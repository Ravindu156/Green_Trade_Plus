package com.lk.vau.it.project.trade.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

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

    @ManyToOne
    @JoinColumn(name = "item_id")
    @JsonBackReference
    private TradeItem item;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference("user-bid")
    private User user;

    @Column(nullable = false)
    private Double bid;

    @Column(nullable = false)
    private java.time.LocalDateTime bidTime;
}