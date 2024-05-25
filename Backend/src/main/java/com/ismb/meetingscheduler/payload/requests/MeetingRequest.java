package com.ismb.meetingscheduler.payload.requests;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class MeetingRequest {
    private String title;
    private String description;
    private String location;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private Timestamp dateTime;
}
