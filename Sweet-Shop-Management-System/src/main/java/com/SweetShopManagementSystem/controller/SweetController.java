package com.SweetShopManagementSystem.controller;

import com.SweetShopManagementSystem.dtos.QuantityRequestDTO;
import com.SweetShopManagementSystem.dtos.SweetRequestDTO;
import com.SweetShopManagementSystem.dtos.SweetResponseDTO;
import com.SweetShopManagementSystem.dtos.UpdateSweetDto;
import com.SweetShopManagementSystem.service.SweetService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/sweets")
public class SweetController {
    private final SweetService service;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public SweetResponseDTO addSweet(@Valid @RequestBody SweetRequestDTO dto) {
        return service.addSweet(dto);
    }

    @GetMapping
    public List<SweetResponseDTO> getAllSweets() {
        return service.getAllSweets();
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SweetResponseDTO updateSweet(@PathVariable Long id, @Valid @RequestBody UpdateSweetDto dto) {
        return service.updateSweet(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteSweet(@PathVariable Long id) {
        service.deleteSweet(id);
    }

    @PostMapping("/{id}/purchase")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public SweetResponseDTO purchaseSweet(@PathVariable Long id, @Valid @RequestBody QuantityRequestDTO dto) {
        return service.purchaseSweet(id, dto.getQuantity());
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public SweetResponseDTO restockSweet(@PathVariable Long id, @Valid @RequestBody QuantityRequestDTO dto) {
        return service.restockSweet(id, dto.getQuantity());
    }

    @GetMapping("/search")
    public List<SweetResponseDTO> searchSweets(@RequestParam(required = false) String name, @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice, @RequestParam(required = false) Double maxPrice) {
        return service.searchSweets(name, category, minPrice, maxPrice);
    }

}
