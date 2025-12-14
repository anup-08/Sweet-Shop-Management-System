package com.SweetShopManagementSystem.controller;

import com.SweetShopManagementSystem.dtos.QuantityRequestDTO;
import com.SweetShopManagementSystem.dtos.SweetRequestDTO;
import com.SweetShopManagementSystem.dtos.SweetResponseDTO;
import com.SweetShopManagementSystem.dtos.UpdateSweetDto;
import com.SweetShopManagementSystem.service.SweetService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/sweets")
public class SweetController {
    private final SweetService service;

    @PostMapping( value = "/addSweets" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetResponseDTO> addSweet(@Valid @ModelAttribute SweetRequestDTO dto,
                                                     @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(service.addSweet(dto, image));
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

    @PostMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SweetResponseDTO> updateSweetPost(@PathVariable Long id,
                                                            @Valid @ModelAttribute UpdateSweetDto dto,
                                                            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(service.updateSweet(id, dto, image));
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

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<byte[]> serveImage(@PathVariable String filename) {
        try {
            java.nio.file.Path path = java.nio.file.Path.of("uploads").resolve(filename).normalize();
            if (!java.nio.file.Files.exists(path)) {
                return ResponseEntity.notFound().build();
            }
            byte[] bytes = java.nio.file.Files.readAllBytes(path);
            String contentType = java.nio.file.Files.probeContentType(path);
            if (contentType == null) contentType = "application/octet-stream";
            return ResponseEntity.ok().header("Content-Type", contentType).body(bytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
