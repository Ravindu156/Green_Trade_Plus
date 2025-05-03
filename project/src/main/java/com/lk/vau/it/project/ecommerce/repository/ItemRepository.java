package com.lk.vau.it.project.ecommerce.repository;

import com.lk.vau.it.project.ecommerce.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
}
