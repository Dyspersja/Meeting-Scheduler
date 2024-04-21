package com.ismb.meetingscheduler.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Attendee {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "meeting",referencedColumnName = "id")
    private Meeting meetingId;

    @ManyToOne
    @JoinColumn(name = "user", referencedColumnName = "id")
    private User userId;


    @Column(name = "status", nullable = true, length = 20)
    private String status;

}
