package com.SweetShopManagementSystem.repository;

import com.SweetShopManagementSystem.model.Sweet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SweetRepository extends JpaRepository<Sweet,Long> {
    List<Sweet> findByNameContainingIgnoreCase(String name);

    List<Sweet> findByCategoryIgnoreCase(String category);

    List<Sweet> findByPriceBetween(Double minPrice, Double maxPrice);
}
