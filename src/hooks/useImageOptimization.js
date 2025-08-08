import { useState, useEffect } from 'react'

export const useImageOptimization = (src, options = {}) => {
	const [state, setState] = useState({
		loading: true,
		error: false,
		loaded: false
	})

	const { 
		placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
		timeout = 10000 
	} = options

	useEffect(() => {
		if (!src) {
			setState({ loading: false, error: true, loaded: false })
			return
		}

		setState({ loading: true, error: false, loaded: false })

		const img = new Image()
		let timeoutId

		const handleLoad = () => {
			clearTimeout(timeoutId)
			setState({ loading: false, error: false, loaded: true })
		}

		const handleError = () => {
			clearTimeout(timeoutId)
			setState({ loading: false, error: true, loaded: false })
		}

		// Timeout para evitar carga infinita
		timeoutId = setTimeout(() => {
			img.src = ''
			handleError()
		}, timeout)

		img.onload = handleLoad
		img.onerror = handleError
		img.src = src

		return () => {
			clearTimeout(timeoutId)
			img.onload = null
			img.onerror = null
		}
	}, [src, timeout])

	return {
		...state,
		src: state.loaded ? src : placeholder
	}
}
