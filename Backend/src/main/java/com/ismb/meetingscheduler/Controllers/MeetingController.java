package com.ismb.meetingscheduler.Controllers;

import com.ismb.meetingscheduler.Security.services.UserDetailsImpl;
import com.ismb.meetingscheduler.models.Meeting;
import com.ismb.meetingscheduler.models.User;
import com.ismb.meetingscheduler.payload.Requests.MeetingRequest;
import com.ismb.meetingscheduler.payload.Responses.MeetingResponse;
import com.ismb.meetingscheduler.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/meeting")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingRepository meetingRepository;

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
}
