import React, { useState, useEffect, useRef, useMemo } from 'react'

const VirtualizedGrid = ({ items, renderItem, itemHeight = 400, columns = 3, gap = 24 }) => {
	const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 })
	const containerRef = useRef(null)
	const [containerHeight, setContainerHeight] = useState(0)

	// Calcular dimensiones
	const itemsPerRow = columns
	const rowHeight = itemHeight + gap
	const totalRows = Math.ceil(items.length / itemsPerRow)
	const totalHeight = totalRows * rowHeight

	// Memoizar los items visibles
	const visibleItems = useMemo(() => {
		const startRow = Math.floor(visibleRange.start / itemsPerRow)
		const endRow = Math.ceil(visibleRange.end / itemsPerRow)
		const startIndex = startRow * itemsPerRow
		const endIndex = Math.min(endRow * itemsPerRow, items.length)

		return items.slice(startIndex, endIndex).map((item, index) => ({
			...item,
			index: startIndex + index,
			row: Math.floor((startIndex + index) / itemsPerRow),
			col: (startIndex + index) % itemsPerRow
		}))
	}, [items, visibleRange, itemsPerRow])

	// Calcular posición de scroll
	useEffect(() => {
		const handleScroll = () => {
			if (!containerRef.current) return

			const scrollTop = containerRef.current.scrollTop
			const containerHeight = containerRef.current.clientHeight

			// Calcular rango visible con buffer
			const buffer = 2 // Filas adicionales para buffer
			const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer)
			const endRow = Math.min(
				totalRows,
				Math.ceil((scrollTop + containerHeight) / rowHeight) + buffer
			)

			const startIndex = startRow * itemsPerRow
			const endIndex = Math.min(endRow * itemsPerRow, items.length)

			setVisibleRange({ start: startIndex, end: endIndex })
		}

		const container = containerRef.current
		if (container) {
			container.addEventListener('scroll', handleScroll)
			handleScroll() // Llamada inicial
		}

		return () => {
			if (container) {
				container.removeEventListener('scroll', handleScroll)
			}
		}
	}, [rowHeight, totalRows, itemsPerRow, items.length])

	// Actualizar altura del contenedor
	useEffect(() => {
		if (containerRef.current) {
			setContainerHeight(containerRef.current.clientHeight)
		}
	}, [])

	if (items.length === 0) {
		return <div className="text-center py-12 text-gray-500">No hay elementos para mostrar</div>
	}

	return (
		<div
			ref={containerRef}
			className="overflow-auto"
			style={{ height: '100%' }}
		>
			<div
				style={{
					height: totalHeight,
					position: 'relative'
				}}
			>
				{visibleItems.map((item) => (
					<div
						key={item.id || item.index}
						style={{
							position: 'absolute',
							top: item.row * rowHeight,
							left: item.col * (100 / columns) + '%',
							width: `calc(${100 / columns}% - ${gap}px)`,
							height: itemHeight,
							marginRight: gap,
							marginBottom: gap
						}}
					>
						{renderItem(item)}
					</div>
				))}
			</div>
		</div>
	)
}

export default VirtualizedGrid
