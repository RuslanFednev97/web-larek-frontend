//Интерфейс карточки товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
};

//Интерфейс для модели данных товара
export interface IProductData {
    cards: IProduct[];
    preview: string | null;
    isOrdered: boolean; // признак включения в заказ
};

//Интерфейс для модели данных формы заказа
export interface IFormData {
    address: string;
    email: string;
    phone: string;
    payment: 'card' | 'cash';
	validateOrder(): void; // валидация полей формы заказа
	clearOrder(): void; // обнуляем поля заказа
	validatePayment(): void; // валидация способа оплаты
	validateAddress(): void; // валидация адреса доставки
	validateEmail(): void; // валидация почты
	validatePhone(): void; // валидация телефона
};

//Интерфейс корзины
export interface IBasket {
    listProducts: TBasket[]; 
	placeInBasket: () => void; // добавляем товар в корзину
	removeFromBasket: () => void; // удаляем товар из корзины
    clearBasket(): void // очищаем корзину
    calculateTotalPrice: () => number; // возвращает сумму всех товаров
    getTotalItemCount: () => number; // возвращает количество товаров
    fetchProductIds: () => string[]; // возвращает массив ID всех товаров
}

//Модальное окно корзины
export type TBasket = Pick<IProduct, 'title' | 'price'>;

//Модальное заказа (способ оплаты и адресс)
export type TFormAddress = Pick<IFormData, 'payment' | 'address'>;

//Модальное заказа (почта и телефон)
export type TFormEmailAndPhone = Pick<IFormData, 'email' | 'phone'>;