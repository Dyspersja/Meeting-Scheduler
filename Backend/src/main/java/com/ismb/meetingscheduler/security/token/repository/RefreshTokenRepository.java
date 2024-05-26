package com.ismb.meetingscheduler.security.token.repository;

import com.ismb.meetingscheduler.account.model.Account;
import com.ismb.meetingscheduler.security.token.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.Optional;

@EnableJpaRepositories
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByAccount(Account account);
    int deleteByAccount(Account account);
}
