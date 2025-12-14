package com.SweetShopManagementSystem.controller;

import com.SweetShopManagementSystem.dtos.QuantityRequestDTO;
import com.SweetShopManagementSystem.dtos.SweetRequestDTO;
import com.SweetShopManagementSystem.dtos.SweetResponseDTO;
import com.SweetShopManagementSystem.dtos.UpdateSweetDto;
import com.SweetShopManagementSystem.service.SweetService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<SweetResponseDTO> addSweet(@Valid @RequestBody SweetRequestDTO dto) {
        return ResponseEntity.ok(service.addSweet(dto));
    }

    @GetMapping
    public ResponseEntity<List<SweetResponseDTO>> getAllSweets() {
        return ResponseEntity.ok(service.getAllSweets());
    }

    @GetMapping("/my-sweets")
    @PreAuthorize("hasRole('ADMIN')")
    public List<SweetResponseDTO> getMySweets() {
        return service.getMyAddedSweets();
    }


    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetResponseDTO> updateSweet(@PathVariable Long id, @Valid @RequestBody UpdateSweetDto dto) {
        return ResponseEntity.ok(service.updateSweet(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteSweet(@PathVariable Long id) {
        service.deleteSweet(id);
        return ResponseEntity.ok("Sweet deleted successfully");
    }

    @PostMapping("/{id}/purchase")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<SweetResponseDTO> purchaseSweet(@PathVariable Long id, @Valid @RequestBody QuantityRequestDTO dto) {
        return ResponseEntity.ok(service.purchaseSweet(id, dto.getQuantity()));
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetResponseDTO> restockSweet(@PathVariable Long id, @Valid @RequestBody QuantityRequestDTO dto) {
        return ResponseEntity.ok(service.restockSweet(id, dto.getQuantity()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<SweetResponseDTO>> searchSweets(@RequestParam(required = false) String name, @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice, @RequestParam(required = false) Double maxPrice) {
        return ResponseEntity.ok(service.searchSweets(name, category, minPrice, maxPrice));
    }

}
