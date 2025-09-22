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
| BUG-236 | 2025-01-09 | Campo Monto Solicitado sin formato monetario | 🔍 Analizando | Alta | Dev Team |

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

## 📈 **Estadísticas de Bugs**

- **Total de bugs reportados**: 10
- **En análisis**: 0
- **En desarrollo**: 0
- **Resueltos**: 10
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

*Última actualización: 2025-01-09*
*Documento creado por: Dev Team*
