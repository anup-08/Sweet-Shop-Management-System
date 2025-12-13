package com.SweetShopManagementSystem.controller;

import com.SweetShopManagementSystem.dtos.UserRequestDTO;
import com.SweetShopManagementSystem.dtos.UserResponseDTO;
import com.SweetShopManagementSystem.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    @PostMapping("/register")
    public UserResponseDTO register(@Valid @RequestBody UserRequestDTO dto) {
        return service.registerUser(dto);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponseDTO> allUsers() {
        return service.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponseDTO getById(@PathVariable Long id) {
        return service.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteUser(id);
    }
}
