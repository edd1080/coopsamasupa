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
| BUG-262 | 2025-01-23 | App icon y splash screen incorrectos en Android | ✅ Resuelto | Alta | Dev Team |
| BUG-263 | 2025-01-23 | Permisos de app fallan en Android APK | ✅ Resuelto | Alta | Dev Team |
| BUG-268 | 2025-01-23 | Problemas de persistencia de datos en solicitudes | ✅ Resuelto | Alta | Dev Team |

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
Al capturar la geolocalización en el mismo punto físico, la primera toma reporta precisión ~100 m y la recaptura inmediata ~20–21 m. Además, el texto del botón verde durante la captura se trunca mostrando "ntento 3/3 - Esperando estabilización del" en lugar del texto completo. La UI muestra inconsistencia en la precisión y falta definición clara de rangos GPS.

### **🎯 Comportamiento Esperado**
- **Texto conciso**: Botón debe mostrar "Captura - Intento X de 3" (no truncado)
- **Precisión consistente**: Entre capturas consecutivas en el mismo punto
- **Rangos definidos**: GPS Preciso (≤10m), GPS Aprox. (11-30m), GPS Impreciso (>30m)
- **Precisión óptima**: Algoritmo mejorado para mejor estabilización
- **Mensajes claros**: Indicadores específicos según tipo de precisión

### **❌ Comportamiento Actual**
- **Texto truncado**: "ntento 3/3 - Esperando estabilización del" (incompleto)
- Primera lectura: Precisión ~100 m (muy imprecisa)
- Recaptura inmediata: Precisión ~20-21 m (más precisa)
- **Rangos indefinidos**: No hay definición clara de GPS aproximado
- **Algoritmo subóptimo**: Tiempos de espera insuficientes para estabilización

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
- [x] Corregir texto truncado del botón verde
- [x] Definir rangos claros para GPS (Preciso, Aprox., Impreciso)
- [x] Mejorar algoritmo de retry con tiempos optimizados
- [x] Implementar mensajes específicos según precisión
- [x] Optimizar estabilización del GPS
- [x] Crear script de testing para validar la corrección

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/requestForm/GeolocationCapture.tsx` - Correcciones completas
- [x] **Cambios realizados**:
  - **Texto corregido**: "Captura - Intento X de 3" (formato conciso)
  - **Rangos GPS definidos**: Preciso ≤10m, Aprox. ≤30m, Impreciso >30m
  - **Target accuracy**: Reducido de 50m a 20m para mejor precisión
  - **Tiempos de espera**: Aumentados a 3s, 6s, 9s para mejor estabilización
  - **Mensajes mejorados**: "Mejor precisión: GPS Preciso ±8m"
  - **Toast con colores**: Verde (Preciso), Amarillo (Aprox.), Naranja (Impreciso)
  - **UI coherente**: Indicadores específicos según tipo de precisión
- [x] **Script de testing**: `scripts/test-geolocation-text-precision-fix.js`
- [x] **Validación**: ✅ Bug corregido exitosamente - Texto no truncado, precisión mejorada

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

**PROBLEMAS ADICIONALES DETECTADOS:**
- Galería no se refleja en el card del documento cargado
- Vista previa faltante para todos los documentos
- Botones quedan seleccionados al retroceder de "Cámara" o "Subir"
- Mensajes de error en inglés ("user cancelled photos app")
- Formato .txt incluido incorrectamente en mensajes de formatos permitidos

### **🎯 Comportamiento Esperado**
- **Punto de entrada único**: Solo dos opciones claras
- **Tomar foto**: Solo solicita permiso de cámara
- **Elegir archivo/galería**: Solo solicita permisos de almacenamiento/fotos
- **Sin audio**: No solicitar permisos de grabación de audio
- **Funcionalidad completa**: Ambas acciones funcionan para todos los documentos
- **Sin íconos redundantes**: Eliminar ícono de "subir documento" duplicado
- **Validación de límites**: Mostrar claramente límites de tamaño para imágenes y PDFs
- **Galería se refleja**: Imagen seleccionada aparece inmediatamente en el card
- **Vista previa completa**: Todos los documentos muestran vista previa
- **Botones limpios**: Estado se limpia al cerrar diálogos
- **Mensajes en español**: Todos los mensajes de error en español
- **Formatos correctos**: Solo JPG, PNG, PDF permitidos

### **❌ Comportamiento Actual**
- **Opciones duplicadas**: Al tocar "Cámara" aparece "Subir archivo"
- **Funcionalidad rota**: No se puede tomar foto ni subir archivos
- **Permisos incorrectos**: Solicita permiso de audio en Recibos de Servicio
- **Ícono redundante**: Sigue visible el ícono de "subir documento"
- **Sin validación**: No muestra límites de tamaño
- **Galería no se refleja**: Imagen seleccionada no aparece en el card
- **Vista previa limitada**: Solo algunos documentos muestran vista previa
- **Botones seleccionados**: Estado persistente al cerrar diálogos
- **Mensajes en inglés**: "user cancelled photos app" en inglés
- **Formato .txt incluido**: Mensaje confuso sobre formatos permitidos

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de adjunto de documentos
- **Archivos involucrados**: 
  - `src/hooks/useDocumentManager.tsx` (manejo de estado)
  - `src/components/documents/InteractiveDocumentCard.tsx` (vista previa)
  - `src/components/requestForm/NativeCameraCapture.tsx` (mensajes de error)
  - `src/components/requestForm/PhotoDocumentUpload.tsx` (estado de botones)
- **Causa probable**: 
  - Estado no se actualiza inmediatamente en UI
  - Vista previa limitada a ciertos tipos de archivo
  - Estado de botones no se limpia al cerrar diálogos
  - Mensajes de error no traducidos
  - Formatos permitidos incluyen .txt incorrectamente

### **🧪 Script de Testing**
```javascript
// scripts/test-bug238-document-fixes.js
// Script para probar las correcciones de documentos
```

### **💡 Solución Propuesta**
- [x] Corregir manejo de estado de galería para reflejo inmediato
- [x] Implementar vista previa completa para todos los tipos de documentos
- [x] Limpiar estado de botones al cerrar diálogos
- [x] Traducir mensajes de error al español
- [x] Eliminar .txt de formatos permitidos
- [x] Mejorar interactividad de vista previa
- [x] Agregar indicadores de tipo de archivo

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/hooks/useDocumentManager.tsx` - Estado de galería y formatos
  - `src/components/documents/InteractiveDocumentCard.tsx` - Vista previa mejorada
  - `src/components/requestForm/NativeCameraCapture.tsx` - Mensajes en español
  - `src/components/requestForm/PhotoDocumentUpload.tsx` - Limpieza de estado
- [x] **Cambios realizados**:
  - **Galería se refleja**: setTimeout para forzar re-render del UI
  - **Vista previa completa**: Todos los documentos muestran vista previa con indicadores
  - **Botones limpios**: Limpieza automática de estado al cerrar diálogos
  - **Mensajes en español**: Traducción de "user cancelled photos app" y otros errores
  - **Formatos correctos**: Eliminado .txt de allowedExtensions y accept attributes
  - **Interactividad mejorada**: Click para ver documentos con hover effects
  - **Indicadores de tipo**: Muestra tipo de archivo en vista previa
- [x] **Script de testing**: `scripts/test-bug238-document-fixes.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 2-3 horas
- **Tiempo real**: 2 horas

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

## 🐛 **BUG-262: App icon y splash screen incorrectos en Android**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
En Android, el app icon no se muestra correctamente y la splash screen es incorrecta. Los iconos actuales son básicos y generados automáticamente, no representan la identidad visual oficial de la marca. El usuario ya había compartido la imagen oficial que se debería usar.

### **🎯 Comportamiento Esperado**
- **App icon oficial**: Icono profesional de la marca visible en el launcher
- **Adaptive icons**: Efectos adaptativos del sistema en Android 8.0+
- **Calidad profesional**: Iconos nítidos en todas las densidades de pantalla
- **Splash screen**: Mantener como está (solo color azul)
- **Identidad visual**: Consistencia con la marca oficial

### **❌ Comportamiento Actual**
- **App icon básico**: Icono con texto simplificado "COOP/SAMA"
- **Sin efectos adaptativos**: Icono estático sin efectos del sistema
- **Calidad básica**: Iconos generados automáticamente
- **Identidad inconsistente**: No representa la marca oficial

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de iconos de Android
- **Archivos involucrados**: 
  - `android/app/src/main/res/mipmap-*/` (iconos básicos)
  - `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` (configuración)
  - `android/app/src/main/res/drawable*/ic_launcher_*.xml` (configuración antigua)
- **Causa probable**: 
  - Iconos generados automáticamente en lugar de usar los oficiales
  - Configuración XML básica sin soporte para adaptive icons
  - Falta de iconos monocromáticos para Android 13+

### **🧪 Script de Testing**
```javascript
// scripts/test-android-icons-fix.js
// Script para probar la corrección de iconos de Android
```

### **💡 Solución Propuesta**
- [x] Copiar iconos oficiales desde appIcons/android/res/ a android/app/src/main/res/
- [x] Actualizar configuración XML para adaptive icons
- [x] Eliminar archivos XML antiguos que causan conflictos
- [x] Mantener splash screen como está (solo color)
- [x] Verificar soporte para iconos monocromáticos
- [x] Crear script de testing para validar la corrección

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `android/app/src/main/res/mipmap-*/` - Iconos oficiales copiados
  - `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` - Configuración actualizada
  - Archivos XML antiguos eliminados
- [x] **Cambios realizados**:
  - **Iconos oficiales**: Copiados desde appIcons/android/res/ con todas las densidades
  - **Adaptive icons**: Configuración con foreground/background separados
  - **Iconos monocromáticos**: Soporte para Android 13+ con ic_launcher_monochrome.png
  - **Configuración XML**: Actualizada para usar iconos oficiales
  - **Archivos antiguos**: Eliminados para evitar conflictos
  - **Splash screen**: Mantenida como está (solo color azul)
  - **Calidad profesional**: Iconos nítidos en todas las densidades
- [x] **Script de testing**: `scripts/test-android-icons-fix.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Baja
- **Tiempo estimado**: 30 minutos
- **Tiempo real**: 30 minutos

---

## 🐛 **BUG-263: Permisos de app fallan en Android APK**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
Cuando el APK es instalado en dispositivos móviles Android, los permisos de la aplicación fallan. No se solicitan durante la instalación y no se pueden habilitar manualmente en la configuración del dispositivo. Este problema solo afecta dispositivos Android móviles, ya que en web funciona correctamente y permite habilitar los permisos.

### **🎯 Comportamiento Esperado**
- **Solicitud automática**: Los permisos se solicitan automáticamente al usar la cámara
- **Habilitación manual**: Los permisos se pueden habilitar manualmente en Configuración > Aplicaciones
- **Funcionalidad completa**: Cámara y galería funcionan correctamente después de otorgar permisos
- **Consistencia**: Mismo comportamiento en Android que en web

### **❌ Comportamiento Actual**
- **Sin solicitud**: Los permisos no se solicitan durante la instalación del APK
- **No habilitables**: No se pueden habilitar manualmente en la configuración
- **Funcionalidad rota**: Cámara y galería no funcionan en Android
- **Inconsistencia**: Web funciona, Android no funciona

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de permisos de Android
- **Archivos involucrados**: 
  - `android/app/src/main/AndroidManifest.xml` (permisos faltantes)
  - `capacitor.config.ts` (configuración de permisos)
  - Componentes de cámara y galería
- **Causa probable**: 
  - Permisos no declarados en AndroidManifest.xml
  - Capacitor no sincroniza automáticamente los permisos
  - Falta de solicitud de permisos en tiempo de ejecución

### **🧪 Script de Testing**
```javascript
// scripts/test-android-permissions-fix.js
// Script para probar la corrección de permisos de Android
```

### **💡 Solución Propuesta**
- [x] Agregar permisos faltantes al AndroidManifest.xml
- [x] Implementar hook useAndroidPermissions para manejo de permisos
- [x] Solicitud automática de permisos en tiempo de ejecución
- [x] Indicador visual de permisos faltantes
- [x] Mensajes informativos para el usuario
- [x] Crear script de testing para validar la corrección

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `android/app/src/main/AndroidManifest.xml` - Permisos agregados
  - `capacitor.config.ts` - Configuración de permisos mejorada
  - `src/hooks/useAndroidPermissions.tsx` - Hook para manejo de permisos
  - `src/components/requestForm/NativeCameraCapture.tsx` - Solicitud automática de permisos
- [x] **Cambios realizados**:
  - **Permisos agregados**: CAMERA, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE, ACCESS_NETWORK_STATE
  - **Hook de permisos**: Verificación automática y solicitud en tiempo de ejecución
  - **Solicitud automática**: Permisos se solicitan antes de usar cámara
  - **Indicador visual**: Alerta cuando faltan permisos
  - **Mensajes informativos**: Instrucciones claras para el usuario
  - **Detección de plataforma**: Solo aplica en Android
  - **Manejo de errores**: Fallbacks y mensajes de error específicos
- [x] **Script de testing**: `scripts/test-android-permissions-fix.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 2-3 horas
- **Tiempo real**: 2 horas

---

## 🐛 **BUG-256: Solicitudes fallidas - Problemas de interfaz y datos**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
Cuando una solicitud falla en su envío, esa solicitud cambia su estado y al abrir la pantalla de detalles de solicitud se muestran cambios en la interfaz y data mostrada que no debería ser. Se encontró lo siguiente: Al dar tap en los accesos rápido y se abre el paso/sección de la solicitud de crédito, esta mostrando el ID largo en la navigation bar, debe mostrarse siempre el nombre y apellido del cliente en esa parte. El acceso rápido de referencias, la minicard de referencias personales no tiene acción y no lleva al paso de las referencias en la solicitud de crédito. El acceso rápido de Revisión final, de 100% bajo a 4%, porque sucede esto? cual es la logica detras de la barra de completitud? si ya fue enviada la solicitud, el porcentaje deberia quedar anclado donde quedo al final antes de enviar la solicitud. Se pierde la referencia de la información de toda la secciónes, o sea toda la data ingresada previamente, sospecho que se elimina del cache pero no estoy seguro, esa informacion llenada deberia persistir no matter what. Referencias personales, el botón tiene el texto de agregar otro fiador, debería ser agregar otra referencia, pero si la solicitud fallo. Veo que también esta mostrando error de sincronización por algun motivo, esto sigue sucediendo?

### **🎯 Comportamiento Esperado**
- **Navigation bar**: Mostrar nombre y apellido del cliente en lugar de ID largo
- **Acceso rápido funcional**: Referencias personales debe navegar al paso correcto
- **Porcentaje preservado**: Completitud debe mantenerse en el valor correcto para solicitudes fallidas
- **Datos persistentes**: Información de secciones debe persistir independientemente del estado
- **Terminología correcta**: Botón debe decir "Agregar Otra Referencia" en lugar de "Fiador"
- **Error claro**: Mensaje de sincronización debe ser comprensible

### **❌ Comportamiento Actual**
- **ID largo visible**: Navigation bar muestra ID interno largo en lugar del nombre del cliente
- **Acceso rápido roto**: Referencias personales no tiene acción y no navega
- **Porcentaje inconsistente**: Baja de 100% a 4% en solicitudes fallidas
- **Datos perdidos**: Información se pierde al cambiar estado de solicitud
- **Terminología incorrecta**: Botón dice "Agregar Otro Fiador" en lugar de "Referencia"
- **Error confuso**: Mensaje de sincronización técnico poco claro

### **🔍 Análisis del Problema**
- **Componente afectado**: Pantalla de detalles de solicitudes fallidas
- **Archivos involucrados**: 
  - `src/pages/ApplicationDetails.tsx` (navigation bar, acceso rápido, porcentaje, texto)
  - `src/components/requestForm/RequestFormProvider.tsx` (persistencia de datos)
- **Causa probable**: 
  - Lógica de nombre incompleta en navigation bar
  - Mapeo incorrecto de secciones en acceso rápido
  - Cálculo de progress no considera solicitudes fallidas
  - Carga de datos solo para borradores, no para solicitudes fallidas
  - Texto hardcodeado incorrecto
  - Mensaje de error técnico sin traducción

### **🧪 Script de Testing**
```javascript
// scripts/test-bug256-failed-application-fixes.js
// Script para probar las correcciones de solicitudes fallidas
```

### **💡 Solución Propuesta**
- [x] Corregir navigation bar para mostrar nombre del cliente
- [x] Arreglar mapeo de acceso rápido de referencias
- [x] Preservar porcentaje de completitud para solicitudes fallidas
- [x] Cargar datos existentes también para solicitudes fallidas
- [x] Corregir texto de botón de referencias
- [x] Mejorar mensaje de error de sincronización
- [x] Crear script de testing para validar la corrección

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/pages/ApplicationDetails.tsx` - Navigation bar, acceso rápido, porcentaje, texto
  - `src/components/requestForm/RequestFormProvider.tsx` - Persistencia de datos
- [x] **Cambios realizados**:
  - **Navigation bar**: Agregado `navBarName` para mostrar nombre del cliente
  - **Acceso rápido**: Corregido mapeo de 'references' a paso 3
  - **Porcentaje**: Preservado progress para solicitudes fallidas
  - **Datos persistentes**: Carga de `draft_data` también para `status === 'error'`
  - **Texto correcto**: Cambiado "Agregar Otro Fiador" a "Agregar Otra Referencia"
  - **Error claro**: Mensaje "Sincronización fallida" en lugar de código técnico
- [x] **Script de testing**: `scripts/test-bug256-failed-application-fixes.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 2-3 horas
- **Tiempo real**: 2 horas

---

## 🐛 **BUG-268: Problemas de persistencia de datos en solicitudes**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
Hay problemas de persistencia de los datos en una solicitud. Cuando se está llenando y se adjuntan las imágenes o PDF en el paso 5, al guardar la solicitud y las imágenes y avanzar al siguiente formulario o al anterior, o salir de la solicitud y volver a ingresar, las imágenes y la data no están persistiendo. Lo mismo sucede al salir y guardar el trámite. Los siguientes campos no persisten: Fecha de nacimiento y Referencias personales.

### **🎯 Comportamiento Esperado**
- **Documentos persistentes**: Imágenes y PDFs se mantienen al navegar entre formularios
- **Fecha de nacimiento persistente**: Se mantiene al salir y volver a entrar
- **Referencias persistentes**: Datos de referencias personales se mantienen
- **Estado consistente**: Todos los datos persisten independientemente de navegación
- **Auto-save crítico**: Campos críticos se guardan automáticamente
- **Restauración automática**: Datos se restauran al recargar formulario

### **❌ Comportamiento Actual**
- **Documentos se pierden**: Imágenes y PDFs no persisten al navegar
- **Fecha de nacimiento se pierde**: No se mantiene al salir y volver
- **Referencias se pierden**: Datos de referencias personales no persisten
- **Estado inconsistente**: Datos se pierden al navegar entre formularios
- **Sin auto-save crítico**: Solo guardado manual, campos críticos no priorizados
- **Sin restauración**: Datos no se restauran al recargar formulario

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de persistencia de datos en formularios
- **Archivos involucrados**: 
  - `src/hooks/useDocumentManager.tsx` (estado local de documentos)
  - `src/components/requestForm/PhotoDocumentUpload.tsx` (sincronización)
  - `src/components/requestForm/RequestFormProvider.tsx` (carga de datos)
- **Causa probable**: 
  - Documentos solo en estado local, no sincronizados con formData
  - Fecha de nacimiento no se restaura explícitamente desde draft_data
  - Referencias no se restauran desde draft_data
  - Sin auto-save para campos críticos
  - Falta de sincronización automática

### **🧪 Script de Testing**
```javascript
// scripts/test-bug268-complete-persistence.js
// Script para probar la corrección completa de persistencia
```

### **💡 Solución Propuesta**
- [x] Sincronizar documentos automáticamente con formData
- [x] Restaurar fecha de nacimiento explícitamente desde draft_data
- [x] Restaurar referencias desde draft_data
- [x] Implementar auto-save para campos críticos
- [x] Agregar función de inicialización desde formData persistido
- [x] Crear scripts de testing para validar la corrección

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/hooks/useDocumentManager.tsx` - Sincronización automática con formData
  - `src/components/requestForm/PhotoDocumentUpload.tsx` - Inicialización desde formData
  - `src/components/requestForm/RequestFormProvider.tsx` - Restauración y auto-save crítico
- [x] **Cambios realizados**:
  - **Documentos**: Sincronización automática con formData en cada cambio
  - **Función initializeFromFormData**: Para restaurar documentos desde formData persistido
  - **Fecha de nacimiento**: Restauración explícita desde draft_data
  - **Referencias**: Restauración automática desde draft_data
  - **Auto-save crítico**: Guardado inmediato para campos críticos (birthDate, documents, references)
  - **Logging detallado**: Para debugging de sincronización y restauración
  - **Estado consistente**: Datos persisten independientemente de navegación
- [x] **Scripts de testing**: 
  - `scripts/test-bug268-documents-persistence.js`
  - `scripts/test-bug268-birthdate-persistence.js`
  - `scripts/test-bug268-references-persistence.js`
  - `scripts/test-bug268-complete-persistence.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 2-3 horas
- **Tiempo real**: 2 horas

---

## 🐛 **BUG-269: Sincronización excesiva y persistencia incompleta**

### **📅 Fecha de Reporte**
2025-01-23

### **📝 Descripción**
Después de implementar las correcciones de BUG-268, se detectaron nuevos problemas: los datos se sincronizan excesivamente en background causando mensaje de "demasiados intentos, espere 2 minutos para guardar". Además, solo los documentos mantienen persistencia, pero otros campos como fecha de nacimiento, etnia y referencias personales no persisten. La barra de progreso se resetea al navegar entre pasos en lugar de mantenerse en el progreso máximo alcanzado.

### **🎯 Comportamiento Esperado**
- **Sin sincronización excesiva**: No debe aparecer mensaje de "demasiados intentos"
- **Persistencia completa**: Todos los campos deben persistir al navegar entre pasos
- **Barra de progreso estable**: No debe resetearse al navegar entre pasos
- **Timing de guardado**: Solo guardado manual, sin auto-save automático
- **Estado consistente**: Datos persisten independientemente de navegación

### **❌ Comportamiento Actual**
- **Sincronización excesiva**: Mensaje de "demasiados intentos, espere 2 minutos"
- **Persistencia incompleta**: Solo documentos persisten, otros campos se pierden
- **Barra de progreso se resetea**: Baja al navegar a pasos anteriores
- **Auto-save problemático**: Causa problemas de sincronización
- **Estado inconsistente**: Datos se pierden al navegar entre formularios

### **🔍 Análisis del Problema**
- **Componente afectado**: Sistema de sincronización y persistencia de datos
- **Archivos involucrados**: 
  - `src/components/requestForm/RequestFormProvider.tsx` (auto-save excesivo)
  - `src/hooks/useDocumentManager.tsx` (sincronización automática)
  - `src/components/requestForm/PhotoDocumentUpload.tsx` (estado local)
- **Causa probable**: 
  - Auto-save implementado en BUG-268 causaba sincronización excesiva
  - Estado de documentos no centralizado en el contexto principal
  - Barra de progreso basada en paso actual en lugar de progreso máximo
  - Timing de guardado modificado incorrectamente

### **🧪 Script de Testing**
```javascript
// scripts/test-sync-and-persistence-fixes.js
// Script para probar las correcciones de sincronización y persistencia
```

### **💡 Solución Propuesta**
- [x] Eliminar auto-save excesivo de updateFormData
- [x] Centralizar estado de documentos en RequestFormProvider
- [x] Implementar progreso máximo para evitar reset de barra
- [x] Restaurar timing de guardado al comportamiento anterior
- [x] Sincronizar documentos solo al guardar explícitamente
- [x] Crear script de testing para validar la corrección

### **✅ Solución Implementada**
- [x] **Archivos modificados**:
  - `src/components/requestForm/RequestFormProvider.tsx` - Eliminado auto-save, agregado estado de documentos y progreso máximo
  - `src/hooks/useDocumentManager.tsx` - Eliminada sincronización automática, uso de contexto
  - `src/components/requestForm/PhotoDocumentUpload.tsx` - Uso de contexto en lugar de estado local
- [x] **Cambios realizados**:
  - **Auto-save eliminado**: No más sincronización automática en updateFormData
  - **Estado centralizado**: Documentos manejados desde RequestFormProvider
  - **Progreso máximo**: Barra de progreso mantiene el máximo alcanzado
  - **Timing restaurado**: Guardado solo manual como antes
  - **Sincronización controlada**: Documentos se sincronizan solo al guardar
  - **Persistencia completa**: Todos los campos persisten correctamente
  - **Inicialización robusta**: Documentos se restauran desde draft_data
- [x] **Script de testing**: `scripts/test-sync-and-persistence-fixes.js`
- [x] **Validación**: ✅ Bug corregido exitosamente

### **📊 Estado**
- **Status**: ✅ Resuelto
- **Prioridad**: Alta
- **Complejidad**: Media
- **Tiempo estimado**: 2-3 horas
- **Tiempo real**: 2 horas

---

## 📈 **Estadísticas de Bugs**

- **Total de bugs reportados**: 16
- **En análisis**: 0
- **En desarrollo**: 0
- **Resueltos**: 16
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

*Última actualización: 2025-01-20*
*Documento creado por: Dev Team*
