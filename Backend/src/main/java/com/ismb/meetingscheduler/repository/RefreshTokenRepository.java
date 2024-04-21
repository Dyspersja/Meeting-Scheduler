package com.ismb.meetingscheduler.repository;

import com.ismb.meetingscheduler.models.RefreshToken;
import com.ismb.meetingscheduler.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Optional;

@EnableJpaRepositories
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    int deleteByUser(User user);

    Optional<RefreshToken> findByUser(User user);
}
