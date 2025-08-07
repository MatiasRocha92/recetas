import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../services/firebase'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

// Datos de recetas argentinas
const recipesData = [
	// ===== PANADERÍA (10 recetas) =====
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
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&h=400&fit=crop"
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
		imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=400&fit=crop"
	},
	// ===== RECETAS TÍPICAS ARGENTINAS (20 recetas) =====
	{
		title: "Empanadas de Carne",
		description: "Empanadas tradicionales argentinas con carne picada y especias",
		ingredients: [
			"500g de harina 0000",
			"250g de carne picada",
			"2 cebollas",
			"2 huevos duros",
			"100g de aceitunas",
			"1 cucharadita de comino",
			"1 cucharadita de pimentón",
			"Sal y pimienta",
			"100g de manteca"
		],
		instructions: [
			"Preparar la masa con harina, manteca y agua",
			"Sofreír cebolla hasta que esté transparente",
			"Agregar carne y especias, cocinar hasta que esté dorada",
			"Agregar huevos picados y aceitunas",
			"Estirar la masa y cortar círculos",
			"Rellenar y cerrar las empanadas",
			"Hornear a 200°C por 20 minutos"
		],
		cookingTime: 90,
		servings: 12,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Asado Argentino",
		description: "Tradicional asado argentino con diferentes cortes de carne",
		ingredients: [
			"2kg de tira de asado",
			"1kg de vacío",
			"500g de chorizo",
			"500g de morcilla",
			"Sal gruesa",
			"Carbón o leña",
			"Limón para acompañar"
		],
		instructions: [
			"Preparar el fuego con carbón o leña",
			"Salar generosamente las carnes",
			"Colocar la tira de asado primero",
			"Agregar vacío y achuras",
			"Cocinar a fuego lento",
			"Dar vuelta cada 30 minutos",
			"Servir con chimichurri"
		],
		cookingTime: 180,
		servings: 8,
		difficulty: "Difícil",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=500&h=400&fit=crop"
	},
	{
		title: "Milanesa a la Napolitana",
		description: "Milanesa con jamón, queso y salsa de tomate",
		ingredients: [
			"4 filetes de ternera",
			"2 huevos",
			"Pan rallado",
			"Harina",
			"4 fetas de jamón",
			"4 fetas de queso mozzarella",
			"Salsa de tomate",
			"Orégano",
			"Aceite para freír"
		],
		instructions: [
			"Pasar los filetes por harina, huevo y pan rallado",
			"Freír en aceite caliente hasta dorar",
			"Colocar en una placa para horno",
			"Agregar jamón, queso y salsa de tomate",
			"Espolvorear orégano",
			"Hornear hasta que el queso se derrita"
		],
		cookingTime: 45,
		servings: 4,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Locro",
		description: "Guiso tradicional argentino con maíz, porotos y carne",
		ingredients: [
			"500g de maíz blanco",
			"300g de porotos blancos",
			"500g de carne de vaca",
			"200g de panceta",
			"2 cebollas",
			"2 zanahorias",
			"2 papas",
			"1 calabaza",
			"Especias: comino, pimentón, ají molido"
		],
		instructions: [
			"Remojar maíz y porotos desde la noche anterior",
			"Cocinar la carne y panceta",
			"Agregar verduras picadas",
			"Incorporar maíz y porotos",
			"Cocinar a fuego lento por 2 horas",
			"Agregar calabaza al final",
			"Servir con salsa criolla"
		],
		cookingTime: 180,
		servings: 8,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Carbonada",
		description: "Guiso criollo con carne, verduras y zapallo",
		ingredients: [
			"500g de carne de vaca",
			"2 zapallos",
			"3 papas",
			"2 cebollas",
			"2 zanahorias",
			"1 taza de arroz",
			"2 duraznos",
			"Especias: comino, pimentón",
			"Caldo de carne"
		],
		instructions: [
			"Cocinar la carne hasta que esté tierna",
			"Agregar verduras picadas",
			"Incorporar arroz y caldo",
			"Agregar duraznos al final",
			"Cocinar hasta que el arroz esté listo",
			"Servir caliente"
		],
		cookingTime: 120,
		servings: 6,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Humita en Chala",
		description: "Humita tradicional envuelta en chala de maíz",
		ingredients: [
			"12 choclos",
			"2 cebollas",
			"200g de queso cremoso",
			"100g de manteca",
			"1 taza de leche",
			"Sal y pimienta",
			"Chalas de maíz para envolver"
		],
		instructions: [
			"Rallar los choclos",
			"Sofreír cebolla en manteca",
			"Agregar choclo rallado",
			"Incorporar leche y queso",
			"Cocinar hasta espesar",
			"Envolver en chalas",
			"Hervir por 30 minutos"
		],
		cookingTime: 90,
		servings: 12,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Tamales",
		description: "Tamales argentinos con masa de maíz y relleno de carne",
		ingredients: [
			"500g de harina de maíz",
			"300g de carne picada",
			"2 cebollas",
			"100g de manteca",
			"Especias: comino, pimentón",
			"Hojas de chala",
			"Caldo de carne"
		],
		instructions: [
			"Preparar la masa con harina de maíz y caldo",
			"Cocinar el relleno de carne",
			"Envolver en hojas de chala",
			"Amarrar con hilo",
			"Hervir por 1 hora",
			"Servir caliente"
		],
		cookingTime: 120,
		servings: 8,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Puchero",
		description: "Cocido tradicional argentino con carnes y verduras",
		ingredients: [
			"500g de carne de vaca",
			"300g de gallina",
			"200g de panceta",
			"3 papas",
			"2 zanahorias",
			"2 cebollas",
			"1 repollo",
			"1 taza de garbanzos",
			"Sal y especias"
		],
		instructions: [
			"Hervir las carnes en agua",
			"Agregar verduras por orden de cocción",
			"Cocinar hasta que todo esté tierno",
			"Servir caldo y carnes por separado",
			"Acompañar con salsa criolla"
		],
		cookingTime: 150,
		servings: 8,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Chimichurri",
		description: "Salsa tradicional argentina para carnes",
		ingredients: [
			"1 taza de perejil picado",
			"1/2 taza de orégano",
			"4 dientes de ajo",
			"1 cebolla",
			"1/2 taza de aceite de oliva",
			"1/4 taza de vinagre",
			"Sal y pimienta",
			"1 cucharadita de ají molido"
		],
		instructions: [
			"Picar finamente perejil y orégano",
			"Rallar ajo y picar cebolla",
			"Mezclar todos los ingredientes",
			"Agregar aceite y vinagre",
			"Dejar reposar 2 horas",
			"Servir con carnes asadas"
		],
		cookingTime: 15,
		servings: 8,
		difficulty: "Fácil",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Salsa Criolla",
		description: "Salsa tradicional con tomate, cebolla y pimiento",
		ingredients: [
			"4 tomates",
			"2 cebollas",
			"2 pimientos",
			"1/2 taza de aceite de oliva",
			"1/4 taza de vinagre",
			"Sal y pimienta",
			"Perejil picado"
		],
		instructions: [
			"Picar finamente tomates, cebollas y pimientos",
			"Mezclar en un bowl",
			"Agregar aceite y vinagre",
			"Sazonar con sal y pimienta",
			"Agregar perejil picado",
			"Dejar reposar 30 minutos"
		],
		cookingTime: 20,
		servings: 6,
		difficulty: "Fácil",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Provoleta",
		description: "Queso provolone a la parrilla argentino",
		ingredients: [
			"400g de queso provolone",
			"Orégano",
			"Aceite de oliva",
			"Pimienta negra",
			"Limón para acompañar"
		],
		instructions: [
			"Cortar el queso en rodajas gruesas",
			"Calentar la parrilla",
			"Colocar el queso en la parrilla",
			"Agregar orégano y aceite",
			"Cocinar hasta que se derrita",
			"Servir con limón"
		],
		cookingTime: 15,
		servings: 4,
		difficulty: "Fácil",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Choripán",
		description: "Sándwich tradicional con chorizo y chimichurri",
		ingredients: [
			"4 chorizos",
			"4 panes de miga",
			"Chimichurri",
			"Salsa criolla",
			"Mostaza"
		],
		instructions: [
			"Asar los chorizos en la parrilla",
			"Calentar los panes",
			"Cortar los chorizos por la mitad",
			"Colocar en los panes",
			"Agregar chimichurri y salsa criolla",
			"Servir caliente"
		],
		cookingTime: 25,
		servings: 4,
		difficulty: "Fácil",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Matambre a la Pizza",
		description: "Matambre relleno con verduras y queso",
		ingredients: [
			"1 matambre de cerdo",
			"2 zanahorias",
			"2 huevos duros",
			"200g de queso mozzarella",
			"Orégano",
			"Sal y pimienta",
			"Hilo de cocina"
		],
		instructions: [
			"Extender el matambre",
			"Colocar zanahorias, huevos y queso",
			"Enrollar y atar con hilo",
			"Hornear a 180°C por 1 hora",
			"Dejar enfriar",
			"Cortar en rodajas"
		],
		cookingTime: 90,
		servings: 8,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop"
	},
	{
		title: "Pascualina",
		description: "Tarta tradicional con acelga y huevos",
		ingredients: [
			"500g de harina 0000",
			"200g de manteca",
			"1kg de acelga",
			"6 huevos",
			"200g de queso rallado",
			"Cebolla",
			"Sal y pimienta"
		],
		instructions: [
			"Preparar masa quebrada",
			"Cocinar acelga y picar",
			"Mezclar con cebolla y queso",
			"Forrar molde con masa",
			"Colocar relleno y huevos",
			"Cubrir con masa y hornear"
		],
		cookingTime: 120,
		servings: 8,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Tarta de Puerros",
		description: "Tarta salada con puerros y queso",
		ingredients: [
			"500g de harina 0000",
			"200g de manteca",
			"1kg de puerros",
			"200g de queso cremoso",
			"3 huevos",
			"1 taza de crema",
			"Sal y pimienta"
		],
		instructions: [
			"Preparar masa quebrada",
			"Cocinar puerros hasta que estén tiernos",
			"Mezclar con queso y crema",
			"Forrar molde con masa",
			"Colocar relleno",
			"Hornear a 180°C por 40 minutos"
		],
		cookingTime: 90,
		servings: 6,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Ensalada Rusa",
		description: "Ensalada tradicional con papas, zanahorias y mayonesa",
		ingredients: [
			"4 papas",
			"3 zanahorias",
			"200g de arvejas",
			"4 huevos duros",
			"1 taza de mayonesa",
			"Sal y pimienta",
			"Perejil picado"
		],
		instructions: [
			"Hervir papas y zanahorias",
			"Cocinar arvejas",
			"Picar todo en cubos",
			"Mezclar con mayonesa",
			"Agregar huevos picados",
			"Enfriar antes de servir"
		],
		cookingTime: 60,
		servings: 6,
		difficulty: "Fácil",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Vitel Toné",
		description: "Plato tradicional italiano-argentino con ternera",
		ingredients: [
			"1kg de ternera",
			"200g de atún en aceite",
			"4 yemas de huevo",
			"1/2 taza de aceite",
			"2 cucharadas de vinagre",
			"Alcaparras",
			"Perejil picado"
		],
		instructions: [
			"Hervir la ternera hasta que esté tierna",
			"Preparar salsa con atún y yemas",
			"Batir aceite y vinagre",
			"Cortar ternera en rodajas",
			"Cubrir con salsa",
			"Decorar con alcaparras"
		],
		cookingTime: 120,
		servings: 6,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop"
	},
	{
		title: "Rabas",
		description: "Calamar frito tradicional argentino",
		ingredients: [
			"1kg de calamares",
			"Harina",
			"2 huevos",
			"Pan rallado",
			"Limón",
			"Sal y pimienta",
			"Aceite para freír"
		],
		instructions: [
			"Limpiar y cortar calamares",
			"Pasar por harina, huevo y pan rallado",
			"Freír en aceite caliente",
			"Escurrir en papel absorbente",
			"Servir con limón",
			"Acompañar con salsa golf"
		],
		cookingTime: 30,
		servings: 4,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Pescado a la Romana",
		description: "Pescado rebozado con limón",
		ingredients: [
			"4 filetes de pescado",
			"Harina",
			"2 huevos",
			"Pan rallado",
			"Limón",
			"Perejil picado",
			"Aceite para freír"
		],
		instructions: [
			"Sazonar filetes con sal y pimienta",
			"Pasar por harina, huevo y pan rallado",
			"Freír en aceite caliente",
			"Escurrir en papel absorbente",
			"Servir con limón y perejil",
			"Acompañar con papas fritas"
		],
		cookingTime: 25,
		servings: 4,
		difficulty: "Fácil",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Sopa de Mondongo",
		description: "Sopa tradicional con panza de vaca",
		ingredients: [
			"1kg de mondongo",
			"2 cebollas",
			"2 zanahorias",
			"2 papas",
			"1 taza de garbanzos",
			"Especias: comino, laurel",
			"Sal y pimienta"
		],
		instructions: [
			"Limpiar bien el mondongo",
			"Hervir con especias por 2 horas",
			"Agregar verduras picadas",
			"Cocinar hasta que todo esté tierno",
			"Servir caliente",
			"Acompañar con limón"
		],
		cookingTime: 180,
		servings: 8,
		difficulty: "Medio",
		category: "Típicas Argentinas",
		imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop"
	},
	// ===== POSTRES, CONFITERÍA Y PASTELERÍA (10 recetas) =====
	{
		title: "Dulce de Leche Casero",
		description: "Dulce de leche tradicional argentino",
		ingredients: [
			"2 litros de leche",
			"400g de azúcar",
			"1 cucharadita de bicarbonato",
			"1 cucharadita de esencia de vainilla"
		],
		instructions: [
			"Calentar leche con azúcar",
			"Agregar bicarbonato",
			"Cocinar a fuego lento",
			"Revolver constantemente",
			"Cocinar hasta que espese",
			"Agregar vainilla al final"
		],
		cookingTime: 120,
		servings: 8,
		difficulty: "Medio",
		category: "Postres",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Alfajores de Maicena",
		description: "Alfajores tradicionales con dulce de leche",
		ingredients: [
			"200g de maicena",
			"200g de harina 0000",
			"200g de manteca",
			"100g de azúcar",
			"2 yemas de huevo",
			"1 cucharadita de esencia de vainilla",
			"Dulce de leche para rellenar",
			"Coco rallado para decorar"
		],
		instructions: [
			"Batir manteca con azúcar",
			"Agregar yemas y vainilla",
			"Mezclar harina y maicena",
			"Formar masa y refrigerar",
			"Estirar y cortar círculos",
			"Hornear a 180°C por 12 minutos",
			"Rellenar con dulce de leche"
		],
		cookingTime: 60,
		servings: 20,
		difficulty: "Medio",
		category: "Postres",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Chocotorta",
		description: "Torta de chocolate con dulce de leche y galletas",
		ingredients: [
			"400g de galletas de chocolate",
			"400g de dulce de leche",
			"400g de queso cremoso",
			"200g de chocolate negro",
			"1 taza de café fuerte",
			"Coco rallado para decorar"
		],
		instructions: [
			"Preparar café fuerte",
			"Batir dulce de leche con queso cremoso",
			"Mojar galletas en café",
			"Alternar capas de galletas y crema",
			"Decorar con chocolate rallado",
			"Refrigerar por 4 horas"
		],
		cookingTime: 45,
		servings: 12,
		difficulty: "Fácil",
		category: "Postres",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Flan Casero",
		description: "Flan tradicional con caramelo",
		ingredients: [
			"1 litro de leche",
			"6 huevos",
			"200g de azúcar",
			"1 cucharadita de esencia de vainilla",
			"100g de azúcar para caramelo"
		],
		instructions: [
			"Preparar caramelo en el molde",
			"Calentar leche con azúcar",
			"Batir huevos y agregar vainilla",
			"Mezclar con leche",
			"Verter en molde",
			"Cocinar a baño maría por 1 hora"
		],
		cookingTime: 90,
		servings: 8,
		difficulty: "Medio",
		category: "Postres",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Torta Rogel",
		description: "Torta de capas con dulce de leche y merengue",
		ingredients: [
			"500g de harina 0000",
			"200g de manteca",
			"2 yemas de huevo",
			"400g de dulce de leche",
			"4 claras de huevo",
			"200g de azúcar",
			"1 cucharadita de esencia de vainilla"
		],
		instructions: [
			"Preparar masa quebrada",
			"Estirar y cortar círculos",
			"Hornear capas por separado",
			"Rellenar con dulce de leche",
			"Preparar merengue italiano",
			"Decorar la torta"
		],
		cookingTime: 120,
		servings: 12,
		difficulty: "Difícil",
		category: "Postres",
		imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop"
	},
	{
		title: "Pasta Frola",
		description: "Tarta tradicional con membrillo",
		ingredients: [
			"500g de harina 0000",
			"200g de manteca",
			"2 yemas de huevo",
			"100g de azúcar",
			"400g de membrillo",
			"1 cucharadita de esencia de vainilla"
		],
		instructions: [
			"Preparar masa quebrada",
			"Estirar y forrar molde",
			"Rellenar con membrillo",
			"Hacer tiras de masa para decorar",
			"Hornear a 180°C por 30 minutos",
			"Dejar enfriar antes de cortar"
		],
		cookingTime: 75,
		servings: 8,
		difficulty: "Medio",
		category: "Postres",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop"
	},
	{
		title: "Torta Balcarce",
		description: "Torta tradicional con dulce de leche y merengue",
		ingredients: [
			"6 huevos",
			"200g de azúcar",
			"200g de harina 0000",
			"400g de dulce de leche",
			"200g de crema de leche",
			"100g de nueces picadas",
			"Coco rallado"
		],
		instructions: [
			"Preparar bizcochuelo",
			"Cortar en capas",
			"Rellenar con dulce de leche",
			"Preparar crema chantilly",
			"Decorar con nueces y coco",
			"Refrigerar por 2 horas"
		],
		cookingTime: 90,
		servings: 10,
		difficulty: "Medio",
		category: "Postres",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop"
	},
	{
		title: "Tiramisú",
		description: "Postre italiano-argentino con café y mascarpone",
		ingredients: [
			"200g de queso mascarpone",
			"200g de crema de leche",
			"4 huevos",
			"100g de azúcar",
			"200g de galletas de vainilla",
			"1 taza de café fuerte",
			"Cacao en polvo"
		],
		instructions: [
			"Preparar café fuerte",
			"Batir yemas con azúcar",
			"Mezclar con mascarpone",
			"Batir claras a punto nieve",
			"Alternar capas de galletas y crema",
			"Espolvorear con cacao"
		],
		cookingTime: 60,
		servings: 8,
		difficulty: "Medio",
		category: "Postres",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop"
	},
	{
		title: "Panqueques con Dulce de Leche",
		description: "Panqueques tradicionales con dulce de leche",
		ingredients: [
			"200g de harina 0000",
			"2 huevos",
			"400ml de leche",
			"50g de manteca",
			"1 cucharadita de sal",
			"Dulce de leche",
			"Azúcar impalpable"
		],
		instructions: [
			"Batir huevos con leche",
			"Agregar harina y sal",
			"Derretir manteca e incorporar",
			"Cocinar en sartén antiadherente",
			"Rellenar con dulce de leche",
			"Enrollar y espolvorear azúcar"
		],
		cookingTime: 45,
		servings: 8,
		difficulty: "Fácil",
		category: "Postres",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop"
	},
	{
		title: "Bombones de Chocolate",
		description: "Bombones caseros con rellenos variados",
		ingredients: [
			"300g de chocolate negro",
			"100g de chocolate blanco",
			"Dulce de leche",
			"Nueces picadas",
			"Almendras",
			"Coco rallado",
			"Frutas secas"
		],
		instructions: [
			"Derretir chocolate a baño maría",
			"Llenar moldes de bombones",
			"Agregar rellenos variados",
			"Refrigerar por 2 horas",
			"Desmoldar cuidadosamente",
			"Decorar según el relleno"
		],
		cookingTime: 60,
		servings: 20,
		difficulty: "Medio",
		category: "Postres",
		imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop"
	}
]

const SeedDatabaseButton = () => {
	const [loading, setLoading] = useState(false)
	const { isAdmin } = useAuth()

	// Solo mostrar el botón si el usuario es administrador
	if (!isAdmin) {
		return null
	}

	const handleSeedDatabase = async () => {
		if (!window.confirm('¿Estás seguro de que quieres poblar la base de datos con recetas argentinas? Esta acción no se puede deshacer.')) {
			return
		}

		setLoading(true)
		
		try {
			console.log('🌱 Iniciando población de Firestore con recetas argentinas...')
			
			const recipesRef = collection(db, 'recipes')
			let addedCount = 0
			
			for (const recipe of recipesData) {
				// Agregar timestamps
				const recipeWithTimestamps = {
					...recipe,
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp()
				}
				
				const docRef = await addDoc(recipesRef, recipeWithTimestamps)
				console.log(`✅ Receta agregada: ${recipe.title} (ID: ${docRef.id})`)
				addedCount++
				
				// Mostrar progreso
				toast.success(`Receta ${addedCount}/${recipesData.length}: ${recipe.title}`)
			}
			
			console.log('🎉 ¡Base de datos poblada exitosamente!')
			console.log(`📊 Se agregaron ${addedCount} recetas argentinas`)
			
			toast.success(`¡Base de datos poblada exitosamente! Se agregaron ${addedCount} recetas argentinas`)
			
		} catch (error) {
			console.error('❌ Error al poblar la base de datos:', error)
			toast.error('Error al poblar la base de datos: ' + error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={handleSeedDatabase}
			disabled={loading}
			className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{loading ? (
				<div className="flex items-center">
					<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
					Poblando base de datos...
				</div>
			) : (
				'🌱 Poblar Base de Datos'
			)}
		</motion.button>
	)
}

export default SeedDatabaseButton 