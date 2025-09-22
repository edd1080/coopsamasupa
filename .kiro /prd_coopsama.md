# PRD - Coopsama App: Portal de Agentes de Crédito
**Product Requirements Document v1.0**

---

## 1. EXECUTIVE SUMMARY

### Descripción del Producto
Coopsama App es una aplicación web progresiva (PWA) diseñada para agentes de crédito de cooperativas financieras que permite gestionar solicitudes de crédito de manera digital y eficiente. La aplicación facilita la captura, procesamiento y seguimiento de solicitudes de crédito desde dispositivos móviles y desktop.

### Objetivos del Producto
- Digitalización completa del proceso de solicitudes de crédito  
- Optimización del tiempo de procesamiento de solicitudes  
- Mejora de la experiencia tanto para agentes como para clientes  
- Captura de datos estructurados con validación en tiempo real  
- Soporte offline para trabajar sin conexión a internet  

### Audiencia Objetivo
- **Primaria**: Agentes de crédito de Coopsama  
- **Secundaria**: Supervisores y administradores del sistema  
- **Terciaria**: Personal de back-office que procesa las solicitudes  

---

## 2. TECH STACK OVERVIEW

### Frontend Framework
- React 18.3.1 con TypeScript  
- Vite como bundler y desarrollo  
- React Router Dom para navegación SPA  

### UI/UX Framework
- Tailwind CSS para styling  
- Radix UI Components (headless components)  
- Lucide React para iconografía  
- Tailwind Animate para animaciones  
- Next Themes para tema claro/oscuro  

### State Management
- TanStack Query (React Query) para server state  
- React Context para client state  
- LocalForage para persistencia offline  

### Backend & Database
- Supabase como BaaS (Backend-as-a-Service)  
- PostgreSQL como base de datos  
- Row Level Security (RLS) para seguridad de datos  
- Supabase Auth para autenticación  

### Forms & Validation
- React Hook Form para gestión de formularios  
- Zod para validación de esquemas  
- Hookform Resolvers para integración  

### PWA & Mobile
- Capacitor para funcionalidades nativas  
- Vite PWA Plugin para service workers  
- Workbox para caching strategies  

### Maps & Geolocation
- Leaflet para mapas interactivos  
- React Leaflet como wrapper de React  

### Charts & Visualization
- Recharts para dashboards y análisis  

### Utilities
- Date-fns para manejo de fechas  
- Lodash para utilidades JavaScript  
- Class Variance Authority para styling condicional  
- CLSX & Tailwind Merge para className utilities  

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Autenticación y Seguridad
- **FR-AUTH-01**: Login con email y contraseña  
- **FR-AUTH-02**: Validación de sesión automática  
- **FR-AUTH-03**: Logout seguro con confirmación  
- **FR-AUTH-04**: Protección de rutas según autenticación  
- **FR-AUTH-05**: Monitoreo de seguridad en tiempo real  

### 3.2 Dashboard y Métricas
- **FR-DASH-01**: Vista general con métricas de solicitudes  
- **FR-DASH-02**: Contador de solicitudes activas, enviadas, en revisión y rechazadas  
- **FR-DASH-03**: Saludo personalizado con nombre del agente  
- **FR-DASH-04**: Acceso rápido a crear nueva solicitud  
- **FR-DASH-05**: Información del rol y agencia del usuario  

### 3.3 Gestión de Solicitudes
- **FR-APP-01**: Lista completa de solicitudes asignadas  
- **FR-APP-02**: Filtros y búsqueda de solicitudes  
- **FR-APP-03**: Creación de nueva solicitud  
- **FR-APP-04**: Edición de solicitudes en borrador  
- **FR-APP-05**: Visualización detallada de solicitudes  
- **FR-APP-06**: Eliminación de borradores con confirmación  
- **FR-APP-07**: Cancelación de solicitudes activas  
- **FR-APP-08**: Estados: borrador, enviada, en revisión, aprobada, rechazada  

### 3.4 Formulario Multipaso de Solicitudes
- **FR-FORM-01**: Navegación por 6 secciones principales  
  1. Identificación y Contacto  
  2. Información del Crédito  
  3. Finanzas y Patrimonio  
  4. Referencias Personales  
  5. Documentos y Cierre  
  6. Revisión Final  
- **FR-FORM-02**: Validación en tiempo real por campo  
- **FR-FORM-03**: Guardado automático de borradores  
- **FR-FORM-04**: Indicador de progreso visual  
- **FR-FORM-05**: Navegación libre entre secciones completadas  
- **FR-FORM-06**: Restricción de avance sin completar secciones requeridas  

### 3.5 Captura de Datos Específicos
- **FR-DATA-01**: Información personal completa (nombres, apellidos, DPI, etc.)  
- **FR-DATA-02**: Datos de contacto (teléfono, email, dirección)  
- **FR-DATA-03**: Información del crédito (monto, plazo, propósito)  
- **FR-DATA-04**: Análisis financiero (ingresos, gastos, patrimonio)  
- **FR-DATA-05**: Referencias personales (mínimo 2, máximo sin límite)  
- **FR-DATA-06**: Captura de documentos fotográficos  
- **FR-DATA-07**: Geolocalización del solicitante  
- **FR-DATA-08**: Firma digital del solicitante  

### 3.6 Gestión de Documentos
- **FR-DOC-01**: Captura de fotografías usando cámara nativa  
- **FR-DOC-02**: Documentos requeridos: DPI frontal, DPI trasero, foto del solicitante  
- **FR-DOC-03**: Validación de calidad de imágenes  
- **FR-DOC-04**: Compresión automática de imágenes  
- **FR-DOC-05**: Estado de documentos: pendiente, completo, rechazado  

### 3.7 Referencias Personales
- **FR-REF-01**: Agregar múltiples referencias  
- **FR-REF-02**: Datos completos por referencia (nombre, teléfono, relación)  
- **FR-REF-03**: Clasificación por tipo de referencia  
- **FR-REF-04**: Edición y eliminación de referencias  
- **FR-REF-05**: Validación de información de contacto  

### 3.8 Configuración y Perfil
- **FR-SET-01**: Visualización de información personal del agente  
- **FR-SET-02**: Edición de datos editables (nombre, teléfono, sucursal)  
- **FR-SET-03**: Cambio de tema claro/oscuro  
- **FR-SET-04**: Configuración de notificaciones  
- **FR-SET-05**: Información del dispositivo  

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### 4.1 Performance
- **NFR-PERF-01**: Tiempo de carga inicial < 3 segundos  
- **NFR-PERF-02**: Transición entre pantallas < 500ms  
- **NFR-PERF-03**: Soporte para 100+ solicitudes simultáneas  
- **NFR-PERF-04**: Optimización de imágenes automática  

### 4.2 Usabilidad
- **NFR-UX-01**: Interfaz responsive (móvil primero)  
- **NFR-UX-02**: Soporte para dispositivos 320px - 2560px  
- **NFR-UX-03**: Navegación intuitiva con máximo 3 taps  
- **NFR-UX-04**: Feedback visual para todas las acciones  
- **NFR-UX-05**: Modo offline funcional  

### 4.3 Seguridad
- **NFR-SEC-01**: Autenticación basada en JWT  
- **NFR-SEC-02**: Encriptación HTTPS obligatoria  
- **NFR-SEC-03**: Row Level Security en base de datos  
- **NFR-SEC-04**: Sanitización de inputs  
- **NFR-SEC-05**: Auditoría de acciones críticas  

### 4.4 Compatibilidad
- **NFR-COMP-01**: Navegadores modernos (Chrome 90+, Safari 14+, Firefox 88+)  
- **NFR-COMP-02**: iOS 12+ y Android 8+  
- **NFR-COMP-03**: Funcionalidad PWA completa  
- **NFR-COMP-04**: Soporte offline con sincronización  

---

## 5. USER FLOW DOCUMENT

### 5.1 Flujo Principal: Autenticación
**Escenario: Login Exitoso**  
1. Usuario accede a la aplicación  
2. Sistema verifica estado de autenticación  
3. Si no autenticado: Muestra pantalla de login  
4. Usuario ingresa email y contraseña  
5. Sistema valida credenciales contra Supabase  
6. Si válido: Redirige al dashboard principal  
7. Si inválido: Muestra mensaje de error  

**Escenario: Sesión Existente**  
1. Usuario accede a la aplicación  
2. Sistema detecta sesión válida existente  
3. Redirige directamente al dashboard  

**Escenario: Logout**  
1. Usuario clickea "Cerrar sesión" en ajustes  
2. Sistema muestra diálogo de confirmación  
3. Usuario confirma logout  
4. Sistema cierra sesión en Supabase  
5. Redirige a pantalla de login  

---

### 5.2 Flujo Principal: Dashboard y Navegación
**Dashboard Principal**  
1. Usuario autenticado accede al dashboard  
2. Sistema carga métricas de solicitudes del usuario  
3. Muestra información personalizada:  
   - Saludo con nombre del agente  
   - Métricas: activas, enviadas, en revisión, rechazadas  
   - Botón para nueva solicitud  
   - Información de rol y agencia  

**Navegación Bottom Bar**  
- Inicio: Dashboard principal  
- Solicitudes: Lista de todas las solicitudes  
- Ajustes: Configuración y perfil  

---

### 5.3 Flujo Principal: Gestión de Solicitudes
**Ver Lista de Solicitudes**  
1. Usuario navega a "Solicitudes"  
2. Sistema carga todas las solicitudes del agente  
3. Muestra lista con información resumida por solicitud:  
   - Nombre del cliente  
   - ID de solicitud  
   - Estado actual  
   - Fecha de última actualización  
4. Opciones por solicitud:  
   - Ver detalles  
   - Editar (si es borrador)  
   - Eliminar (si es borrador)  
   - Cancelar (si está activa)  

**Crear Nueva Solicitud**  
1. Usuario clickea "Nueva Solicitud" desde dashboard o lista  
2. Sistema genera ID único de solicitud  
3. Inicia formulario en la primera sección  
4. Guarda automáticamente como borrador  

**Ver Detalles de Solicitud**  
1. Usuario clickea una solicitud específica  
2. Sistema carga datos completos de la solicitud  
3. Muestra vista detallada con:  
   - Información del cliente  
   - Progreso de completitud  
   - Resumen de crédito  
   - Referencias agregadas  
   - Estado de documentos  
   - Acceso rápido a secciones  
4. Opciones disponibles según estado:  
   - Editar (si es borrador)  
   - Enviar solicitud (si está completa)  
   - Solo lectura (si ya fue enviada)  

---

### 5.4 Flujo Detallado: Formulario de Solicitud
**Sección 1: Identificación y Contacto**  
- Datos básicos: Nombres completos, Apellidos, DPI, NIT, lugar de emisión de DPI  
- Datos demográficos: Fecha y lugar de nacimiento, Género, Etnia, Estado civil, Nivel educativo  
- Información de contacto: Teléfonos, Email, Dirección, Tipo de vivienda, Estabilidad residencial  

**Sección 2: Información del Crédito**  
- Monto solicitado, plazo, tipo de crédito, propósito, grupo de destino  
- Validación de montos y plazos según políticas  

**Sección 3: Finanzas y Patrimonio**  
- Información laboral: Ocupación, Profesión, Lugar de trabajo, Ingresos  
- Análisis financiero: Ingresos, gastos, activos, pasivos  
- Sistema calcula capacidad de pago automáticamente  

**Sección 4: Referencias Personales**  
- Mínimo 2 referencias  
- Datos: Nombre, tipo de referencia, relación, teléfono, dirección opcional  

**Sección 5: Documentos y Cierre**  
- Captura de DPI frontal, DPI trasero y foto del solicitante  
- Geolocalización automática  
- Firma digital  

**Sección 6: Revisión Final**  
- Resumen de todos los datos capturados  
- Usuario revisa información  
- Opciones: editar, guardar como borrador, enviar solicitud  

**Envío Final de Solicitud**  
- Validación de secciones completas, documentos, referencias y firma  
- Confirmación final del usuario  
- Sistema cambia estado a "enviada"  

---

### 5.5 Flujos Específicos: Gestión de Datos
**Guardado Automático**  
- Cada 5 segundos o cambio de campo  
- Progreso guardado automáticamente  

**Navegación Entre Secciones**  
- Libre hacia atrás  
- Restricción hacia adelante si hay pendientes  
- Indicadores visuales de estado  

**Validaciones en Tiempo Real**  
- Texto, números, DPI, emails, teléfonos  

---

### 5.6 Flujos Específicos: Configuración
**Información Personal**  
- Visualización, edición y guardado de perfil  

**Preferencias de App**  
- Tema claro/oscuro  
- Resolución  
- Notificaciones  

---

### 5.7 Flujos de Error y Casos Edge
- **Pérdida de Conectividad**: banner offline, formularios siguen funcionando, sincronización posterior  
- **Errores de Validación**: resaltado de campos, mensajes descriptivos  
- **Errores de Red**: toast, reintentos automáticos  
- **Sesión Expirada**: progreso guardado localmente y restaurado tras login  

---
