package com.ismb.meetingscheduler.email;

import com.ismb.meetingscheduler.account.repository.AccountRepository;
import com.ismb.meetingscheduler.meeting.repository.AttendeeRepository;
import com.ismb.meetingscheduler.meeting.model.Meeting;
import com.ismb.meetingscheduler.meeting.repository.MeetingRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Async
@Slf4j
@EnableScheduling

@RequiredArgsConstructor
public class EmailSenderService {

    private final JavaMailSender javaMailSender;
    private final MeetingRepository meetingRepository;
    private final AttendeeRepository attendeeRepository;
    private final AccountRepository userRepository;

    @Async
    public void sendEmail(String email, List<Meeting> meetingList) throws MessagingException {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(email);
            String subject = "Meeting notification!";

            EmailContentBuilder emailContentBuilder = EmailContentBuilder.builder();
            meetingList.forEach(emailContentBuilder::addMeeting);
            String content = emailContentBuilder.build();

            helper.setSubject(subject);
            helper.setText(content, true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            log.error("Email send error: {}", e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 1 * * *", zone = "Europe/Warsaw")
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
