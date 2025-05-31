package com.lk.vau.it.project.trade.service.impl;

import com.lk.vau.it.project.trade.dto.TradeItemDto;
import com.lk.vau.it.project.trade.model.TradeItem;
import com.lk.vau.it.project.trade.model.User;
import com.lk.vau.it.project.trade.repository.TradeItemRepository;
import com.lk.vau.it.project.trade.repository.UserRepository;
import com.lk.vau.it.project.trade.service.TradeItemService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TradeItemServiceImpl implements TradeItemService {

    private final TradeItemRepository itemRepository;
    private final UserRepository userRepository;

    // Fixed: Single constructor with both dependencies
    @Autowired
    public TradeItemServiceImpl(TradeItemRepository itemRepository, UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    @Override
    public TradeItemDto createItem(TradeItemDto itemDto) {
        // Fixed: Better error handling and validation
        if (itemDto.getUser() == null || itemDto.getUser().getId() == null) {
            throw new IllegalArgumentException("User information is required");
        }

        User user = userRepository.findById(itemDto.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + itemDto.getUser().getId()));

        TradeItem item = convertToEntity(itemDto);
        item.setFarmer(user);
        // Remove explicit dateAdded setting since @PrePersist handles it

        TradeItem savedItem = itemRepository.save(item);
        return convertToDTO(savedItem);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TradeItemDto> getAllItems() {
        return itemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TradeItemDto getItemById(Long id) {
        TradeItem item = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + id));
        return convertToDTO(item);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TradeItemDto> getItemsByUserId(Long userId) {
        // Fixed: Use proper method name (assuming repository method exists)
        return itemRepository.findByFarmerId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TradeItemDto> getItemsByCategory(String category) {
        return itemRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TradeItemDto> getOrganicItems(Boolean isOrganic) {
        return itemRepository.findByIsOrganic(isOrganic).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TradeItemDto updateItem(Long id, TradeItemDto itemDto) {
        TradeItem existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + id));

        // Fixed: Proper user handling in update
        if (itemDto.getUser() != null && itemDto.getUser().getId() != null) {
            User user = userRepository.findById(itemDto.getUser().getId())
                    .orElseThrow(
                            () -> new EntityNotFoundException("User not found with id: " + itemDto.getUser().getId()));
            existingItem.setFarmer(user);
        }

        // Update other fields
        existingItem.setCategory(itemDto.getCategory());
        existingItem.setName(itemDto.getName());
        existingItem.setQuantity(itemDto.getQuantity());
        existingItem.setUnit(itemDto.getUnit());
        existingItem.setIsOrganic(itemDto.getIsOrganic());
        existingItem.setIsBidActive(itemDto.getIsBidActive());
        existingItem.setDescription(itemDto.getDescription());
        // dateAdded should not be updated

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

    @Override
    public TradeItemDto updateBidStatus(Long id, boolean isBidActive) {
        TradeItem item = itemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Item not found with id: " + id));

        item.setIsBidActive(isBidActive);
        TradeItem updatedItem = itemRepository.save(item);

        return convertToDTO(updatedItem);
    }

    // Helper methods to convert between Entity and DTO
    private TradeItem convertToEntity(TradeItemDto itemDto) {
        TradeItem item = new TradeItem();
        // Don't set user here - it's handled in the calling method
        item.setCategory(itemDto.getCategory());
        item.setName(itemDto.getName());
        item.setQuantity(itemDto.getQuantity());
        item.setUnit(itemDto.getUnit());
        item.setIsOrganic(itemDto.getIsOrganic());
        item.setIsBidActive(itemDto.getIsBidActive());
        item.setDescription(itemDto.getDescription());
        // Don't set dateAdded - let @PrePersist handle it
        return item;
    }

    private TradeItemDto convertToDTO(TradeItem item) {
        return new TradeItemDto(
                item.getId(),
                item.getFarmer(),
                item.getCategory(),
                item.getName(),
                item.getQuantity(),
                item.getUnit(),
                item.getIsOrganic(),
                item.getDescription(),
                item.getDateAdded(),
                item.getIsBidActive());
    }
}