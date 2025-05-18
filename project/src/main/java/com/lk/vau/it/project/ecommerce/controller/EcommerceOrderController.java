package com.lk.vau.it.project.ecommerce.controller;

import com.lk.vau.it.project.ecommerce.model.EcommerceOrder;
import com.lk.vau.it.project.ecommerce.service.EcommerceOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class EcommerceOrderController {

    @Autowired
    private EcommerceOrderService EcommerceOrderService;

    @GetMapping
    public List<EcommerceOrder> getAllOrders() {
        return EcommerceOrderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EcommerceOrder> getOrderById(@PathVariable Long id) {
        return EcommerceOrderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public EcommerceOrder createOrder(@RequestBody EcommerceOrder order) {
        return EcommerceOrderService.createOrder(order);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EcommerceOrder> updateOrder(@PathVariable Long id, @RequestBody EcommerceOrder order) {
        try {
            EcommerceOrder updated = EcommerceOrderService.updateOrder(id, order);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        EcommerceOrderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
