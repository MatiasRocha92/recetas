import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Configuración de Firebase - usa las mismas variables de entorno
const firebaseConfig = {
	apiKey: "AIzaSyC6nNxwBySd1YiG4QUtU9XACrIMtR8w42M",
    authDomain: "recipe-app-ff529.firebaseapp.com",
    projectId: "recipe-app-ff529",
    storageBucket: "recipe-app-ff529.firebasestorage.app",
    messagingSenderId: "317582960360",
    appId: "1:317582960360:web:fd2d95a79efc7bb8788b5d"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Datos de recetas argentinas
const recipesData = [
	// ===== PANADERÍA (20 recetas) =====
	{
		title: "Facturas de Manteca",
		description: "Facturas tradicionales argentinas con manteca y dulce de leche",
		ingredients: [
			"500g de harina 0000",
			"250g de manteca",
			"2 huevos",
			"1/2 taza de leche",
			"1/4 taza de azúcar",
			"1 cucharadita de sal",
			"25g de levadura fresca",
			"Dulce de leche para rellenar"
		],
		instructions: [
			"Disolver la levadura en leche tibia con una cucharada de azúcar",
			"Mezclar harina, azúcar y sal",
			"Agregar los huevos y la leche con levadura",
			"Amasar hasta formar una masa suave",
			"Estirar la masa y agregar manteca en capas",
			"Plegar y estirar 3 veces",
			"Cortar en formas de facturas y rellenar",
			"Hornear a 180°C por 20 minutos"
		],
		cookingTime: 120,
		servings: 12,
		difficulty: "Difícil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Medialunas de Manteca",
		description: "Croissants argentinos con manteca y azúcar espolvoreado",
		ingredients: [
			"500g de harina 0000",
			"300g de manteca",
			"2 huevos",
			"1 taza de leche",
			"1/4 taza de azúcar",
			"1 cucharadita de sal",
			"25g de levadura fresca",
			"Azúcar para espolvorear"
		],
		instructions: [
			"Preparar la masa base con harina, leche, huevos y levadura",
			"Amasar hasta que esté suave y elástica",
			"Estirar la masa y agregar manteca en capas",
			"Plegar y estirar varias veces",
			"Cortar en triángulos y enrollar",
			"Dejar leudar 2 horas",
			"Hornear a 180°C por 15-20 minutos",
			"Espolvorear con azúcar"
		],
		cookingTime: 180,
		servings: 16,
		difficulty: "Difícil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Pan de Campo",
		description: "Pan rústico argentino con corteza crujiente y miga tierna",
		ingredients: [
			"1kg de harina 000",
			"600ml de agua tibia",
			"25g de levadura fresca",
			"2 cucharaditas de sal",
			"1 cucharada de azúcar",
			"2 cucharadas de aceite de oliva"
		],
		instructions: [
			"Disolver la levadura en agua tibia con azúcar",
			"Mezclar harina y sal en un bowl grande",
			"Agregar el agua con levadura y el aceite",
			"Amasar durante 10 minutos hasta que esté suave",
			"Dejar leudar 2 horas en lugar cálido",
			"Formar el pan y hacer cortes en la superficie",
			"Hornear a 200°C por 40-45 minutos"
		],
		cookingTime: 180,
		servings: 8,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Tortitas Negras",
		description: "Galletas tradicionales argentinas con miel y especias",
		ingredients: [
			"500g de harina 0000",
			"200g de miel",
			"100g de azúcar negra",
			"2 huevos",
			"1/2 taza de leche",
			"1 cucharadita de canela",
			"1 cucharadita de jengibre",
			"1/2 cucharadita de clavo de olor",
			"1 cucharadita de bicarbonato"
		],
		instructions: [
			"Mezclar harina, especias y bicarbonato",
			"Batir huevos con miel y azúcar",
			"Agregar la leche y mezclar",
			"Combinar con la harina hasta formar masa",
			"Estirar y cortar en círculos",
			"Hornear a 180°C por 12-15 minutos"
		],
		cookingTime: 45,
		servings: 24,
		difficulty: "Fácil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Rosca de Pascua",
		description: "Pan dulce tradicional de Pascua con frutas confitadas",
		ingredients: [
			"500g de harina 0000",
			"100g de azúcar",
			"3 huevos",
			"1/2 taza de leche",
			"100g de manteca",
			"25g de levadura fresca",
			"100g de frutas confitadas",
			"1 cucharadita de esencia de vainilla",
			"1 cucharadita de ralladura de limón"
		],
		instructions: [
			"Disolver levadura en leche tibia",
			"Mezclar harina, azúcar y sal",
			"Agregar huevos, manteca y leche con levadura",
			"Amasar hasta formar masa suave",
			"Agregar frutas confitadas y especias",
			"Dejar leudar 2 horas",
			"Formar rosca y decorar",
			"Hornear a 180°C por 30 minutos"
		],
		cookingTime: 150,
		servings: 10,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Pan de Yema",
		description: "Pan tradicional argentino con yemas de huevo",
		ingredients: [
			"500g de harina 0000",
			"6 yemas de huevo",
			"1/2 taza de leche",
			"100g de manteca",
			"1/4 taza de azúcar",
			"1 cucharadita de sal",
			"25g de levadura fresca"
		],
		instructions: [
			"Disolver levadura en leche tibia",
			"Mezclar harina, azúcar y sal",
			"Agregar yemas, manteca y leche con levadura",
			"Amasar hasta formar masa suave",
			"Dejar leudar 1 hora",
			"Formar bollos y decorar",
			"Hornear a 180°C por 20 minutos"
		],
		cookingTime: 90,
		servings: 12,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Galletas de Vainilla",
		description: "Galletas caseras argentinas con esencia de vainilla",
		ingredients: [
			"300g de harina 0000",
			"200g de manteca",
			"150g de azúcar",
			"2 huevos",
			"1 cucharadita de esencia de vainilla",
			"1/2 cucharadita de sal",
			"1 cucharadita de polvo para hornear"
		],
		instructions: [
			"Batir manteca con azúcar hasta que esté cremosa",
			"Agregar huevos y vainilla",
			"Mezclar harina, sal y polvo para hornear",
			"Combinar hasta formar masa",
			"Enfriar 30 minutos",
			"Estirar y cortar con cortapastas",
			"Hornear a 180°C por 12 minutos"
		],
		cookingTime: 60,
		servings: 30,
		difficulty: "Fácil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Miga",
		description: "Pan de molde tradicional argentino",
		ingredients: [
			"500g de harina 0000",
			"300ml de leche",
			"2 huevos",
			"50g de manteca",
			"25g de levadura fresca",
			"1 cucharadita de sal",
			"1 cucharada de azúcar"
		],
		instructions: [
			"Disolver levadura en leche tibia",
			"Mezclar harina, sal y azúcar",
			"Agregar huevos, manteca y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 2 horas",
			"Colocar en molde de pan",
			"Hornear a 180°C por 40 minutos"
		],
		cookingTime: 180,
		servings: 12,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Bizcochos de Grasa",
		description: "Bizcochos tradicionales argentinos con grasa vacuna",
		ingredients: [
			"500g de harina 0000",
			"200g de grasa vacuna",
			"1 taza de leche",
			"2 huevos",
			"1/4 taza de azúcar",
			"1 cucharadita de sal",
			"25g de levadura fresca"
		],
		instructions: [
			"Disolver levadura en leche tibia",
			"Mezclar harina, azúcar y sal",
			"Agregar huevos, grasa y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 1 hora",
			"Formar bizcochos",
			"Hornear a 200°C por 15 minutos"
		],
		cookingTime: 90,
		servings: 20,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Leche",
		description: "Pan dulce argentino con leche y azúcar",
		ingredients: [
			"500g de harina 0000",
			"300ml de leche",
			"100g de azúcar",
			"2 huevos",
			"50g de manteca",
			"25g de levadura fresca",
			"1 cucharadita de sal"
		],
		instructions: [
			"Calentar leche y disolver levadura",
			"Mezclar harina, azúcar y sal",
			"Agregar huevos, manteca y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 2 horas",
			"Formar bollos",
			"Hornear a 180°C por 25 minutos"
		],
		cookingTime: 150,
		servings: 10,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Galletas de Miel",
		description: "Galletas caseras con miel y especias",
		ingredients: [
			"400g de harina 0000",
			"200g de miel",
			"100g de manteca",
			"2 huevos",
			"1 cucharadita de canela",
			"1/2 cucharadita de jengibre",
			"1 cucharadita de bicarbonato"
		],
		instructions: [
			"Batir manteca con miel",
			"Agregar huevos y mezclar",
			"Combinar harina, especias y bicarbonato",
			"Formar masa y refrigerar",
			"Estirar y cortar",
			"Hornear a 180°C por 15 minutos"
		],
		cookingTime: 75,
		servings: 25,
		difficulty: "Fácil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Papa",
		description: "Pan suave argentino con puré de papa",
		ingredients: [
			"500g de harina 0000",
			"200g de papa cocida y pisada",
			"300ml de leche",
			"2 huevos",
			"50g de manteca",
			"25g de levadura fresca",
			"1 cucharadita de sal"
		],
		instructions: [
			"Preparar puré de papa",
			"Disolver levadura en leche tibia",
			"Mezclar harina, papa y sal",
			"Agregar huevos, manteca y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 2 horas",
			"Hornear a 180°C por 30 minutos"
		],
		cookingTime: 120,
		servings: 8,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Bizcochos de Agua",
		description: "Bizcochos ligeros argentinos sin grasa",
		ingredients: [
			"500g de harina 0000",
			"300ml de agua tibia",
			"2 huevos",
			"1/4 taza de aceite",
			"25g de levadura fresca",
			"1 cucharadita de sal"
		],
		instructions: [
			"Disolver levadura en agua tibia",
			"Mezclar harina y sal",
			"Agregar huevos, aceite y agua",
			"Amasar hasta formar masa suave",
			"Dejar leudar 1 hora",
			"Formar bizcochos",
			"Hornear a 200°C por 15 minutos"
		],
		cookingTime: 90,
		servings: 20,
		difficulty: "Fácil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Maíz",
		description: "Pan tradicional argentino con harina de maíz",
		ingredients: [
			"300g de harina de maíz",
			"200g de harina 0000",
			"400ml de leche",
			"2 huevos",
			"50g de manteca",
			"25g de levadura fresca",
			"1 cucharadita de sal"
		],
		instructions: [
			"Disolver levadura en leche tibia",
			"Mezclar harinas y sal",
			"Agregar huevos, manteca y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 2 horas",
			"Formar pan",
			"Hornear a 180°C por 35 minutos"
		],
		cookingTime: 150,
		servings: 8,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Galletas de Limón",
		description: "Galletas caseras con ralladura de limón",
		ingredients: [
			"300g de harina 0000",
			"200g de manteca",
			"150g de azúcar",
			"2 huevos",
			"Ralladura de 2 limones",
			"1 cucharadita de esencia de vainilla",
			"1/2 cucharadita de sal"
		],
		instructions: [
			"Batir manteca con azúcar",
			"Agregar huevos, ralladura y vainilla",
			"Mezclar harina y sal",
			"Combinar hasta formar masa",
			"Enfriar 30 minutos",
			"Estirar y cortar",
			"Hornear a 180°C por 12 minutos"
		],
		cookingTime: 60,
		servings: 30,
		difficulty: "Fácil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Centeno",
		description: "Pan saludable argentino con harina de centeno",
		ingredients: [
			"400g de harina de centeno",
			"100g de harina 0000",
			"400ml de agua tibia",
			"25g de levadura fresca",
			"2 cucharaditas de sal",
			"2 cucharadas de miel"
		],
		instructions: [
			"Disolver levadura en agua tibia",
			"Mezclar harinas, sal y miel",
			"Agregar agua con levadura",
			"Amasar hasta formar masa suave",
			"Dejar leudar 3 horas",
			"Formar pan",
			"Hornear a 200°C por 45 minutos"
		],
		cookingTime: 240,
		servings: 8,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Bizcochos de Leche",
		description: "Bizcochos suaves argentinos con leche",
		ingredients: [
			"500g de harina 0000",
			"300ml de leche",
			"2 huevos",
			"100g de manteca",
			"25g de levadura fresca",
			"1 cucharadita de sal",
			"1 cucharada de azúcar"
		],
		instructions: [
			"Calentar leche y disolver levadura",
			"Mezclar harina, sal y azúcar",
			"Agregar huevos, manteca y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 1 hora",
			"Formar bizcochos",
			"Hornear a 180°C por 20 minutos"
		],
		cookingTime: 90,
		servings: 15,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Salvado",
		description: "Pan integral argentino con salvado",
		ingredients: [
			"400g de harina 0000",
			"100g de salvado de trigo",
			"400ml de agua tibia",
			"25g de levadura fresca",
			"2 cucharaditas de sal",
			"2 cucharadas de miel"
		],
		instructions: [
			"Disolver levadura en agua tibia",
			"Mezclar harina, salvado, sal y miel",
			"Agregar agua con levadura",
			"Amasar hasta formar masa suave",
			"Dejar leudar 2 horas",
			"Formar pan",
			"Hornear a 200°C por 40 minutos"
		],
		cookingTime: 180,
		servings: 8,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	{
		title: "Galletas de Chocolate",
		description: "Galletas caseras con chips de chocolate",
		ingredients: [
			"300g de harina 0000",
			"200g de manteca",
			"150g de azúcar",
			"2 huevos",
			"200g de chips de chocolate",
			"1 cucharadita de esencia de vainilla",
			"1/2 cucharadita de sal"
		],
		instructions: [
			"Batir manteca con azúcar",
			"Agregar huevos y vainilla",
			"Mezclar harina y sal",
			"Agregar chips de chocolate",
			"Formar bolitas",
			"Hornear a 180°C por 12 minutos"
		],
		cookingTime: 45,
		servings: 24,
		difficulty: "Fácil",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pan de Avena",
		description: "Pan saludable argentino con avena",
		ingredients: [
			"400g de harina 0000",
			"100g de avena",
			"400ml de leche",
			"2 huevos",
			"50g de manteca",
			"25g de levadura fresca",
			"1 cucharadita de sal"
		],
		instructions: [
			"Disolver levadura en leche tibia",
			"Mezclar harina, avena y sal",
			"Agregar huevos, manteca y leche",
			"Amasar hasta formar masa suave",
			"Dejar leudar 2 horas",
			"Formar pan",
			"Hornear a 180°C por 35 minutos"
		],
		cookingTime: 150,
		servings: 8,
		difficulty: "Medio",
		category: "Panadería",
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"
	},
	// ===== PASTELERÍA/REPOSTERÍA (20 recetas) =====
	{
		title: "Alfajores de Maicena",
		description: "Alfajores tradicionales argentinos con dulce de leche",
		ingredients: [
			"200g de maicena",
			"200g de harina 0000",
			"200g de manteca",
			"150g de azúcar",
			"2 yemas de huevo",
			"1 cucharadita de esencia de vainilla",
			"Dulce de leche para rellenar",
			"Coco rallado para decorar"
		],
		instructions: [
			"Batir manteca con azúcar hasta que esté cremosa",
			"Agregar yemas y vainilla",
			"Mezclar maicena y harina",
			"Combinar hasta formar masa",
			"Enfriar 30 minutos",
			"Estirar y cortar círculos",
			"Hornear a 180°C por 12 minutos",
			"Rellenar con dulce de leche y espolvorear coco"
		],
		cookingTime: 60,
		servings: 20,
		difficulty: "Medio",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Dulce de Leche Casero",
		description: "Dulce de leche tradicional argentino",
		ingredients: [
			"1 litro de leche",
			"300g de azúcar",
			"1/2 cucharadita de bicarbonato",
			"1 cucharadita de esencia de vainilla"
		],
		instructions: [
			"Calentar la leche en una olla grande",
			"Agregar azúcar y bicarbonato",
			"Cocinar a fuego bajo revolviendo constantemente",
			"Cocinar hasta que tome color caramelo",
			"Agregar vainilla al final",
			"Dejar enfriar antes de usar"
		],
		cookingTime: 120,
		servings: 8,
		difficulty: "Difícil",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Torta Rogel",
		description: "Torta tradicional argentina con capas de masa y dulce de leche",
		ingredients: [
			"500g de harina 0000",
			"300g de manteca",
			"4 yemas de huevo",
			"1/2 taza de agua",
			"1 cucharadita de sal",
			"Dulce de leche para rellenar",
			"Merengue italiano para decorar"
		],
		instructions: [
			"Mezclar harina, manteca y sal",
			"Agregar yemas y agua",
			"Amasar hasta formar masa",
			"Dividir en 8 porciones",
			"Estirar cada porción muy fina",
			"Hornear cada capa a 200°C por 8 minutos",
			"Rellenar con dulce de leche",
			"Decorar con merengue"
		],
		cookingTime: 180,
		servings: 12,
		difficulty: "Difícil",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Chocotorta",
		description: "Torta argentina con galletas de chocolate y dulce de leche",
		ingredients: [
			"400g de galletas de chocolate",
			"400g de dulce de leche",
			"200g de queso crema",
			"200g de chocolate para decorar",
			"1 taza de café fuerte",
			"1 cucharadita de esencia de vainilla"
		],
		instructions: [
			"Preparar café fuerte y dejar enfriar",
			"Mezclar dulce de leche con queso crema",
			"Mojar galletas en café",
			"Alternar capas de galletas y crema",
			"Refrigerar por 4 horas",
			"Decorar con chocolate rallado"
		],
		cookingTime: 30,
		servings: 10,
		difficulty: "Fácil",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Flan Casero",
		description: "Flan tradicional argentino con caramelo",
		ingredients: [
			"6 huevos",
			"500ml de leche",
			"200g de azúcar",
			"1 cucharadita de esencia de vainilla",
			"100g de azúcar para caramelo"
		],
		instructions: [
			"Preparar caramelo con azúcar",
			"Batir huevos con azúcar",
			"Agregar leche y vainilla",
			"Verter en molde con caramelo",
			"Cocinar al baño maría",
			"Hornear a 180°C por 45 minutos"
		],
		cookingTime: 60,
		servings: 8,
		difficulty: "Medio",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Budín de Pan",
		description: "Budín tradicional argentino con pan viejo",
		ingredients: [
			"500g de pan viejo",
			"1 litro de leche",
			"4 huevos",
			"200g de azúcar",
			"100g de pasas",
			"1 cucharadita de canela",
			"1 cucharadita de esencia de vainilla"
		],
		instructions: [
			"Cortar pan en trozos",
			"Calentar leche y remojar pan",
			"Batir huevos con azúcar",
			"Mezclar con pan y agregar pasas",
			"Verter en molde enmantecado",
			"Hornear a 180°C por 45 minutos"
		],
		cookingTime: 75,
		servings: 10,
		difficulty: "Fácil",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Torta Sacher",
		description: "Torta de chocolate argentina con glasé",
		ingredients: [
			"200g de chocolate negro",
			"200g de manteca",
			"6 huevos",
			"150g de azúcar",
			"100g de harina 0000",
			"200g de chocolate para glasé",
			"100g de dulce de leche"
		],
		instructions: [
			"Derretir chocolate con manteca",
			"Separar yemas y claras",
			"Batir yemas con azúcar",
			"Mezclar con chocolate",
			"Batir claras a punto nieve",
			"Integrar con movimientos suaves",
			"Hornear a 180°C por 25 minutos",
			"Cubrir con glasé de chocolate"
		],
		cookingTime: 90,
		servings: 12,
		difficulty: "Difícil",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Pionono",
		description: "Pionono argentino con dulce de leche",
		ingredients: [
			"6 huevos",
			"150g de azúcar",
			"100g de harina 0000",
			"1 cucharadita de polvo para hornear",
			"Dulce de leche para rellenar",
			"Azúcar impalpable para decorar"
		],
		instructions: [
			"Separar yemas y claras",
			"Batir yemas con azúcar",
			"Batir claras a punto nieve",
			"Mezclar harina y polvo para hornear",
			"Integrar todo con movimientos suaves",
			"Hornear en bandeja a 200°C por 12 minutos",
			"Rellenar con dulce de leche y enrollar"
		],
		cookingTime: 45,
		servings: 8,
		difficulty: "Medio",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Torta Balcarce",
		description: "Torta tradicional argentina con merengue",
		ingredients: [
			"6 huevos",
			"200g de azúcar",
			"150g de harina 0000",
			"1 cucharadita de polvo para hornear",
			"Dulce de leche",
			"Merengue italiano",
			"Coco rallado"
		],
		instructions: [
			"Separar yemas y claras",
			"Batir yemas con azúcar",
			"Batir claras a punto nieve",
			"Mezclar harina y polvo para hornear",
			"Integrar todo",
			"Hornear a 180°C por 25 minutos",
			"Rellenar con dulce de leche",
			"Decorar con merengue y coco"
		],
		cookingTime: 90,
		servings: 12,
		difficulty: "Difícil",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Tiramisú",
		description: "Tiramisú argentino con café y mascarpone",
		ingredients: [
			"200g de mascarpone",
			"4 huevos",
			"100g de azúcar",
			"200g de galletas de soletilla",
			"1 taza de café fuerte",
			"Cacao en polvo para decorar"
		],
		instructions: [
			"Preparar café fuerte y dejar enfriar",
			"Separar yemas y claras",
			"Batir yemas con azúcar",
			"Mezclar con mascarpone",
			"Batir claras a punto nieve",
			"Integrar con movimientos suaves",
			"Alternar capas de galletas y crema",
			"Refrigerar 4 horas y espolvorear cacao"
		],
		cookingTime: 30,
		servings: 8,
		difficulty: "Medio",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Torta de Chocolate",
		description: "Torta de chocolate húmeda argentina",
		ingredients: [
			"200g de chocolate negro",
			"200g de manteca",
			"4 huevos",
			"150g de azúcar",
			"100g de harina 0000",
			"1 cucharadita de polvo para hornear",
			"1 cucharadita de esencia de vainilla"
		],
		instructions: [
			"Derretir chocolate con manteca",
			"Batir huevos con azúcar",
			"Mezclar con chocolate",
			"Agregar harina y polvo para hornear",
			"Verter en molde enmantecado",
			"Hornear a 180°C por 30 minutos"
		],
		cookingTime: 60,
		servings: 10,
		difficulty: "Medio",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Cheesecake",
		description: "Cheesecake argentino con frutos rojos",
		ingredients: [
			"200g de galletas de vainilla",
			"100g de manteca",
			"500g de queso crema",
			"200g de azúcar",
			"3 huevos",
			"1 cucharadita de esencia de vainilla",
			"Frutos rojos para decorar"
		],
		instructions: [
			"Triturar galletas y mezclar con manteca",
			"Presionar en base de molde",
			"Batir queso crema con azúcar",
			"Agregar huevos y vainilla",
			"Verter sobre base",
			"Hornear a 160°C por 45 minutos",
			"Refrigerar 4 horas y decorar"
		],
		cookingTime: 90,
		servings: 12,
		difficulty: "Medio",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Torta de Manzana",
		description: "Torta de manzana tradicional argentina",
		ingredients: [
			"6 manzanas",
			"200g de harina 0000",
			"150g de azúcar",
			"100g de manteca",
			"2 huevos",
			"1 cucharadita de canela",
			"1 cucharadita de polvo para hornear"
		],
		instructions: [
			"Pelar y cortar manzanas en rodajas",
			"Batir manteca con azúcar",
			"Agregar huevos y mezclar",
			"Agregar harina, canela y polvo para hornear",
			"Alternar capas de masa y manzanas",
			"Hornear a 180°C por 40 minutos"
		],
		cookingTime: 75,
		servings: 10,
		difficulty: "Medio",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Torta de Limón",
		description: "Torta de limón argentina con glasé",
		ingredients: [
			"200g de harina 0000",
			"150g de azúcar",
			"100g de manteca",
			"3 huevos",
			"Ralladura de 2 limones",
			"Jugo de 2 limones",
			"1 cucharadita de polvo para hornear"
		],
		instructions: [
			"Batir manteca con azúcar",
			"Agregar huevos y ralladura",
			"Mezclar harina y polvo para hornear",
			"Agregar jugo de limón",
			"Verter en molde",
			"Hornear a 180°C por 30 minutos"
		],
		cookingTime: 60,
		servings: 8,
		difficulty: "Fácil",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Torta de Zanahoria",
		description: "Torta de zanahoria argentina con crema",
		ingredients: [
			"300g de zanahorias ralladas",
			"200g de harina 0000",
			"150g de azúcar",
			"100g de manteca",
			"3 huevos",
			"1 cucharadita de canela",
			"1 cucharadita de polvo para hornear",
			"Crema de queso para decorar"
		],
		instructions: [
			"Rallar zanahorias finamente",
			"Batir manteca con azúcar",
			"Agregar huevos y mezclar",
			"Agregar zanahorias y canela",
			"Mezclar harina y polvo para hornear",
			"Hornear a 180°C por 35 minutos",
			"Decorar con crema de queso"
		],
		cookingTime: 75,
		servings: 10,
		difficulty: "Medio",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Torta de Naranja",
		description: "Torta de naranja húmeda argentina",
		ingredients: [
			"200g de harina 0000",
			"150g de azúcar",
			"100g de manteca",
			"3 huevos",
			"Ralladura de 2 naranjas",
			"Jugo de 2 naranjas",
			"1 cucharadita de polvo para hornear"
		],
		instructions: [
			"Batir manteca con azúcar",
			"Agregar huevos y ralladura",
			"Mezclar harina y polvo para hornear",
			"Agregar jugo de naranja",
			"Verter en molde",
			"Hornear a 180°C por 30 minutos"
		],
		cookingTime: 60,
		servings: 8,
		difficulty: "Fácil",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Torta de Vainilla",
		description: "Torta de vainilla clásica argentina",
		ingredients: [
			"200g de harina 0000",
			"150g de azúcar",
			"100g de manteca",
			"3 huevos",
			"1 cucharadita de esencia de vainilla",
			"1 cucharadita de polvo para hornear",
			"Azúcar impalpable para decorar"
		],
		instructions: [
			"Batir manteca con azúcar",
			"Agregar huevos y vainilla",
			"Mezclar harina y polvo para hornear",
			"Verter en molde",
			"Hornear a 180°C por 25 minutos",
			"Decorar con azúcar impalpable"
		],
		cookingTime: 50,
		servings: 8,
		difficulty: "Fácil",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Torta de Coco",
		description: "Torta de coco argentina con dulce de leche",
		ingredients: [
			"200g de harina 0000",
			"150g de azúcar",
			"100g de manteca",
			"3 huevos",
			"100g de coco rallado",
			"1 cucharadita de polvo para hornear",
			"Dulce de leche para rellenar"
		],
		instructions: [
			"Batir manteca con azúcar",
			"Agregar huevos y mezclar",
			"Agregar coco rallado",
			"Mezclar harina y polvo para hornear",
			"Verter en molde",
			"Hornear a 180°C por 30 minutos",
			"Rellenar con dulce de leche"
		],
		cookingTime: 60,
		servings: 8,
		difficulty: "Medio",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Torta de Frutilla",
		description: "Torta de frutilla argentina con crema",
		ingredients: [
			"200g de harina 0000",
			"150g de azúcar",
			"100g de manteca",
			"3 huevos",
			"300g de frutillas",
			"1 cucharadita de polvo para hornear",
			"Crema chantilly para decorar"
		],
		instructions: [
			"Batir manteca con azúcar",
			"Agregar huevos y mezclar",
			"Mezclar harina y polvo para hornear",
			"Verter en molde",
			"Hornear a 180°C por 25 minutos",
			"Decorar con crema y frutillas"
		],
		cookingTime: 50,
		servings: 8,
		difficulty: "Fácil",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	},
	{
		title: "Torta de Banana",
		description: "Torta de banana argentina con nueces",
		ingredients: [
			"200g de harina 0000",
			"150g de azúcar",
			"100g de manteca",
			"3 huevos",
			"3 bananas maduras",
			"100g de nueces picadas",
			"1 cucharadita de polvo para hornear"
		],
		instructions: [
			"Pisar bananas hasta formar puré",
			"Batir manteca con azúcar",
			"Agregar huevos y puré de banana",
			"Agregar nueces picadas",
			"Mezclar harina y polvo para hornear",
			"Hornear a 180°C por 35 minutos"
		],
		cookingTime: 65,
		servings: 10,
		difficulty: "Medio",
		category: "Pastelería",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
	}
]

// Función para poblar la base de datos
async function seedFirestore() {
	try {
		console.log('🌱 Iniciando población de Firestore con recetas argentinas...')
		
		const recipesRef = collection(db, 'recipes')
		
		for (const recipe of recipesData) {
			// Agregar timestamps
			const recipeWithTimestamps = {
				...recipe,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp()
			}
			
			const docRef = await addDoc(recipesRef, recipeWithTimestamps)
			console.log(`✅ Receta agregada: ${recipe.title} (ID: ${docRef.id})`)
		}
		
		console.log('🎉 ¡Base de datos poblada exitosamente!')
		console.log(`📊 Se agregaron ${recipesData.length} recetas argentinas`)
		
	} catch (error) {
		console.error('❌ Error al poblar la base de datos:', error)
	}
}

// Ejecutar el script
seedFirestore() 