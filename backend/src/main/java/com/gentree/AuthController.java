package com.gentree;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public static class RegisterRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        public String email;

        @NotBlank(message = "Username is required")
        public String username;

        @NotBlank(message = "Password is required")
        public String password;
    }

    public static class LoginRequest {
        @NotBlank(message = "Username is required")
        public String username;

        @NotBlank(message = "Password is required")
        public String password;
    }

    public static class AuthResponse {
        public String username;
        public String email;

        public AuthResponse(User user) {
            this.username = user.getUsername();
            this.email = user.getEmail();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        Optional<User> existingUsername = userRepository.findByUsername(request.username);
        if (existingUsername.isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        Optional<User> existingEmail = userRepository.findByEmail(request.email);
        if (existingEmail.isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered");
        }

        String passwordHash = passwordEncoder.encode(request.password);
        User user = new User(request.username, request.email, passwordHash);
        userRepository.save(user);

        return ResponseEntity.status(201).body(new AuthResponse(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Optional<User> user = userRepository.findByUsername(request.username);
        if (user.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        if (!passwordEncoder.matches(request.password, user.get().getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        return ResponseEntity.ok(new AuthResponse(user.get()));
    }
}
