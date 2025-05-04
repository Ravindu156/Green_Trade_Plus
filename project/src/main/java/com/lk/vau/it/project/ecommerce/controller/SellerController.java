package com.lk.vau.it.project.ecommerce.controller;

import com.lk.vau.it.project.ecommerce.model.Seller;
import com.lk.vau.it.project.ecommerce.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sellers")
public class SellerController {

    @Autowired
    private SellerRepository sellerRepository;

    @GetMapping
    public List<Seller> getAllSellers() {
        return sellerRepository.findAll();
    }

    @GetMapping("/{id}")
    public Seller getSellerById(@PathVariable String id) {
        return sellerRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Seller createSeller(@RequestBody Seller seller) {
        return sellerRepository.save(seller);
    }

    @PutMapping("/{id}")
    public Seller updateSeller(@PathVariable String id, @RequestBody Seller updatedSeller) {
        return sellerRepository.findById(id).map(seller -> {
            seller.setSeller_name(updatedSeller.getSeller_name());
            seller.setSeller_NIC(updatedSeller.getSeller_NIC());
            seller.setSeller_address(updatedSeller.getSeller_address());
            seller.setSeller_email(updatedSeller.getSeller_email());
            seller.setSeller_phoneNo(updatedSeller.getSeller_phoneNo());
            return sellerRepository.save(seller);
        }).orElseThrow(() -> new RuntimeException("Seller not found with ID: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteSeller(@PathVariable String id) {
        sellerRepository.deleteById(id);
    }
}
