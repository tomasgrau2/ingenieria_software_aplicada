package com.example.product.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.example.product.domain.Product;
import com.example.product.repository.ProductRepository;
import com.example.product.service.dto.ProductDTO;
import com.example.product.service.mapper.ProductMapper;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Unit tests for {@link ProductService}.
 */
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    private ProductDTO productDTO;
    private Product product;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        productDTO = new ProductDTO();
        productDTO.setId(1L);
        productDTO.setName("Leche Fresca");
        productDTO.setPrice(new BigDecimal("2.50"));
        productDTO.setStock(100);
        productDTO.setBarcode("1234567890123");
        productDTO.setExpirationDate(Instant.now().plus(7, ChronoUnit.DAYS));
        productDTO.setCreatedAt(Instant.now());

        product = new Product();
        product.setId(1L);
        product.setName("Leche Fresca");
        product.setPrice(new BigDecimal("2.50"));
        product.setStock(100);
        product.setBarcode("1234567890123");
        product.setExpirationDate(Instant.now().plus(7, ChronoUnit.DAYS));
        product.setCreatedAt(Instant.now());
    }

    @Test
    void shouldSaveProductSuccessfully() {
        // Given
        when(productMapper.toEntity(productDTO)).thenReturn(product);
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(productMapper.toDto(product)).thenReturn(productDTO);

        // When
        ProductDTO result = productService.save(productDTO);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Leche Fresca");
        assertThat(result.getPrice()).isEqualTo(new BigDecimal("2.50"));
        assertThat(result.getStock()).isEqualTo(100);
        assertThat(result.getBarcode()).isEqualTo("1234567890123");
        assertThat(result.getExpirationDate()).isAfter(Instant.now());
    }

    @Test
    void shouldUpdateProductSuccessfully() {
        // Given
        ProductDTO updatedDTO = new ProductDTO();
        updatedDTO.setId(1L);
        updatedDTO.setName("Leche Fresca Actualizada");
        updatedDTO.setPrice(new BigDecimal("3.00"));
        updatedDTO.setStock(50);
        updatedDTO.setBarcode("1234567890123");
        updatedDTO.setExpirationDate(Instant.now().plus(14, ChronoUnit.DAYS));

        Product updatedProduct = new Product();
        updatedProduct.setId(1L);
        updatedProduct.setName("Leche Fresca Actualizada");
        updatedProduct.setPrice(new BigDecimal("3.00"));
        updatedProduct.setStock(50);
        updatedProduct.setBarcode("1234567890123");
        updatedProduct.setExpirationDate(Instant.now().plus(14, ChronoUnit.DAYS));

        when(productMapper.toEntity(updatedDTO)).thenReturn(updatedProduct);
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);
        when(productMapper.toDto(updatedProduct)).thenReturn(updatedDTO);

        // When
        ProductDTO result = productService.update(updatedDTO);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Leche Fresca Actualizada");
        assertThat(result.getPrice()).isEqualTo(new BigDecimal("3.00"));
        assertThat(result.getStock()).isEqualTo(50);
        assertThat(result.getExpirationDate()).isAfter(Instant.now().plus(7, ChronoUnit.DAYS));
    }

    @Test
    void shouldFindProductById() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productMapper.toDto(product)).thenReturn(productDTO);

        // When
        Optional<ProductDTO> result = productService.findOne(1L);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        assertThat(result.get().getName()).isEqualTo("Leche Fresca");
    }

    @Test
    void shouldReturnEmptyWhenProductNotFound() {
        // Given
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<ProductDTO> result = productService.findOne(999L);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void shouldDeleteProductSuccessfully() {
        // Given
        Long productId = 1L;

        // When & Then - No exception should be thrown
        productService.delete(productId);
    }
}
