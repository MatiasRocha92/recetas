# Configuración de Firebase

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Cómo obtener las credenciales:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a Configuración del proyecto > General
4. En la sección "Tus apps", haz clic en el ícono de web (</>)
5. Registra tu app y copia la configuración
6. Reemplaza los valores en el archivo `.env`

## Estructura de la base de datos

La aplicación espera una colección llamada `recipes` en Firestore con documentos que contengan:

```javascript
{
  title: "Nombre de la receta",
  description: "Descripción de la receta",
  ingredients: ["ingrediente 1", "ingrediente 2"],
  instructions: ["paso 1", "paso 2"],
  cookingTime: 30, // en minutos
  servings: 4,
  difficulty: "Fácil", // Fácil, Medio, Difícil
  imageUrl: "https://url-de-la-imagen.jpg",
  createdAt: timestamp,
  updatedAt: timestamp
}
``` 