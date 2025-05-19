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
    private EcommerceOrderRepository ecommerceOrderRepository;

    public List<EcommerceOrder> getAllOrders() {
        return ecommerceOrderRepository.findAll();
    }

    public Optional<EcommerceOrder> getOrderById(Long order_id) {
        return ecommerceOrderRepository.findById(order_id);
    }

    public EcommerceOrder createOrder(EcommerceOrder order) {
        return ecommerceOrderRepository.save(order);
    }

    public EcommerceOrder updateOrder(Long order_id, EcommerceOrder orderDetails) {
        return ecommerceOrderRepository.findById(order_id).map(order -> {
            order.setOrder_id(orderDetails.getOrder_id());
            order.setUser_id(orderDetails.getUser_id());
            order.setUser_address(orderDetails.getUser_address());
            order.setUser_email(orderDetails.getUser_email());
            order.setUser_phoneNo(orderDetails.getUser_phoneNo());
            return ecommerceOrderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found with id " + order_id));
    }

    public void deleteOrder(Long order_id) {
        ecommerceOrderRepository.deleteById(order_id);
    }
}
