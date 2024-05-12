package com.ismb.meetingscheduler.payload.Responses;

import com.ismb.meetingscheduler.models.Meeting;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MeetingResponse {
    private int id;
    private String title;
    private String description;
    private Timestamp dateTime;
    private String location;
    private Long organizerId;

    public static MeetingResponse fromMeeting(Meeting meeting) {
        return MeetingResponse.builder()
                .id(meeting.getId())
                .title(meeting.getTitle())
                .description(meeting.getDescription())
                .dateTime(meeting.getDateTime())
                .location(meeting.getLocation())
                .organizerId(meeting.getOrganizerId().getId())
                .build();
    }
}
