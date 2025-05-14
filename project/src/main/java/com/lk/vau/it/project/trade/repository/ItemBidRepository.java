package com.lk.vau.it.project.trade.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lk.vau.it.project.trade.model.ItemBid;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemBidRepository extends JpaRepository<ItemBid, Long> {
    
    List<ItemBid> findByItemIdOrderByBidDesc(Long itemId);
    
    @Query("SELECT MAX(ib.bid) FROM ItemBid ib WHERE ib.itemId = :itemId")
    Optional<Double> findMaxBidByItemId(@Param("itemId") Long itemId);
    
    @Query("SELECT ib FROM ItemBid ib WHERE ib.itemId = :itemId AND ib.userId = :userId")
    Optional<ItemBid> findByItemIdAndUserId(@Param("itemId") Long itemId, @Param("userId") Long userId);
}