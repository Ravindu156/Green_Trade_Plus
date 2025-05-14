package com.lk.vau.it.project.trade.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemBidDto {
    private Long id;
    private Long itemId;
    private Long userId;
    private Double bid;
    private java.time.LocalDateTime bidTime;
    
    // Additional field for the maximum bid for an item
    private Double maxBid;
}