package com.lk.vau.it.project.ecommerce.service;

import com.lk.vau.it.project.ecommerce.model.EcommerceItem;
import com.lk.vau.it.project.ecommerce.repository.EcommerceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EcommerceItemService {

    @Autowired
    private EcommerceItemRepository EcommerceItemRepository;

    public List<EcommerceItem> getAllItems() {
        return EcommerceItemRepository.findAll();
    }

    public Optional<EcommerceItem> getItemById(Long id) {
        return EcommerceItemRepository.findById(id);
    }

    public EcommerceItem createItem(EcommerceItem item) {
        return EcommerceItemRepository.save(item);
    }

    public EcommerceItem updateItem(Long id, EcommerceItem itemDetails) {
        return EcommerceItemRepository.findById(id).map(item -> {
            item.setItem_name(itemDetails.getItem_name());
            item.setCategory(itemDetails.getCategory());
            item.setColor(itemDetails.getColor());
            item.setImage(itemDetails.getImage());
            item.setPrice(itemDetails.getPrice());
            item.setSize(itemDetails.getSize());
            item.setStock(itemDetails.getStock());
            return EcommerceItemRepository.save(item);
        }).orElseThrow(() -> new RuntimeException("Item not found with id " + id));
    }

    public void deleteItem(Long id) {
        EcommerceItemRepository.deleteById(id);
    }
}
