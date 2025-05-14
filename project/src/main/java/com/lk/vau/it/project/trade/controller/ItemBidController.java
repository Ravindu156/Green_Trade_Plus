package com.lk.vau.it.project.trade.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lk.vau.it.project.trade.dto.ItemBidDto;
import com.lk.vau.it.project.trade.service.ItemBidService;

import java.util.List;

@RestController
@RequestMapping("/api/item-bids")
public class ItemBidController {
    
    @Autowired
    private ItemBidService itemBidService;
    
    @GetMapping("/{itemId}")
    public ResponseEntity<List<ItemBidDto>> getBidsByItemId(@PathVariable Long itemId) {
        List<ItemBidDto> bids = itemBidService.getBidsByItemId(itemId);
        return ResponseEntity.ok(bids);
    }
    
    @GetMapping("/{itemId}/max")
    public ResponseEntity<Double> getMaxBidForItem(@PathVariable Long itemId) {
        Double maxBid = itemBidService.getMaxBidForItem(itemId);
        return ResponseEntity.ok(maxBid);
    }
    
    @PostMapping
    public ResponseEntity<ItemBidDto> placeBid(@RequestBody ItemBidDto itemBidDto) {
        ItemBidDto savedBid = itemBidService.placeBid(itemBidDto);
        return new ResponseEntity<>(savedBid, HttpStatus.CREATED);
    }
}