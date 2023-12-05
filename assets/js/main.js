const contentContainer = document.querySelector('#content-container')
const cartCounterLabel = document.querySelector('#cart-counter-label')

let cartCounter = 0
let cartPrice = 0

const btnClickHandler = (e) => {
    const target = e.target
    const interval = 2000
    let restoreHTML = null

    if (typeof target !== 'object') return
    if (!target.matches('.item-actions__cart')) return

    incrementCounter(cartCounterLabel, ++cartCounter)
    cartPrice = getPrice(target, cartPrice)
    restoreHTML = target.innerHTML
    target.innerHTML = `Added ${cartPrice} $`
    disableControls(target, contentContainer, btnClickHandler)

    setTimeout(() => {
        target.innerHTML = restoreHTML
        enableControls(target, contentContainer, btnClickHandler)
    }, interval);
}

contentContainer.addEventListener('click', btnClickHandler)

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