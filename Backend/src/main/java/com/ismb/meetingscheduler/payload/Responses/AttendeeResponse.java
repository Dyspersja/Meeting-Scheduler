package com.ismb.meetingscheduler.payload.Responses;

import com.ismb.meetingscheduler.models.Attendee;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendeeResponse {
    private Integer id;
    private int meetingId;
    private Long userId;

    public static AttendeeResponse fromAttendee(Attendee attendee) {
        return AttendeeResponse.builder()
                .id(attendee.getId())
                .meetingId(attendee.getMeetingId().getId())
                .userId(attendee.getUserId().getId())
                .build();
    }
}
