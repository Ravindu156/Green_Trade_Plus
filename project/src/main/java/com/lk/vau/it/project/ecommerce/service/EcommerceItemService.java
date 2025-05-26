package com.lk.vau.it.project.ecommerce.service;

import com.lk.vau.it.project.ecommerce.model.EcommerceItem;
import com.lk.vau.it.project.ecommerce.repository.EcommerceItemRepository;
import com.lk.vau.it.project.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EcommerceItemService {
    
    @Autowired
    private EcommerceItemRepository ecommerceItemRepository;
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    // Create new item with image uploads
    public EcommerceItem createItem(EcommerceItem item, List<MultipartFile> productPhotos, MultipartFile sizeChart) throws IOException {
        // Upload product photos to Cloudinary
        if (productPhotos != null && !productPhotos.isEmpty()) {
            List<String> photoUrls = new ArrayList<>();
            for (MultipartFile photo : productPhotos) {
                if (!photo.isEmpty() && photoUrls.size() < 5) {
                    String photoUrl = cloudinaryService.uploadFile(photo, "image");
                    photoUrls.add(photoUrl);
                }
            }
            item.setProductPhotoUrls(photoUrls);
        }
        
        // Upload size chart to Cloudinary
        if (sizeChart != null && !sizeChart.isEmpty()) {
            String sizeChartUrl = cloudinaryService.uploadFile(sizeChart, "image");
            item.setSizeChartImageUrl(sizeChartUrl);
        }
        
        return ecommerceItemRepository.save(item);
    }
    
    // Get all items
    public List<EcommerceItem> getAllItems() {
        return ecommerceItemRepository.findAll();
    }
    
    // Get item by ID
    public Optional<EcommerceItem> getItemById(Long id) {
        return ecommerceItemRepository.findById(id);
    }
    
    // Update item
    public EcommerceItem updateItem(Long id, EcommerceItem updatedItem, List<MultipartFile> newProductPhotos, MultipartFile newSizeChart) throws IOException {
        Optional<EcommerceItem> existingItemOpt = ecommerceItemRepository.findById(id);
        
        if (existingItemOpt.isPresent()) {
            EcommerceItem existingItem = existingItemOpt.get();
            
            // Update basic fields
            existingItem.setSeller(updatedItem.getSeller());
            existingItem.setitemName(updatedItem.getitemName());
            existingItem.setCategory(updatedItem.getCategory());
            existingItem.setStock(updatedItem.getStock());
            existingItem.setSize(updatedItem.getSize());
            existingItem.setColor(updatedItem.getColor());
            existingItem.setPrice(updatedItem.getPrice());
            existingItem.setDescription(updatedItem.getDescription());
            
            // Update product photos if new ones provided
            if (newProductPhotos != null && !newProductPhotos.isEmpty()) {
                List<String> newPhotoUrls = new ArrayList<>();
                for (MultipartFile photo : newProductPhotos) {
                    if (!photo.isEmpty() && newPhotoUrls.size() < 5) {
                        String photoUrl = cloudinaryService.uploadFile(photo, "image");
                        newPhotoUrls.add(photoUrl);
                    }
                }
                existingItem.setProductPhotoUrls(newPhotoUrls);
            }
            
            // Update size chart if new one provided
            if (newSizeChart != null && !newSizeChart.isEmpty()) {
                String sizeChartUrl = cloudinaryService.uploadFile(newSizeChart, "image");
                existingItem.setSizeChartImageUrl(sizeChartUrl);
            }
            
            return ecommerceItemRepository.save(existingItem);
        }
        
        throw new RuntimeException("Item not found with id: " + id);
    }
    
    // Delete item by ID
    public void deleteItem(Long id) {
        if (ecommerceItemRepository.existsById(id)) {
            ecommerceItemRepository.deleteById(id);
        } else {
            throw new RuntimeException("Item not found with id: " + id);
        }
    }
    
    // Search items
   /*  public List<EcommerceItem> searchItems(String searchTerm) {
        return ecommerceItemRepository.searchItems(searchTerm);
    } */
    
    // Get items by category
    public List<EcommerceItem> getItemsByCategory(String category) {
        return ecommerceItemRepository.findByCategoryIgnoreCase(category);
    }
    
    // Get items by color
    public List<EcommerceItem> getItemsByColor(String color) {
        return ecommerceItemRepository.findByColor(color);
    }
    
    // Get items by size
    public List<EcommerceItem> getItemsBySize(String size) {
        return ecommerceItemRepository.findBySize(size);
    }
    
    // Get items by price range
    public List<EcommerceItem> getItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return ecommerceItemRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    // Get available items (in stock)
    public List<EcommerceItem> getAvailableItems() {
        return ecommerceItemRepository.findByStockGreaterThan(0);
    }
    
    // Get available items by category
    public List<EcommerceItem> getAvailableItemsByCategory(String category) {
        return ecommerceItemRepository.findAvailableItemsByCategory(category);
    }
    
    // Get items with low stock
    public List<EcommerceItem> getLowStockItems(Integer threshold) {
        return ecommerceItemRepository.findLowStockItems(threshold != null ? threshold : 5);
    }
    
    // Filter items by multiple criteria
    public List<EcommerceItem> getFilteredItems(String category, String color, String size, BigDecimal minPrice, BigDecimal maxPrice) {
        List<EcommerceItem> items = ecommerceItemRepository.findAll();
        
        return items.stream()
                .filter(item -> category == null || category.isEmpty() || item.getCategory().equalsIgnoreCase(category))
                .filter(item -> color == null || color.isEmpty() || item.getColor().equalsIgnoreCase(color))
                .filter(item -> size == null || size.isEmpty() || item.getSize().equalsIgnoreCase(size))
                .filter(item -> minPrice == null || item.getPrice().compareTo(minPrice) >= 0)
                .filter(item -> maxPrice == null || item.getPrice().compareTo(maxPrice) <= 0)
                .toList();
    }
    
    // Update stock quantity
    public EcommerceItem updateStock(Long id, Integer newStock) {
        Optional<EcommerceItem> itemOpt = ecommerceItemRepository.findById(id);
        
        if (itemOpt.isPresent()) {
            EcommerceItem item = itemOpt.get();
            item.setStock(newStock);
            return ecommerceItemRepository.save(item);
        }
        
        throw new RuntimeException("Item not found with id: " + id);
    }
    
    // Decrease stock (for purchase operations)
    public EcommerceItem decreaseStock(Long id, Integer quantity) {
        Optional<EcommerceItem> itemOpt = ecommerceItemRepository.findById(id);
        
        if (itemOpt.isPresent()) {
            EcommerceItem item = itemOpt.get();
            
            if (item.getStock() >= quantity) {
                item.setStock(item.getStock() - quantity);
                return ecommerceItemRepository.save(item);
            } else {
                throw new RuntimeException("Insufficient stock. Available: " + item.getStock() + ", Requested: " + quantity);
            }
        }
        
        throw new RuntimeException("Item not found with id: " + id);
    }
    
    // Get distinct categories
    public List<String> getDistinctCategories() {
        return ecommerceItemRepository.findDistinctCategories();
    }
    
    // Get distinct colors
    public List<String> getDistinctColors() {
        return ecommerceItemRepository.findDistinctColors();
    }
    
    // Get distinct sizes
    public List<String> getDistinctSizes() {
        return ecommerceItemRepository.findDistinctSizes();
    }
    
    // Add product photo to existing item
    public EcommerceItem addProductPhoto(Long id, MultipartFile photo) throws IOException {
        Optional<EcommerceItem> itemOpt = ecommerceItemRepository.findById(id);
        
        if (itemOpt.isPresent()) {
            EcommerceItem item = itemOpt.get();
            
            if (!item.hasMaxPhotos()) {
                String photoUrl = cloudinaryService.uploadFile(photo, "image");
                item.addProductPhotoUrl(photoUrl);
                return ecommerceItemRepository.save(item);
            } else {
                throw new RuntimeException("Maximum 5 photos allowed per item");
            }
        }
        
        throw new RuntimeException("Item not found with id: " + id);
    }
    
    // Remove product photo from existing item
    public EcommerceItem removeProductPhoto(Long id, String photoUrl) {
        Optional<EcommerceItem> itemOpt = ecommerceItemRepository.findById(id);
        
        if (itemOpt.isPresent()) {
            EcommerceItem item = itemOpt.get();
            item.removeProductPhotoUrl(photoUrl);
            return ecommerceItemRepository.save(item);
        }
        
        throw new RuntimeException("Item not found with id: " + id);
    }
    
    // Check if item exists
    public boolean itemExists(Long id) {
        return ecommerceItemRepository.existsById(id);
    }
    
    // Get item count
    public long getItemCount() {
        return ecommerceItemRepository.count();
    }
    
    // Get item count by category
    public Long getItemCountByCategory(String category) {
        return ecommerceItemRepository.countByCategory(category);
    }
}