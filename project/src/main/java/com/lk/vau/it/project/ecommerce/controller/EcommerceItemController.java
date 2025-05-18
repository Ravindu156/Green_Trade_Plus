package com.lk.vau.it.project.ecommerce.controller;

import com.lk.vau.it.project.ecommerce.model.EcommerceItem;
import com.lk.vau.it.project.ecommerce.service.EcommerceItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class EcommerceItemController {

    @Autowired
    private EcommerceItemService ecommerceitemService;

    @GetMapping
    public List<EcommerceItem> getAllItems() {
        return ecommerceitemService.getAllItems();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EcommerceItem> getItemById(@PathVariable Long id) {
        return ecommerceitemService.getItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public EcommerceItem createItem(@RequestBody EcommerceItem item) {
        return ecommerceitemService.createItem(item);
    }

    @PutMapping
    public ResponseEntity<EcommerceItem> updateItem(@PathVariable Long id, @RequestBody EcommerceItem item) {
        try {
            EcommerceItem updated = ecommerceitemService.updateItem(id, item);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        ecommerceitemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
