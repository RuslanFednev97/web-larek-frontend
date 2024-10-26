# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Описание данных

Интерфейс карточки товара

```
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```
Интерфейс корзины
```
interface IBasket {
    listProducts: TBasket[]; 
	placeInBasket: () => void; 
	removeFromBasket: () => void; 
    clearBasket(): void 
    calculateTotalPrice: () => number; 
    getTotalItemCount: () => number; 
    fetchProductIds: () => string[]; 
}
```

Данные товара, используемые при добавлении в корзину
```
type TBasket = Pick<IProduct, 'title' | 'price'>;
```
Данные пользователя, используемые в форме оформления заказа (выбор способа оплаты и адресс)
```
type TFormAddress = Pick<IForm, 'payment' | 'adress'>;
```
Данные пользователя, используемые в форме оформления заказа (почта и телефон)
```
type TFormEmailAndPhone = Pick<IForm, 'email' | 'phone'>;
```

## Архитектура приложения
Приложение реализовано по MVP архитектуре.

- слой представления, отвечает за отображение на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

В приложении используется событийно-ориентированный подход. В качестве инструмента, который обеспечивает данных подход, выступает EventEmitter.

### Базовый код

#### 1. Класс `Api`

Этот код предназначен для упрощения взаимодействия с API. Он предоставляет методы для выполнения HTTP-запросов (GET и POST) и обработки ответов, что позволяет легко интегрировать API в приложение.

Метод get:
- Назначение: Выполняет HTTP GET-запрос.
- Как работает:
    - Принимает параметр uri, который добавляется к базовому URL (baseUrl).
    - Использует метод fetch для отправки запроса с методом GET.
    - Обрабатывает ответ с помощью метода handleResponse, который возвращает JSON-данные, если запрос успешен, или ошибку, если нет.

Метод post:
- Назначение: Выполняет HTTP POST-запрос (или PUT/DELETE, в зависимости от переданного параметра).
- Как работает:
    - Принимает параметры uri, data и method.
    - uri добавляется к базовому URL (baseUrl).
    - data преобразуется в строку JSON и отправляется в теле запроса.
    - method указывает, какой HTTP-метод использовать (по умолчанию 'POST').
    - Использует метод fetch для отправки запроса.
    - Обрабатывает ответ с помощью метода handleResponse.

Оба метода используют fetch API для выполнения сетевых запросов и возвращают промис, который разрешается с данными ответа или отклоняется с ошибкой.


#### 2. Класс `EventEmitter`

Этот код реализует классический шаблон проектирования "Event Emitter" (или "Event Broker") на TypeScript. Этот шаблон используется для управления событиями в приложении, позволяя объектам подписываться на события и реагировать на них, когда они происходят.
Класс имеет методы `on`, `off`, `emit` — для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события соответственно.

### Слой данных

#### Класс ProductData

Класс отвечает за хранение и логику работы с данными товара\
В полях класса хранятся следующие данные :

- cards: IProduct[] - массив объектов с товаром
- preview: string | null; - id товара, выбранного для просмотра в модальном окне

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- isOrdered: boolean; - признак включения в заказ

#### Класс FormData

Класс отвечает за хранение и логику работы с данными формы заказа\
В полях класса хранятся следующие данные :

- address - аддресс доставки
- email - почта
- phone - номер телефона
- payment - способ оплаты

Так же класс предоставляет набор методов для взаимодействия с данными.

- validateOrder(): void - валидация полей формы заказа
- clearOrder(): void - обнуляем поля заказа
- validatePayment(): void - валидация способа оплаты
- validateAddress(): void - валидация адреса доставки
- validateEmail(): void - валидация почты
- validatePhone(): void - валидация номера телефона

### Классы представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### 1. Класс `MainPage`

Отвечает за отображение главной страницы.

- `counter` - элемент отображения количества товаров в корзине
- `galery` - элемент отображения всех доступных карточек
- `basket` - кнопка для отображения корзины. Клик по кнопке вызывает событие `basket:open`

Методы:

- Сеттер `locked`
Управляет классом page__wrapper_locked для блокировки/разблокировки страницы

#### 2. Класс `Modal`

Отвечает за отображение модального окна.

- `content` - для отображения внутреннего содержания модального окна
- `closeButton` - для отображения кнопки закрытия модального окна

Привязывает события закрытие модального окна (`modal:close`) к кликам по кнопке закрытия формы и по родительскому контейнеру модального окна.

Методы: 

- `open` Метод для открытия модального окна.
- `close` Метод для закрытия модального окна.

#### 3. Класс `Basket`

Отвечает за отображение корзины.

- `list` - список отображаемых элементов в корзине
- `total` - общую ценность корзины
- `button` - кнопку открытия формы оформления заказа. Вызывает событие `order_payment:open`

Методы:

- Сеттер `items` - Обновляет содержимое списка корзины
- Сеттер `total` - Обновляет отображаемую общую стоимость корзины
- Сеттер `valid` - Устанавливает состояние кнопки (активна/неактивна) в зависимости от валидности корзины

#### 4. Класс `BasketItem`

Отвечает за отображение элементов корзины.

- `index` - порядковый номер элемента в корзине
- `title` - название элемента в корзине
- `price` - стоимость элемента в корзине
- `deleteBtn` - кнопка удаления элемента из корзины

Методы:

- Сеттер `index` - Устанавливает текст для элемента индекса, увеличивая значение на 1
- Сеттер `title` - Устанавливает текст заголовка элемента корзины
- Сеттер `price` - Устанавливает отформатированную цену элемента корзины

#### 5. Класс `Card`

Отвечает за отображение карточки, задавая в карточке данные названия товара, описание товара, цену товара, категорию товара и изображение товара. Класс используется для отображения карточек на странице сайта.

Сеттеры :
- `set category` - Устанавливает текст категории
- `set title` - Устанавливает заголовок карточки
- `set image` - Устанавливает изображение карточки
- `set description` - Устанавливает описание карточки
- `set price` - Устанавливает цену

#### 6. Класс `Form`

Отвечает за отображение базовой формы.

- `submit` - кнопку отправки формы
- `errors` - блок отображения ошибок в форме

В данном классе на весь контейнер отображение привязываем событие отслеживание input, для вызова событий вида `container.field:change` и событие `container:submit`.

Методы:

- `set valid` Сеттер для установки валидности формы. Включает или отключает кнопку отправки в зависимости от валидности.
- `set errors` Сеттер для установки текста ошибок. Устанавливает текст в блоке ошибок.
- `render` Метод для отрисовки формы. Обновляет состояние формы (валидность и ошибки). Обновляет значения полей ввода. Возвращает контейнер формы.

#### 7. Класс `FormAdress`

Класс представления, наследующийся от класса Form, для отображения формы оформления заказа с информацией об способе оплаты с адресом доставки.

- payment - способ оплаты
- address - адрес доставки

Методы:

- `setClassPaymentMethod` - Управляет выделением кнопки в зависимости от выбранного способа оплаты. Добавляет класс button_alt-active выбранной кнопке и удаляет его у остальных.
- `set payment` - Сеттер для свойства payment. Вызывает метод setClassPaymentMethod для обновления выделения кнопки.
- `set address` - Сеттер для свойства address. Устанавливает значение поля ввода адреса в форме.

#### 8. Класс `FormEmailAndPhone`

Класс представления, наследующийся от класса Form, для отображения формы оформления заказа с контактной информацией.

- email - почта для связи
- phone - телефон для связи

Методы:

- `set phone` - устанавливает значение поля ввода телефона в форме
- `set email` - устанавливает значение поля ввода email в форме

#### 9. Класс `Success`

Отвечает за отображение основной информации об оформленном заказе:

- total - общая сумма заказа

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.


*Список всех событий*
- `catalog:changed` - подгружаем доступные лоты
- `card:open` - открываем карточку лота для просмотра
- `basket:open` - открываем корзину
- `lot:changed` - добавляем/удаляем лот из корзины
- `formErrors:changed` - проверяем форму отправки
- `order_payment:open` - начинаем оформление заказа
- `order:submit` - заполнили первую форму
- `order_contacts:open` - продолжаем оформление заказа
- `contacts:submit` - заполнили первую форму
- `order:post` - завершаем заказ
- `payment:changed` - выбираем способ оплаты
- `order.address:change` - изменили адрес доставки
- `contacts.email:change` - изменили почту для связи
- `contacts.phone:change` - изменили телефон для связи
- `modal:open` - блокировка при открытии модального окна
- `modal:close` - снятие блокировки при закрытии модального окна
