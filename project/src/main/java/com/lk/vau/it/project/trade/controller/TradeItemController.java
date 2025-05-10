package com.lk.vau.it.project.trade.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lk.vau.it.project.trade.dto.TradeItemDto;
import com.lk.vau.it.project.trade.service.TradeItemService;

import java.util.List;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/trade-items")
@CrossOrigin(origins = "*") // Allow requests from any origin (for React Native)
public class TradeItemController {
    
    private final TradeItemService itemService;
    
    @Autowired
    public TradeItemController(TradeItemService itemService) {
        this.itemService = itemService;
    }
    
    @PostMapping
    public ResponseEntity<TradeItemDto> createItem(@Valid @RequestBody TradeItemDto ItemDto) {
        com.lk.vau.it.project.trade.dto.TradeItemDto createdItem = itemService.createItem(ItemDto);
        return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<TradeItemDto>> getAllItems() {
        List<TradeItemDto> items = itemService.getAllItems();
        return new ResponseEntity<>(items, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TradeItemDto> getItemById(@PathVariable Long id) {
        TradeItemDto item = itemService.getItemById(id);
        return new ResponseEntity<>(item, HttpStatus.OK);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<TradeItemDto>> getItemsByCategory(@PathVariable String category) {
        List<TradeItemDto> items = itemService.getItemsByCategory(category);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }
    
    @GetMapping("/organic/{isOrganic}")
    public ResponseEntity<List<TradeItemDto>> getOrganicItems(@PathVariable Boolean isOrganic) {
        List<TradeItemDto> items = itemService.getOrganicItems(isOrganic);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TradeItemDto> updateItem(@PathVariable Long id, @Valid @RequestBody TradeItemDto ItemDto) {
        TradeItemDto updatedItem = itemService.updateItem(id, ItemDto);
        return new ResponseEntity<>(updatedItem, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}