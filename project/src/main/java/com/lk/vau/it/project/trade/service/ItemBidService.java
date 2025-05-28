package com.lk.vau.it.project.trade.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lk.vau.it.project.trade.dto.ItemBidDto;
import com.lk.vau.it.project.trade.model.ItemBid;
import com.lk.vau.it.project.trade.model.TradeItem;
import com.lk.vau.it.project.trade.model.User;
import com.lk.vau.it.project.trade.repository.ItemBidRepository;
import com.lk.vau.it.project.trade.repository.TradeItemRepository;
import com.lk.vau.it.project.trade.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ItemBidService {

    @Autowired
    private ItemBidRepository itemBidRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TradeItemRepository tradeItemRepository;

    public List<ItemBidDto> getBidsByItemId(Long itemId) {
        List<ItemBid> bids = itemBidRepository.findByItemIdOrderByBidDesc(itemId);
        return bids.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    //Get Bids by User
    public List<ItemBidDto> getBidsByUserId(Long userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    List<ItemBid> bids = itemBidRepository.findAllByUser(user);

    return bids.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
}

    public Double getMaxBidForItem(Long itemId) {
        return itemBidRepository.findMaxBidByItemId(itemId).orElse(0.0);
    }

    public ItemBidDto placeBid(ItemBidDto itemBidDto) {
        // Fetch related entities
        TradeItem item = tradeItemRepository.findById(itemBidDto.getItemId())
                .orElseThrow(() -> new RuntimeException("Trade item not found"));
        User user = userRepository.findById(itemBidDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<ItemBid> existingBid = itemBidRepository.findByItemAndUser(item, user);

        ItemBid itemBid;
        if (existingBid.isPresent()) {
            // Update existing bid
            itemBid = existingBid.get();
            itemBid.setBid(itemBidDto.getBid());
            itemBid.setBidTime(LocalDateTime.now());
        } else {
            // Create new bid
            itemBid = new ItemBid();
            itemBid.setItem(item);
            itemBid.setUser(user);
            itemBid.setBid(itemBidDto.getBid());
            itemBid.setBidTime(LocalDateTime.now());
        }

        ItemBid savedBid = itemBidRepository.save(itemBid);
        return convertToDto(savedBid);
    }

    private ItemBidDto convertToDto(ItemBid itemBid) {
        ItemBidDto dto = new ItemBidDto();
        dto.setId(itemBid.getId());
        dto.setItemId(itemBid.getItem().getId());
        dto.setUserId(itemBid.getUser().getId());
        dto.setBid(itemBid.getBid());
        dto.setBidTime(itemBid.getBidTime());
        return dto;
    }
}
