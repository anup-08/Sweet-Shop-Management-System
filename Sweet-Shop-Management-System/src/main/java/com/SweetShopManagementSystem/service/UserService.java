package com.SweetShopManagementSystem.service;

import com.SweetShopManagementSystem.Enum.Role;
import com.SweetShopManagementSystem.dtos.UserRequestDTO;
import com.SweetShopManagementSystem.dtos.UserResponseDTO;
import com.SweetShopManagementSystem.exception.NotFound;
import com.SweetShopManagementSystem.model.User;
import com.SweetShopManagementSystem.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDTO registerUser(UserRequestDTO dto) {

        if (userRepo.existsByUsername(dto.getUsername())) {
            throw new NotFound("Username already exists");
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        Role role = resolveRole(dto.getRole());
        user.setRole(role);

        return mapToResponse(userRepo.save(user));
    }

    private Role resolveRole(String roleFromRequest) {
        if (roleFromRequest == null || roleFromRequest.isBlank()) {
            return Role.USER;
        }
        try {
            return Role.valueOf(roleFromRequest.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid role");
        }
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepo.findById(id).orElseThrow(()->new NotFound("User Not Found"));
        return mapToResponse(user);
    }

    public void deleteUser(Long id) {
        User user = userRepo.findById(id).orElseThrow(()->new NotFound("User Not Found"));
        userRepo.delete(user);
    }


    private UserResponseDTO mapToResponse(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole().name());
        return dto;
    }


}
