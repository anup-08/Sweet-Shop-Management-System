package com.SweetShopManagementSystem.refreshToken;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@Service

public class RefreshService {
    private final RefreshRepo repo;

    @Transactional
    public String generateRefreshToken(Long userId) {
        repo.deleteByUserId(userId);

        String rToken = UUID.randomUUID().toString();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(userId);
        refreshToken.setToken(rToken);
        refreshToken.setExpireTime(new Date(System.currentTimeMillis() + 5 * 24 * 60 * 60 * 1000));

        repo.save(refreshToken);
        return rToken;
    }

    public RefreshToken validate(String rToken){
        RefreshToken refreshToken = repo.findByToken(rToken).orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        if (refreshToken.getExpireTime().before(new Date())) throw new IllegalArgumentException("Invalid or Token Expired");
        return refreshToken;
    }
}
