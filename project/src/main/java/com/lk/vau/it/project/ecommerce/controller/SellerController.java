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
            seller.setSellerName(updatedSeller.getSeller_Name());
            seller.setSellerNIC(updatedSeller.getSeller_NIC());
            seller.setSellerAddress(updatedSeller.getSeller_Address());
            seller.setSellerEmail(updatedSeller.getSeller_Email());
            seller.setSellerPhoneNo(updatedSeller.getSeller_PhoneNo());
            return sellerRepository.save(seller);
        }).orElseThrow(() -> new RuntimeException("Seller not found with ID: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteSeller(@PathVariable String id) {
        sellerRepository.deleteById(id);
    }
}
