package com.ismb.meetingscheduler.Controllers;

import com.ismb.meetingscheduler.Security.services.UserDetailsImpl;
import com.ismb.meetingscheduler.models.Meeting;
import com.ismb.meetingscheduler.models.User;
import com.ismb.meetingscheduler.payload.Requests.MeetingRequest;
import com.ismb.meetingscheduler.payload.Responses.MeetingResponse;
import com.ismb.meetingscheduler.repository.MeetingRepository;
import com.ismb.meetingscheduler.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.XSlf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/meeting")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;
    @PostMapping
    public MeetingResponse createMeeting(
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
        return MeetingResponse.fromMeeting(createdMeeting);
    }

    @GetMapping("/getTodayMeetings")
    public List<Meeting> findTodayMeetings(@AuthenticationPrincipal UserDetailsImpl userDetails){
        return meetingRepository.findTodayMeetingsByOrganizerId(userDetails.getId());
    }
}
