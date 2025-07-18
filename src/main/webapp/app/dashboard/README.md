# Dashboard de Productos

## Descripción

El Dashboard de Productos es una página web que proporciona una vista general y monitoreo de todos los productos en el sistema, con especial énfasis en las fechas de vencimiento.

## Características

### 📊 Estadísticas en Tiempo Real

- **Productos Válidos**: Productos que no vencen en los próximos 30 días
- **Vencen Pronto**: Productos que vencen en los próximos 7 días
- **Productos Vencidos**: Productos cuya fecha de vencimiento ya pasó
- **Total de Productos**: Contador general de productos

### 🔍 Filtros

- **Vencen pronto (≤ 7 días)**: Muestra solo productos que vencen en los próximos 7 días
- **Vencidos**: Muestra solo productos cuya fecha de vencimiento ya pasó

### 📋 Lista de Productos

Cada producto muestra:

- **Nombre y ID**: Información básica del producto
- **Código de barras**: Si está disponible
- **Precio**: Formateado en moneda
- **Stock**: Con indicadores visuales de nivel de inventario
- **Estado de vencimiento**: Con iconos y colores según el estado
- **Fecha de vencimiento**: En formato dd/MM/yyyy
- **Días hasta el vencimiento**: Texto descriptivo (ej: "Vence en 5 días")
- **Acciones**: Enlaces para ver y editar el producto

### 🎨 Indicadores Visuales

#### Estados de Vencimiento:

- 🟢 **Válido** (verde): Más de 30 días hasta el vencimiento
- 🔵 **Vence en 30 días** (azul): Entre 8 y 30 días
- 🟡 **Vence pronto** (amarillo): 7 días o menos
- 🔴 **Vencido** (rojo): Fecha de vencimiento pasada

#### Estados de Stock:

- 🟢 **Stock alto** (verde): Más de 50 unidades
- 🔵 **Stock medio** (azul): Entre 11 y 50 unidades
- 🟡 **Stock bajo** (amarillo): 10 unidades o menos
- 🔴 **Sin stock** (rojo): 0 unidades

## Funcionalidades

### Ordenamiento Automático

Los productos se ordenan automáticamente por fecha de vencimiento, mostrando primero los que vencen más pronto.

### Actualización en Tiempo Real

- Botón de actualización manual
- Indicador de carga durante las actualizaciones
- Manejo de errores con opción de reintentar

### Navegación

- Enlaces directos a la vista detallada de cada producto
- Enlaces para editar productos
- Integración con la navegación principal

## Tecnologías Utilizadas

- **Angular 17**: Framework principal
- **Bootstrap 5**: Framework CSS para el diseño
- **Bootstrap Icons**: Iconografía
- **Day.js**: Manejo de fechas
- **RxJS**: Programación reactiva para las llamadas HTTP

## Estructura de Archivos

```
dashboard/
├── dashboard.component.ts          # Lógica del componente
├── dashboard.component.html        # Template HTML
├── dashboard.component.scss        # Estilos CSS
├── dashboard.component.spec.ts     # Pruebas unitarias
└── README.md                      # Esta documentación
```

## Uso

1. Navega a `/dashboard` en la aplicación
2. Usa los filtros para ver productos específicos
3. Haz clic en los botones de acción para ver o editar productos
4. Usa el botón "Actualizar" para refrescar los datos

## Pruebas

El componente incluye pruebas unitarias completas que cubren:

- Creación del componente
- Carga de productos
- Ordenamiento por fecha de vencimiento
- Filtrado de productos
- Estados de vencimiento y stock
- Funcionalidad de actualización

Para ejecutar las pruebas:

```bash
npm test -- --include="**/dashboard/**"
```

## Personalización

### Colores

Los colores de los estados se pueden personalizar en `dashboard.component.scss`:

- `.text-success`: Productos válidos
- `.text-warning`: Productos que vencen pronto
- `.text-danger`: Productos vencidos
- `.text-info`: Productos que vencen en 30 días

### Umbrales

Los umbrales de días se pueden modificar en `dashboard.component.ts`:

- Productos que vencen pronto: 7 días
- Productos que vencen en 30 días: 30 días
- Stock bajo: 10 unidades
- Stock medio: 50 unidades
