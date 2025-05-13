package com.lk.vau.it.project.trade.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.lk.vau.it.project.trade.model.TradeItem;
import java.util.List;

@Repository
public interface TradeItemRepository extends JpaRepository<TradeItem, Long> {
    List<TradeItem> findByUserId(Long userId);
    List<TradeItem> findByCategory(String category);
    List<TradeItem> findByIsOrganic(Boolean isOrganic);
}
