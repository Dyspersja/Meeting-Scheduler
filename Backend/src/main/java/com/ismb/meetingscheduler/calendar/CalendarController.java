package com.ismb.meetingscheduler.calendar;

import com.ismb.meetingscheduler.meeting.model.Meeting;
import com.ismb.meetingscheduler.meeting.payload.MeetingResponse;
import com.ismb.meetingscheduler.meeting.repository.MeetingRepository;
import com.ismb.meetingscheduler.security.auth.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/calendar")

@RequiredArgsConstructor
public class CalendarController {

    private final MeetingRepository meetingRepository;

    @GetMapping
    public ResponseEntity<String> exportCalendar(@AuthenticationPrincipal AuthenticatedUser userDetails) {
        List<Meeting> organizerMeetingList = meetingRepository.findByOrganizerId(userDetails.getId());
        List<Meeting> attendeeMeetingList = meetingRepository.findByAttendeeId(userDetails.getId());

        List<MeetingResponse> meetingResponseList = new ArrayList<>();

        meetingResponseList.addAll(organizerMeetingList.stream()
                .map(meeting -> MeetingResponse.fromMeeting(meeting, true))
                .toList());

        meetingResponseList.addAll(attendeeMeetingList.stream()
                .map(meeting -> MeetingResponse.fromMeeting(meeting, false))
                .toList());

        // Respond with 404 Not Found when not having any meetings
        if (meetingResponseList.isEmpty()) return ResponseEntity.notFound().build();

        CalendarContentBuilder calendarContentBuilder = CalendarContentBuilder.builder();
        meetingResponseList.forEach(calendarContentBuilder::addMeeting);
        String calendar = calendarContentBuilder.build();

        return ResponseEntity.ok(calendar);
    }
}
