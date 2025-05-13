package com.lk.vau.it.project.trade.service;

import java.util.List;
import com.lk.vau.it.project.trade.dto.TradeItemDto;

public interface  TradeItemService {
    TradeItemDto createItem(TradeItemDto ItemDto);
    List<TradeItemDto> getAllItems();
    TradeItemDto getItemById(Long id);
    List<TradeItemDto> getItemsByUserId(Long userId);
    List<TradeItemDto> getItemsByCategory(String category);
    List<TradeItemDto> getOrganicItems(Boolean isOrganic);
    TradeItemDto updateItem(Long id, TradeItemDto ItemDto);
    void deleteItem(Long id);
}
