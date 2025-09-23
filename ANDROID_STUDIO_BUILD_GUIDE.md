# 📱 Guía de Build Manual en Android Studio - Coopsama App

> **Instrucciones paso a paso para generar APK manualmente en Android Studio**

---

## ✅ **PROYECTO ACTUALIZADO Y LISTO**

El proyecto Android ha sido actualizado y sincronizado. Android Studio debería abrirse automáticamente con el proyecto cargado.

---

## 🚀 **PASOS PARA GENERAR APK EN ANDROID STUDIO**

### **1. Verificar que el Proyecto se Cargó Correctamente**
- ✅ Android Studio debería mostrar el proyecto `coopsama` en el panel izquierdo
- ✅ Deberías ver la estructura: `android > app > src > main`
- ✅ El proyecto debería compilar sin errores

### **2. Configurar Build Variants (Opcional)**
1. En la barra superior, busca **"Build Variants"**
2. Asegúrate de que esté seleccionado:
   - **Module**: `app`
   - **Active Build Variant**: `debug` (para APK de prueba) o `release` (para APK final)

### **3. Generar APK Debug (Recomendado para pruebas)**

#### **Opción A: Desde el Menú**
1. Ve a **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Android Studio comenzará a compilar
3. Espera a que aparezca la notificación **"APK(s) generated successfully"**

#### **Opción B: Desde la Barra de Herramientas**
1. Busca el ícono de **"Build"** (martillo) en la barra superior
2. Haz clic en **"Build APK"**
3. Espera a que termine la compilación

### **4. Generar APK Release (Para distribución)**

#### **Configuración de Firma (Solo para Release)**
1. Ve a **Build** → **Generate Signed Bundle / APK**
2. Selecciona **"APK"**
3. Crea un nuevo keystore o usa uno existente:
   - **Key store path**: Crea un nuevo archivo `.jks`
   - **Password**: Crea una contraseña segura
   - **Key alias**: `coopsama-key`
   - **Key password**: Misma contraseña o diferente
4. Sigue el asistente para crear el keystore
5. Selecciona **"release"** como build variant
6. Haz clic en **"Finish"**

### **5. Ubicación de los APKs Generados**

#### **APK Debug:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### **APK Release:**
```
android/app/build/outputs/apk/release/app-release.apk
```

### **6. Acceder a los APKs desde Android Studio**
1. En el panel izquierdo, expande **"Project"**
2. Navega a: `android > app > build > outputs > apk`
3. Verás las carpetas `debug` y/o `release`
4. Haz clic derecho en el archivo `.apk` → **"Reveal in Finder"** (Mac) o **"Show in Explorer"** (Windows)

---

## 🔧 **CONFIGURACIÓN DEL PROYECTO**

### **Información del Proyecto:**
- **App ID**: `app.lovable.c018926e40254894ae52122f75906f16`
- **App Name**: `Coopsama App`
- **Version**: `1.0 (1)`
- **Min SDK**: `23` (Android 6.0+)
- **Target SDK**: `35` (Android 15)

### **Plugins Capacitor Instalados:**
- ✅ @capacitor/camera@7.0.2
- ✅ @capacitor/splash-screen@7.0.3
- ✅ @capacitor/status-bar@7.0.3

---

## ⚠️ **SOLUCIÓN DE PROBLEMAS COMUNES**

### **Si el proyecto no compila:**
1. Ve a **File** → **Sync Project with Gradle Files**
2. Espera a que termine la sincronización
3. Intenta compilar nuevamente

### **Si hay errores de dependencias:**
1. Ve a **File** → **Invalidate Caches and Restart**
2. Selecciona **"Invalidate and Restart"**
3. Espera a que Android Studio se reinicie

### **Si no encuentras Build Variants:**
1. Ve a **View** → **Tool Windows** → **Build Variants**
2. O busca en la barra lateral izquierda

---

## 📱 **INFORMACIÓN DEL APK GENERADO**

### **Tamaño Estimado:**
- **Debug**: ~7-8 MB
- **Release**: ~5-6 MB (optimizado)

### **Características:**
- ✅ Splash screen con logo Coopsama
- ✅ Icono de la app personalizado
- ✅ Colores de marca (#19418A)
- ✅ Permisos de cámara y almacenamiento
- ✅ Funcionalidad offline completa
- ✅ PWA habilitada

---

## 🎯 **PRÓXIMOS PASOS DESPUÉS DEL BUILD**

### **1. Probar el APK:**
```bash
# Instalar en dispositivo conectado
adb install android/app/build/outputs/apk/debug/app-debug.apk

# O transferir manualmente al dispositivo
```

### **2. Distribuir el APK:**
- **Debug**: Para pruebas internas
- **Release**: Para distribución final (requiere firma)

### **3. Subir a Google Play Store:**
- Usar el APK Release firmado
- Seguir las guías de Google Play Console

---

## ✅ **CHECKLIST DE BUILD**

- [ ] ✅ Proyecto abierto en Android Studio
- [ ] ✅ Build Variants configurado
- [ ] ⏳ APK Debug generado
- [ ] ⏳ APK Release generado (opcional)
- [ ] ⏳ APK probado en dispositivo
- [ ] ⏳ APK listo para distribución

---

**🎉 ¡El proyecto está listo para generar APK en Android Studio!**

*Última actualización: 2025-01-20*
*Proyecto sincronizado y actualizado*
