package com.hospital.hospitalerp.controller;

import com.hospital.hospitalerp.service.GlobalSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class GlobalSearchController {

    @Autowired
    private GlobalSearchService globalSearchService;

    @GetMapping
    public Map<String, Object> searchAll(@RequestParam(required = false, defaultValue = "") String query) {
        return globalSearchService.searchAll(query);
    }
}
