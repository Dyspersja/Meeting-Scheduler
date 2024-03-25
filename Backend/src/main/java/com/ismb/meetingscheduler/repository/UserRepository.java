package com.ismb.meetingscheduler.repository;



import com.ismb.meetingscheduler.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String emial);

    Boolean existsByEmail(String email);
}
