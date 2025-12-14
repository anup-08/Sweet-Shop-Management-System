package com.SweetShopManagementSystem.controller;

import com.SweetShopManagementSystem.dtos.UserRequestDTO;
import com.SweetShopManagementSystem.dtos.UserResponseDTO;
import com.SweetShopManagementSystem.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;
    private final AuthenticationManager authenticationManager;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRequestDTO dto) {
        service.registerUser(dto);
        String token = service.generateToken(dto.getUsername());
        String refreshToken = service.generateRefreshToken(dto.getUsername());
        return ResponseEntity.ok(Map.of("accessToken",token , "refreshToken",refreshToken));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String ,String> loginInfo){
        if (loginInfo.get("username") == null || loginInfo.get("password") == null) {
            return ResponseEntity.badRequest().body("username and password are required");
        }

        String username = loginInfo.get("username");
        String password = loginInfo.get("password");

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,password));

        String token = service.generateToken(username);
        String refreshToken = service.generateRefreshToken(username);

        return ResponseEntity.ok(Map.of("accessToken" , token , "refreshToken" , refreshToken));
    }

    @PostMapping("/getToken")
    public ResponseEntity<Map<String,String>> getNewJwtToken(@RequestBody Map<String,String> tokenInfo){

        String rToken = tokenInfo.get("refreshToken");
        logger.debug("Received refresh token request, refreshToken present={}", rToken != null);
        try {
            String newToken = service.generateTokenFromRefreshToken(rToken);
            return ResponseEntity.ok(Map.of("accessToken",newToken));
        } catch (Exception ex) {
            return ResponseEntity.status(401).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> allUsers() {
        return ResponseEntity.ok(service.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getUserById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}
