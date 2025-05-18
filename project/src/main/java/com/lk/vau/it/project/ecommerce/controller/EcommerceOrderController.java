package com.lk.vau.it.project.ecommerce.controller;

import com.lk.vau.it.project.ecommerce.model.EcommerceOrder;
import com.lk.vau.it.project.ecommerce.repository.EcommerceOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class EcommerceOrderController {

    @Autowired
    private EcommerceOrderRepository orderRepository;

    @GetMapping
    public List<EcommerceOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public EcommerceOrder getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @PostMapping
    public EcommerceOrder createOrder(@RequestBody EcommerceOrder order) {
        return orderRepository.save(order);
    }

    @PutMapping("/{id}")
    public EcommerceOrder updateOrder(@PathVariable Long id, @RequestBody EcommerceOrder updatedOrder) {
        return orderRepository.findById(id).map(order -> {
            order.setOrder_id(updatedOrder.getOrder_id());
            order.setUser_id(updatedOrder.getUser_id());
            order.setUser_address(updatedOrder.getUser_address());
            order.setUser_email(updatedOrder.getUser_email());
            order.setUser_phoneNo(updatedOrder.getUser_phoneNo());
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }
}
