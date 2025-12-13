package com.SweetShopManagementSystem.service;

import com.SweetShopManagementSystem.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepo;

}
