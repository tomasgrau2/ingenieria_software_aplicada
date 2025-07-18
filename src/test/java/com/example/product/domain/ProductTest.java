package com.example.product.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for {@link Product} entity.
 */
class ProductTest {

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Yogur Natural");
        product.setPrice(new BigDecimal("1.75"));
        product.setStock(50);
        product.setBarcode("9876543210987");
        product.setExpirationDate(Instant.now().plus(5, ChronoUnit.DAYS));
        product.setCreatedAt(Instant.now());
    }

    @Test
    void shouldCreateProductWithValidData() {
        // Then
        assertThat(product.getId()).isEqualTo(1L);
        assertThat(product.getName()).isEqualTo("Yogur Natural");
        assertThat(product.getPrice()).isEqualTo(new BigDecimal("1.75"));
        assertThat(product.getStock()).isEqualTo(50);
        assertThat(product.getBarcode()).isEqualTo("9876543210987");
        assertThat(product.getExpirationDate()).isAfter(Instant.now());
        assertThat(product.getCreatedAt()).isNotNull();
    }

    @Test
    void shouldUseFluentSettersCorrectly() {
        // When
        Product fluentProduct = new Product()
            .id(2L)
            .name("Pan Integral")
            .price(new BigDecimal("3.25"))
            .stock(25)
            .barcode("1112223334445")
            .expirationDate(Instant.now().plus(3, ChronoUnit.DAYS))
            .createdAt(Instant.now());

        // Then
        assertThat(fluentProduct.getId()).isEqualTo(2L);
        assertThat(fluentProduct.getName()).isEqualTo("Pan Integral");
        assertThat(fluentProduct.getPrice()).isEqualTo(new BigDecimal("3.25"));
        assertThat(fluentProduct.getStock()).isEqualTo(25);
        assertThat(fluentProduct.getBarcode()).isEqualTo("1112223334445");
        assertThat(fluentProduct.getExpirationDate()).isAfter(Instant.now());
    }

    @Test
    void shouldHandleNullValuesCorrectly() {
        // When
        Product nullProduct = new Product();
        nullProduct.setId(3L);
        nullProduct.setName("Producto Sin Precio");

        // Then
        assertThat(nullProduct.getId()).isEqualTo(3L);
        assertThat(nullProduct.getName()).isEqualTo("Producto Sin Precio");
        assertThat(nullProduct.getPrice()).isNull();
        assertThat(nullProduct.getStock()).isNull();
        assertThat(nullProduct.getBarcode()).isNull();
        assertThat(nullProduct.getExpirationDate()).isNull();
        assertThat(nullProduct.getCreatedAt()).isNull();
    }

    @Test
    void shouldValidateExpirationDateLogic() {
        // Given
        Instant futureDate = Instant.now().plus(10, ChronoUnit.DAYS);
        Instant pastDate = Instant.now().minus(1, ChronoUnit.DAYS);
        Instant currentDate = Instant.now();

        // When & Then
        product.setExpirationDate(futureDate);
        assertThat(product.getExpirationDate()).isAfter(currentDate);

        product.setExpirationDate(pastDate);
        assertThat(product.getExpirationDate()).isBefore(currentDate);

        product.setExpirationDate(currentDate);
        assertThat(product.getExpirationDate()).isEqualTo(currentDate);
    }

    @Test
    void shouldHandleStockQuantityLogic() {
        // Given
        product.setStock(0);
        assertThat(product.getStock()).isEqualTo(0);

        product.setStock(100);
        assertThat(product.getStock()).isEqualTo(100);

        product.setStock(-5);
        assertThat(product.getStock()).isEqualTo(-5); // Permite stock negativo según el modelo actual
    }

    @Test
    void shouldHandlePricePrecision() {
        // Given
        BigDecimal precisePrice = new BigDecimal("12.99");
        BigDecimal zeroPrice = BigDecimal.ZERO;
        BigDecimal negativePrice = new BigDecimal("-5.50");

        // When & Then
        product.setPrice(precisePrice);
        assertThat(product.getPrice()).isEqualTo(new BigDecimal("12.99"));

        product.setPrice(zeroPrice);
        assertThat(product.getPrice()).isEqualTo(BigDecimal.ZERO);

        product.setPrice(negativePrice);
        assertThat(product.getPrice()).isEqualTo(new BigDecimal("-5.50"));
    }

    @Test
    void shouldImplementEqualsAndHashCodeCorrectly() {
        // Given
        Product product1 = new Product();
        product1.setId(1L);
        product1.setName("Producto 1");

        Product product2 = new Product();
        product2.setId(1L);
        product2.setName("Producto 2");

        Product product3 = new Product();
        product3.setId(2L);
        product3.setName("Producto 1");

        // When & Then
        assertThat(product1).isEqualTo(product2); // Mismo ID
        assertThat(product1).isNotEqualTo(product3); // Diferente ID
        assertThat(product1.hashCode()).isEqualTo(product2.hashCode());
        // El hashCode se basa en la clase, no en el ID, por lo que puede ser igual
        // assertThat(product1.hashCode()).isNotEqualTo(product3.hashCode());
    }

    @Test
    void shouldGenerateCorrectToString() {
        // When
        String toString = product.toString();

        // Then
        assertThat(toString).contains("id=1");
        assertThat(toString).contains("name='Yogur Natural'");
        assertThat(toString).contains("price=1.75");
        assertThat(toString).contains("stock=50");
        assertThat(toString).contains("barcode='9876543210987'");
        assertThat(toString).contains("expirationDate=");
        assertThat(toString).contains("createdAt=");
    }

    @Test
    void shouldHandleEdgeCasesForProductData() {
        // Given
        Product edgeCaseProduct = new Product();

        // When - Casos extremos
        edgeCaseProduct.setName(""); // Nombre vacío
        edgeCaseProduct.setBarcode(""); // Código de barras vacío
        edgeCaseProduct.setPrice(new BigDecimal("999999.99")); // Precio muy alto
        edgeCaseProduct.setStock(Integer.MAX_VALUE); // Stock máximo
        edgeCaseProduct.setExpirationDate(Instant.now().plus(365, ChronoUnit.DAYS)); // Fecha muy futura

        // Then
        assertThat(edgeCaseProduct.getName()).isEmpty();
        assertThat(edgeCaseProduct.getBarcode()).isEmpty();
        assertThat(edgeCaseProduct.getPrice()).isEqualTo(new BigDecimal("999999.99"));
        assertThat(edgeCaseProduct.getStock()).isEqualTo(Integer.MAX_VALUE);
        assertThat(edgeCaseProduct.getExpirationDate()).isAfter(Instant.now().plus(364, ChronoUnit.DAYS));
    }
}
