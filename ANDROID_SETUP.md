# 🤖 Настройка Android приложения PrintShop CRM

## ✅ Исправление проблемы с подключением к Backend

### Проблема:
Android эмулятор не может подключиться к `localhost:8000`, потому что у него своя собственная сеть.

### Решение:
Используйте специальный IP адрес `10.0.2.2` для доступа к компьютеру из эмулятора.

---

## 🚀 Пошаговая инструкция:

### **Шаг 1: Запустите Backend**

```powershell
# Откройте новый PowerShell
cd C:\Users\Winter\Desktop\student-performance-prediction\printshop-crm\backend

# Активируйте виртуальное окружение
venv\Scripts\activate

# Запустите backend на всех интерфейсах (важно!)
uvicorn main:app --host 0.0.0.0 --reload
```

**Важно:** Используйте `--host 0.0.0.0` чтобы backend был доступен из эмулятора!

### **Шаг 2: Пересоберите приложение**

```powershell
# В другом PowerShell
cd C:\Users\Winter\Desktop\student-performance-prediction\printshop-crm\frontend

# Пересобрать приложение
npm run build

# Синхронизировать с Android
npx cap sync
```

### **Шаг 3: Откройте в Android Studio**

```powershell
npx cap open android
```

### **Шаг 4: Запустите в эмуляторе**

В Android Studio:
1. Нажмите зеленую кнопку **Run** (или Shift+F10)
2. Выберите эмулятор
3. Дождитесь запуска приложения

---

## 🔧 Что было исправлено:

Файл `frontend/src/services/api.js` теперь автоматически определяет правильный URL:

- **В Android эмуляторе:** `http://10.0.2.2:8000`
- **В iOS симуляторе:** `http://localhost:8000`
- **В веб-браузере:** `http://localhost:8000`

---

## 📱 Тестирование:

1. **Убедитесь, что backend запущен:**
   ```powershell
   # Проверьте в браузере:
   http://localhost:8000/docs
   ```

2. **Запустите приложение в эмуляторе**

3. **Попробуйте зарегистрироваться:**
   - ФИО: Тестовый Пользователь
   - Email: test@example.com
   - Пароль: test123

4. **Если регистрация прошла успешно** - войдите в систему!

---

## ❓ Частые проблемы:

### **Ошибка: "Network Error" или "Failed to connect"**

**Причина:** Backend не запущен или запущен без `--host 0.0.0.0`

**Решение:**
```powershell
# Остановите backend (Ctrl+C)
# Запустите с правильными параметрами:
uvicorn main:app --host 0.0.0.0 --reload
```

### **Ошибка: "Email already exists"**

**Причина:** Этот email уже зарегистрирован в базе данных

**Решение 1:** Используйте другой email

**Решение 2:** Очистите базу данных:
```powershell
cd backend
# Удалите файл базы данных
Remove-Item printshop.db
# Пересоздайте базу
alembic upgrade head
```

### **Ошибка: "CORS policy"**

**Причина:** Backend не разрешает запросы с мобильного приложения

**Решение:** Проверьте `backend/app/core/config.py`:
```python
BACKEND_CORS_ORIGINS: List[str] = [
    "http://localhost:5173",
    "http://localhost:8100",  # Capacitor
    "capacitor://localhost",   # Android
    "ionic://localhost",       # iOS
]
```

---

## 🔐 Настройка CORS для мобильного приложения:

Если возникают CORS ошибки, обновите backend:

1. Откройте `backend/app/core/config.py`

2. Добавьте в `BACKEND_CORS_ORIGINS`:
   ```python
   BACKEND_CORS_ORIGINS: List[str] = [
       "http://localhost:5173",
       "capacitor://localhost",
       "ionic://localhost",
       "http://localhost",
   ]
   ```

3. Перезапустите backend

---

## 🌐 Для тестирования на реальном устройстве:

Если хотите протестировать на реальном Android телефоне:

1. **Узнайте IP адрес компьютера:**
   ```powershell
   ipconfig
   # Найдите IPv4 адрес (например: 192.168.1.100)
   ```

2. **Обновите `.env` файл:**
   ```
   VITE_API_URL=http://192.168.1.100:8000
   ```

3. **Пересоберите:**
   ```powershell
   npm run build
   npx cap sync
   ```

4. **Подключите телефон по USB и запустите из Android Studio**

---

## ✅ Контрольный список:

- [ ] Backend запущен с `--host 0.0.0.0`
- [ ] Приложение пересобрано (`npm run build`)
- [ ] Синхронизировано с Capacitor (`npx cap sync`)
- [ ] Эмулятор запущен
- [ ] Используется новый email для регистрации

---

## 🎯 Готово!

Теперь приложение должно успешно подключаться к backend и регистрация должна работать! 🎉
