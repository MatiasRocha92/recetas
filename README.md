# 🍳 RecetasApp - Aplicación de Recetas

Una aplicación web moderna para descubrir, guardar y compartir recetas criollas argentinas. Desarrollada con React, Vite, Firebase y optimizada para rendimiento.

## ✨ Características

- 🇦🇷 **Toque argentino auténtico** - Expresiones y términos criollos
- 🚀 **Rendimiento optimizado** - Lazy loading, memoización, virtualización
- 🔍 **Búsqueda inteligente** - Filtros por dificultad y búsqueda en tiempo real
- ❤️ **Sistema de favoritos** - Guarda tus recetas preferidas
- 🔐 **Autenticación segura** - Login con email/password y Google
- 📱 **Diseño responsive** - Funciona perfectamente en móviles
- 🎨 **UI moderna** - Interfaz elegante con animaciones suaves

## 🛠️ Tecnologías

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
- **Backend:** Firebase (Firestore, Authentication)
- **Optimizaciones:** Lazy loading, memoización, debounce
- **Deployment:** Vercel

## 🚀 Despliegue Rápido

### **1. Clonar el repositorio**
```bash
git clone https://github.com/MatiasRocha92/recetas.git
cd recetas
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
Crea un archivo `.env.local` en la raíz del proyecto y agrega tus credenciales de Firebase:

```bash
# Crear archivo .env.local
touch .env.local
```

Luego agrega las siguientes variables:
```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### **4. Ejecutar en desarrollo**
```bash
npm run dev
```

## 🔧 Configuración de Firebase

### **Variables de Entorno Requeridas**
```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### **Configuración en Firebase Console**
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Authentication** y **Firestore**
3. Crea una app web y copia la configuración
4. Configura las reglas de Firestore para permitir lectura

## 🎯 Optimizaciones Implementadas

### **Rendimiento**
- ⚡ **Lazy loading** de componentes
- 🔄 **Memoización** con React.memo, useMemo, useCallback
- 🖼️ **Optimización de imágenes** con lazy loading
- 🔍 **Debounce** en búsquedas (300ms)
- 📦 **Chunking manual** de librerías
- 🗜️ **Compresión** con Terser

### **Experiencia de Usuario**
- 😊 **Tono amigable**
- 🎭 **Personalidad única** de la aplicación
- 🌟 **Navegación fluida** y responsive

## 📊 Métricas de Rendimiento

- **Tiempo de carga inicial:** ~1-2s (vs 3-5s anterior)
- **Tamaño del bundle:** ~226kB gzipped (vs 2-3MB anterior)
- **Re-renders:** Minimizados con memoización
- **Experiencia móvil:** Optimizada y fluida

## 🔍 Debugging

### **Componente de Debug**
Presiona `Ctrl + Shift + D` en cualquier página para ver:
- Estado de las variables de entorno
- Información del navegador
- Configuración de Firebase

### **Logs en Consola**
Revisa la consola del navegador para:
- ✅ Mensajes de éxito de Firebase
- ❌ Errores de configuración
- ⚠️ Advertencias sobre variables faltantes

## 🚀 Despliegue en Vercel

Consulta la [Guía de Despliegue en Vercel](./VERCEL_DEPLOYMENT.md) para instrucciones detalladas.

### **Pasos Rápidos:**
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel Dashboard
3. Agrega tu dominio a Firebase Auth
4. ¡Listo! Tu app se desplegará automáticamente

## 🐛 Solución de Problemas

### **Problemas Comunes**

#### **1. Las recetas no se muestran**
- Verifica que las variables de entorno estén configuradas
- Usa el componente de debug (Ctrl + Shift + D)
- Revisa la consola del navegador

#### **2. Error de CORS**
- Agrega tu dominio de Vercel a Firebase Auth
- Verifica las reglas de Firestore

#### **3. Error de autenticación**
- Confirma que Firebase Auth esté habilitado
- Verifica las credenciales de Firebase

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── layout/         # Componentes de layout
│   ├── VirtualizedGrid.jsx
│   └── DebugInfo.jsx
├── hooks/              # Hooks personalizados
│   ├── useRecipes.js
│   ├── useDebounce.js
│   └── useImageOptimization.js
├── pages/              # Páginas de la aplicación
├── services/           # Servicios (Firebase)
├── context/            # Contextos de React
└── config/             # Configuraciones
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🆘 Soporte

Si tienes problemas:
1. Revisa la [Guía de Despliegue](./VERCEL_DEPLOYMENT.md)
2. Usa el componente de debug (Ctrl + Shift + D)
3. Verifica la consola del navegador
4. Abre un issue en GitHub

---

**Esta pagina fue creada con fines de practica, la misma la dejo para que la puedan usar libremente. Atte. Matias Rocha**
