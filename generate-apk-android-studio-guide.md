# 📱 Guía para Generar APK en Android Studio

## ✅ Pasos Completados
1. ✅ **Assets web construidos** - `npm run build` ejecutado exitosamente
2. ✅ **Sincronización con Capacitor** - `npx cap sync android` completada
3. ✅ **Android Studio abierto** - Proyecto cargado en Android Studio

## 🚀 Pasos para Generar APK en Android Studio

### Paso 1: Verificar Configuración del Proyecto
- En Android Studio, verifica que el proyecto se haya cargado correctamente
- Asegúrate de que no haya errores de compilación en la pestaña "Build"

### Paso 2: Seleccionar Variante de Build
1. En la barra de herramientas, busca el dropdown que dice "app"
2. Selecciona **"app"** como el módulo a construir
3. En el dropdown de variantes, selecciona **"debug"** o **"release"**

### Paso 3: Generar APK
**Opción A: Desde el menú Build**
1. Ve a **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Espera a que termine la compilación

**Opción B: Desde la barra de herramientas**
1. Haz clic en el ícono de **Build** (🔨) en la barra de herramientas
2. O usa el atajo de teclado: **Ctrl+Shift+A** (Windows/Linux) o **Cmd+Shift+A** (Mac)

### Paso 4: Localizar el APK Generado
Una vez completada la compilación:
1. Android Studio mostrará una notificación: **"APK(s) generated successfully"**
2. Haz clic en **"locate"** en la notificación
3. O navega manualmente a: `android/app/build/outputs/apk/debug/`

### Paso 5: Instalar el APK (Opcional)
1. Conecta tu dispositivo Android via USB
2. Habilita **"Opciones de desarrollador"** y **"Depuración USB"**
3. En Android Studio, haz clic en **Run** (▶️) para instalar y ejecutar

## 🔧 Solución de Problemas Comunes

### Error: "Gradle sync failed"
- Ve a **File** → **Sync Project with Gradle Files**
- O haz clic en el ícono de sincronización en la barra de herramientas

### Error: "SDK not found"
- Ve a **File** → **Project Structure** → **SDK Location**
- Verifica que la ruta del Android SDK sea correcta

### Error: "Build failed"
- Revisa la pestaña **"Build"** en la parte inferior de Android Studio
- Busca errores específicos y corrígelos

## 📁 Ubicación del APK
El APK se generará en:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## 🎯 Notas Importantes
- **Debug APK**: Para pruebas y desarrollo (más grande, incluye información de debug)
- **Release APK**: Para distribución (más pequeño, optimizado)
- El APK incluye todos los assets web sincronizados
- Los plugins de Capacitor están configurados correctamente

## ✅ Verificación Final
Una vez generado el APK:
1. Verifica que el archivo `app-debug.apk` existe
2. El tamaño debería ser aproximadamente 15-25 MB
3. Puedes instalar el APK en un dispositivo Android para probarlo

---
**Fecha de generación**: $(date)
**Proyecto**: Coopsama Android App
**Estado**: Listo para compilación
