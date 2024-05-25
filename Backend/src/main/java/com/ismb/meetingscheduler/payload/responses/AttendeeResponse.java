package com.ismb.meetingscheduler.payload.responses;

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
    private String attendeeEmail;

    public static AttendeeResponse fromAttendee(Attendee attendee) {
        return AttendeeResponse.builder()
                .id(attendee.getId())
                .meetingId(attendee.getMeetingId().getId())
                .attendeeEmail(attendee.getUserId().getEmail())
                .build();
    }
}
