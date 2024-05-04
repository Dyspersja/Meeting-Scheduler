package com.ismb.meetingscheduler.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Meeting {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "date_time", nullable = false)
    private Timestamp dateTime;

    @Column(name = "location")
    private String location;

    @ManyToOne
    @JoinColumn(name = "organizer_id",referencedColumnName = "id")
    private User organizerId;
}
