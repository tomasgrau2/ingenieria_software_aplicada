import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import dayjs from 'dayjs/esm';
import relativeTime from 'dayjs/esm/plugin/relativeTime';

import { IProduct, NewProduct } from '../entities/product/product.model';
import { ProductService } from '../entities/product/service/product.service';

dayjs.extend(relativeTime);

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbModule, FontAwesomeModule],
  selector: 'jhi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  products: IProduct[] = [];
  loading = false;
  error = false;
  productToDelete: IProduct | null = null;
  deleting = false;
  showDeleteModal = false;

  // Propiedades para añadir productos
  showAddModal = false;
  adding = false;
  newProduct: any = {
    name: '',
    price: null,
    stock: null,
    barcode: '',
    expirationDate: '',
  };
  today = new Date().toISOString().split('T')[0]; // Para el input de fecha

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = false;

    this.productService.query().subscribe({
      next: response => {
        this.products = response.body ?? [];
        this.sortProductsByExpiration();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  confirmDelete(product: IProduct): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  deleteProduct(): void {
    if (!this.productToDelete) return;

    this.deleting = true;
    this.productService.delete(this.productToDelete.id).subscribe({
      next: () => {
        // Cerrar el modal
        this.closeDeleteModal();

        // Recargar productos
        this.loadProducts();
        this.deleting = false;
      },
      error: () => {
        this.deleting = false;
        // Aquí podrías mostrar un mensaje de error
      },
    });
  }

  sortProductsByExpiration(): void {
    this.products.sort((a, b) => {
      if (!a.expirationDate && !b.expirationDate) return 0;
      if (!a.expirationDate) return 1;
      if (!b.expirationDate) return 1;
      return a.expirationDate.isBefore(b.expirationDate) ? -1 : 1;
    });
  }

  getExpirationStatus(product: IProduct): { status: string; class: string; icon: string } {
    if (!product.expirationDate) {
      return { status: 'Sin fecha de vencimiento', class: 'text-muted', icon: 'bi-question-circle' };
    }

    const now = dayjs();
    const expiration = product.expirationDate;
    const daysUntilExpiration = expiration.diff(now, 'day');

    if (daysUntilExpiration < 0) {
      return { status: 'Vencido', class: 'text-danger', icon: 'bi-exclamation-triangle-fill' };
    } else if (daysUntilExpiration <= 7) {
      return { status: 'Vence pronto', class: 'text-warning', icon: 'bi-exclamation-circle' };
    } else if (daysUntilExpiration <= 30) {
      return { status: 'Vence en 30 días', class: 'text-info', icon: 'bi-info-circle' };
    } else {
      return { status: 'Válido', class: 'text-success', icon: 'bi-check-circle' };
    }
  }

  getDaysUntilExpiration(product: IProduct): string {
    if (!product.expirationDate) return 'N/A';

    const now = dayjs();
    const expiration = product.expirationDate;
    const days = expiration.diff(now, 'day');

    if (days < 0) {
      return `Vencido hace ${Math.abs(days)} días`;
    } else if (days === 0) {
      return 'Vence hoy';
    } else if (days === 1) {
      return 'Vence mañana';
    } else {
      return `Vence en ${days} días`;
    }
  }

  getStockStatus(product: IProduct): { status: string; class: string } {
    if (!product.stock) return { status: 'Sin stock', class: 'text-danger' };

    if (product.stock <= 10) {
      return { status: 'Stock bajo', class: 'text-warning' };
    } else if (product.stock <= 50) {
      return { status: 'Stock medio', class: 'text-info' };
    } else {
      return { status: 'Stock alto', class: 'text-success' };
    }
  }

  refreshProducts(): void {
    this.loadProducts();
  }

  // Métodos para estadísticas
  getValidProductsCount(): number {
    return this.products.filter(p => this.getExpirationStatus(p).status === 'Válido').length;
  }

  getExpiringSoonCount(): number {
    return this.products.filter(p => this.getExpirationStatus(p).status === 'Vence pronto').length;
  }

  getExpiredCount(): number {
    return this.products.filter(p => this.getExpirationStatus(p).status === 'Vencido').length;
  }

  getTotalCount(): number {
    return this.products.length;
  }

  // Método para formatear fecha de Dayjs
  formatExpirationDate(product: IProduct): string {
    if (!product.expirationDate) {
      return 'N/A';
    }
    return product.expirationDate.format('DD/MM/YYYY');
  }

  // Métodos para añadir productos
  openAddProductModal(): void {
    this.showAddModal = true;
    this.resetNewProduct();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.resetNewProduct();
  }

  resetNewProduct(): void {
    this.newProduct = {
      name: '',
      price: null,
      stock: null,
      barcode: '',
      expirationDate: '',
    };
  }

  addProduct(): void {
    if (
      !this.newProduct.name ||
      !this.newProduct.price ||
      this.newProduct.price <= 0 ||
      !this.newProduct.stock ||
      this.newProduct.stock < 0
    ) {
      return;
    }

    this.adding = true;

    // Crear el objeto producto para enviar al servicio
    const productToAdd: NewProduct = {
      id: null,
      name: this.newProduct.name,
      price: this.newProduct.price,
      stock: this.newProduct.stock,
      barcode: this.newProduct.barcode || null,
      expirationDate: this.newProduct.expirationDate ? dayjs(this.newProduct.expirationDate) : null,
      createdAt: dayjs(),
    };

    this.productService.create(productToAdd).subscribe({
      next: response => {
        // Cerrar el modal
        this.closeAddModal();

        // Recargar productos
        this.loadProducts();

        this.adding = false;

        // Aquí podrías mostrar un mensaje de éxito
        console.log('Producto añadido exitosamente:', response.body);
      },
      error: error => {
        this.adding = false;
        console.error('Error al añadir producto:', error);
        // Aquí podrías mostrar un mensaje de error
      },
    });
  }
}
