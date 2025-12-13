package com.SweetShopManagementSystem.security;

import com.SweetShopManagementSystem.exception.NotFound;
import com.SweetShopManagementSystem.model.User;
import com.SweetShopManagementSystem.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SecurityService implements UserDetailsService {
    private final UserRepository repository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repository.findByUsername(username).orElseThrow(()->new NotFound("User Not Found"));

        return org.springframework.security.core.userdetails.User.withUsername(username).password(user.getPassword())
                .roles(user.getRole().toString()).build();
    }
}
