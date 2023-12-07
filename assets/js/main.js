const contentContainer = document.querySelector('#content-container')
const cartCounterLabel = document.querySelector('#cart-counter-label')
const cartModalBody = document.querySelector('#cartModalBody');
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
const clearCartBtn = document.getElementById('clearCartBtn');


let cartCounter = 0
let cartPrice = 0
let cartItems = [];

const btnClickHandler = (e) => {
    const target = e.target
    const interval = 2000
    let restoreHTML = null

    if (typeof target !== 'object') return
    if (!target.matches('.item-actions__cart')) return

    const itemTitle = target.closest('.item-wrapper').querySelector('.item-title').textContent;
    const itemPrice = getMockData(target);

    const itemData = { title: itemTitle, price: itemPrice };

    incrementCounter(cartCounterLabel, ++cartCounter)
    cartPrice = getPrice(target, cartPrice)
    restoreHTML = target.innerHTML
    target.innerHTML = `Added ${cartPrice} $`
    disableControls(target, contentContainer, btnClickHandler)

    cartItems.push(itemData);

    setTimeout(() => {
        target.innerHTML = restoreHTML
        enableControls(target, contentContainer, btnClickHandler)
    }, interval);
}

contentContainer.addEventListener('click', btnClickHandler)

clearCartBtn.addEventListener('click', () => {
    cartItems = [];
    cartCounter = 0;
    cartPrice = 0;

    cartCounterLabel.innerHTML = '0';
    cartCounterLabel.style.display = 'none';

    updateCartModal();

    cartModal.hide();
});

function incrementCounter($label, counter) {
    $label.innerHTML = counter
    if (counter === 1) {
        $label.style.display = 'block'
    }
}

function getMockData(target) {
    return +target.parentElement
        .previousElementSibling
        .innerHTML
        .replace(/^\$(\d+)\s\D+(\d+).*$/, '$1.$2')

}

function getPrice(target, price) {
    return cartPrice = Math.round((cartPrice + getMockData(target)) * 100) / 100

}

function disableControls(target, $container, handler) {

    target.disabled = true
    $container.removeEventListener('click', handler)

}

function enableControls(target, $container, handler) {
    target.disabled = false
    $container.addEventListener('click', handler)
}

function updateCartModal() {
    cartModalBody.innerHTML = '';
    if (cartItems.length > 0) {
        cartItems.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.innerHTML = `
          ${item.title} - $${item.price}
          <button type="button" class="btn btn-outline-danger btn-sm remove-item-btn" data-index="${index}">
            <i class="fas fa-times"></i>
          </button>`;
            cartModalBody.appendChild(cartItemElement);
        });

        // Add event listeners for the "Remove" buttons
        const removeButtons = document.querySelectorAll('.remove-item-btn');
        removeButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const indexToRemove = parseInt(event.target.dataset.index, 10);
                removeItemFromCart(indexToRemove);
            });
        });
    } else {
        cartModalBody.innerHTML = 'No items in the cart';
    }
}

function removeItemFromCart(index) {
    // Remove the item from the cartItems array based on the index
    cartItems.splice(index, 1);

    // Update the cart counter and price
    cartCounter = cartItems.length;
    cartPrice = calculateTotalPrice(cartItems);

    // Update the cart counter label
    cartCounterLabel.innerHTML = cartCounter;
    cartCounterLabel.style.display = cartCounter > 0 ? 'block' : 'none';

    // Update the cart modal content
    updateCartModal();
}

function calculateTotalPrice(items) {
    return items.reduce((total, item) => total + item.price, 0);
}


document.querySelector('.page-header__cart-btn').addEventListener('click', () => {
    updateCartModal();
    cartModal.show();
});