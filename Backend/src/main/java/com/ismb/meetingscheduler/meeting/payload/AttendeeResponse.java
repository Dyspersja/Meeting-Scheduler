package com.ismb.meetingscheduler.meeting.payload;

import com.ismb.meetingscheduler.meeting.model.Attendee;
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
                .meetingId(attendee.getMeeting().getId())
                .attendeeEmail(attendee.getAccount().getEmail())
                .build();
    }
}
