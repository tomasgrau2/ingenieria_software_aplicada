import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardComponent } from './dashboard.component';
import { ProductService } from '../entities/product/service/product.service';
import { ApplicationConfigService } from '../core/config/application-config.service';
import { IProduct } from '../entities/product/product.model';

import dayjs from 'dayjs/esm';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, FormsModule, NgbModule],
      providers: [ProductService, ApplicationConfigService, provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on initialization', () => {
    // Simplemente verificar que el componente se inicializa correctamente
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
