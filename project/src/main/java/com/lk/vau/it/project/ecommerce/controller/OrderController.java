package com.lk.vau.it.project.ecommerce.controller;

import com.lk.vau.it.project.ecommerce.model.Order;
import com.lk.vau.it.project.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable Long id, @RequestBody Order updatedOrder) {
        return orderRepository.findById(id).map(order -> {
            order.setItemName(updatedOrder.getItem_Name());
            order.setPrice(updatedOrder.getPrice());
            order.setColor(updatedOrder.getColor());
            order.setSize(updatedOrder.getSize());
            order.setImage(updatedOrder.getImage());
            order.setOrderId(updatedOrder.getOrder_Id());
            order.setBuyerName(updatedOrder.getBuyer_Name());
            order.setBuyerNIC(updatedOrder.getBuyer_NIC());
            order.setBuyerAddress(updatedOrder.getBuyer_Address());
            order.setBuyerEmail(updatedOrder.getBuyer_Email());
            order.setBuyerPhoneNo(updatedOrder.getBuyer_PhoneNo());
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }
}
