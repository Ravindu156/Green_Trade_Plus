package com.lk.vau.it.project.ecommerce.controller;

import com.lk.vau.it.project.ecommerce.model.EcommerceItem;
import com.lk.vau.it.project.ecommerce.service.EcommerceItemService;
import com.lk.vau.it.project.trade.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*") // Configure as needed for your frontend
public class EcommerceItemController {
    
    @Autowired
    private EcommerceItemService ecommerceItemService;
    
    // Create new item
    @PostMapping
    public ResponseEntity<?> createItem(
            @RequestParam("seller") User seller,
            @RequestParam("itemName") String itemName,
            @RequestParam("category") String category,
            @RequestParam("stock") Integer stock,
            @RequestParam("size") String size,
            @RequestParam("color") String color,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "productPhotos", required = false) List<MultipartFile> productPhotos,
            @RequestParam(value = "sizeChart", required = false) MultipartFile sizeChart) {
        
        try {
            EcommerceItem item = new EcommerceItem();
            item.setSeller(seller);
            item.setitemName(itemName);
            item.setCategory(category);
            item.setStock(stock);
            item.setSize(size);
            item.setColor(color);
            item.setPrice(price);
            item.setDescription(description);
            
            EcommerceItem createdItem = ecommerceItemService.createItem(item, productPhotos, sizeChart);
            return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
            
        } catch (IOException e) {
            return new ResponseEntity<>("Error uploading images: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating item: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get all items
    @GetMapping
    public ResponseEntity<List<EcommerceItem>> getAllItems() {
        try {
            List<EcommerceItem> items = ecommerceItemService.getAllItems();
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get item by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        try {
            Optional<EcommerceItem> item = ecommerceItemService.getItemById(id);
            if (item.isPresent()) {
                return new ResponseEntity<>(item.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Item not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Update item
    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(
            @PathVariable Long id,
            @RequestParam("itemName") String itemName,
            @RequestParam("category") String category,
            @RequestParam("stock") Integer stock,
            @RequestParam("size") String size,
            @RequestParam("color") String color,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "productPhotos", required = false) List<MultipartFile> productPhotos,
            @RequestParam(value = "sizeChart", required = false) MultipartFile sizeChart) {
        
        try {
            EcommerceItem updatedItem = new EcommerceItem();
            updatedItem.setitemName(itemName);
            updatedItem.setCategory(category);
            updatedItem.setStock(stock);
            updatedItem.setSize(size);
            updatedItem.setColor(color);
            updatedItem.setPrice(price);
            updatedItem.setDescription(description);
            
            EcommerceItem item = ecommerceItemService.updateItem(id, updatedItem, productPhotos, sizeChart);
            return new ResponseEntity<>(item, HttpStatus.OK);
            
        } catch (IOException e) {
            return new ResponseEntity<>("Error uploading images: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating item: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Delete item
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            ecommerceItemService.deleteItem(id);
            return new ResponseEntity<>("Item deleted successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Search items
   /*  @GetMapping("/search")
    public ResponseEntity<List<EcommerceItem>> searchItems(@RequestParam String query) {
        try {
            List<EcommerceItem> items = ecommerceItemService.searchItems(query);
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } */
    
    // Get items by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<EcommerceItem>> getItemsByCategory(@PathVariable String category) {
        try {
            List<EcommerceItem> items = ecommerceItemService.getItemsByCategory(category);
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get items by color
    @GetMapping("/color/{color}")
    public ResponseEntity<List<EcommerceItem>> getItemsByColor(@PathVariable String color) {
        try {
            List<EcommerceItem> items = ecommerceItemService.getItemsByColor(color);
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get items by size
    @GetMapping("/size/{size}")
    public ResponseEntity<List<EcommerceItem>> getItemsBySize(@PathVariable String size) {
        try {
            List<EcommerceItem> items = ecommerceItemService.getItemsBySize(size);
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get items by price range
    @GetMapping("/price-range")
    public ResponseEntity<List<EcommerceItem>> getItemsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        try {
            List<EcommerceItem> items = ecommerceItemService.getItemsByPriceRange(minPrice, maxPrice);
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get available items (in stock)
    @GetMapping("/available")
    public ResponseEntity<List<EcommerceItem>> getAvailableItems() {
        try {
            List<EcommerceItem> items = ecommerceItemService.getAvailableItems();
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get available items by category
    @GetMapping("/available/category/{category}")
    public ResponseEntity<List<EcommerceItem>> getAvailableItemsByCategory(@PathVariable String category) {
        try {
            List<EcommerceItem> items = ecommerceItemService.getAvailableItemsByCategory(category);
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get filtered items
    @GetMapping("/filter")
    public ResponseEntity<List<EcommerceItem>> getFilteredItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        try {
            List<EcommerceItem> items = ecommerceItemService.getFilteredItems(category, color, size, minPrice, maxPrice);
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Update stock
    @PatchMapping("/{id}/stock")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestParam Integer stock) {
        try {
            EcommerceItem item = ecommerceItemService.updateStock(id, stock);
            return new ResponseEntity<>(item, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating stock: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Decrease stock (for purchases)
    @PatchMapping("/{id}/decrease-stock")
    public ResponseEntity<?> decreaseStock(@PathVariable Long id, @RequestParam Integer quantity) {
        try {
            EcommerceItem item = ecommerceItemService.decreaseStock(id, quantity);
            return new ResponseEntity<>(item, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error decreasing stock: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get low stock items
    @GetMapping("/low-stock")
    public ResponseEntity<List<EcommerceItem>> getLowStockItems(@RequestParam(defaultValue = "5") Integer threshold) {
        try {
            List<EcommerceItem> items = ecommerceItemService.getLowStockItems(threshold);
            return new ResponseEntity<>(items, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Add product photo to existing item
    @PostMapping("/{id}/photos")
    public ResponseEntity<?> addProductPhoto(@PathVariable Long id, @RequestParam("photo") MultipartFile photo) {
        try {
            EcommerceItem item = ecommerceItemService.addProductPhoto(id, photo);
            return new ResponseEntity<>(item, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error uploading photo: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Remove product photo from existing item
    @DeleteMapping("/{id}/photos")
    public ResponseEntity<?> removeProductPhoto(@PathVariable Long id, @RequestParam String photoUrl) {
        try {
            EcommerceItem item = ecommerceItemService.removeProductPhoto(id, photoUrl);
            return new ResponseEntity<>(item, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error removing photo: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get distinct categories
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getDistinctCategories() {
        try {
            List<String> categories = ecommerceItemService.getDistinctCategories();
            return new ResponseEntity<>(categories, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get distinct colors
    @GetMapping("/colors")
    public ResponseEntity<List<String>> getDistinctColors() {
        try {
            List<String> colors = ecommerceItemService.getDistinctColors();
            return new ResponseEntity<>(colors, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get distinct sizes
    @GetMapping("/sizes")
    public ResponseEntity<List<String>> getDistinctSizes() {
        try {
            List<String> sizes = ecommerceItemService.getDistinctSizes();
            return new ResponseEntity<>(sizes, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get item count
    @GetMapping("/count")
    public ResponseEntity<Long> getItemCount() {
        try {
            long count = ecommerceItemService.getItemCount();
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get item count by category
    @GetMapping("/count/category/{category}")
    public ResponseEntity<Long> getItemCountByCategory(@PathVariable String category) {
        try {
            Long count = ecommerceItemService.getItemCountByCategory(category);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Check if item exists
    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> itemExists(@PathVariable Long id) {
        try {
            boolean exists = ecommerceItemService.itemExists(id);
            return new ResponseEntity<>(exists, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Bulk update stock (useful for inventory management)
    @PatchMapping("/bulk-stock-update")
    public ResponseEntity<?> bulkUpdateStock(@RequestBody List<StockUpdateRequest> stockUpdates) {
        try {
            for (StockUpdateRequest request : stockUpdates) {
                ecommerceItemService.updateStock(request.getItemId(), request.getNewStock());
            }
            return new ResponseEntity<>("Bulk stock update completed successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error in bulk stock update: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Inner class for bulk stock update request
    public static class StockUpdateRequest {
        private Long itemId;
        private Integer newStock;
        
        public StockUpdateRequest() {}
        
        public StockUpdateRequest(Long itemId, Integer newStock) {
            this.itemId = itemId;
            this.newStock = newStock;
        }
        
        public Long getItemId() {
            return itemId;
        }
        
        public void setItemId(Long itemId) {
            this.itemId = itemId;
        }
        
        public Integer getNewStock() {
            return newStock;
        }
        
        public void setNewStock(Integer newStock) {
            this.newStock = newStock;
        }
    }
}