// Configuración de optimizaciones de rendimiento
export const PERFORMANCE_CONFIG = {
	// Configuración de imágenes
	images: {
		// Tamaños de imagen optimizados
		sizes: {
			thumbnail: '300x200',
			card: '400x300',
			detail: '800x600',
			hero: '1200x800'
		},
		// Formato preferido para imágenes
		format: 'webp',
		// Calidad de compresión
		quality: 80,
		// Lazy loading threshold
		lazyThreshold: 0.1
	},

	// Configuración de virtualización
	virtualization: {
		// Número de items por página
		itemsPerPage: 20,
		// Buffer para virtualización
		buffer: 5,
		// Altura estimada de cada item
		estimatedItemHeight: 400
	},

	// Configuración de caché
	cache: {
		// Tiempo de expiración del caché (en minutos)
		expirationTime: 30,
		// Tamaño máximo del caché (en MB)
		maxSize: 50
	},

	// Configuración de debounce
	debounce: {
		// Tiempo de debounce para búsquedas (en ms)
		searchDelay: 300,
		// Tiempo de debounce para scroll (en ms)
		scrollDelay: 100
	},

	// Configuración de animaciones
	animations: {
		// Duración de animaciones (en ms)
		duration: 200,
		// Easing para animaciones
		easing: 'ease-out'
	}
}

// Función para obtener la configuración según el entorno
export const getPerformanceConfig = (environment = 'production') => {
	const baseConfig = PERFORMANCE_CONFIG

	if (environment === 'development') {
		return {
			...baseConfig,
			// Configuraciones específicas para desarrollo
			images: {
				...baseConfig.images,
				quality: 90 // Mayor calidad en desarrollo
			},
			debounce: {
				...baseConfig.debounce,
				searchDelay: 100 // Menor delay en desarrollo
			}
		}
	}

	return baseConfig
}
