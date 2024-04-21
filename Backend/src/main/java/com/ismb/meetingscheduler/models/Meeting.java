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

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = true, length = -1)
    private String description;

    @Column(name = "date_time", nullable = false)
    private Timestamp dateTime;

    @Column(name = "location", nullable = true, length = 255)
    private String location;

    @ManyToOne
    @JoinColumn(name = "user",referencedColumnName = "id")
    private User organizerId;
}
