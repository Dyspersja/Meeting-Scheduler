package com.ismb.meetingscheduler.repository;

import com.ismb.meetingscheduler.models.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface MeetingRepository extends JpaRepository<Meeting, Long> {
}
