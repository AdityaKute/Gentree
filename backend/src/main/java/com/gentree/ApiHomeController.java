package com.gentree;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiHomeController {

    @GetMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("GenTree backend is running. Use /api/members or /api/auth/login and /api/auth/register.");
    }

    @RequestMapping("/api/error")
    public ResponseEntity<String> handleError() {
        return ResponseEntity.status(404)
                .body("Endpoint not found. Available endpoints: /api/members, /api/auth/login, /api/auth/register.");
    }
}
