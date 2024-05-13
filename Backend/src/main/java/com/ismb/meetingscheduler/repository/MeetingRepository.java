package com.ismb.meetingscheduler.repository;

import com.ismb.meetingscheduler.models.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.List;

@EnableJpaRepositories
public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    @Query("SELECT m FROM Meeting m JOIN Attendee a ON m.id = a.meetingId.id WHERE a.userId.id = :attendeeId")
    List<Meeting> findByAttendeeId(Long attendeeId);
    List<Meeting> findByOrganizerIdId(Long organizerId);
}
