package com.ismb.meetingscheduler.repository;

import com.ismb.meetingscheduler.models.AccountRole;
import com.ismb.meetingscheduler.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(AccountRole name);
}
