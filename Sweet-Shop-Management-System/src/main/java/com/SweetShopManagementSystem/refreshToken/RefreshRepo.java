package com.SweetShopManagementSystem.refreshToken;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshRepo extends JpaRepository<RefreshToken,Long> {
    void deleteByUserId(Long userId);

    Optional<RefreshToken> findByRToken(String rToken);
}
