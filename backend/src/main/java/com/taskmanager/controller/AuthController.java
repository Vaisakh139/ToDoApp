package com.taskmanager.controller;

import com.taskmanager.auth.TokenStore;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private static final String USERNAME = "admin";
    private static final String PASSWORD = "password";

    private final TokenStore tokenStore;

    public AuthController(TokenStore tokenStore) {
        this.tokenStore = tokenStore;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {
        if (USERNAME.equals(body.get("username")) && PASSWORD.equals(body.get("password"))) {
            String token = UUID.randomUUID().toString();
            tokenStore.add(token);
            return ResponseEntity.ok(Map.of("token", token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid username or password"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            tokenStore.remove(authHeader.substring(7));
        }
        return ResponseEntity.noContent().build();
    }
}
