// Данные кейса с разными редкостями
const caseItems = [
    { name: "Glock-18 | Берег", price: 50, img: "https://wiki.cs.money/_next/static/images/glock-18-cbacf12dbd4be93910ad9ebc54580111.png", rarity: "common" },
    { name: "USP-S | Костолом", price: 80, img: "https://wiki.swapskins.com/storage/skins/img/usp-s-target-acquired.png", rarity: "uncommon" },
    { name: "AK-47 | Красная линия", price: 150, img: "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVS7cYg3LuT94qm21GyqUpsa2j7IIDDJwI7YwvRrFi7lOa5hpfpvs_A1zI97fpmYHCU/360fx360f", rarity: "rare" },
    { name: "AWP | Электрический горилль", price: 300, img: "https://images.steamusercontent.com/ugc/1007022869720429039/A6ADF0427323CE50745F66EDCA0587FB312102CB/?imw=512&imh=384&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true", rarity: "mythical" },
    { name: "★ Нож-бабочка | Ультрафиолет", price: 1000, img: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqPP7I6vdk3lu-M1wmeyTyo7KhF2zowdyNW-mcNKUdQY-Y1iDqFS9ye3sgJfv6pvAzXJluCAj5CnUlke3hRgdP_sv26J0Ho7kIQ", rarity: "legendary" },
    { name: "★ Перчатки | Спектр", price: 800, img: "https://csgo-news.com/wp-content/uploads/2024/05/wiki_gd9y0pt_large_preview.jpg", rarity: "ancient" },
    { name: "★ Нож M9 | Автоматон", price: 1200, img: "https://cdn2.csgo.com/item/image/width=458/%E2%98%85%20M9%20Bayonet%20%7C%20Autotronic%20(Field-Tested).webp", rarity: "immortal" }
];

// Состояние пользователя
let userBalance = 1000;
let inventory = [];
let lastOpenedItem = null;

// Элементы DOM
const balanceElement = document.getElementById('user-balance');
const caseRollElement = document.getElementById('case-roll');
const openCaseButton = document.getElementById('open-case');
const inventoryElement = document.getElementById('inventory');
const inventoryCountElement = document.getElementById('inventory-count');
const depositAmountInput = document.getElementById('deposit-amount');
const depositButton = document.getElementById('deposit-btn');
const caseOpenSound = document.getElementById('caseOpenSound');
const itemRevealSound = document.getElementById('itemRevealSound');
const sellSound = document.getElementById('sellSound');
const resultActions = document.getElementById('result-actions');
const sellItemButton = document.getElementById('sell-item');
const openAgainButton = document.getElementById('open-again');
const sellPriceElement = document.getElementById('sell-price');

// Обновление баланса
function updateBalance() {
    balanceElement.textContent = userBalance;
    openCaseButton.disabled = userBalance < 100;
    openAgainButton.disabled = userBalance < 100;
}

// Добавление предмета в инвентарь
function addToInventory(item) {
    inventory.push(item);
    renderInventory();
}

// Отрисовка инвентаря
function renderInventory() {
    inventoryElement.innerHTML = inventory.map(item => `
        <div class="inventory-item ${item.rarity}">
            <img src="${item.img}" alt="${item.name}" title="${item.name}">
            <div class="price">${item.price}₽</div>
        </div>
    `).join('');
    inventoryCountElement.textContent = inventory.length;
}

// Анимация открытия кейса
function playCaseOpenAnimation() {
    return new Promise((resolve) => {
        const caseImg = document.getElementById('case-closed');
        if (!caseImg) return resolve();

        caseOpenSound.play();
        caseImg.classList.add('case-opening');
        setTimeout(() => {
            caseImg.remove();
            resolve();
        }, 500);
    });
}

// Анимация прокрутки кейса
function animateCaseOpening(callback) {
    let counter = 0;
    const rollSpeed = 50;
    const totalRolls = 30;

    const interval = setInterval(() => {
        caseRollElement.innerHTML = '';
        const currentIndex = counter % caseItems.length;
        const prevIndex = (currentIndex - 1 + caseItems.length) % caseItems.length;
        const nextIndex = (currentIndex + 1) % caseItems.length;

        caseRollElement.innerHTML = `
            <img class="case-item" src="${caseItems[prevIndex].img}" style="transform: scale(0.8); opacity: 0.6;">
            <img class="case-item" src="${caseItems[currentIndex].img}" style="transform: scale(1.1);">
            <img class="case-item" src="${caseItems[nextIndex].img}" style="transform: scale(0.8); opacity: 0.6;">
        `;

        counter++;
        if (counter >= totalRolls) {
            clearInterval(interval);
            setTimeout(() => callback(), 300);
        }
    }, rollSpeed);
}

// Открытие кейса
openCaseButton.addEventListener('click', async () => {
    if (userBalance < 100) return;

    userBalance -= 100;
    updateBalance();
    openCaseButton.disabled = true;
    resultActions.style.display = 'none';

    await playCaseOpenAnimation();
    
    animateCaseOpening(() => {
        lastOpenedItem = caseItems[Math.floor(Math.random() * caseItems.length)];
        addToInventory(lastOpenedItem);
        
        itemRevealSound.play();
        caseRollElement.innerHTML = `
            <div class="item-reveal result-item">
                <h3>Вы выиграли:</h3>
                <img src="${lastOpenedItem.img}" alt="${lastOpenedItem.name}">
                <p class="${lastOpenedItem.rarity}">${lastOpenedItem.name} (${lastOpenedItem.price}₽)</p>
            </div>
        `;
        
        // Обновляем цену продажи (70% от стоимости)
        const sellPrice = Math.floor(lastOpenedItem.price * 0.7);
        sellPriceElement.textContent = sellPrice;
        resultActions.style.display = 'flex';
        updateBalance();
    });
});

// Продажа предмета
sellItemButton.addEventListener('click', () => {
    if (!lastOpenedItem) return;
    
    const sellPrice = Math.floor(lastOpenedItem.price * 0.7);
    userBalance += sellPrice;
    sellSound.play();
    
    // Удаляем последний добавленный предмет
    inventory = inventory.filter(item => item !== lastOpenedItem);
    renderInventory();
    
    alert(`Вы продали ${lastOpenedItem.name} за ${sellPrice}₽`);
    lastOpenedItem = null;
    resultActions.style.display = 'none';
    updateBalance();
});

// Открыть снова
openAgainButton.addEventListener('click', () => {
    if (userBalance < 100) {
        alert('Недостаточно средств!');
        return;
    }
    
    resultActions.style.display = 'none';
    openCaseButton.click();
});

// Пополнение баланса
depositButton.addEventListener('click', () => {
    const amount = parseInt(depositAmountInput.value);
    if (amount >= 100) {
        userBalance += amount;
        updateBalance();
        depositAmountInput.value = '';
        alert(`Баланс пополнен на ${amount}₽!`);
    } else {
        alert('Минимальная сумма 100₽!');
    }
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updateBalance();
    renderInventory();
    
    // Показываем кейс при загрузке
    caseRollElement.innerHTML = `
        <img src="https://img.championat.com/news/big/f/u/v-cs-go-vyshel-novyj-kejs-pervyj-za-polgoda_16567606201446229397.jpg" 
             id="case-closed" 
             class="case-closed">
    `;
});
