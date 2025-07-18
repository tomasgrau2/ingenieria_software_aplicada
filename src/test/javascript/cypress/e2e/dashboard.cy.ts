import { entityCreateButtonSelector, entityCreateSaveButtonSelector } from '../support/entity';

interface IProduct {
  id?: number;
  name?: string;
  price?: number;
  stock?: number;
  barcode?: string;
  expirationDate?: string;
  createdAt?: string;
}

describe('Dashboard e2e test', () => {
  const homePageUrl = 'http://localhost:8080/';
  const username = 'user';
  const password = 'user';

  // Datos de prueba para productos (formato correcto para la API)
  const newProduct = {
    name: 'Producto Test Dashboard',
    price: 99.99,
    stock: 50,
    barcode: 'TEST123456',
    expirationDate: '2025-12-31T23:59',
  };

  const updatedProduct = {
    name: 'Producto Test Dashboard Actualizado',
    price: 149.99,
    stock: 75,
    barcode: 'TEST654321',
    expirationDate: '2026-01-31T23:59',
  };

  let createdProduct: IProduct | undefined;

  beforeEach(() => {
    // Interceptar todas las llamadas a la API de productos
    cy.intercept('GET', '/api/products*').as('getProducts');
    cy.intercept('POST', '/api/products').as('createProduct');
    cy.intercept('PUT', '/api/products/*').as('updateProduct');
    cy.intercept('DELETE', '/api/products/*').as('deleteProduct');

    // Iniciar desde la página principal
    cy.visit(homePageUrl);

    // Hacer clic en "sign in" para ir al login
    cy.get('a').contains('sign in').click();

    // Verificar que estamos en la página de login
    cy.url().should('include', '/login');

    // Hacer login
    cy.get('[data-cy="username"]').type(username);
    cy.get('[data-cy="password"]').type(password);
    cy.get('[data-cy="submit"]').click();

    // Verificar que el login fue exitoso
    cy.get('[data-cy="navbar"]').should('exist');
  });

  afterEach(() => {
    if (createdProduct) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/products/${createdProduct.id}`,
      }).then(() => {
        createdProduct = undefined;
      });
    }
  });

  describe('Test 1: Create a new product', () => {
    it('should create a new product and verify it appears in dashboard', () => {
      // 1. Navegar al dashboard
      cy.get('a[routerLink="/dashboard"]').click();
      cy.wait('@getProducts');

      // 2. Ir a la página de productos para crear
      cy.get('[data-cy="entity"]').click();
      cy.get('a[routerLink="/product"]').click();
      cy.wait('@getProducts');

      // 3. Crear nuevo producto
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Product');

      // 4. Llenar formulario
      cy.get('[data-cy="name"]').type(newProduct.name);
      cy.get('[data-cy="name"]').should('have.value', newProduct.name);

      cy.get('[data-cy="price"]').type(newProduct.price.toString());
      cy.get('[data-cy="price"]').should('have.value', newProduct.price.toString());

      cy.get('[data-cy="stock"]').type(newProduct.stock.toString());
      cy.get('[data-cy="stock"]').should('have.value', newProduct.stock.toString());

      cy.get('[data-cy="barcode"]').type(newProduct.barcode);
      cy.get('[data-cy="barcode"]').should('have.value', newProduct.barcode);

      cy.get('[data-cy="expirationDate"]').type(newProduct.expirationDate);
      cy.get('[data-cy="expirationDate"]').blur();
      cy.get('[data-cy="expirationDate"]').should('have.value', newProduct.expirationDate);

      // 5. Guardar producto
      cy.get(entityCreateSaveButtonSelector).click();
      cy.wait('@createProduct').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        if (response?.body) {
          createdProduct = response.body;
        }
      });
      cy.wait('@getProducts');

      // 6. Verificar que aparece en el dashboard
      cy.get('a[routerLink="/dashboard"]').click();
      cy.wait('@getProducts');

      // Verificar que el producto aparece en la lista
      cy.get('.product-item').should('contain', newProduct.name);
      cy.get('.product-item').should('contain', newProduct.barcode);

      // Verificar que las estadísticas se actualizaron
      cy.get('.stat-number').last().should('not.contain', '0');
    });
  });

  describe('Test 2: Edit a product', () => {
    beforeEach(() => {
      // Crear un producto para editar usando la UI
      cy.get('a[routerLink="/dashboard"]').click();
      cy.wait('@getProducts');

      // Ir a la página de productos para crear
      cy.get('[data-cy="entity"]').click();
      cy.get('a[routerLink="/product"]').click();
      cy.wait('@getProducts');

      // Crear nuevo producto
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Product');

      // Llenar formulario
      cy.get('[data-cy="name"]').type(newProduct.name);
      cy.get('[data-cy="price"]').type(newProduct.price.toString());
      cy.get('[data-cy="stock"]').type(newProduct.stock.toString());
      cy.get('[data-cy="barcode"]').type(newProduct.barcode);
      cy.get('[data-cy="expirationDate"]').type(newProduct.expirationDate);
      cy.get('[data-cy="expirationDate"]').blur();

      // Guardar producto
      cy.get(entityCreateSaveButtonSelector).click();
      cy.wait('@createProduct').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        if (response?.body) {
          createdProduct = response.body;
        }
      });
      cy.wait('@getProducts');
    });

    it('should edit a product and verify changes in dashboard', () => {
      // 1. Navegar al dashboard
      cy.get('a[routerLink="/dashboard"]').click();
      cy.wait('@getProducts');

      // 2. Verificar que el producto original existe
      cy.get('.product-item').should('contain', newProduct.name);

      // 3. Editar el producto desde el dashboard
      cy.get('.product-item')
        .contains(newProduct.name)
        .parent()
        .parent()
        .parent()
        .within(() => {
          cy.get('a[href*="/edit"]').click();
        });
      cy.getEntityCreateUpdateHeading('Product');

      // 4. Modificar campos
      cy.get('[data-cy="name"]').clear().type(updatedProduct.name);
      cy.get('[data-cy="name"]').should('have.value', updatedProduct.name);

      cy.get('[data-cy="price"]').clear().type(updatedProduct.price.toString());
      cy.get('[data-cy="price"]').should('have.value', updatedProduct.price.toString());

      cy.get('[data-cy="stock"]').clear().type(updatedProduct.stock.toString());
      cy.get('[data-cy="stock"]').should('have.value', updatedProduct.stock.toString());

      cy.get('[data-cy="barcode"]').clear().type(updatedProduct.barcode);
      cy.get('[data-cy="barcode"]').should('have.value', updatedProduct.barcode);

      cy.get('[data-cy="expirationDate"]').clear().type(updatedProduct.expirationDate);
      cy.get('[data-cy="expirationDate"]').blur();
      cy.get('[data-cy="expirationDate"]').should('have.value', updatedProduct.expirationDate);

      // 5. Guardar cambios
      cy.get(entityCreateSaveButtonSelector).click();
      cy.wait('@updateProduct').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });

      // 6. Verificar cambios en el dashboard
      cy.get('a[routerLink="/dashboard"]').click();
      cy.wait('@getProducts');

      // Verificar que los cambios aparecen
      cy.get('.product-item').should('contain', updatedProduct.name);
      cy.get('.product-item').should('contain', updatedProduct.barcode);
      cy.get('.product-item').should('contain', updatedProduct.price);
      cy.get('.product-item').should('contain', updatedProduct.stock);
    });
  });

  describe('Test 3: Delete a product', () => {
    let initialTotalCount: number;

    beforeEach(() => {
      // Crear un producto para eliminar usando la UI
      cy.get('a[routerLink="/dashboard"]').click();
      cy.wait('@getProducts');

      // Ir a la página de productos para crear
      cy.get('[data-cy="entity"]').click();
      cy.get('a[routerLink="/product"]').click();
      cy.wait('@getProducts');

      // Crear nuevo producto
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Product');

      // Llenar formulario
      cy.get('[data-cy="name"]').type(newProduct.name);
      cy.get('[data-cy="price"]').type(newProduct.price.toString());
      cy.get('[data-cy="stock"]').type(newProduct.stock.toString());
      cy.get('[data-cy="barcode"]').type(newProduct.barcode);
      cy.get('[data-cy="expirationDate"]').type(newProduct.expirationDate);
      cy.get('[data-cy="expirationDate"]').blur();

      // Guardar producto
      cy.get(entityCreateSaveButtonSelector).click();
      cy.wait('@createProduct').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        if (response?.body) {
          createdProduct = response.body;
        }
      });
      cy.wait('@getProducts');

      // Obtener el total de productos DESPUÉS de crear el producto
      cy.get('a[routerLink="/dashboard"]').click();
      cy.wait('@getProducts');
      cy.get('.stat-card')
        .last()
        .find('.stat-number')
        .invoke('text')
        .then(text => {
          initialTotalCount = parseInt(text.trim());
        });
    });

    it('should delete a product and verify it disappears from dashboard', () => {
      // 1. Verificar que el producto existe
      cy.get('.product-item').should('contain', newProduct.name);

      // 2. Eliminar el producto directamente desde el dashboard
      cy.get('.product-item')
        .contains(newProduct.name)
        .parent()
        .parent()
        .parent()
        .within(() => {
          cy.get('button.btn-outline-danger').click();
        });

      // 3. Confirmar eliminación en el modal
      cy.get('.modal').should('be.visible');
      cy.get('.modal-body').should('contain', newProduct.name);
      cy.get('.modal-footer .btn-danger').click();

      cy.wait('@deleteProduct').then(({ response }) => {
        expect(response?.statusCode).to.equal(204);
      });
      cy.wait('@getProducts');

      // 4. Verificar que el modal se cerró
      cy.get('.modal').should('not.exist');

      // 5. Verificar que el producto ya no aparece en el dashboard
      cy.get('.product-item').should('not.contain.text', newProduct.name);
      cy.get('.product-item').should('not.contain.text', newProduct.barcode);

      // 6. Verificar que las estadísticas se actualizaron (un producto menos)
      cy.get('.stat-card')
        .last()
        .find('.stat-number')
        .should('contain', (initialTotalCount - 1).toString());
    });
  });
});
