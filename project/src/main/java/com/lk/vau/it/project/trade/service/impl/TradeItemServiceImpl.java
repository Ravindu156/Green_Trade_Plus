package com.lk.vau.it.project.trade.service.impl;

import com.lk.vau.it.project.trade.dto.TradeItemDto;
import com.lk.vau.it.project.trade.model.TradeItem;
import com.lk.vau.it.project.trade.repository.TradeItemRepository;
import com.lk.vau.it.project.trade.service.TradeItemService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TradeItemServiceImpl implements TradeItemService {

    private final TradeItemRepository itemRepository;

    @Autowired
    public TradeItemServiceImpl(TradeItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Override
    public TradeItemDto createItem(TradeItemDto itemDto) {
        TradeItem item = convertToEntity(itemDto);
        item.setDateAdded(LocalDateTime.now());
        TradeItem savedItem = itemRepository.save(item);
        return convertToDTO(savedItem);
    }

    @Override
    public List<TradeItemDto> getAllItems() {
        return itemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TradeItemDto getItemById(Long id) {
        TradeItem item = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + id));
        return convertToDTO(item);
    }

    @Override
    public List<TradeItemDto> getItemsByCategory(String category) {
        return itemRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TradeItemDto> getOrganicItems(Boolean isOrganic) {
        return itemRepository.findByIsOrganic(isOrganic).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TradeItemDto updateItem(Long id, TradeItemDto itemDto) {
        TradeItem existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + id));

        // Update the fields
        existingItem.setUserId(itemDto.getUserId());
        existingItem.setCategory(itemDto.getCategory());
        existingItem.setName(itemDto.getName());
        existingItem.setQuantity(itemDto.getQuantity());
        existingItem.setUnit(itemDto.getUnit());
        existingItem.setIsOrganic(itemDto.getIsOrganic());
        existingItem.setDescription(itemDto.getDescription());
        // Don't update dateAdded

        TradeItem updatedItem = itemRepository.save(existingItem);
        return convertToDTO(updatedItem);
    }

    @Override
    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new EntityNotFoundException("Item not found with id: " + id);
        }
        itemRepository.deleteById(id);
    }

    // Helper methods to convert between Entity and DTO
    private TradeItem convertToEntity(TradeItemDto itemDto) {
        TradeItem item = new TradeItem();
        item.setUserId(itemDto.getUserId());
        item.setCategory(itemDto.getCategory());
        item.setName(itemDto.getName());
        item.setQuantity(itemDto.getQuantity());
        item.setUnit(itemDto.getUnit());
        item.setIsOrganic(itemDto.getIsOrganic());
        item.setDescription(itemDto.getDescription());
        item.setDateAdded(itemDto.getDateAdded() != null ? itemDto.getDateAdded() : LocalDateTime.now());
        return item;
    }

    private TradeItemDto convertToDTO(TradeItem item) {
        return new TradeItemDto(
                item.getId(),
                item.getUserId(),
                item.getCategory(),
                item.getName(),
                item.getQuantity(),
                item.getUnit(),
                item.getIsOrganic(),
                item.getDescription(),
                item.getDateAdded()
        );
    }
}
