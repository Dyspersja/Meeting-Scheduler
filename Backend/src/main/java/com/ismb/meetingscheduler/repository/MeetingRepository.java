package com.ismb.meetingscheduler.repository;

import com.ismb.meetingscheduler.models.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.sql.Timestamp;
import java.util.List;

@EnableJpaRepositories
public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    @Query(value = "Select * from meeting where date_time between ?1 and ?2", nativeQuery = true)
    List<Meeting> getNextDayMeetings(Timestamp currentDate, Timestamp nextDay);
}
