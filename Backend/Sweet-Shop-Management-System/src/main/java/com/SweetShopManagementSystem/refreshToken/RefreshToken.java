package com.SweetShopManagementSystem.refreshToken;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "refresh_token")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id" , nullable = false, unique = true)
    private Long userId;

    @Column(name = "refresh_token")
    private String token;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "expire_time")
    private Date expireTime;
}
