package com.lk.vau.it.project.trade.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lk.vau.it.project.trade.dto.ItemBidDto;
import com.lk.vau.it.project.trade.model.ItemBid;
import com.lk.vau.it.project.trade.repository.ItemBidRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ItemBidService {
    
    @Autowired
    private ItemBidRepository itemBidRepository;
    
    public List<ItemBidDto> getBidsByItemId(Long itemId) {
        List<ItemBid> bids = itemBidRepository.findByItemIdOrderByBidDesc(itemId);
        return bids.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Double getMaxBidForItem(Long itemId) {
        return itemBidRepository.findMaxBidByItemId(itemId).orElse(0.0);
    }
    
    public ItemBidDto placeBid(ItemBidDto itemBidDto) {
        // Check if user already has a bid for this item
        Optional<ItemBid> existingBid = itemBidRepository.findByItemIdAndUserId(
                itemBidDto.getItemId(), itemBidDto.getUserId());
        
        ItemBid itemBid;
        if (existingBid.isPresent()) {
            // Update existing bid
            itemBid = existingBid.get();
            itemBid.setBid(itemBidDto.getBid());
            itemBid.setBidTime(LocalDateTime.now());
        } else {
            // Create new bid
            itemBid = new ItemBid();
            itemBid.setItemId(itemBidDto.getItemId());
            itemBid.setUserId(itemBidDto.getUserId());
            itemBid.setBid(itemBidDto.getBid());
            itemBid.setBidTime(LocalDateTime.now());
        }
        
        ItemBid savedBid = itemBidRepository.save(itemBid);
        return convertToDto(savedBid);
    }
    
    private ItemBidDto convertToDto(ItemBid itemBid) {
        ItemBidDto dto = new ItemBidDto();
        dto.setId(itemBid.getId());
        dto.setItemId(itemBid.getItemId());
        dto.setUserId(itemBid.getUserId());
        dto.setBid(itemBid.getBid());
        dto.setBidTime(itemBid.getBidTime());
        return dto;
    }
}