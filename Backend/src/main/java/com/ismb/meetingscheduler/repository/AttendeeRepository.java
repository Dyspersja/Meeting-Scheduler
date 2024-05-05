package com.ismb.meetingscheduler.repository;

import com.ismb.meetingscheduler.models.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface AttendeeRepository extends JpaRepository<Attendee, Long> {
}
