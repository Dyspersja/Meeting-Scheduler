package com.ismb.meetingscheduler.account.repository;

import com.ismb.meetingscheduler.account.model.AccountRole;
import com.ismb.meetingscheduler.account.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(AccountRole name);
}
