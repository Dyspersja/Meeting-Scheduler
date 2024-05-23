package com.ismb.meetingscheduler.Services;


import com.ismb.meetingscheduler.models.Meeting;
import com.ismb.meetingscheduler.repository.AttendeeRepository;
import com.ismb.meetingscheduler.repository.MeetingRepository;
import com.ismb.meetingscheduler.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
@Async
@Slf4j
@EnableScheduling

public class EmailSenderService {

    @Autowired
    JavaMailSender javaMailSender;

    @Autowired
    MeetingRepository meetingRepository;

    @Autowired
    AttendeeRepository attendeeRepository;

    @Autowired
    UserRepository userRepository;

    @Async
    public void sendEmail(String email, List<Meeting> meetingList) throws MessagingException {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(email);
            String subject = "Meeting notification!";
            StringBuilder content = new StringBuilder("<html>" +
                    "<head>" +
                    "<style>" +
                    "body {" +
                    "    font-family: Arial, sans-serif;" +
                    "    background-color: #f2f2f2;" +
                    "    margin: 0;" +
                    "    padding: 0;" +
                    "}" +
                    ".container {" +
                    "    width: 600px;" +
                    "    margin: 20px auto;" +
                    "    background-color: #ffffff;" +
                    "    padding: 20px;" +
                    "    border-radius: 10px;" +
                    "    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" +
                    "}" +
                    "p {" +
                    "    margin-bottom: 10px;" +
                    ".meeting {"+
                    "    border: 1px solid #dddddd;"+
                    "    padding: 10px;"+
                    "    margin-bottom: 10px;"+
                    "    border-radius: 5px;"+
                    "    background-color: #f9f9f9;"+
                    "    border-bottom: 1px solid #dddddd;}" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class=\"container\">" +
                    "<p>Dzień dobry,</p>" +
                    "<p>Przypominamy o nadchodzących spotkaniach</p>");
            for (Meeting meeting : meetingList) {
                content.append("<div class=\"meeting\">")
                        .append("<p><strong>Nazwa spotkania:</strong> ").append(meeting.getTitle()).append("</p>")
                        .append("<p><strong>Godzina:</strong> ").append(meeting.getDateTime()).append("</p>")
                        .append("<p><strong>Organizator:</strong> ").append(meeting.getOrganizerId().getEmail()).append("</p>")
                        .append("</div>")
                        .append("<div style=\"border-top: 1px dotted #999999;\">&nbsp;</div>");

            }
                    content.append("Pozdrawiamy" +
                            "<div className = `navbar`><h1>Meeting<span>Scheduler</span></h1></div></div>" +
                    "</body>" +
                    "</html>");

            helper.setSubject(subject);
            helper.setText(String.valueOf(content), true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            System.err.println("Wysyłanie zakończone błędem. Błąd: " + e.getMessage());
            throw e;
        }
    }

//    @Scheduled(cron = "0 0 1 * * *", zone = "Europe/Warsaw") // codziennie o 1 w nocy
@Scheduled(fixedRate = 20000)
public void checkMeetingDateAndSendNotifications() throws MessagingException {
    List<Meeting> meetingList = meetingRepository.findTodayMeetings();
    Map<Long, List<Meeting>> userMeetingsMap = new HashMap<>();

    for (Meeting meeting : meetingList) {
        List<Long> attendedUsersId = attendeeRepository.getAllAttendeeIdsByMeetingId(meeting.getId());
        for (Long userId : attendedUsersId) {
            userMeetingsMap.putIfAbsent(userId, new ArrayList<>());
            userMeetingsMap.get(userId).add(meeting);
        }
    }

    for (Map.Entry<Long, List<Meeting>> entry : userMeetingsMap.entrySet()) {
        Long userId = entry.getKey();
        List<Meeting> meetingsByAttendeeId = entry.getValue();
        sendEmail(userRepository.findById(userId).get().getEmail(), meetingsByAttendeeId);
    }
}


}
