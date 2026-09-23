package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.entity.Notification;
import com.hospital.hospitalerp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/role/{role}")
    public List<Notification> getNotificationsForRole(@PathVariable String role) {
        return notificationService.getNotificationsForRole(role);
    }

    @GetMapping("/user/{username}")
    public List<Notification> getNotificationsForUser(@PathVariable String username) {
        return notificationService.getNotificationsForUser(username);
    }
}
