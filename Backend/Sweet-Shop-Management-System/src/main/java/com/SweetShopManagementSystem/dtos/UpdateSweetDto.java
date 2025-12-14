package com.SweetShopManagementSystem.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateSweetDto {
    private String name;
    private String category;
    private String description;
    private Double price;
    private Integer quantity;
    
}
