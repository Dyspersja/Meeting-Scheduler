package com.ismb.meetingscheduler.repository;

import com.ismb.meetingscheduler.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Optional;

@EnableJpaRepositories
public interface UserRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByEmail(String emial);
    Optional<Account> findById(Long id);

    Boolean existsByEmail(String email);
}
