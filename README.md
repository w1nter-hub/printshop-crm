# PrintShop CRM System

Кроссплатформенная система управления клиентами для полиграфического предприятия PrintShop.

## Описание проекта

PrintShop CRM - это веб-приложение для управления клиентами, продуктами и заказами полиграфического предприятия. Система позволяет:

- Управлять базой клиентов
- Вести каталог продуктов и услуг
- Создавать и отслеживать заказы
- Изменять статусы заказов
- Просматривать статистику работы

## Технологический стек

### Backend
- **Python 3.11**
- **FastAPI** - современный веб-фреймворк
- **SQLAlchemy** - ORM для работы с БД
- **SQLite** - база данных
- **Pydantic** - валидация данных
- **JWT** - аутентификация

### Frontend
- **React 18** - UI библиотека
- **Vite** - сборщик проекта
- **Ant Design** - UI компоненты
- **Axios** - HTTP клиент
- **React Router** - роутинг

## Требования

- Python 3.11+
- Node.js 18+
- npm или yarn

## Установка и запуск

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd printshop-crm
```

### 2. Установка Backend
```bash
cd backend

# Создать виртуальное окружение
python -m venv venv

# Активировать виртуальное окружение
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt

# Создать файл .env на основе .env.example
cp .env.example .env

# Применить миграции базы данных
alembic upgrade head

# Запустить сервер
uvicorn main:app --reload
```

Backend будет доступен на **http://localhost:8000**

API документация (Swagger): **http://localhost:8000/docs**

### 3. Установка Frontend
```bash
cd frontend

# Установить зависимости
npm install

# Создать файл .env на основе .env.example
cp .env.example .env

# Запустить dev сервер
npm run dev
```

Frontend будет доступен на **http://localhost:5173**

## Использование

### Первый вход

1. Откройте http://localhost:5173
2. Перейдите на страницу регистрации
3. Создайте учетную запись
4. Войдите в систему

### Тестовый пользователь

Если вы уже создали тестового пользователя через Swagger:

- **Email:** admin@printshop.kz
- **Пароль:** admin123

### Основные функции

#### Управление клиентами
- Добавление новых клиентов
- Редактирование информации о клиентах
- Удаление клиентов
- Поиск по имени, телефону, email

#### Управление продуктами
- Создание каталога продуктов/услуг
- Установка базовых цен
- Деактивация неактуальных продуктов
- Указание единиц измерения

#### Управление заказами
- Создание заказов с несколькими позициями
- Выбор клиента из базы
- Добавление продуктов с количеством и ценой
- Установка срока выполнения
- Изменение статусов заказов:
  - Новый
  - В работе
  - Готов
  - Выдан
  - Отменен
- Просмотр детальной информации о заказе

#### Dashboard
- Общая статистика по системе
- Количество клиентов
- Количество продуктов
- Общее количество заказов
- Количество завершенных заказов

## Структура проекта

```
printshop-crm/
├── backend/                # Backend приложение
│   ├── app/
│   │   ├── api/           # API роуты
│   │   ├── models/        # SQLAlchemy модели
│   │   ├── schemas/       # Pydantic схемы
│   │   ├── services/      # Бизнес-логика
│   │   └── core/          # Конфигурация
│   ├── alembic/           # Миграции БД
│   ├── main.py            # Точка входа
│   └── requirements.txt   # Зависимости
│
├── frontend/              # Frontend приложение
│   ├── src/
│   │   ├── pages/        # Страницы
│   │   ├── services/     # API сервисы
│   │   ├── App.jsx       # Главный компонент
│   │   └── main.jsx      # Точка входа
│   └── package.json      # Зависимости
│
└── README.md             # Документация
```

## API Endpoints

### Authentication
- `POST /auth/register` - Регистрация пользователя
- `POST /auth/login` - Вход в систему

### Clients
- `GET /clients` - Получить список клиентов
- `GET /clients/{id}` - Получить клиента по ID
- `POST /clients` - Создать клиента
- `PUT /clients/{id}` - Обновить клиента
- `DELETE /clients/{id}` - Удалить клиента

### Products
- `GET /products` - Получить список продуктов
- `GET /products/{id}` - Получить продукт по ID
- `POST /products` - Создать продукт
- `PUT /products/{id}` - Обновить продукт
- `DELETE /products/{id}` - Деактивировать продукт

### Orders
- `GET /orders` - Получить список заказов
- `GET /orders/{id}` - Получить заказ по ID
- `POST /orders` - Создать заказ
- `PUT /orders/{id}` - Обновить заказ
- `DELETE /orders/{id}` - Удалить заказ

## Разработка

### Backend
```bash
cd backend
# Создать новую миграцию
alembic revision --autogenerate -m "description"
# Применить миграции
alembic upgrade head
```

### Frontend
```bash
cd frontend
# Сборка для production
npm run build
# Preview production build
npm run preview
```

## Лицензия

MIT License

## Автор

PrintShop CRM Development Team
