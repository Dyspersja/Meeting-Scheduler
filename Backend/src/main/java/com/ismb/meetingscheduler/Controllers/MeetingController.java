package com.ismb.meetingscheduler.Controllers;

import com.ismb.meetingscheduler.Security.services.UserDetailsImpl;
import com.ismb.meetingscheduler.models.Attendee;
import com.ismb.meetingscheduler.models.Meeting;
import com.ismb.meetingscheduler.models.User;
import com.ismb.meetingscheduler.payload.Requests.AttendeeRequest;
import com.ismb.meetingscheduler.payload.Requests.MeetingRequest;
import com.ismb.meetingscheduler.payload.Responses.AttendeeResponse;
import com.ismb.meetingscheduler.payload.Responses.MeetingResponse;
import com.ismb.meetingscheduler.repository.AttendeeRepository;
import com.ismb.meetingscheduler.repository.MeetingRepository;
import com.ismb.meetingscheduler.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
                .organizerId(User.builder()
                        .id(userDetails.getId())
                        .build())
                .build();

        Meeting createdMeeting = meetingRepository.save(meeting);
        return ResponseEntity.ok(MeetingResponse.fromMeeting(createdMeeting));
    }

    @DeleteMapping("/{meetingId}")
    public ResponseEntity<?> deleteMeeting(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable long meetingId
    ) {
        Optional<Meeting> optionalMeeting = meetingRepository.findById(meetingId);
        if(optionalMeeting.isEmpty()) return ResponseEntity.notFound().build();

        Meeting meeting = optionalMeeting.get();

        if(!Objects.equals(meeting.getOrganizerId().getId(), userDetails.getId()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this meeting.");

        meetingRepository.delete(meeting);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{meetingId}/attendee")
    public ResponseEntity<AttendeeResponse> createMeeting(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable long meetingId,
            @RequestBody AttendeeRequest attendeeRequest
    ) {
        Optional<Meeting> optionalMeeting = meetingRepository.findById(meetingId);
        if(optionalMeeting.isEmpty()) return ResponseEntity.notFound().build();

        Optional<User> optionalAttendee = userRepository.findByEmail(attendeeRequest.getEmail());
        if(optionalAttendee.isEmpty()) return ResponseEntity.notFound().build();

        Meeting meeting = optionalMeeting.get();
        User user = optionalAttendee.get();

        if(!Objects.equals(meeting.getOrganizerId().getId(), userDetails.getId()))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        Attendee attendee = Attendee.builder()
                .meetingId(meeting)
                .userId(user)
                .build();

        Attendee newAttendee = attendeeRepository.save(attendee);
        return ResponseEntity.ok(AttendeeResponse.fromAttendee(newAttendee));
    }
}
