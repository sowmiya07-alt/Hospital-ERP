package com.hospital.hospitalerp.repository;

import com.hospital.hospitalerp.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientRoleOrRecipientRole(String role1, String role2);
    List<Notification> findByRecipientUsername(String username);
}
