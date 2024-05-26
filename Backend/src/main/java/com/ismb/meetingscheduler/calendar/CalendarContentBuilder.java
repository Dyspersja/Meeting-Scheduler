package com.ismb.meetingscheduler.calendar;

import com.ismb.meetingscheduler.meeting.payload.MeetingResponse;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CalendarContentBuilder {

    private static final String TIME_ZONE = "Europe/Warsaw";
    private static final String ORGANIZATION = "ismb";
    private static final String PRODUCT = "meeting_scheduler v1.0";
    private static final String NAME = "Meetings";

    private final String calendarBeginning = String.format("""
            BEGIN:VCALENDAR
            TZID:%s
            X-WR-TIMEZONE:%s
            VERSION:2.0
            PRODID:-//%s//NONSGML %s//EN
            NAME:%s
            X-WR-CALNAME:%s
            COLOR:blue
            CALSCALE:GREGORIAN
            """, TIME_ZONE, TIME_ZONE, ORGANIZATION, PRODUCT, NAME, NAME);
    private final StringBuilder content = new StringBuilder(calendarBeginning);

    public static CalendarContentBuilder builder() {
        return new CalendarContentBuilder();
    }

    public CalendarContentBuilder addMeeting(MeetingResponse meeting) {
        String meetingTime = meeting.getDateTime().toLocalDateTime().format(DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss"));
        String meetingEndTime = meeting.getDateTime().toLocalDateTime().plusMinutes(45).format(DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss"));
        String summary = meeting.getTitle();
        String categories = meeting.isOwner() ? "Owner" : "Attendee";
        String location = meeting.getLocation();
        String description = meeting.getDescription();

        String text = String.format("""
                BEGIN:VEVENT
                DTSTAMP:%s
                DTSTART:%s
                DTEND:%s
                SUMMARY:%s
                CATEGORIES:%s
                LOCATION:%s
                DESCRIPTION:%s
                END:VEVENT
                """, meetingTime, meetingTime, meetingEndTime, summary, categories, location, description);

        this.content.append(text);
        return this;
    }

    public String build() {
        content.append("END:VCALENDAR");
        return content.toString();
    }
}
