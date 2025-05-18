package com.lk.vau.it.project.ecommerce.service;

import com.lk.vau.it.project.ecommerce.model.EcommerceOrder;
import com.lk.vau.it.project.ecommerce.repository.EcommerceOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EcommerceOrderService {

    @Autowired
    private EcommerceOrderRepository EcommerceOrderRepository;

    public List<EcommerceOrder> getAllOrders() {
        return EcommerceOrderRepository.findAll();
    }

    public Optional<EcommerceOrder> getOrderById(Long id) {
        return EcommerceOrderRepository.findById(id);
    }

    public EcommerceOrder createOrder(EcommerceOrder order) {
        return EcommerceOrderRepository.save(order);
    }

    public EcommerceOrder updateOrder(Long id, EcommerceOrder orderDetails) {
        return EcommerceOrderRepository.findById(id).map(order -> {
            order.setOrder_id(orderDetails.getOrder_id());
            order.setUser_id(orderDetails.getUser_id());
            order.setUser_address(orderDetails.getUser_address());
            order.setUser_email(orderDetails.getUser_email());
            order.setUser_phoneNo(orderDetails.getUser_phoneNo());
            return EcommerceOrderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found with id " + id));
    }

    public void deleteOrder(Long id) {
        EcommerceOrderRepository.deleteById(id);
    }
}
