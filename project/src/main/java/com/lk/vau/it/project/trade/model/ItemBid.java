package com.lk.vau.it.project.trade.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "item_bids")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemBid {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long itemId;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private Double bid;
    
    @Column(nullable = false)
    private java.time.LocalDateTime bidTime;
}