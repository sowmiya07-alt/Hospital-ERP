package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.entity.MedicationAlarm;
import com.hospital.hospitalerp.service.MedicationAlarmService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/medication-alarms")
public class MedicationAlarmController {

    @Autowired
    private MedicationAlarmService medicationAlarmService;


    // CREATE NEW ALARM
    @PostMapping
    public MedicationAlarm createAlarm(
            @RequestBody Map<String, Object> request) {

        Long patientId = Long.valueOf(
                request.get("patientId").toString()
        );

        Long prescriptionId = Long.valueOf(
                request.get("prescriptionId").toString()
        );

        String alarmTime =
                request.get("alarmTime").toString();

        return medicationAlarmService.createAlarm(
                patientId,
                prescriptionId,
                alarmTime
        );
    }


    // GET ALL ALARMS FOR ONE PATIENT
    @GetMapping("/patient/{patientId}")
    public List<MedicationAlarm> getPatientAlarms(
            @PathVariable Long patientId) {

        return medicationAlarmService
                .getAlarmsByPatientId(patientId);
    }


    // TURN ALARM ON / OFF
    @PutMapping("/{alarmId}/toggle")
    public MedicationAlarm toggleAlarm(
            @PathVariable Long alarmId) {

        return medicationAlarmService
                .toggleAlarm(alarmId);
    }


    // DELETE ALARM
    @DeleteMapping("/{alarmId}")
    public String deleteAlarm(
            @PathVariable Long alarmId) {

        return medicationAlarmService
                .deleteAlarm(alarmId);
    }
}