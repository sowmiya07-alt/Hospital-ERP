package com.hospital.hospitalerp;

import com.hospital.hospitalerp.entity.User;
import com.hospital.hospitalerp.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HospitalErpApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                HospitalErpApplication.class,
                args
        );
    }

    @Bean
    CommandLineRunner createAdminUser(
            UserRepository userRepository) {

        return args -> {

            // Create default admin only if it
            // does not already exist.

            if (userRepository
                    .findByUsername("admin")
                    .isEmpty()) {

                User admin = new User(
                        null,
                        "admin",
                        "admin123",
                        "ADMIN"
                );

                userRepository.save(admin);

                System.out.println(
                        "Default admin account created."
                );

            } else {

                System.out.println(
                        "Admin account already exists."
                );
            }
        };
    }
}