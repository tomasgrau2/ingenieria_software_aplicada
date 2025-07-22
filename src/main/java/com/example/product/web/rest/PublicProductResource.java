package com.example.product.web.rest;

import com.example.product.service.ProductService;
import com.example.product.service.dto.ProductDTO;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public REST controller for managing {@link com.example.product.domain.Product}.
 * This controller doesn't require authentication for development purposes.
 */
@RestController
@RequestMapping("/api/public/products")
public class PublicProductResource {

    private static final Logger LOG = LoggerFactory.getLogger(PublicProductResource.class);

    private final ProductService productService;

    public PublicProductResource(ProductService productService) {
        this.productService = productService;
    }

    /**
     * {@code GET  /api/public/products} : get all the products.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of products in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ProductDTO>> getAllProducts(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Products (public)");
        Page<ProductDTO> page = productService.findAll(pageable);
        return ResponseEntity.ok().body(page.getContent());
    }

    /**
     * {@code GET  /api/public/products/:id} : get the "id" product.
     *
     * @param id the id of the productDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Product : {} (public)", id);
        return productService.findOne(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
