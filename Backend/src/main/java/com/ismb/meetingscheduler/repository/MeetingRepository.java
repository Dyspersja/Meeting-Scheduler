package com.ismb.meetingscheduler.repository;

import com.ismb.meetingscheduler.models.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;



import java.sql.Timestamp;
import java.util.List;

@EnableJpaRepositories
public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    List<Meeting> findByOrganizerId(Long organizerId);

    @Query("SELECT m FROM Meeting m JOIN Attendee a ON m.id = a.meeting.id WHERE a.account.id = :attendeeId")
    List<Meeting> findByAttendeeId(Long attendeeId);
    @Query(value = "Select * from meeting where date_time between ?1 and ?2", nativeQuery = true)
    List<Meeting> getNextDayMeetings(Timestamp currentDate, Timestamp nextDay);
    @Query(value = "SELECT * FROM meeting WHERE DATE(date_time) = CURDATE() AND organizer_id = ?1 order by date_time", nativeQuery = true)
    List<Meeting> findTodayMeetingsByOrganizerId(Long organizerId);
    @Query(value = "SELECT * FROM meeting WHERE DATE(date_time) = CURDATE() order by date_time", nativeQuery = true)
    List<Meeting> findTodayMeetings();


}
