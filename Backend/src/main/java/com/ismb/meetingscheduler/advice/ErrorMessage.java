package com.ismb.meetingscheduler.advice;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorMessage {
    private int statusCode;
    private Date timestamp;
    private String message;
    private String description;
}