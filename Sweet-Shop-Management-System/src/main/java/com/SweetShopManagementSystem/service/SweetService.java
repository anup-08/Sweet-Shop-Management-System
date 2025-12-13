package com.SweetShopManagementSystem.service;

import com.SweetShopManagementSystem.dtos.SweetRequestDTO;
import com.SweetShopManagementSystem.dtos.SweetResponseDTO;
import com.SweetShopManagementSystem.dtos.UpdateSweetDto;
import com.SweetShopManagementSystem.exception.NotFound;
import com.SweetShopManagementSystem.model.Sweet;
import com.SweetShopManagementSystem.repository.SweetRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SweetService {
    private final SweetRepository sweetRepo;

    public SweetResponseDTO addSweet(SweetRequestDTO dto){
        Sweet sweet = new Sweet();
        sweet.setName(dto.getName());
        sweet.setCategory(dto.getCategory());
        sweet.setDesc(dto.getDescription());
        sweet.setPrice(dto.getPrice());
        sweet.setQuantity(dto.getQuantity());

        return mapToResponse(sweetRepo.save(sweet));
    }

    public List<SweetResponseDTO> getAllSweets() {
        return sweetRepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public SweetResponseDTO updateSweet(Long id, UpdateSweetDto dto) {

        Sweet sweet = sweetRepo.findById(id).orElseThrow(() -> new NotFound("Sweet not found"));

        if(dto.getName() != null) {
            sweet.setName(dto.getName());
        }
        else if(dto.getCategory() != null){
            sweet.setCategory(dto.getCategory());
        } else if (dto.getDescription() != null ) {
            sweet.setDesc(dto.getDescription());
        } else if (dto.getPrice() != null) {
            sweet.setPrice(dto.getPrice());
        } else if (dto.getQuantity() != null) {
            sweet.setQuantity(dto.getQuantity());
        }
        return mapToResponse(sweetRepo.save(sweet));
    }

    public void deleteSweet(Long id) {
        Sweet sweet = sweetRepo.findById(id).orElseThrow(() -> new NotFound("Sweet Not Found"));
        sweetRepo.delete(sweet);
    }

    public SweetResponseDTO purchaseSweet(Long id, int quantity) {

        Sweet sweet = sweetRepo.findById(id).orElseThrow(() -> new NotFound("Sweet Not Found"));

        if (sweet.getQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stock for purchase");
        }

        sweet.setQuantity(sweet.getQuantity() - quantity);
        return mapToResponse(sweetRepo.save(sweet));
    }

    public SweetResponseDTO restockSweet(Long id, int quantity) {

        Sweet sweet = sweetRepo.findById(id).orElseThrow(() -> new NotFound("Sweet Not Found"));
        sweet.setQuantity(sweet.getQuantity() + quantity);

        return mapToResponse(sweetRepo.save(sweet));
    }

    public List<SweetResponseDTO> searchSweets(String name, String category, Double minPrice, Double maxPrice) {

        List<Sweet> sweets;

        if (name != null && !name.isBlank()) {
            sweets = sweetRepo.findByNameContainingIgnoreCase(name);
        } else if (category != null && !category.isBlank()) {
            sweets = sweetRepo.findByCategoryIgnoreCase(category);
        } else if (minPrice != null && maxPrice != null) {
            sweets = sweetRepo.findByPriceBetween(minPrice, maxPrice);
        } else {
            sweets = sweetRepo.findAll();
        }

        return sweets.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private SweetResponseDTO mapToResponse(Sweet sweet) {
        SweetResponseDTO dto = new SweetResponseDTO();
        dto.setId(sweet.getId());
        dto.setName(sweet.getName());
        dto.setCategory(sweet.getCategory());
        dto.setDescription(sweet.getDesc());
        dto.setPrice(sweet.getPrice());
        dto.setQuantity(sweet.getQuantity());
        return dto;
    }
}
