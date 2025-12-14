package com.SweetShopManagementSystem.service;

import com.SweetShopManagementSystem.dtos.SweetRequestDTO;
import com.SweetShopManagementSystem.dtos.SweetResponseDTO;
import com.SweetShopManagementSystem.dtos.UpdateSweetDto;
import com.SweetShopManagementSystem.exception.NotFound;
import com.SweetShopManagementSystem.model.Sweet;
import com.SweetShopManagementSystem.model.User;
import com.SweetShopManagementSystem.repository.SweetRepository;
import com.SweetShopManagementSystem.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class SweetService {
    private final SweetRepository sweetRepo;
    private final UserRepository userRepository;

    public SweetResponseDTO addSweet(SweetRequestDTO dto, MultipartFile image){
        String username = getCurrentUsername();
        User admin = userRepository.findByUsername(username).orElseThrow(() -> new NotFound("User not found"));

        Sweet sweet = new Sweet();
        sweet.setName(dto.getName());
        sweet.setCategory(dto.getCategory());
        sweet.setDescription(dto.getDescription());
        sweet.setPrice(dto.getPrice());
        if (image != null && !image.isEmpty()) {
            try {
                // ensure uploads directory exists
                Path uploadsDir = Path.of("uploads");
                if (!Files.exists(uploadsDir)) Files.createDirectories(uploadsDir);
                String ext = "";
                String original = image.getOriginalFilename();
                if (original != null && original.contains(".")) {
                    ext = original.substring(original.lastIndexOf('.'));
                }
                String filename = UUID.randomUUID().toString() + ext;
                Path target = uploadsDir.resolve(filename);
                Files.copy(image.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
                sweet.setImage(filename);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save uploaded image", e);
            }
        }
        sweet.setQuantity(dto.getQuantity());
        sweet.setAddedBy(admin);

        return mapToResponse(sweetRepo.save(sweet));
    }
    private String getCurrentUsername() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }


    public List<SweetResponseDTO> getAllSweets() {
        return sweetRepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<SweetResponseDTO> getMyAddedSweets() {

        String username = getCurrentUsername();

        User admin = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return sweetRepo.findByAddedBy(admin)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public SweetResponseDTO updateSweet(Long id, UpdateSweetDto dto, MultipartFile image) {

        Sweet sweet = sweetRepo.findById(id).orElseThrow(() -> new NotFound("Sweet not found"));

        if (dto.getName() != null && !dto.getName().isBlank()) {
            sweet.setName(dto.getName());
        }

        if (dto.getCategory() != null && !dto.getCategory().isBlank()) {
            sweet.setCategory(dto.getCategory());
        }

        if (dto.getDescription() != null && !dto.getDescription().isBlank()) {
            sweet.setDescription(dto.getDescription());
        }

        if (dto.getPrice() != null) {
            sweet.setPrice(dto.getPrice());
        }

        if (dto.getQuantity() != null) {
            sweet.setQuantity(dto.getQuantity());
        }
        // handle uploaded image if present
        if (image != null && !image.isEmpty()) {
            try {
                Path uploadsDir = Path.of("uploads");
                if (!Files.exists(uploadsDir)) Files.createDirectories(uploadsDir);
                String ext = "";
                String original = image.getOriginalFilename();
                if (original != null && original.contains(".")) {
                    ext = original.substring(original.lastIndexOf('.'));
                }
                String filename = UUID.randomUUID().toString() + ext;
                Path target = uploadsDir.resolve(filename);
                Files.copy(image.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
                sweet.setImage(filename);
            } catch (IOException e) {
                throw new IllegalArgumentException("Failed to save uploaded image", e);
            }
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
        dto.setDescription(sweet.getDescription());
        dto.setPrice(sweet.getPrice());
        dto.setQuantity(sweet.getQuantity());
        if (sweet.getImage() != null && !sweet.getImage().isBlank()) {
            // return filename only; frontend will build the full URL
            dto.setImage(sweet.getImage());
        }
        return dto;
    }
}
