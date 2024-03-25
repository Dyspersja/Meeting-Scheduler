package com.ismb.meetingscheduler.repository;


import com.ismb.meetingscheduler.models.ERole;
import com.ismb.meetingscheduler.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(ERole name);
}
