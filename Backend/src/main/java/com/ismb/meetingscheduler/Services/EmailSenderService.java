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
import java.util.Date;
import java.util.List;

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
    public void sendEmail(String email,String meetingTitle, Date meetingDate) throws MessagingException {
        try{
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(email);
            String subject = "Meeting notification!";
            String content = "<html>" +
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
                    "}" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class=\"container\">" +
                    "<p>Dzień dobry,</p>" +
                    "<p>Przypominamy o nadchodzącym spotkaniu <strong>" + meetingTitle + "</strong>, które odbędzie się <strong>" + meetingDate + "</strong>.</p>" +
                    "</div>" +
                    "</body>" +
                    "</html>";

            helper.setSubject(subject);
            helper.setText(content, true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            System.err.println("Wysyłanie zakończone błędem. Błąd: " + e.getMessage());
            throw e;
        }
    }

    @Scheduled(cron = "0 0 1 * * *", zone = "Europe/Warsaw") // o 1 w nocy codziennie
    public void checkMeetingDateAndSendNotifications() throws MessagingException {
        Timestamp currentDay = Timestamp.from(Instant.now());
        Timestamp nextDay = Timestamp.from(currentDay.toInstant().plus(Duration.ofDays(1)));
        List<Meeting> meetingList = meetingRepository.getNextDayMeetings(currentDay, nextDay);
        for (Meeting meeting :
                meetingList) {
            List<Long> attendedUsersId = attendeeRepository.getAllAttendeeIdsByMeetingId(meeting.getId());
            for (Long usersId : attendedUsersId) {
                sendEmail(userRepository.findById(usersId).get().getEmail(),
                        meeting.getTitle(),
                        meeting.getDateTime());
            }
        }
    }


}
