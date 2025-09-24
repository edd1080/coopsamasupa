# 🐛 Bug Tracking - Coopsama App

> **Registro de bugs reportados por QA y su resolución**

---

## 📋 **Control de Bugs**

| Bug ID | Fecha | Título | Estado | Prioridad | Asignado |
|--------|-------|--------|--------|-----------|----------|
| BUG-219 | 2025-01-09 | Redirección incorrecta después del login | ✅ Resuelto | Alta | Dev Team |
| BUG-225 | 2025-01-09 | Validación de DPI no funciona correctamente | ✅ Resuelto | Alta | Dev Team |
| BUG-226 | 2025-01-09 | Geolocalización inconsistente y UI confusa | ✅ Resuelto | Alta | Dev Team |
| BUG-231 | 2025-01-09 | Scroll bleed-through en picker de secciones | ✅ Resuelto | Alta | Dev Team |
| BUG-233 | 2025-01-09 | Barra de navegación mal alineada y botones recortados | ✅ Resuelto | Alta | Dev Team |
| BUG-236 | 2025-01-09 | Campo Monto Solicitado sin formato monetario | ✅ Resuelto | Alta | Dev Team |
| BUG-254 | 2025-01-20 | Layout desordenado en diálogo de confirmación de eliminación | ✅ Resuelto | Media | Dev Team |

---

## 🐛 **BUG-219: Redirección incorrecta después del login**

### **📅 Fecha de Reporte**
2025-01-09

### **📝 Descripción**
Cuando un usuario se loguea, cierra sesión y vuelve a hacer login con el mismo usuario, la aplicación lo redirige automáticamente a la pantalla de Ajustes en lugar de la pestaña de Inicio (Dashboard).

### **🎯 Comportamiento Esperado**
Después del login exitoso, el usuario debería ser redirigido a la pestaña de **Inicio** (Dashboard principal).

### **❌ Comportamiento Actual**
Después del login exitoso, el usuario es redirigido a la pestaña de **Ajustes**.

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de autenticación y redirección
- **Archivos involucrados**: 
  - `src/hooks/useAuth.tsx` (lógica de autenticación)
  - `src/App.tsx` (routing principal)
  - `src/pages/Login.tsx` (proceso de login)
- **Causa probable**: La lógica de redirección después del login no está considerando la ruta por defecto correcta

### **🧪 Script de Testing**
```javascript
// scripts/test-login-redirection.js
// Script para reproducir el bug de redirección
```

### **💡 Solución Propuesta**
- [x] Revisar lógica de redirección en `useAuth.tsx`
- [x] Verificar configuración de rutas por defecto
- [x] Implementar redirección correcta a `/` (Dashboard)
- [x] Crear script de testing para validar la corrección

### **✅ Solución Implementada**
- [x] **Archivo modificado**: `src/components/auth/LoginForm.tsx`
- [x] **Cambios realizados**:
  - Importado `useNavigate` de `react-router-dom`
  - Agregado `navigate()` en el componente
  - Implementado `navigate("/", { replace: true })` después del login exitoso
  - Agregado comentario explicativo del fix
- [x] **Script de testing**: `scripts/test-login-redirection-fix.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 2-3 horas
- **Tiempo real**: 1 hora

---

## 🐛 **BUG-225: Validación de DPI no funciona correctamente**

### **📅 Fecha de Reporte**
2025-01-09

### **📝 Descripción**
El campo número de DPI en la solicitud de crédito no está validando el formato correcto, solo valida la longitud. El formato correcto debe ser: Solamente números [0-9] con la fórmula de DPI (8 Dígitos asignados por RENAP, 1 Dígito verificador, 2 Dígitos del departamento y 2 Dígitos del municipio de nacimiento).

### **🎯 Comportamiento Esperado**
- **Formato**: XXXX XXXXX XXXX (13 dígitos con espacios)
- **Validación**: Solo números [0-9]
- **Estructura**: 8 dígitos RENAP + 1 verificador + 2 departamento + 2 municipio
- **Algoritmo**: Verificación de dígito verificador con algoritmo guatemalteco
- **Códigos**: Validar códigos de departamento (01-22) y municipio (01-99)

### **❌ Comportamiento Actual**
- Se hace la validación pero continúa sin presentar el formato correcto
- Aún acepta formatos diferentes a DPI
- Acepta letras o caracteres especiales
- Solo valida la longitud, no el formato ni la estructura

### **🔍 Análisis del Problema**
- **Componente afectado**: Validación de DPI en formularios
- **Archivos involucrados**: 
  - `src/utils/dpiValidation.ts` (algoritmo de validación)
  - Componentes de formulario que usan validación de DPI
- **Causa probable**: La validación no está siendo aplicada correctamente en los campos de entrada
- **Problema anterior**: Ya se implementó la validación completa pero no funciona

### **🧪 Script de Testing**
```javascript
// scripts/test-dpi-validation.js
// Script para probar la validación de DPI
```

### **💡 Solución Propuesta**
- [x] Revisar implementación actual en `dpiValidation.ts`
- [x] Verificar que la validación se esté aplicando en los campos de entrada
- [x] Implementar formato de entrada con máscara XXXX XXXXX XXXX
- [x] Asegurar que solo acepte números
- [x] Validar que el algoritmo de verificación funcione correctamente
- [x] Crear script de testing para validar la corrección

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/utils/formatters.ts` - validateDPIFormat ahora usa validación completa
  - `src/components/requestForm/identification/BasicDataForm.tsx` - Validación completa + solo números
  - `src/components/requestForm/identification/PersonalIdentificationForm.tsx` - Validación completa + solo números
  - `src/components/requestForm/identification/DocumentsForm.tsx` - Validación completa + solo números
- [x] **Cambios realizados**:
  - validateDPIFormat ahora usa validateDPI completa en lugar de solo verificar longitud
  - formatDPI limita a 13 dígitos máximo
  - Inputs solo aceptan números (inputMode="numeric", pattern="[0-9]*")
  - maxLength=15 (13 dígitos + 2 espacios)
  - Errores específicos de validación mostrados al usuario
  - Formato automático XXXX XXXXX XXXX aplicado
- [x] **Script de testing**: `scripts/test-dpi-validation-fix.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 3-4 horas
- **Tiempo real**: 2 horas

---

## 🐛 **BUG-226: Geolocalización inconsistente y UI confusa**

### **📅 Fecha de Reporte**
2025-01-09

### **📝 Descripción**
Al capturar la geolocalización en el mismo punto físico, la primera toma reporta precisión ~100 m y la recaptura inmediata ~20–21 m. Además, la UI muestra simultáneamente "Ubicación Capturada (GPS Aprox.)" y "capturada con precisión", generando inconsistencia de copy.

### **🎯 Comportamiento Esperado**
- **Precisión consistente**: Entre capturas consecutivas en el mismo punto
- **Texto coherente**: Usar "GPS aprox. ±XX m" cuando no sea precisa
- **Evitar contradicciones**: No mostrar "capturada con precisión" si no es precisa
- **Precisión óptima**: Debe ser lo más certera posible

### **❌ Comportamiento Actual**
- Primera lectura: Precisión ~100 m (muy imprecisa)
- Recaptura inmediata: Precisión ~20-21 m (más precisa)
- UI inconsistente: Muestra ambos textos contradictorios
- Primera lectura se desvía hasta 100 m

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de geolocalización
- **Archivos involucrados**: 
  - Componentes de geolocalización
  - Lógica de captura de GPS
  - UI de estado de geolocalización
- **Causa probable**: 
  - No se espera a que el GPS se estabilice
  - No se implementa retry con mejor precisión
  - UI no refleja el estado real de precisión

### **🧪 Script de Testing**
```javascript
// scripts/test-geolocation-accuracy.js
// Script para probar la precisión de geolocalización
```

### **💡 Solución Propuesta**
- [x] Implementar espera para estabilización del GPS
- [x] Agregar retry automático para mejorar precisión
- [x] Unificar texto de UI según precisión real
- [x] Implementar timeout y fallback
- [x] Mostrar indicador de precisión real (±XX m)
- [x] Crear script de testing para validar la corrección

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/requestForm/GeolocationCapture.tsx` - Algoritmo de retry mejorado
  - `src/components/requestForm/CoordinateDisplay.tsx` - UI coherente
- [x] **Cambios realizados**:
  - Algoritmo de retry automático (máximo 3 intentos)
  - Espera progresiva entre intentos (2s, 4s, 6s)
  - Mantiene la mejor precisión encontrada automáticamente
  - UI coherente con copy "GPS Aprox. ±XXm" o "GPS Preciso ±XXm"
  - Indicador de progreso durante captura
  - Timeout de 10 segundos por intento
  - Texto coherente según precisión real
- [x] **Script de testing**: `scripts/test-geolocation-fix.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 3-4 horas
- **Tiempo real**: 2 horas

---

## 🐛 **BUG-231: Scroll bleed-through en picker de secciones**

### **📅 Fecha de Reporte**
2025-01-09

### **📝 Descripción**
Al abrir el picker de pasos/secciones de una solicitud de crédito y desplazarse dentro del dropdown, la vista de fondo (pantalla principal) también se desplaza ("scroll bleed-through"). Además, cuando se hace tap para abrir el picker/dropdown, al hacer tap fuera del área del componente del picker no cierra el dropdown, solo permite cerrarlo haciendo tap otra vez en el área que abre el picker.

### **🎯 Comportamiento Esperado**
- **Scroll bloqueado**: Mientras el dropdown esté abierto, el scroll de la pantalla principal debe quedar bloqueado
- **Solo scroll del dropdown**: Solo se debe desplazar el contenido del dropdown
- **Cierre con tap fuera**: El usuario debe poder cerrar el dropdown haciendo tap en cualquier área fuera del dropdown
- **UX intuitiva**: Comportamiento estándar de modales/dropdowns

### **❌ Comportamiento Actual**
- **Scroll bleed-through**: Al hacer scroll dentro del dropdown, también se desplaza la pantalla principal
- **Cierre limitado**: Solo se puede cerrar el dropdown haciendo tap en el área que lo abre
- **UX confusa**: No se puede cerrar haciendo tap fuera del dropdown

### **🔍 Análisis del Problema**
- **Componente afectado**: Picker/dropdown de navegación entre secciones
- **Archivos involucrados**: 
  - Componente del picker de secciones
  - Lógica de scroll y eventos de touch
  - Manejo de eventos de click/tap
- **Causa probable**: 
  - No se previene el scroll del body cuando el dropdown está abierto
  - No se implementa click outside para cerrar el dropdown
  - Falta de event listeners para detectar taps fuera del área

### **🧪 Script de Testing**
```javascript
// scripts/test-picker-scroll-fix.js
// Script para probar el scroll y cierre del picker
```

### **💡 Solución Propuesta**
- [x] Implementar scroll lock cuando el dropdown esté abierto
- [x] Agregar event listener para click outside del dropdown
- [x] Prevenir propagación de eventos de scroll
- [x] Implementar cierre automático al hacer tap fuera
- [x] Mejorar UX del picker/dropdown
- [x] Crear script de testing para validar la corrección

### **✅ Solución Implementada**
- [x] **Archivos creados**:
  - `src/hooks/useScrollLock.tsx` - Hook para bloquear scroll del body
  - `src/hooks/useClickOutside.tsx` - Hook para detectar clicks fuera del elemento
- [x] **Archivos modificados**:
  - `src/components/requestForm/DynamicFormHeader.tsx` - Componente corregido
- [x] **Cambios realizados**:
  - Scroll lock automático cuando picker está abierto
  - Click outside detection con event listeners para mouse/touch
  - Soporte para teclado (ESC para cerrar)
  - Z-index corregido (z-50 para dropdown)
  - Scroll interno del dropdown (max-h-80 overflow-y-auto)
  - stopPropagation para eventos del dropdown
  - Cleanup automático de event listeners
- [x] **Script de testing**: `scripts/test-picker-fix-validation.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 2-3 horas
- **Tiempo real**: 1.5 horas

---

## 🐛 **BUG-233: Barra de navegación mal alineada y botones recortados**

### **📅 Fecha de Reporte**
2025-01-09

### **📝 Descripción**
En la barra de navegación de una solicitud en edición, los botones **Anterior**, **Guardar** y **Siguiente** aparecen agrupados y alineados a la derecha; en la pantalla de envío, el botón **Enviar solicitud** se recorta por el borde derecho y **Anterior/Siguiente** quedan pegados a los bordes, afectando la visibilidad.

### **🎯 Comportamiento Esperado**
- **Centrado**: El grupo de acciones debe estar centrado en la barra de navegación
- **Espaciado uniforme**: Gap adecuado entre botones
- **Márgenes/padding**: Adecuados para todas las resoluciones
- **Safe areas**: Respeto de áreas seguras para que todos los botones se muestren completos
- **Tamaño optimizado**: Botones más pequeños con tipografía reducida
- **Espaciado interno**: Reducir margen entre icono y texto del botón

### **❌ Comportamiento Actual**
- **Alineación incorrecta**: Botones agrupados y alineados a la derecha
- **Botones recortados**: "Enviar solicitud" se corta por el borde derecho
- **Pegados a bordes**: "Anterior/Siguiente" quedan pegados a los bordes
- **Visibilidad afectada**: Botones no se muestran completos en todas las resoluciones
- **Tamaño excesivo**: Botones muy grandes para el espacio disponible

### **🔍 Análisis del Problema**
- **Componente afectado**: Barra de navegación de solicitudes
- **Archivos involucrados**: 
  - Componente de navegación de formularios
  - Estilos de botones y layout
  - Responsive design
- **Causa probable**: 
  - Layout no centrado
  - Tamaños de botones excesivos
  - Falta de responsive design
  - No se respetan safe areas
  - Espaciado interno excesivo

### **🧪 Script de Testing**
```javascript
// scripts/test-navigation-layout-fix.js
// Script para probar el layout de la barra de navegación
```

### **💡 Solución Propuesta**
- [x] Centrar el grupo de acciones en la barra de navegación
- [x] Reducir tamaño de botones y tipografía
- [x] Reducir margen entre icono y texto
- [x] Implementar espaciado uniforme entre botones
- [x] Respetar safe areas para todas las resoluciones
- [x] Mejorar responsive design
- [x] Crear script de testing para validar la corrección

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/requestForm/FormActionBar.tsx` - Barra de navegación corregida
- [x] **Cambios realizados**:
  - Layout responsive con breakpoints (sm, md)
  - Tamaños de botones adaptativos (70px-120px)
  - Gap progresivo (3px → 4px → 6px)
  - Texto responsive (xs → sm)
  - Iconos adaptativos (12px → 16px)
  - Espaciado interno optimizado (4px)
  - Altura consistente (36px)
  - Flex-wrap para casos extremos
  - Padding responsive
  - Safe areas respetadas
- [x] **Script de testing**: `scripts/test-navigation-fix-validation.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 2-3 horas
- **Tiempo real**: 1 hora

---

## 🐛 **BUG-236: Campo Monto Solicitado sin formato monetario**

### **📅 Fecha de Reporte**
2025-01-09

### **📝 Descripción**
En el paso 3 (Finanzas y Patrimonio) de la solicitud de crédito, el campo **Monto Solicitado** se muestra sin formato monetario (p. ej., `100000`), a diferencia de otros campos de moneda. Se espera que muestre y valide el formato de quetzales `QXXX,XXX,XXX.XX` (prefijo **Q**, separador de miles y dos decimales) de forma consistente tanto en visualización como en entrada.

### **🎯 Comportamiento Esperado**
- **Formato consistente**: Mostrar formato `QXXX,XXX,XXX.XX`
- **Prefijo Q**: Siempre mostrar prefijo de quetzales
- **Separador de miles**: Comas para separar miles
- **Dos decimales**: Siempre mostrar `.XX` al final
- **Validación**: Aceptar solo números y formatear automáticamente
- **Consistencia**: Igual que otros campos de moneda en la aplicación

### **❌ Comportamiento Actual**
- **Sin formato**: Muestra `100000` en lugar de `Q100,000.00`
- **Inconsistente**: Diferente a otros campos de moneda
- **Sin prefijo Q**: No muestra el símbolo de quetzales
- **Sin separadores**: No separa miles con comas
- **Sin decimales**: No muestra los dos decimales

### **🔍 Análisis del Problema**
- **Componente afectado**: Paso 3 - Finanzas y Patrimonio
- **Campo específico**: Monto Solicitado
- **Archivos involucrados**: 
  - Componente del formulario de finanzas
  - Utilidades de formateo de moneda
  - Validación de campos monetarios
- **Causa probable**: 
  - No se aplica formateo monetario al campo
  - Falta de utilidad de formateo específica
  - No se usa el mismo sistema que otros campos de moneda

### **🧪 Script de Testing**
```javascript
// scripts/test-currency-formatting-fix.js
// Script para probar el formateo de moneda
```

### **💡 Solución Propuesta**
- [x] Encontrar el campo Monto Solicitado en el paso 3
- [x] Implementar formateo monetario consistente
- [x] Agregar prefijo Q y separadores de miles
- [x] Asegurar dos decimales siempre
- [x] Validar entrada y formateo automático
- [x] Crear script de testing para validar la corrección

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/requestForm/PatrimonialStatement.tsx` - Campo Monto Solicitado corregido
- [x] **Cambios realizados**:
  - Importación de CurrencyInput component
  - Reemplazo de Input básico con CurrencyInput
  - Props correctas (id, value, onValueChange, placeholder, currencySymbol)
  - Formateo automático QXXX,XXX,XXX.XX
  - Validación automática de entrada
  - Consistencia con otros campos de moneda
- [x] **Script de testing**: `scripts/test-currency-fix-validation.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Baja
- **Tiempo estimado**: 1-2 horas
- **Tiempo real**: 30 minutos

---

## 🐛 **BUG-238: Documentos - Opciones duplicadas y permisos incorrectos**

### **📅 Fecha de Reporte**
2025-01-09

### **📝 Descripción**
Al adjuntar documentos, al tocar **Cámara** también aparece **Subir archivo** (opción duplicada) y actualmente no se puede ni tomar foto ni subir archivos para ningún tipo de documento; en **Recibos de Servicio** se solicita permiso para grabar audio, y el ícono de "subir documento" acordado retirar sigue visible. Se espera un único punto de entrada que ofrezca **Tomar foto** (pidiendo solo permiso de cámara) o **Elegir archivo/galería** (pidiendo solo permisos de almacenamiento/fotos), sin solicitar audio; que ambas acciones funcionen para todos los documentos; que se elimine el ícono redundante; y que se validen y muestren claramente los límites máximos de tamaño para imágenes y PDFs.

### **🎯 Comportamiento Esperado**
- **Punto de entrada único**: Solo dos opciones claras
- **Tomar foto**: Solo solicita permiso de cámara
- **Elegir archivo/galería**: Solo solicita permisos de almacenamiento/fotos
- **Sin audio**: No solicitar permisos de grabación de audio
- **Funcionalidad completa**: Ambas acciones funcionan para todos los documentos
- **Sin íconos redundantes**: Eliminar ícono de "subir documento" duplicado
- **Validación de límites**: Mostrar claramente límites de tamaño para imágenes y PDFs

### **❌ Comportamiento Actual**
- **Opciones duplicadas**: Al tocar "Cámara" aparece "Subir archivo"
- **Funcionalidad rota**: No se puede tomar foto ni subir archivos
- **Permisos incorrectos**: Solicita permiso de audio en Recibos de Servicio
- **Ícono redundante**: Sigue visible el ícono de "subir documento"
- **Sin validación**: No muestra límites de tamaño

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de adjunto de documentos
- **Archivos involucrados**: 
  - Componentes de captura de cámara
  - Componentes de subida de archivos
  - Gestión de permisos
  - Validación de archivos
- **Causa probable**: 
  - Implementación duplicada de opciones
  - Permisos mal configurados
  - Íconos redundantes no removidos
  - Falta de validación de límites

### **🧪 Script de Testing**
```javascript
// scripts/test-document-upload-fix.js
// Script para probar la funcionalidad de adjunto de documentos
```

### **💡 Solución Propuesta**
- [x] Revisar implementación existente de adjunto de documentos
- [x] Verificar que las opciones no estén duplicadas
- [x] Confirmar que los permisos sean correctos
- [x] Validar que ambas acciones funcionen
- [x] Verificar que no haya íconos redundantes
- [x] Confirmar validación de límites de tamaño

### **✅ Solución Implementada**
- [x] **Estado**: Ya resuelto en sesión anterior
- [x] **Funcionalidad confirmada**: 
  - Opciones de cámara y galería funcionando
  - Permisos correctos (solo cámara y almacenamiento)
  - Sin solicitar permisos de audio
  - Archivos se guardan exitosamente en Supabase
  - Validación de límites implementada
- [x] **Archivos verificados**: Componentes de documentos
- [x] **Testing**: Funcionalidad confirmada al 100% por el usuario

### **📊 Estado**
- **Status**: ✅ Resuelto (Confirmado por usuario)
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 2-3 horas
- **Tiempo real**: Completado en sesión anterior

---

## 🐛 **BUG-240: Referencias personales - Mapeo incorrecto al payload**

### **📅 Fecha de Reporte**
2025-01-09

### **📝 Descripción**
En la pantalla de agregar referencias personales del solicitante del crédito no se están mapeando correctamente la información agregada en el formulario al payload final para enviar por medio del microservicio implementado a Coopsama. Los campos del formulario de referencias no coinciden con la estructura requerida en el payload.

### **🎯 Comportamiento Esperado**
- **Campos separados**: Primer nombre, segundo nombre, primer apellido, segundo apellido en inputs individuales
- **Mapeo correcto**: Cada campo debe mapear a su data path correspondiente
- **Catálogos funcionando**: Tipo de referencia y Calificación con dropdowns
- **Estructura del payload**: Referencias entre "collateral" e "investmentPlan"
- **Múltiples referencias**: Soporte para hasta 3 referencias
- **Validación**: Campos requeridos validados correctamente

### **❌ Comportamiento Actual**
- **Campo único**: Nombre completo en un solo input
- **Mapeo incorrecto**: No se mapea correctamente al payload
- **Estructura incorrecta**: No sigue la estructura requerida
- **Catálogos no funcionan**: Dropdowns no despliegan opciones correctas
- **Payload incompleto**: Referencias no se incluyen en el payload final

### **🔍 Análisis del Problema**
- **Componente afectado**: Formulario de referencias personales
- **Archivos involucrados**: 
  - Formulario de referencias personales
  - fieldMapper.ts para mapeo de datos
  - Catálogos de tipo de referencia y calificación
- **Causa probable**: 
  - Formulario usa campo único para nombre completo
  - Mapeo no coincide con estructura requerida
  - Catálogos no están configurados correctamente

### **📋 Campos Requeridos**
| Campo | Data Path | Catálogo |
|-------|-----------|----------|
| Tipo de referencia | process.profile.personal.references.x.type.id/value | Sí |
| Primer nombre | process.profile.personal.references.x.firstName | No |
| Segundo nombre | process.profile.personal.references.x.secondName | No |
| Primer apellido | process.profile.personal.references.x.firstLastName | No |
| Segundo apellido | process.profile.personal.references.x.secondLastName | No |
| Dirección | process.profile.personal.references.x.fullAddress | No |
| Relación | process.profile.personal.references.x.relationship | No |
| Teléfono | process.profile.personal.references.x.mobile | No |
| Calificación | process.profile.personal.references.x.score.id/value | Sí |
| Comentario | process.profile.personal.references.x.comments | No |

### **🧪 Script de Testing**
```javascript
// scripts/test-references-mapping-fix.js
// Script para probar el mapeo de referencias personales
```

### **💡 Solución Propuesta**
- [x] Encontrar formulario de referencias personales
- [x] Separar campo de nombre completo en 4 campos individuales
- [x] Configurar catálogos para Tipo de referencia y Calificación
- [x] Corregir mapeo en fieldMapper.ts
- [x] Validar estructura del payload
- [x] Crear script de testing para validar corrección

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/requestForm/RequestFormProvider.tsx` - Estructura ReferenceData actualizada
  - `src/components/requestForm/references/ReferenceBasicInfo.tsx` - Formulario con campos separados
  - `src/utils/fieldMapper.ts` - Mapeo corregido
- [x] **Cambios realizados**:
  - Campos separados para nombres (firstName, secondName, firstLastName, secondLastName)
  - Auto-generación de fullName desde campos individuales
  - Nombres de campos actualizados (relationship, mobile, score, comments, fullAddress)
  - Catálogos sincronizados (PERSONAL/COMERCIAL, EXCELENTE/BUENO/REGULAR/MALO)
  - Mapeo directo sin dependencia de splitFullName()
  - Compatibilidad con campos legacy
  - Validación actualizada para campos requeridos
  - **CORRECCIÓN ADICIONAL**: Asteriscos removidos de labels
  - **CORRECCIÓN ADICIONAL**: Campos no son obligatorios
  - **CORRECCIÓN ADICIONAL**: Sincronización automática con formData
  - **CORRECCIÓN ADICIONAL**: Límite máximo de 3 referencias
  - **CORRECCIÓN ADICIONAL**: Mapeo correcto al payload final
- [x] **Script de testing**: `scripts/test-references-mapping-fix.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 2-3 horas
- **Tiempo real**: 1.5 horas

---

## 🐛 **BUG-252: Validación mínima para envío de solicitudes**

### **📅 Fecha de Reporte**
2025-01-09

### **📝 Descripción**
A pesar de que ningún campo de la solicitud es obligatorio, la aplicación está permitiendo crear y enviar solicitudes completamente vacías. Debería haber un validador de al menos información del solicitante mínima. Actualmente para poder guardar un borrador y salir de la solicitud a la lista de solicitudes, la app pide como mínimo nombre y DPI para permitir al usuario salir del llenado de la solicitud, algo igual se podría implementar.

### **🎯 Comportamiento Esperado**
- **Validación mínima**: Al menos información básica del solicitante (nombre y DPI)
- **Bloqueo de envío**: No permitir enviar solicitudes completamente vacías
- **Mensaje claro**: Informar al usuario qué campos mínimos necesita completar
- **Consistencia**: Misma validación que para guardar borrador
- **UX mejorada**: Guiar al usuario sobre qué completar

### **❌ Comportamiento Actual**
- **Sin validación**: Permite enviar solicitudes completamente vacías
- **Inconsistencia**: Diferente validación para borrador vs envío final
- **Mala UX**: Usuario puede enviar solicitudes sin datos
- **Sin retroalimentación**: No informa qué campos son necesarios

### **🔍 Análisis del Problema**
- **Componente afectado**: Lógica de validación de envío de solicitudes
- **Archivos involucrados**: 
  - Lógica de envío de solicitudes
  - Validación de campos mínimos
  - Mensajes de error/validación
- **Causa probable**: 
  - Falta de validación mínima en envío final
  - Inconsistencia entre validación de borrador y envío
  - No se valida información básica del solicitante

### **📋 Campos Mínimos Requeridos**
| Campo | Descripción | Validación |
|-------|-------------|------------|
| firstName | Primer nombre del solicitante | No vacío |
| firstLastName | Primer apellido del solicitante | No vacío |
| dpi | DPI del solicitante | 13 dígitos válidos |

### **🧪 Script de Testing**
```javascript
// scripts/test-minimum-validation-fix.js
// Script para probar la validación mínima de solicitudes
```

### **💡 Solución Propuesta**
- [x] Encontrar lógica de validación actual
- [x] Implementar validación mínima de datos del solicitante
- [x] Agregar mensajes de error claros
- [x] Mantener consistencia con validación de borrador
- [x] Crear script de testing para validación

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/requestForm/ReviewSection.tsx` - Validación en handleSendApplication
  - `src/components/requestForm/FormActionBar.tsx` - Validación en handleSubmitWithValidation
  - `src/hooks/useDraftActions.tsx` - Función validateMinimumRequiredData (ya existía)
- [x] **Cambios realizados**:
  - Validación mínima antes del envío en ambos puntos
  - Bloqueo de solicitudes completamente vacías
  - Requerimiento de nombre completo (mínimo 2 caracteres)
  - Requerimiento de DPI válido (13 dígitos)
  - Mensajes de error informativos al usuario
  - Consistencia con validación de borrador
- [x] **Script de testing**: `scripts/test-minimum-validation-fix.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Baja
- **Tiempo estimado**: 1-2 horas
- **Tiempo real**: 1 hora

---

## 🐛 **BUG-253: ID interno visible y nombre incompleto en nav bar**

### **📅 Fecha de Reporte**
2025-01-09

### **📝 Descripción**
Tras enviar una solicitud, en la pantalla de **Detalles de solicitud** (navigation bar bajo el nombre del solicitante) permanece visible el identificador interno de gran longitud y no se actualiza; no aparece el ID público esperado con prefijo `SCO_XXXXXX`. **Se espera** que, inmediatamente después del envío (o al cargar la vista), se muestre el ID corto de negocio `SCO_XXXXXX` de forma consistente en esa barra y en el resto de la UI, ocultando el ID interno. Además en la nav bar se está mostrando solamente el primer nombre de la persona cuando debería ser primer nombre y primer apellido. Debajo ya en la pantalla de detalles debería ir el nombre completo de la persona de la solicitud.

### **🎯 Comportamiento Esperado**
- **ID público**: Mostrar `SCO_XXXXXX` en lugar del ID interno largo
- **Nombre completo en nav bar**: "Primer nombre + Primer apellido"
- **Nombre completo en detalles**: Nombre completo de la persona
- **Consistencia**: ID público visible en toda la UI
- **Actualización inmediata**: Cambio automático tras envío

### **❌ Comportamiento Actual**
- **ID interno visible**: Se muestra ID interno largo en nav bar
- **Nombre incompleto**: Solo primer nombre en nav bar
- **Inconsistencia**: Diferentes IDs en diferentes partes de la UI
- **Sin actualización**: No cambia tras envío de solicitud

### **🔍 Análisis del Problema**
- **Componente afectado**: Pantalla de detalles de solicitud
- **Archivos involucrados**: 
  - Componente de detalles de solicitud
  - Lógica de generación de ID público
  - Nav bar de detalles
- **Causa probable**: 
  - No se está usando el ID público generado
  - Lógica de nombre incompleta en nav bar
  - Falta de actualización tras envío

### **📋 Campos Requeridos**
| Campo | Descripción | Formato |
|-------|-------------|---------|
| ID público | Identificador de negocio | SCO_XXXXXX |
| Nombre nav bar | Nombre en barra de navegación | Primer nombre + Primer apellido |
| Nombre completo | Nombre completo en detalles | Nombre completo de la persona |

### **🧪 Script de Testing**
```javascript
// scripts/test-id-display-fix.js
// Script para probar la visualización correcta de ID y nombre
```

### **💡 Solución Propuesta**
- [x] Encontrar componente de detalles de solicitud
- [x] Implementar visualización de ID público SCO_XXXXXX
- [x] Corregir nombre en nav bar (primer nombre + primer apellido)
- [x] Asegurar consistencia en toda la UI
- [x] Crear script de testing para validación

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/pages/ApplicationDetails.tsx` - ID público y nombre nav bar
  - `src/lib/nameUtils.ts` - Nueva función getNavBarName
  - `src/utils/applicationIdGenerator.ts` - Función formatApplicationId (ya existía)
- [x] **Cambios realizados**:
  - ID público SCO_XXXXXX en lugar de ID interno
  - Nombre nav bar: "Primer nombre + Primer apellido"
  - Nombre completo en detalles de solicitud
  - Prioridad: externalReferenceId > SCO_XXXXXX
  - Formateo automático de IDs internos
  - Consistencia en toda la UI
- [x] **Script de testing**: `scripts/test-id-display-fix.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 2-3 horas
- **Tiempo real**: 1.5 horas

---

## 🐛 **BUG-254: Layout desordenado en diálogo de confirmación de eliminación**

### **📅 Fecha de Reporte**
2025-01-20

### **📝 Descripción**
La card para confirmar la eliminación de una solicitud tiene el layout desordenado y asimétrico. El título e icono están alineados hacia la izquierda cuando deberían estar centrados. Además, el texto "el borrador será eliminado permanentemente" debe ser eliminado del diálogo.

### **🎯 Comportamiento Esperado**
- **Título e icono centrados**: Alineados al centro del diálogo
- **Descripción centrada**: Texto de confirmación centrado
- **Texto simplificado**: Solo "Esta acción no se puede deshacer"
- **Layout simétrico**: Diseño balanceado y profesional

### **❌ Comportamiento Actual**
- **Título e icono alineados a la izquierda**: No centrados
- **Descripción alineada a la izquierda**: No centrada
- **Texto redundante**: "El borrador será eliminado permanentemente" innecesario
- **Layout asimétrico**: Diseño desbalanceado

### **🔍 Análisis del Problema**
- **Componente afectado**: Diálogo de confirmación de eliminación
- **Archivos involucrados**: 
  - `src/pages/Applications.tsx` - AlertDialog de confirmación
- **Causa probable**: 
  - Falta de clases de centrado en AlertDialogHeader
  - Falta de justify-center en AlertDialogTitle
  - Texto redundante en AlertDialogDescription

### **🧪 Script de Testing**
```javascript
// scripts/test-delete-dialog-layout.js
// Script para probar el layout del diálogo de eliminación
```

### **💡 Solución Propuesta**
- [x] Centrar header con `text-center`
- [x] Centrar título e icono con `justify-center`
- [x] Centrar descripción con `text-center`
- [x] Eliminar texto "será eliminado permanentemente"
- [x] Mantener texto "Esta acción no se puede deshacer"
- [x] Crear script de testing para validación

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/pages/Applications.tsx` - Layout del diálogo corregido
- [x] **Cambios realizados**:
  - `AlertDialogHeader` con `className="text-center"`
  - `AlertDialogTitle` con `className="flex items-center justify-center gap-2"`
  - `AlertDialogDescription` con `className="text-center"`
  - Texto "será eliminado permanentemente" eliminado
  - Texto "Esta acción no se puede deshacer" mantenido
  - Icono Trash2 preservado con color rojo
- [x] **Script de testing**: `verify-delete-dialog-layout.sh`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Media
- **Complejidad**: Baja
- **Tiempo estimado**: 30 minutos
- **Tiempo real**: 15 minutos

---

## 🐛 **BUG-270: Pantalla en blanco al navegar a documentos (step 5)**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
Al navegar al paso 5 (Documentos) de la solicitud de crédito, se muestra una pantalla en blanco y la aplicación se congela en esa pantalla. El usuario no puede navegar libremente al paso de documentos.

### **🎯 Comportamiento Esperado**
- **Navegación libre**: El usuario debe poder navegar libremente al paso 5 (Documentos)
- **Sin pantalla en blanco**: La pantalla de documentos debe cargar correctamente
- **Sin congelamiento**: La aplicación no debe congelarse

### **❌ Comportamiento Actual**
- **Pantalla en blanco**: Se muestra una pantalla en blanco al abrir documentos
- **Aplicación congelada**: La app se queda colgada en esa pantalla
- **Sin navegación**: No se puede navegar libremente al paso 5

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de gestión de documentos
- **Archivos involucrados**: 
  - `src/hooks/useDocumentManager.tsx` (arquitectura de estado)
  - `src/components/requestForm/PhotoDocumentUpload.tsx` (inicialización)
- **Causa probable**: 
  - Arquitectura basada en contexto causaba problemas de timing
  - `useDocumentManager` usaba `useFormContext()` en lugar de estado local
  - Problemas de inicialización y dependencias de contexto

### **🧪 Script de Testing**
```javascript
// scripts/test-blank-screen-fix.js
// Script para probar la navegación a documentos
```

### **💡 Solución Propuesta**
- [x] Restaurar arquitectura de commit d038961 que funcionaba correctamente
- [x] `useDocumentManager` usa `useState` con `guatemalanDocuments` como valor inicial
- [x] `PhotoDocumentUpload` usa `useDocumentManager()` directamente sin dependencias de contexto
- [x] `useEffect` simple para sincronización con `formData`
- [x] Sin inicialización compleja o dependencias de contexto

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/hooks/useDocumentManager.tsx` - Arquitectura restaurada
  - `src/components/requestForm/PhotoDocumentUpload.tsx` - Inicialización simplificada
- [x] **Cambios realizados**:
  - Arquitectura basada en estado local en lugar de contexto
  - Inicialización inmediata con `guatemalanDocuments`
  - Sincronización manual con `formData` via `useEffect`
  - Eliminación de dependencias complejas de contexto
  - Restauración de commit `d038961` que funcionaba correctamente
- [x] **Script de testing**: `verify-blank-screen-fix.sh`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 2-3 horas
- **Tiempo real**: 1 hora

---

## 🐛 **BUG-271: Botón "Salir sin guardar" no funciona en step 5**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
En el paso 5 (Documentos) de la solicitud de crédito, el botón "Salir sin guardar" no funciona, dejando al usuario atrapado en la pantalla de documentos. El botón "Guardar y salir" sí funciona correctamente.

### **🎯 Comportamiento Esperado**
- **Salir sin guardar**: El botón debe permitir salir de la solicitud sin guardar cambios
- **Navegación libre**: El usuario debe poder salir libremente de cualquier paso
- **Consistencia**: Mismo comportamiento que en otros pasos

### **❌ Comportamiento Actual**
- **Botón no funciona**: "Salir sin guardar" no permite salir de la solicitud
- **Usuario atrapado**: Se queda en la pantalla de documentos
- **Inconsistencia**: Diferente comportamiento que otros pasos

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de navegación y diálogos de salida
- **Archivos involucrados**: 
  - `src/components/requestForm/RequestFormProvider.tsx` (lógica de salida)
  - `src/components/requestForm/PhotoDocumentUpload.tsx` (interferencia de eventos)
- **Causa probable**: 
  - Conflictos entre event listeners y diálogos anidados
  - Interferencia del `SafeNavigationWrapper` con `popstate`
  - Problemas de arquitectura de documentos

### **🧪 Script de Testing**
```javascript
// scripts/test-exit-without-save-fix.js
// Script para probar el botón de salir sin guardar
```

### **💡 Solución Propuesta**
- [x] Restaurar arquitectura de commit d038961 que funcionaba correctamente
- [x] Eliminar conflictos de event listeners
- [x] Simplificar manejo de diálogos
- [x] Asegurar navegación libre sin interferencias

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/hooks/useDocumentManager.tsx` - Arquitectura restaurada
  - `src/components/requestForm/PhotoDocumentUpload.tsx` - Eventos simplificados
- [x] **Cambios realizados**:
  - Restauración de commit `d038961` que funcionaba correctamente
  - Eliminación de conflictos de event listeners
  - Simplificación de manejo de diálogos
  - Navegación libre sin interferencias
- [x] **Script de testing**: `verify-exit-without-save-fix.sh`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 2-3 horas
- **Tiempo real**: 1 hora

---

## 🐛 **BUG-272: File picker no permite seleccionar archivos PDF**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
El file picker en la pantalla de subir documentos no permite seleccionar archivos PDF. El usuario no puede elegir archivos PDF desde el selector de archivos del dispositivo.

### **🎯 Comportamiento Esperado**
- **Selección de PDFs**: El file picker debe permitir seleccionar archivos PDF
- **Múltiples formatos**: Debe permitir imágenes y PDFs según el tipo de documento
- **UX consistente**: Comportamiento estándar de file picker

### **❌ Comportamiento Actual**
- **PDFs bloqueados**: El file picker no muestra archivos PDF como opción
- **Solo imágenes**: Solo permite seleccionar archivos de imagen
- **UX limitada**: Usuario no puede subir documentos PDF

### **🔍 Análisis del Problema**
- **Componente afectado**: File picker de documentos
- **Archivos involucrados**: 
  - `src/components/requestForm/PhotoDocumentUpload.tsx` (atributo accept)
  - `src/hooks/useDocumentManager.tsx` (tipos de documento)
- **Causa probable**: 
  - Atributo `accept` usaba extensiones (`.pdf`) en lugar de MIME types (`application/pdf`)
  - Todos los documentos definidos como `type: 'photo'` causaba `accept="image/*"`

### **🧪 Script de Testing**
```javascript
// scripts/test-pdf-file-picker-fix.js
// Script para probar la selección de PDFs
```

### **💡 Solución Propuesta**
- [x] Cambiar atributo `accept` de extensiones a MIME types
- [x] Cambiar `recibosServicios` de tipo `'photo'` a `'document'`
- [x] Permitir `accept="*"` para documentos de tipo `'document'`
- [x] Mantener `accept="image/*"` para documentos de tipo `'photo'`

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/requestForm/PhotoDocumentUpload.tsx` - MIME types correctos
  - `src/hooks/useDocumentManager.tsx` - Tipo de documento corregido
- [x] **Cambios realizados**:
  - `accept="image/*,application/pdf"` en lugar de extensiones
  - `recibosServicios` cambiado a `type: 'document'`
  - `InteractiveDocumentCard` usa `accept="*"` para documentos
  - Soporte completo para PDFs, imágenes y fotos
- [x] **Script de testing**: `verify-pdf-file-picker-fix.sh`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 1-2 horas
- **Tiempo real**: 1 hora

---

## 🐛 **BUG-273: Visualización incorrecta de PDFs en cards de documentos**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
Cuando se sube un archivo PDF correctamente y se actualiza la card, se muestra el texto "Toca para ver" y aparece un botón "Ver" que no debería estar presente para PDFs. Los PDFs no necesitan vista previa.

### **🎯 Comportamiento Esperado**
- **Nombre del archivo**: Mostrar el nombre del archivo PDF subido
- **Sin vista previa**: No mostrar botón "Ver" para PDFs
- **Sin "Toca para ver"**: Eliminar texto confuso
- **Botón eliminar**: Mantener funcionalidad de eliminar

### **❌ Comportamiento Actual**
- **Texto confuso**: Muestra "Toca para ver" para PDFs
- **Botón innecesario**: Aparece botón "Ver" que no funciona para PDFs
- **Sin nombre**: No muestra el nombre del archivo subido
- **UX inconsistente**: Diferente comportamiento que imágenes

### **🔍 Análisis del Problema**
- **Componente afectado**: Visualización de documentos en cards
- **Archivos involucrados**: 
  - `src/components/documents/InteractiveDocumentCard.tsx` (UI de documentos)
- **Causa probable**: 
  - Lógica de visualización no diferenciaba entre PDFs e imágenes
  - Botón "Ver" aparecía para todos los tipos de archivo
  - Texto genérico "Toca para ver" para todos los tipos

### **🧪 Script de Testing**
```javascript
// scripts/test-pdf-display-fix.js
// Script para probar la visualización de PDFs
```

### **💡 Solución Propuesta**
- [x] Mostrar nombre del archivo en lugar de "Toca para ver" para PDFs
- [x] Condicionar botón "Ver" para que no aparezca en PDFs
- [x] Mantener botón "Eliminar" para PDFs
- [x] Preservar vista previa para imágenes (no PDFs)

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/documents/InteractiveDocumentCard.tsx` - UI de PDFs corregida
- [x] **Cambios realizados**:
  - PDFs muestran `{document.file?.name || 'Archivo PDF'}` en lugar de "Toca para ver"
  - Botón "Ver" condicionado: `{document.file?.type !== 'application/pdf' && ...}`
  - Botón "Eliminar" mantenido para PDFs
  - Vista previa preservada para imágenes
- [x] **Script de testing**: `verify-pdf-display-fix.sh`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Media
- **Complejidad**: Baja
- **Tiempo estimado**: 30 minutos
- **Tiempo real**: 30 minutos

---

## 🐛 **BUG-274: Iconos de aplicación Android perdidos después de rollback**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
Después del rollback al commit d038961, se perdieron los iconos oficiales de Coopsama que habían sido implementados en commit de71f8f. Los iconos de aplicación Android no muestran el branding oficial.

### **🎯 Comportamiento Esperado**
- **Iconos oficiales**: Mostrar iconos con branding oficial de Coopsama
- **Todas las densidades**: Iconos en todas las resoluciones (ldpi a xxxhdpi)
- **Adaptive icons**: Soporte para Android 8+ con adaptive icons
- **Consistencia**: Iconos coherentes en toda la aplicación

### **❌ Comportamiento Actual**
- **Iconos genéricos**: Se muestran iconos por defecto sin branding
- **Densidades faltantes**: Algunas resoluciones de iconos no están presentes
- **Sin adaptive icons**: Falta soporte para adaptive icons modernos
- **Branding perdido**: No se refleja la identidad visual de Coopsama

### **🔍 Análisis del Problema**
- **Componente afectado**: Iconos de aplicación Android
- **Archivos involucrados**: 
  - `android/app/src/main/res/mipmap-*/` (todas las densidades)
  - `android/app/src/main/res/mipmap-anydpi-v26/` (adaptive icons)
- **Causa probable**: 
  - Rollback eliminó iconos implementados en commit de71f8f
  - Carpeta `appIcons` contenía iconos oficiales no restaurados
  - Falta de restauración manual de recursos de Android

### **🧪 Script de Testing**
```javascript
// scripts/test-app-icons-restoration.js
// Script para verificar iconos de aplicación
```

### **💡 Solución Propuesta**
- [x] Restaurar iconos desde carpeta `appIcons/android/res/`
- [x] Copiar todas las densidades (ldpi a xxxhdpi)
- [x] Restaurar adaptive icons (Android 8+)
- [x] Verificar configuración XML de adaptive icons

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `android/app/src/main/res/mipmap-*/` - Todas las densidades restauradas
  - `android/app/src/main/res/mipmap-anydpi-v26/` - Adaptive icons restaurados
- [x] **Cambios realizados**:
  - Comando: `cp -r appIcons/android/res/mipmap-* android/app/src/main/res/`
  - 26 iconos instalados en todas las densidades
  - Adaptive icons configurados correctamente
  - Branding oficial de Coopsama restaurado
- [x] **Script de testing**: `verify-app-icons-restoration.sh`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Media
- **Complejidad**: Baja
- **Tiempo estimado**: 30 minutos
- **Tiempo real**: 15 minutos

---

## 🐛 **BUG-275: Diálogo de salida se queda en estado de carga**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
En la pantalla de documentos, después de subir un documento o imagen, cuando se intenta "Salir sin guardar" no sucede nada, y cuando se intenta "Guardar y salir" se queda en estado de carga, los botones se deshabilitan y no se puede volver a intentar salir. El botón de "Guardar y salir" cambia al texto "guardando..." y no sucede nada.

### **🎯 Comportamiento Esperado**
- **Salir sin guardar**: El botón debe permitir salir de la solicitud sin guardar cambios
- **Guardar y salir**: El botón debe guardar y salir correctamente
- **Sin estado de carga infinito**: Los botones deben re-habilitarse si hay error
- **Navegación funcional**: El usuario debe poder salir de la solicitud

### **❌ Comportamiento Actual**
- **"Salir sin guardar" no funciona**: No pasa nada al presionar el botón
- **"Guardar y salir" se queda cargando**: Estado de carga infinito
- **Botones deshabilitados**: No se pueden volver a presionar
- **Sin navegación**: No sale de la pantalla de documentos

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de navegación y diálogos de salida
- **Archivos involucrados**: 
  - `src/components/requestForm/ExitDialog.tsx` (estado de carga)
  - `src/components/requestForm/RequestFormProvider.tsx` (manejo de errores)
  - `src/components/requestForm/SafeNavigationWrapper.tsx` (interferencia de navegación)
  - `src/components/requestForm/PhotoDocumentUpload.tsx` (interferencia con formData)
- **Causa probable**: 
  - `isExiting` no se resetea correctamente en caso de error
  - Errores de `saveDraftMutation` no se re-lanzan para manejo en `ExitDialog`
  - Estado de carga no se limpia en el `finally` block
  - `SafeNavigationWrapper` interfiere con la navegación normal
  - **NUEVA CAUSA**: `PhotoDocumentUpload` actualiza `formData` durante subida de documentos, causando re-renders que interfieren con el diálogo de salida

### **🧪 Script de Testing**
```javascript
// scripts/test-exit-dialog-loading-fix.js
// Script para probar el estado de carga del diálogo de salida
```

### **💡 Solución Propuesta**
- [x] Agregar `finally` block en `handleExitWithSave` para resetear `isExiting`
- [x] Modificar `RequestFormProvider` para re-lanzar errores de `saveDraftMutation`
- [x] Modificar `SafeNavigationWrapper` para no interferir cuando `showExitDialog` está activo
- [x] **NUEVA SOLUCIÓN**: Modificar `PhotoDocumentUpload` para no actualizar `formData` cuando `showExitDialog` está activo
- [x] Agregar debounce para evitar actualizaciones excesivas de `formData`
- [x] Asegurar que el estado de carga se resetee siempre
- [x] Crear script de testing para validación

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/requestForm/ExitDialog.tsx` - `finally` block agregado
  - `src/components/requestForm/RequestFormProvider.tsx` - Re-lanzamiento de errores
  - `src/components/requestForm/SafeNavigationWrapper.tsx` - No interferir con diálogo
  - `src/components/requestForm/PhotoDocumentUpload.tsx` - No actualizar formData durante diálogo
- [x] **Cambios realizados**:
  - `finally` block en `handleExitWithSave` para resetear `isExiting`
  - `throw error` en `RequestFormProvider` para manejo de errores
  - `SafeNavigationWrapper` verifica `showExitDialog` antes de interferir
  - **NUEVO**: `PhotoDocumentUpload` verifica `showExitDialog` antes de actualizar `formData`
  - **NUEVO**: Debounce de 100ms para evitar actualizaciones excesivas de `formData`
  - **NUEVO**: Cleanup de timeout para prevenir memory leaks
  - Estado de carga se resetea siempre, independientemente del resultado
  - Botones se re-habilitan correctamente en caso de error
  - Navegación de salida funciona correctamente sin interferencia de documentos
- [x] **Script de testing**: `verify-document-interference-fix.sh`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 1-2 horas
- **Tiempo real**: 1.5 horas

---

## 🐛 **BUG-276: Error al subir archivos con opción "subir"**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
Al intentar cargar una foto con la opción "subir" y seleccionar una imagen se muestra un error y no se sube. El toast muestra el mensaje "error al subir el archivo: no se pudo cargar el documento: failed to write blobs (invalidblob)".

### **🎯 Comportamiento Esperado**
- **Subida exitosa**: El archivo debe subirse correctamente
- **Sin errores**: No debe aparecer el error "failed to write blobs (invalidblob)"
- **Persistencia**: El archivo debe persistir al navegar entre pasos
- **Funcionalidad completa**: Debe funcionar tanto para imágenes como PDFs

### **❌ Comportamiento Actual**
- **Error de subida**: Aparece error "failed to write blobs (invalidblob)"
- **Archivo no se sube**: El archivo no se carga en la aplicación
- **Sin persistencia**: El archivo no persiste al navegar
- **Funcionalidad rota**: No se puede subir ningún archivo

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de almacenamiento de archivos
- **Archivos involucrados**: 
  - `src/hooks/useDocumentManager.tsx` (almacenamiento en localforage)
  - `src/hooks/useNetworkSync.tsx` (procesamiento de cola offline)
- **Causa probable**: 
  - **Problema de serialización**: Los blobs no se serializan correctamente en localforage
  - **Blobs corruptos**: Los blobs almacenados se corrompen durante la serialización
  - **Error en cola offline**: Cuando se procesa la cola offline, los blobs están corruptos
  - **Incompatibilidad**: localforage no maneja bien los objetos Blob directamente

### **🧪 Script de Testing**
```javascript
// scripts/test-blob-upload-fix.js
// Script para probar la subida de archivos sin errores
```

### **💡 Solución Propuesta**
- [x] Convertir `File` a `ArrayBuffer` antes de almacenar en localforage
- [x] Convertir `ArrayBuffer` a `Blob` para Supabase Storage
- [x] Convertir `ArrayBuffer` a `File` para restauración
- [x] Validar integridad de archivos antes de subir
- [x] Implementar manejo robusto de conversiones
- [x] Crear script de testing para validación

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/hooks/useDocumentManager.tsx` - Conversión File ↔ ArrayBuffer
  - `src/hooks/useNetworkSync.tsx` - Conversión ArrayBuffer ↔ Blob
- [x] **Cambios realizados**:
  - **NUEVO**: `const arrayBuffer = await file.arrayBuffer()` antes de almacenar
  - **NUEVO**: `await localforage.setItem(blobKey, arrayBuffer)` en lugar de File/Blob
  - **NUEVO**: `restoredArrayBuffer instanceof ArrayBuffer` para validación
  - **NUEVO**: `new Blob([restoredArrayBuffer], { type: ... })` para conversión
  - **NUEVO**: `new File([blob], fileName, { type: ... })` para restauración
  - **NUEVO**: `new Blob([arrayBuffer], { type: 'application/octet-stream' })` para Supabase
  - Eliminado uso directo de Blob/File en localforage
  - Manejo robusto de conversiones en ambos hooks
  - Validación de tipos antes de conversión
- [x] **Script de testing**: `verify-blob-upload-fix.sh`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 1-2 horas
- **Tiempo real**: 1 hora

---

## 🐛 **BUG-264: Campo de teléfono en referencias permite caracteres especiales**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
El campo de teléfono en el formulario para agregar referencias personales está permitiendo caracteres especiales, letras y espacios. Debería restringirse únicamente a números para mantener consistencia con otros campos de teléfono en la aplicación.

### **🎯 Comportamiento Esperado**
- **Solo números**: El campo debe aceptar únicamente dígitos (0-9)
- **Formateo automático**: Aplicar formato 0000 0000 automáticamente
- **Validación en tiempo real**: Mostrar error si el formato es incorrecto
- **Límite de caracteres**: Máximo 8 dígitos
- **Teclado numérico**: En dispositivos móviles debe mostrar teclado numérico
- **Consistencia**: Mismo comportamiento que otros campos de teléfono

### **❌ Comportamiento Actual**
- **Caracteres especiales permitidos**: Acepta guiones, espacios, símbolos
- **Letras permitidas**: Acepta letras del alfabeto
- **Sin validación**: No valida el formato en tiempo real
- **Sin formateo**: No aplica formato automático
- **Inconsistente**: Diferente comportamiento que otros campos de teléfono

### **🔍 Análisis del Problema**
- **Componente afectado**: Campo de teléfono en formulario de referencias
- **Archivos involucrados**: 
  - `src/components/requestForm/references/ReferenceBasicInfo.tsx` (campo de teléfono)
  - `src/utils/formatters.ts` (funciones de formateo y validación)
- **Causa probable**: 
  - Campo usaba `pattern="[0-9\-\s]*"` que permitía guiones y espacios
  - No usaba funciones de formateo existentes (`formatPhone`, `validatePhoneFormat`)
  - Falta de restricciones de entrada (`inputMode="numeric"`, `type="tel"`)
  - Sin validación visual en tiempo real

### **🧪 Script de Testing**
```javascript
// scripts/test-phone-field-restriction.js
// Script para probar restricciones del campo de teléfono
```

### **💡 Solución Propuesta**
- [x] Importar funciones `formatPhone` y `validatePhoneFormat` existentes
- [x] Implementar función `handlePhoneChange` para formateo automático
- [x] Cambiar `type="tel"` y `inputMode="numeric"` para restricción
- [x] Agregar `maxLength={9}` para límite de caracteres
- [x] Eliminar `pattern="[0-9\-\s]*"` problemático
- [x] Implementar validación visual con borde rojo
- [x] Agregar mensaje de error informativo
- [x] Crear script de testing para validación

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/requestForm/references/ReferenceBasicInfo.tsx` - Campo de teléfono corregido
- [x] **Cambios realizados**:
  - **NUEVO**: Importación de `formatPhone` y `validatePhoneFormat`
  - **NUEVO**: Función `handlePhoneChange` para formateo automático
  - **NUEVO**: `type="tel"` y `inputMode="numeric"` para restricción
  - **NUEVO**: `maxLength={9}` para límite de caracteres
  - **NUEVO**: `handlePhoneChange(e.target.value)` para manejo de cambios
  - **ELIMINADO**: `pattern="[0-9\-\s]*"` problemático
  - **NUEVO**: Validación visual con borde rojo para formato incorrecto
  - **NUEVO**: Mensaje de error "Formato: 0000 0000 (8 dígitos)"
  - **NUEVO**: Placeholder actualizado a "0000 0000"
  - **NUEVO**: Consistencia con otros campos de teléfono en la aplicación
- [x] **Script de testing**: `verify-phone-field-restriction-fix.sh`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Media
- **Complejidad**: Baja
- **Tiempo estimado**: 30 minutos
- **Tiempo real**: 30 minutos

---

## 🐛 **BUG-277: Problemas de Dark Mode y UX en Geolocalización**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
Cuando se captura con éxito la localización, algunos componentes no son aptos para dark mode: los inputs de latitud y longitud son claros, el texto no se ve y el background del componente que dice "Precisión Xm" no es apto para dark mode. Además, hay problemas de UX: el texto "GPS Impreciso" debe eliminarse, el título "Captura - Intento X de X" se muestra 2 veces, no hay indicador visual al recapturar, y la precisión siempre es 35m sin posibilidad de mejora.

### **🎯 Comportamiento Esperado**
- **Dark Mode completo**: Todos los componentes adaptados a dark mode
- **Solo distancia**: Mostrar únicamente la distancia aproximada (sin badges GPS)
- **Título único**: "Captura - Intento X de X" solo una vez
- **Feedback visual**: Loader en botón de recaptura
- **Mayor precisión**: Posibilidad de obtener mejor precisión que 35m

### **❌ Comportamiento Actual**
- **Dark Mode incompleto**: Inputs y textos no adaptados a dark mode
- **Badge GPS innecesario**: Muestra "GPS Impreciso" o "GPS Preciso"
- **Título duplicado**: "Captura - Intento X de X" aparece 2 veces
- **Sin feedback**: No hay indicador visual al recapturar
- **Precisión limitada**: Siempre muestra 35m de precisión

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de geolocalización
- **Archivos involucrados**: 
  - `src/components/requestForm/CoordinateDisplay.tsx` (dark mode, badge GPS)
  - `src/components/requestForm/GeolocationCapture.tsx` (título duplicado, loader, precisión)
- **Causa probable**: 
  - Falta de clases dark mode en inputs y textos
  - Badge GPS innecesario y confuso
  - Título mostrado en botón y indicador de progreso
  - Botón de recaptura sin loader
  - Parámetros GPS conservadores (20m objetivo, 10s timeout)

### **🧪 Script de Testing**
```bash
# scripts/verify-geolocation-darkmode-ux-fix.sh
# Script para verificar correcciones de dark mode y UX
```

### **💡 Solución Propuesta**
- [x] Adaptar inputs de coordenadas a dark mode (`bg-muted text-foreground`)
- [x] Adaptar labels a dark mode (`text-muted-foreground`)
- [x] Adaptar sección de precisión a dark mode (`dark:bg-blue-950/20`)
- [x] Eliminar badge GPS completamente
- [x] Eliminar función `getAccuracyStatus`
- [x] Eliminar título duplicado del botón
- [x] Agregar loader al botón de recaptura
- [x] Mejorar precisión GPS (10m objetivo vs 20m anterior)
- [x] Aumentar timeout (15s vs 10s anterior)
- [x] Limpiar imports innecesarios

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/requestForm/CoordinateDisplay.tsx` - Dark mode completo, badge GPS eliminado
  - `src/components/requestForm/GeolocationCapture.tsx` - Título duplicado eliminado, loader agregado, precisión mejorada
- [x] **Cambios realizados**:
  - **Dark Mode**: Inputs usan `bg-muted text-foreground`, labels usan `text-muted-foreground`
  - **Sección de precisión**: `dark:bg-blue-950/20`, `dark:border-blue-800`, `dark:text-blue-300`
  - **Badge GPS**: Eliminado completamente, solo muestra distancia (ej: "35m")
  - **Función getAccuracyStatus**: Eliminada completamente
  - **Título duplicado**: Eliminado del botón, solo en indicador de progreso
  - **Loader de recaptura**: Agregado con texto "Recapturando..." y spinner
  - **Precisión mejorada**: Objetivo de 10m (vs 20m anterior)
  - **Timeout aumentado**: 15 segundos (vs 10s anterior)
  - **Imports limpios**: Badge y Target eliminados
- [x] **Script de testing**: `verify-geolocation-darkmode-ux-fix.sh`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Media
- **Complejidad**: Media
- **Tiempo estimado**: 1-2 horas
- **Tiempo real**: 1 hora

---

## 📈 **Estadísticas de Bugs**

- **Total de bugs reportados**: 20
- **En análisis**: 0
- **En desarrollo**: 0
- **Resueltos**: 20
- **Rechazados**: 0

---

## 📝 **Notas de Desarrollo**

### **Metodología de Resolución**
1. **Análisis**: Reproducir el bug y entender la causa raíz
2. **Testing**: Crear script para validar el comportamiento
3. **Propuesta**: Documentar solución antes de implementar
4. **Autorización**: Esperar aprobación del usuario
5. **Implementación**: Aplicar la corrección
6. **Validación**: Verificar que el bug esté resuelto

---

## 🐛 **BUG-275: Diálogo de salida se queda en estado de carga**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
En la pantalla de documentos, después de subir un documento o imagen, cuando se intenta "Salir sin guardar" no sucede nada, y cuando se intenta "Guardar y salir" se queda en estado de carga, los botones se deshabilitan y no se puede volver a intentar salir. El botón de "Guardar y salir" cambia al texto "guardando..." y no sucede nada.

### **🎯 Comportamiento Esperado**
- **Salir sin guardar**: El botón debe permitir salir de la solicitud sin guardar cambios
- **Guardar y salir**: El botón debe guardar y salir correctamente
- **Sin estado de carga infinito**: Los botones deben re-habilitarse si hay error
- **Navegación funcional**: El usuario debe poder salir de la solicitud

### **❌ Comportamiento Actual**
- **"Salir sin guardar" no funciona**: No pasa nada al presionar el botón
- **"Guardar y salir" se queda cargando**: Estado de carga infinito
- **Botones deshabilitados**: No se pueden volver a presionar
- **Sin navegación**: No sale de la pantalla de documentos

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de navegación y diálogos de salida
- **Archivos involucrados**: 
  - `src/components/requestForm/ExitDialog.tsx` (estado de carga)
  - `src/components/requestForm/RequestFormProvider.tsx` (manejo de errores)
  - `src/components/requestForm/SafeNavigationWrapper.tsx` (interferencia de navegación)
  - `src/components/requestForm/PhotoDocumentUpload.tsx` (interferencia con formData)
- **Causa probable**: 
  - `isExiting` no se resetea correctamente en caso de error
  - Errores de `saveDraftMutation` no se re-lanzan para manejo en `ExitDialog`
  - Estado de carga no se limpia en el `finally` block
  - `SafeNavigationWrapper` interfiere con la navegación normal
  - **NUEVA CAUSA**: `PhotoDocumentUpload` actualiza `formData` durante subida de documentos, causando re-renders que interfieren con el diálogo de salida

### **🧪 Script de Testing**
```javascript
// scripts/test-exit-dialog-loading-fix.js
// Script para probar el estado de carga del diálogo de salida
```

### **💡 Solución Propuesta**
- [x] Agregar `finally` block en `handleExitWithSave` para resetear `isExiting`
- [x] Modificar `RequestFormProvider` para re-lanzar errores de `saveDraftMutation`
- [x] Modificar `SafeNavigationWrapper` para no interferir cuando `showExitDialog` está activo
- [x] **NUEVA SOLUCIÓN**: Modificar `PhotoDocumentUpload` para no actualizar `formData` cuando `showExitDialog` está activo
- [x] Agregar debounce para evitar actualizaciones excesivas de `formData`
- [x] Asegurar que el estado de carga se resetee siempre
- [x] Crear script de testing para validación

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/requestForm/ExitDialog.tsx` - `finally` block agregado
  - `src/components/requestForm/RequestFormProvider.tsx` - Re-lanzamiento de errores
  - `src/components/requestForm/SafeNavigationWrapper.tsx` - No interferir con diálogo
  - `src/components/requestForm/PhotoDocumentUpload.tsx` - No actualizar formData durante diálogo
- [x] **Cambios realizados**:
  - `finally` block en `handleExitWithSave` para resetear `isExiting`
  - `throw error` en `RequestFormProvider` para manejo de errores
  - `SafeNavigationWrapper` verifica `showExitDialog` antes de interferir
  - **NUEVO**: `PhotoDocumentUpload` verifica `showExitDialog` antes de actualizar `formData`
  - **NUEVO**: Debounce de 100ms para evitar actualizaciones excesivas de `formData`
  - **NUEVO**: Cleanup de timeout para prevenir memory leaks
  - Estado de carga se resetea siempre, independientemente del resultado
  - Botones se re-habilitan correctamente en caso de error
  - Navegación de salida funciona correctamente sin interferencia de documentos
- [x] **Script de testing**: `verify-document-interference-fix.sh`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 1-2 horas
- **Tiempo real**: 1.5 horas

---

## 🐛 **BUG-278: Persistencia de documentos no funciona al navegar entre secciones**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
Al subir documentos en la sección de documentos de una solicitud, los archivos se cargan correctamente pero al navegar a otra sección y regresar, las cards de documentos aparecen vacías. El mismo comportamiento ocurre al guardar la solicitud y re-entrar - los documentos no persisten.

### **🎯 Comportamiento Esperado**
- **Persistencia entre navegación**: Los documentos deberían persistir al navegar entre secciones
- **Persistencia al guardar**: Los documentos deberían persistir al guardar la solicitud y re-entrar
- **Restauración correcta**: Los documentos deberían mostrarse con su estado y archivos correctos
- **Sincronización bidireccional**: Los documentos deberían sincronizarse correctamente con formData

### **❌ Comportamiento Actual**
- **Pérdida al navegar**: Los documentos desaparecen al navegar entre secciones
- **Pérdida al guardar**: Los documentos no persisten al guardar y re-entrar
- **Cards vacías**: Las cards de documentos aparecen vacías sin los archivos subidos
- **Sin restauración**: Los archivos no se restauran desde el almacenamiento local

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de gestión de documentos
- **Archivos involucrados**: 
  - `src/components/requestForm/PhotoDocumentUpload.tsx` (inicialización incorrecta)
  - `src/hooks/useDocumentManager.tsx` (gestión de estado)
- **Causa probable**: 
  - `useDocumentManager()` se llamaba sin parámetros, inicializando siempre con estado vacío
  - Al navegar entre secciones, el componente se desmonta y vuelve a montar
  - La inicialización incorrecta causa que los documentos se pierdan en cada montaje
  - `initializeFromFormData` se ejecuta después del renderizado inicial con documentos vacíos

### **🧪 Script de Testing**
```bash
# scripts/verify-document-persistence-fix.sh
# Script para verificar la corrección de persistencia de documentos
```

### **💡 Solución Propuesta**
- [x] Modificar llamada a `useDocumentManager()` para usar `guatemalanDocuments` como parámetro inicial
- [x] Asegurar que la inicialización sea consistente en cada montaje del componente
- [x] Mantener la funcionalidad existente de `initializeFromFormData`
- [x] Preservar la sincronización bidireccional con `formData`
- [x] Mantener el debounce y verificación de `showExitDialog`
- [x] Crear script de testing para validación

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/requestForm/PhotoDocumentUpload.tsx` - Llamada a useDocumentManager corregida
- [x] **Cambios realizados**:
  - **NUEVO**: `useDocumentManager(guatemalanDocuments)` en lugar de `useDocumentManager()`
  - **PRESERVADO**: `initializeFromFormData` sigue funcionando para restaurar archivos desde localforage
  - **PRESERVADO**: Sincronización bidireccional con `formData` mantenida
  - **PRESERVADO**: Debounce de 100ms y verificación de `showExitDialog` mantenidos
  - **PRESERVADO**: Conversión ArrayBuffer a File para restauración desde localforage
  - **PRESERVADO**: Manejo robusto de errores y logging detallado
- [x] **Script de testing**: `verify-document-persistence-fix.sh`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 1-2 horas
- **Tiempo real**: 30 minutos

---

## 🐛 **BUG-279: Persistencia de documentos no funciona al salir y regresar a solicitud**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
La persistencia de documentos funciona correctamente al navegar entre secciones dentro de una solicitud, pero no funciona al salir completamente de la solicitud y regresar. Los documentos se pierden al re-entrar a la solicitud desde la lista de aplicaciones.

### **🎯 Comportamiento Esperado**
- **Persistencia completa**: Los documentos deberían persistir al salir y regresar a la solicitud
- **Restauración correcta**: Los documentos deberían mostrarse con su estado y archivos correctos
- **Consistencia**: Mismo comportamiento que la persistencia entre secciones
- **Sincronización**: Los documentos deberían sincronizarse correctamente con formData

### **❌ Comportamiento Actual**
- **Pérdida al salir**: Los documentos desaparecen al salir completamente de la solicitud
- **Sin restauración**: Los documentos no se restauran al re-entrar desde la lista
- **Cards vacías**: Las cards de documentos aparecen vacías sin los archivos subidos previamente
- **Inconsistencia**: Diferente comportamiento que la persistencia entre secciones

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de gestión de documentos
- **Archivos involucrados**: 
  - `src/hooks/useDocumentManager.tsx` (dependencias de initializeFromFormData)
  - `src/components/requestForm/PhotoDocumentUpload.tsx` (timing de inicialización)
- **Causa probable**: 
  - **Problema de timing**: `initializeFromFormData` depende de `documents` en las dependencias del `useCallback`
  - **Estado vacío**: Cuando se llama por primera vez, `documents` aún es `guatemalanDocuments` vacío
  - **Restauración fallida**: `initializeFromFormData` no puede restaurar documentos porque `documents` está vacío
  - **Dependencia circular**: La función depende del estado que debe actualizar

### **🧪 Script de Testing**
```bash
# scripts/verify-document-persistence-exit-fix.sh
# Script para verificar la corrección de persistencia al salir y regresar
```

### **💡 Solución Propuesta**
- [x] Modificar dependencias de `initializeFromFormData` en `useDocumentManager.tsx`
- [x] Eliminar `documents` de las dependencias del `useCallback`
- [x] Mantener solo `toast` como dependencia
- [x] Permitir que la función funcione independientemente del estado actual de `documents`
- [x] Crear script de testing para validación

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/hooks/useDocumentManager.tsx` - Dependencias de initializeFromFormData corregidas
- [x] **Cambios realizados**:
  - **NUEVO**: Dependencias cambiadas de `[documents, toast]` a `[toast]`
  - **PRESERVADO**: Funcionalidad completa de restauración desde localforage
  - **PRESERVADO**: Conversión ArrayBuffer a File para restauración
  - **PRESERVADO**: Manejo robusto de errores y logging detallado
  - **PRESERVADO**: Sincronización bidireccional con formData
  - **PRESERVADO**: Debounce y verificación de showExitDialog
  - **PRESERVADO**: Carga de draft_data desde Supabase
  - **PRESERVADO**: Preservación de applicationId al cargar draft
- [x] **Script de testing**: `verify-document-persistence-exit-fix.sh`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 1-2 horas
- **Tiempo real**: 30 minutos

## BUG-280: Acceso rápido a referencias no funciona en ApplicationDetails

**Descripción:** Al hacer click en la mini card de "Referencias Personales" en la pantalla de detalles de solicitud, no navega a la sección de referencias en el formulario.

**Análisis:** El problema estaba en el `sectionToStepMap` en `src/pages/ApplicationDetails.tsx`. El mapeo tenía `'guarantors': 3` en lugar de `'references': 3`, lo que causaba que el acceso rápido a referencias no funcionara correctamente.

**Solución Propuesta:** Corregir el mapeo de secciones en `src/pages/ApplicationDetails.tsx` cambiando `'guarantors': 3` por `'references': 3`.

**Solución Implementada:** 
- Modificado `src/pages/ApplicationDetails.tsx` línea 132: cambiado `'guarantors': 3` por `'references': 3`
- Verificado que todos los accesos rápidos estén mapeados correctamente:
  - `'identification': 0` ✅
  - `'credit': 1` ✅
  - `'finances': 2` ✅
  - `'references': 3` ✅ (corregido)
  - `'documents': 4` ✅
  - `'review': 5` ✅

**Validación:** Script `verify-quick-access-navigation.sh` ejecutado exitosamente, confirmando que todos los accesos rápidos funcionan correctamente.

**Estado:** ✅ RESUELTO

## BUG-267: Error de sesión expirada al guardar borrador sin internet

**Descripción:** Al intentar guardar un formulario sin tener internet en el dispositivo, muestra un error "error al guardar el borrador, sesión expirada, por favor inicia sesión nuevamente" en lugar de guardar offline correctamente.

**Análisis:** El problema estaba en `src/hooks/useDraftActions.tsx`. Aunque el código detectaba correctamente si estaba offline y debería retornar temprano, había una verificación de sesión (líneas 172-181) que llamaba a `supabase.auth.getUser()` **incluso cuando estaba offline**. Esta verificación requiere conexión a internet y cuando falla, lanza el error "Sesión expirada".

**Solución Propuesta:** Mover la verificación de sesión **antes** del bloque offline para que solo se ejecute cuando hay conexión a internet.

**Solución Implementada:** 
- Modificado `src/hooks/useDraftActions.tsx`:
  - Agregado `useOfflineStorage` hook para acceder a `isOffline`
  - Movida la verificación de sesión después del bloque offline (líneas 102-117)
  - Agregado return temprano para offline sin verificación de sesión
  - Agregado comentario explicativo "no need to verify session" para offline

**Flujo Corregido:**
1. 📱 Usuario autenticado localmente
2. 💾 Datos guardados offline inmediatamente
3. 🔍 Si está offline: se encola y retorna éxito (sin verificación de sesión)
4. 🌐 Si está online: verifica sesión y guarda en Supabase

**Validación:** Script `verify-offline-draft-save-fix.sh` ejecutado exitosamente, confirmando que:
- ✅ Verificación de sesión solo ocurre cuando está online
- ✅ Return temprano para offline implementado
- ✅ No hay verificación de sesión antes del bloque offline
- ✅ Guardado offline inmediato funciona correctamente

**Estado:** ✅ RESUELTO

## BUG-281: Mitigación de vulnerabilidad "Debug habilitado para la aplicación [android:debuggable=true]"

**Descripción:** Vulnerabilidad de seguridad crítica en aplicaciones Android de producción donde el flag `android:debuggable=true` permite a atacantes debuggear la aplicación, acceder a información sensible y modificar el comportamiento en tiempo de ejecución.

**Análisis:** La vulnerabilidad ocurre cuando la aplicación Android se compila con el flag de debug habilitado. Esto permite que atacantes puedan:
- Debuggear la aplicación usando herramientas como `adb`
- Acceder a información sensible almacenada en memoria
- Modificar el comportamiento de la aplicación en tiempo de ejecución
- Extraer datos de la aplicación sin autorización

**Solución Propuesta:** Configurar `debuggable=false` explícitamente en el build de release y agregar configuraciones de seguridad adicionales.

**Solución Implementada:** 
- Modificado `android/app/build.gradle`:
  - Agregado `debuggable false` en build de release
  - Agregado `debuggable true` en build de debug (para desarrollo)
  - Agregado `buildConfigField "boolean", "DEBUG_MODE", "false"` en release
  - Agregado `buildConfigField "boolean", "ENABLE_LOGGING", "false"` en release
- Modificado `android/app/src/main/AndroidManifest.xml`:
  - Agregado `android:extractNativeLibs="false"` (previene extracción de librerías nativas)
  - Agregado `android:usesCleartextTraffic="false"` (previene tráfico HTTP no cifrado)

**Configuraciones de Seguridad Agregadas:**
- ✅ `debuggable=false` en build de release
- ✅ `debuggable=true` en build de debug (para desarrollo)
- ✅ `extractNativeLibs=false` (previene extracción de librerías nativas)
- ✅ `usesCleartextTraffic=false` (previene tráfico HTTP no cifrado)
- ✅ `DEBUG_MODE=false` en release
- ✅ `ENABLE_LOGGING=false` en release
- ✅ ProGuard configurado para ofuscación

**Validación:** Script `verify-debug-vulnerability-fix.sh` ejecutado exitosamente, confirmando que:
- ✅ Debug deshabilitado en producción
- ✅ Configuraciones de seguridad implementadas
- ✅ Vulnerabilidades adicionales mitigadas

**Estado:** ✅ RESUELTO

---

*Última actualización: 2025-01-23*
*Documento creado por: Dev Team*
