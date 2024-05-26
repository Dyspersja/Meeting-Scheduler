package com.ismb.meetingscheduler.meeting.repository;

import com.ismb.meetingscheduler.meeting.model.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


import java.util.Optional;
import java.util.List;

@EnableJpaRepositories
public interface AttendeeRepository extends JpaRepository<Attendee, Long> {

    boolean existsByMeetingIdAndAccountId(Long meetingId, Long accountId);
    Optional<Attendee> findByMeetingIdAndAccountId(Long meetingId, Long accountId);
    List<Attendee> findByMeetingId(Long meetingId);

    @Query(value = "SELECT account_id FROM Attendee attendee WHERE attendee.meeting_id = ?1", nativeQuery = true)
    List<Long> getAllAttendeeIdsByMeetingId(Integer meetingId);
}
