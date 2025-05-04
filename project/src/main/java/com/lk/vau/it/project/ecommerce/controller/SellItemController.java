package com.lk.vau.it.project.ecommerce.controller;

import com.lk.vau.it.project.ecommerce.model.SellItem;
import com.lk.vau.it.project.ecommerce.repository.SellItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sell-items")
public class SellItemController {

    @Autowired
    private SellItemRepository repository;

    @GetMapping
    public List<SellItem> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public SellItem getById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping
    public SellItem create(@RequestBody SellItem item) {
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public SellItem update(@PathVariable Long id, @RequestBody SellItem updatedItem) {
        return repository.findById(id).map(item -> {
            item.setItem_name(updatedItem.getItem_name());
            item.setPrice(updatedItem.getPrice());
            item.setColor(updatedItem.getColor());
            item.setSize(updatedItem.getSize());
            item.setImage(updatedItem.getImage());
            item.setStock(updatedItem.getStock());
            item.setSeller_id(updatedItem.getSeller_id());
            item.setDescription(updatedItem.getDescription());
            return repository.save(item);
        }).orElseThrow(() -> new RuntimeException("SellItem not found with ID: " + id));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
