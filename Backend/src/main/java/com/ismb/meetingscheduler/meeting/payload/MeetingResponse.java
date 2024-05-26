package com.ismb.meetingscheduler.meeting.payload;

import com.ismb.meetingscheduler.meeting.model.Meeting;
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
    private boolean isOwner;

    public static MeetingResponse fromMeeting(Meeting meeting, boolean isOwner) {
        return MeetingResponse.builder()
                .id(meeting.getId())
                .title(meeting.getTitle())
                .description(meeting.getDescription())
                .dateTime(meeting.getDateTime())
                .location(meeting.getLocation())
                .organizerId(meeting.getOrganizer().getId())
                .isOwner(isOwner)
                .build();
    }
}
