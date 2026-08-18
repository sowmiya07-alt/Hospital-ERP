package com.hospital.hospitalerp.service;

import com.hospital.hospitalerp.entity.Notification;
import com.hospital.hospitalerp.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(String recipientRole, String recipientUsername, String title, String message, String type) {
        Notification notification = new Notification();
        notification.setRecipientRole(recipientRole);
        notification.setRecipientUsername(recipientUsername);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type != null ? type : "SYSTEM");
        notification.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForRole(String role) {
        return notificationRepository.findByRecipientRoleOrRecipientRole(role, "ALL");
    }

    public List<Notification> getNotificationsForUser(String username) {
        return notificationRepository.findByRecipientUsername(username);
    }
}
