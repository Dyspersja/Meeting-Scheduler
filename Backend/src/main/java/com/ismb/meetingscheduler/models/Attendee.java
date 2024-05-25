package com.ismb.meetingscheduler.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Attendee {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "meeting_id",referencedColumnName = "id")
    private Meeting meetingId;

    @ManyToOne
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    private Account userId;


    @Column(name = "status", length = 20)
    private String status;
}
