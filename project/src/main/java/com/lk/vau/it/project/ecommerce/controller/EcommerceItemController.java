package com.lk.vau.it.project.ecommerce.controller;

import com.lk.vau.it.project.ecommerce.model.EcommerceItem;
import com.lk.vau.it.project.ecommerce.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class EcommerceItemController {

    @Autowired
    private ItemRepository itemRepository;

    @GetMapping
    public List<EcommerceItem> getAllItems() {
        return itemRepository.findAll();
    }

    @GetMapping("/{id}")
    public EcommerceItem getItemById(@PathVariable Long id) {
        return itemRepository.findById(id).orElse(null);
    }

    @PostMapping
    public EcommerceItem createItem(@RequestBody EcommerceItem item) {
        return itemRepository.save(item);
    }

    @PutMapping("/{id}")
    public EcommerceItem updateItem(@PathVariable Long id, @RequestBody EcommerceItem updatedItem) {
        return itemRepository.findById(id).map(item -> {
            item.setItem_name(updatedItem.getItem_name());
            item.setPrice(updatedItem.getPrice());
            item.setColor(updatedItem.getColor());
            item.setSize(updatedItem.getSize());
            item.setImage(updatedItem.getImage());
            return itemRepository.save(item);
        }).orElseThrow(() -> new RuntimeException("Item not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        itemRepository.deleteById(id);
    }
}
