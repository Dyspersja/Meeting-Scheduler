package com.ismb.meetingscheduler.repository;

import com.ismb.meetingscheduler.models.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Optional;

@EnableJpaRepositories
public interface AttendeeRepository extends JpaRepository<Attendee, Long> {
    boolean existsByMeetingIdIdAndUserIdId(Long meetingId, Long accountId);
    Optional<Attendee> findByMeetingIdIdAndUserIdId(Long meetingId, Long accountId);
}
