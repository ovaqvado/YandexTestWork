const button = document.getElementById('btn_buy')
const basket = document.getElementById('basket_box')
const groupItems = document.querySelectorAll('.group_item')
const dragItems = document.querySelectorAll('.drag_item')

// Drag items for mobile
let selectedItem = null
let offsetX = 0
let offsetY = 0

function handleDragStart(e) {
	selectedItem = this
	this.classList.add('selected')
}

function handleDragEnd() {
	if (selectedItem) {
		selectedItem.classList.remove('selected')
		selectedItem = null
	}
}

for (const product of dragItems) {
	product.draggable = true
	product.addEventListener('dragstart', handleDragStart)
	product.addEventListener('dragend', handleDragEnd)

	// Touch events for mobile
	product.addEventListener('touchstart', function (e) {
		e.preventDefault()
		selectedItem = this
		this.classList.add('selected')
		offsetX = e.touches[0].clientX - this.getBoundingClientRect().left
		offsetY = e.touches[0].clientY - this.getBoundingClientRect().top
	})

	product.addEventListener('touchmove', function (e) {
		e.preventDefault()
		if (selectedItem) {
			const currentX = e.touches[0].clientX - offsetX
			const currentY = e.touches[0].clientY - offsetY
			selectedItem.style.position = 'absolute' // Позиционирование для перемещения
			selectedItem.style.transform = `translate(${currentX}px, ${currentY}px)`
		}
	})

	product.addEventListener('touchend', function () {
		if (selectedItem) {
			const basketRect = basket.getBoundingClientRect()
			const itemRect = selectedItem.getBoundingClientRect()

			// Проверка на нахождение товара над корзиной
			if (
				itemRect.left < basketRect.right &&
				itemRect.right > basketRect.left &&
				itemRect.top < basketRect.bottom &&
				itemRect.bottom > basketRect.top
			) {
				handleProductDrop(selectedItem.src)
			}

			this.classList.remove('selected')
			this.style.transform = '' // Сброс позиции
			selectedItem = null
		}
	})
}

// Drag over and drop for basket
basket.addEventListener('dragover', e => {
	e.preventDefault()
})

basket.addEventListener('drop', e => {
	e.preventDefault()
	const productSrc = e.dataTransfer.getData('text/plain')
	if (productSrc) {
		handleProductDrop(productSrc)
	}
})

// Touch events for basket
basket.addEventListener('touchstart', function (e) {
	e.preventDefault()
	if (selectedItem) {
		handleProductDrop(selectedItem.src)
	}
})

function handleProductDrop(productSrc) {
	const newProduct = document.createElement('img')
	newProduct.src = productSrc
	newProduct.alt = 'Product'
	newProduct.classList.add('basket_product')
	basket.appendChild(newProduct)

	const productToRemove = Array.from(dragItems).find(
		item => item.src === productSrc
	)
	if (productToRemove) {
		productToRemove.remove()
	}

	const basketProducts = basket.querySelectorAll('.basket_product')
	if (basketProducts.length >= 2) {
		button.classList.add('view')
		button.style.display = 'block'
	} else {
		button.classList.remove('view')
		button.style.display = 'none'
	}
}

// Drag over group items
for (const group of groupItems) {
	group.addEventListener('dragover', e => {
		e.preventDefault()
		const activeProduct = group.querySelector('.selected')
		const currentProduct = e.target
		const isMoveable =
			activeProduct !== currentProduct &&
			currentProduct.classList.contains('drag_item')
		if (!isMoveable) {
			return
		}
		const nextElement =
			currentProduct === activeProduct.nextElementSibling
				? currentProduct.nextElementSibling
				: currentProduct
		group.insertBefore(activeProduct, nextElement)
	})
}
