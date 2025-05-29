package com.lk.vau.it.project.trade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lk.vau.it.project.trade.model.ItemBid;
import com.lk.vau.it.project.trade.model.TradeItem;
import com.lk.vau.it.project.trade.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemBidRepository extends JpaRepository<ItemBid, Long> {

    // ✅ Fetch all bids by item object, ordered by bid amount descending
    List<ItemBid> findByItemOrderByBidDesc(TradeItem item);

    // ✅ Custom query: Find max bid using TradeItem entity
    @Query("SELECT MAX(ib.bid) FROM ItemBid ib WHERE ib.item = :item")
    Optional<Double> findMaxBidByItem(@Param("item") TradeItem item);

    // ✅ Custom query: Find max bid using item ID (fixes the error you got)
    @Query("SELECT MAX(ib.bid) FROM ItemBid ib WHERE ib.item.id = :itemId")
    Optional<Double> findMaxBidByItemId(@Param("itemId") Long itemId);

    // ✅ Find existing bid by both item and user entities
    Optional<ItemBid> findByItemAndUser(TradeItem item, User user);

    //Find existing bid by user
    List<ItemBid> findAllByUser(User user);

    // ✅ Fetch all bids by item ID (alternative way)
    List<ItemBid> findByItemIdOrderByBidDesc(Long itemId);
}
