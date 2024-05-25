package com.ismb.meetingscheduler.controllers;

import com.ismb.meetingscheduler.security.services.UserDetailsImpl;
import com.ismb.meetingscheduler.models.Attendee;
import com.ismb.meetingscheduler.models.Meeting;
import com.ismb.meetingscheduler.models.Account;
import com.ismb.meetingscheduler.payload.requests.AttendeeRequest;
import com.ismb.meetingscheduler.payload.requests.MeetingRequest;
import com.ismb.meetingscheduler.payload.responses.AttendeeResponse;
import com.ismb.meetingscheduler.payload.responses.MeetingResponse;

import com.ismb.meetingscheduler.repository.AttendeeRepository;
import com.ismb.meetingscheduler.repository.MeetingRepository;
import com.ismb.meetingscheduler.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;



@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/meeting")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;
    private final AttendeeRepository attendeeRepository;

    @PostMapping
    public ResponseEntity<MeetingResponse> createMeeting(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody MeetingRequest request
    ) {
        Meeting meeting = Meeting.builder()
                .title(request.getTitle())
                .dateTime(request.getDateTime())
                .description(request.getDescription())
                .location(request.getLocation())
                .organizerId(Account.builder()
                        .id(userDetails.getId())
                        .build())
                .build();

        Meeting createdMeeting = meetingRepository.save(meeting);
        return ResponseEntity.ok(MeetingResponse.fromMeeting(createdMeeting, true));
    }

    @PutMapping("/{meetingId}")
    public ResponseEntity<MeetingResponse> updateMeeting(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable long meetingId,
            @RequestBody MeetingRequest request
    ) {
        // The meeting must exist in order to be updated.
        Optional<Meeting> optionalMeeting = meetingRepository.findById(meetingId);
        if(optionalMeeting.isEmpty()) return ResponseEntity.notFound().build();

        Meeting meeting = optionalMeeting.get();

        // Only the organizer of the meeting can update it.
        if(!Objects.equals(meeting.getOrganizerId().getId(), userDetails.getId()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        meeting.setTitle(request.getTitle());
        meeting.setDescription(request.getDescription());
        meeting.setLocation(request.getLocation());
        meeting.setDateTime(request.getDateTime());

        Meeting updatedMeeting = meetingRepository.save(meeting);
        return ResponseEntity.ok(MeetingResponse.fromMeeting(updatedMeeting, true));
    }

    @GetMapping
    public ResponseEntity<List<MeetingResponse>> getAllMeetings(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Meeting> organizerMeetingList = meetingRepository.findByOrganizerIdId(userDetails.getId());
        List<Meeting> attendeeMeetingList = meetingRepository.findByAttendeeId(userDetails.getId());

        List<MeetingResponse> meetingResponseList = new ArrayList<>();

        meetingResponseList.addAll(organizerMeetingList.stream()
                .map(meeting -> MeetingResponse.fromMeeting(meeting, true))
                .toList());

        meetingResponseList.addAll(attendeeMeetingList.stream()
                .map(meeting -> MeetingResponse.fromMeeting(meeting, false))
                .toList());

        return ResponseEntity.ok(meetingResponseList);
    }

    @DeleteMapping("/{meetingId}")
    public ResponseEntity<?> deleteMeeting(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable long meetingId
    ) {
        // The meeting must exist in order to be deleted.
        Optional<Meeting> optionalMeeting = meetingRepository.findById(meetingId);
        if(optionalMeeting.isEmpty()) return ResponseEntity.notFound().build();

        Meeting meeting = optionalMeeting.get();

        // Only the organizer of the meeting can delete it.
        if(!Objects.equals(meeting.getOrganizerId().getId(), userDetails.getId()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this meeting.");

        meetingRepository.delete(meeting);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{meetingId}/attendee")
    public ResponseEntity<List<AttendeeResponse>> getAttendees(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable long meetingId
    ) {
        Optional<Meeting> optionalMeeting = meetingRepository.findById(meetingId);
        if(optionalMeeting.isEmpty()) return ResponseEntity.notFound().build();

        Meeting meeting = optionalMeeting.get();

        if(!Objects.equals(meeting.getOrganizerId().getId(), userDetails.getId()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        
        List<Attendee> attendeeList = attendeeRepository.findByMeetingIdId(meetingId);
        List<AttendeeResponse> attendeeResponseList = attendeeList.stream()
                .map(AttendeeResponse::fromAttendee).toList();

        return ResponseEntity.ok(attendeeResponseList);
    }

    @PostMapping("/{meetingId}/attendee")
    public ResponseEntity<AttendeeResponse> addAttendee(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable long meetingId,
            @RequestBody AttendeeRequest attendeeRequest
    ) {
        // The meeting to which we add an attendee must exist.
        Optional<Meeting> optionalMeeting = meetingRepository.findById(meetingId);
        if(optionalMeeting.isEmpty()) return ResponseEntity.notFound().build();

        // Only registered attendees can be added.
        Optional<Account> optionalAttendee = userRepository.findByEmail(attendeeRequest.getEmail());
        if(optionalAttendee.isEmpty()) return ResponseEntity.notFound().build();

        Meeting meeting = optionalMeeting.get();
        Account user = optionalAttendee.get();

        // Only the meeting organizer can add attendees.
        if(!Objects.equals(meeting.getOrganizerId().getId(), userDetails.getId()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        // The organizer cannot invite themselves to the meeting.
        if(Objects.equals(meeting.getOrganizerId().getId(), user.getId()))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

        // The organizer cannot add the same attendee twice to the same meeting.
        if(attendeeRepository.existsByMeetingIdIdAndUserIdId(meetingId, user.getId()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        Attendee attendee = Attendee.builder()
                .meetingId(meeting)
                .userId(user)
                .build();

        Attendee newAttendee = attendeeRepository.save(attendee);
        return ResponseEntity.ok(AttendeeResponse.fromAttendee(newAttendee));
    }

    @DeleteMapping("/{meetingId}/attendee")
    public ResponseEntity<AttendeeResponse> deleteAttendee(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable long meetingId,
            @RequestBody AttendeeRequest attendeeRequest
    ) {
        // The meeting from which we want to remove an attendee must exist.
        Optional<Meeting> optionalMeeting = meetingRepository.findById(meetingId);
        if(optionalMeeting.isEmpty()) return ResponseEntity.notFound().build();

        // Attendee to remove must exist
        Optional<Account> optionalUser = userRepository.findByEmail(attendeeRequest.getEmail());
        if(optionalUser.isEmpty()) return ResponseEntity.notFound().build();

        Account user = optionalUser.get();
        Meeting meeting = optionalMeeting.get();

        // Only the meeting organizer can remove attendees.
        if(!Objects.equals(meeting.getOrganizerId().getId(), userDetails.getId()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        // Attendee must be added to meeting to be removed.
        Optional<Attendee> optionalAttendee = attendeeRepository.findByMeetingIdIdAndUserIdId(meetingId, user.getId());
        if(optionalAttendee.isEmpty()) return ResponseEntity.notFound().build();

        Attendee attendee = optionalAttendee.get();

        attendeeRepository.delete(attendee);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getTodayMeetings")
    public List<Meeting> findTodayMeetings(@AuthenticationPrincipal UserDetailsImpl userDetails){
        return meetingRepository.findTodayMeetingsByOrganizerId(userDetails.getId());
    }
}
