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
        cartItems.forEach((item) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.innerHTML = `${item.title} - $${item.price}`;
            cartModalBody.appendChild(cartItemElement);
        });
    } else {
        cartModalBody.innerHTML = 'No items in the cart';
    }
}

document.querySelector('.page-header__cart-btn').addEventListener('click', () => {
    updateCartModal();
    cartModal.show();
});