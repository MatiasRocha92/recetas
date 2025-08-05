# Scripts de Población de Datos

## Script de Población de Firestore

Este script permite poblar automáticamente tu base de datos de Firestore con datos de prueba de recetas.

### Prerrequisitos

1. **Configurar Firebase**: Asegúrate de tener configurado tu proyecto de Firebase
2. **Variables de Entorno**: Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Firebase

### Archivo .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente formato:

```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### Ejecutar el Script

```bash
npm run seed
```

### Datos que se Agregan

El script agregará 5 recetas de ejemplo:

1. **Pasta Carbonara** - Pasta italiana clásica
2. **Ensalada César** - Ensalada fresca con aderezo cremoso
3. **Pollo al Curry** - Pollo en salsa de curry aromática
4. **Tacos de Carne Asada** - Tacos tradicionales mexicanos
5. **Sopa de Tomate** - Sopa cremosa de tomate

### Estructura de los Datos

Cada receta incluye:
- `title`: Título de la receta
- `description`: Descripción breve
- `ingredients`: Array de ingredientes
- `instructions`: Array de pasos de preparación
- `cookingTime`: Tiempo de cocción en minutos
- `servings`: Número de porciones
- `difficulty`: Nivel de dificultad (Fácil, Medio, Difícil)
- `imageUrl`: URL de la imagen
- `createdAt`: Timestamp de creación
- `updatedAt`: Timestamp de actualización

### Solución de Problemas

- **Error de credenciales**: Verifica que las variables de entorno estén correctamente configuradas
- **Error de permisos**: Asegúrate de que las reglas de Firestore permitan escritura
- **Error de conexión**: Verifica que tu proyecto de Firebase esté activo

### Notas

- El script es idempotente, puedes ejecutarlo múltiples veces
- Los timestamps se generan automáticamente usando `serverTimestamp()`
- Los IDs de los documentos se generan automáticamente por Firestore 