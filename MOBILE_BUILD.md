# 📱 Инструкция по сборке мобильных приложений PrintShop CRM

## ✅ Capacitor успешно настроен!

Проект готов для создания нативных приложений Android и iOS.

---

## 📦 Что уже сделано:

✅ Установлен Capacitor и все зависимости
✅ Создан `capacitor.config.ts` с настройками
✅ Добавлены скрипты в `package.json`
✅ Собран production build
✅ Добавлена платформа Android
✅ Добавлена платформа iOS (если на Mac)

---

## 🤖 Сборка APK для Android

### Требования:
- **Android Studio** (скачать: https://developer.android.com/studio)
- **Java JDK 11+** (обычно устанавливается с Android Studio)

### Шаги:

#### 1. Открыть проект в Android Studio
```bash
cd frontend
npm run cap:android
```
Или вручную:
```bash
npx cap open android
```

#### 2. В Android Studio:

**Первый запуск:**
- Дождитесь завершения Gradle Sync
- Установите необходимые SDK компоненты (если попросит)

**Сборка Debug APK (для тестирования):**
1. `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. Дождитесь завершения сборки
3. APK будет в: `android/app/build/outputs/apk/debug/app-debug.apk`

**Сборка Release APK (для публикации):**
1. `Build` → `Generate Signed Bundle / APK`
2. Выберите `APK`
3. Нажмите `Next`

**Создание Keystore (первый раз):**
4. Нажмите `Create new...`
5. Заполните данные:
   - Key store path: выберите место сохранения (например: `printshop-keystore.jks`)
   - Password: придумайте пароль
   - Alias: `printshop`
   - Validity: 25 (лет)
   - Certificate: заполните данные организации
6. Нажмите `OK`

**Сборка:**
7. Выберите `release`
8. Нажмите `Finish`
9. APK будет в: `android/app/build/outputs/apk/release/app-release.apk`

**⚠️ ВАЖНО:** Сохраните keystore файл и пароли! Без них невозможно обновить приложение в Google Play.

---

## 🍎 Сборка IPA для iOS

### Требования:
- **macOS** (только на Mac можно собирать iOS приложения)
- **Xcode** (скачать из App Store)
- **Apple Developer аккаунт** ($99/год)

### Шаги:

#### 1. Открыть проект в Xcode
```bash
cd frontend
npm run cap:ios
```
Или вручную:
```bash
npx cap open ios
```

#### 2. В Xcode:

**Настройка:**
1. Выберите проект `App` в левой панели
2. В разделе `Signing & Capabilities`:
   - Выберите свою команду (Team)
   - Bundle Identifier: `com.printshop.crm`

**Сборка для симулятора (тестирование):**
1. Выберите симулятор в верхней панели
2. `Product` → `Run` (или Cmd+R)

**Сборка IPA (для публикации):**
1. Выберите `Any iOS Device` в верхней панели
2. `Product` → `Archive`
3. Дождитесь завершения архивации
4. В окне Organizer нажмите `Distribute App`
5. Выберите метод распространения:
   - `App Store Connect` - для публикации в App Store
   - `Ad Hoc` - для тестирования на конкретных устройствах
   - `Enterprise` - для корпоративного распространения
   - `Development` - для разработки
6. Следуйте инструкциям мастера
7. IPA файл будет экспортирован

---

## 🔄 Обновление приложения после изменений

После изменений в коде:

```bash
cd frontend

# Пересобрать веб-приложение
npm run build

# Синхронизировать с нативными платформами
npx cap sync

# Или одной командой:
npm run build:mobile
```

Затем снова откройте проект в Android Studio или Xcode и пересоберите.

---

## 📝 Полезные команды

```bash
# Собрать веб-приложение
npm run build

# Синхронизировать с нативными платформами
npm run cap:sync

# Открыть Android проект
npm run cap:android

# Открыть iOS проект (только Mac)
npm run cap:ios

# Собрать и синхронизировать одной командой
npm run build:mobile

# Добавить новую платформу
npm run cap:add:android
npm run cap:add:ios
```

---

## 🔧 Настройка приложения

### Изменить название приложения:
Отредактируйте `capacitor.config.ts`:
```typescript
appName: 'Ваше название'
```

### Изменить ID приложения:
```typescript
appId: 'com.yourcompany.yourapp'
```

### Изменить иконку:
1. Создайте иконку 1024x1024 px
2. Используйте генератор: https://icon.kitchen/
3. Замените файлы в:
   - Android: `android/app/src/main/res/`
   - iOS: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Изменить Splash Screen:
Отредактируйте `capacitor.config.ts`:
```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    backgroundColor: '#1890ff',
    showSpinner: false
  }
}
```

---

## 📱 Тестирование на устройстве

### Android:
1. Включите режим разработчика на телефоне
2. Включите отладку по USB
3. Подключите телефон к компьютеру
4. В Android Studio нажмите `Run` (зеленая кнопка)
5. Выберите ваше устройство

### iOS:
1. Подключите iPhone к Mac
2. В Xcode выберите ваше устройство
3. Нажмите `Run` (Cmd+R)
4. Первый раз нужно будет доверять сертификату на iPhone:
   - `Настройки` → `Основные` → `Управление устройством`
   - Выберите ваш профиль и нажмите `Доверять`

---

## 🚀 Публикация

### Google Play Store:
1. Создайте аккаунт разработчика ($25 один раз)
2. Создайте приложение в Google Play Console
3. Загрузите APK или AAB файл
4. Заполните описание, скриншоты
5. Отправьте на проверку

### Apple App Store:
1. Создайте аккаунт разработчика ($99/год)
2. Создайте приложение в App Store Connect
3. Загрузите IPA через Xcode или Transporter
4. Заполните описание, скриншоты
5. Отправьте на проверку

---

## ❓ Частые проблемы

### Android Studio не видит устройство:
- Установите драйверы USB для вашего телефона
- Проверьте, что отладка по USB включена
- Попробуйте другой USB кабель/порт

### Gradle sync failed:
- Проверьте подключение к интернету
- Очистите кэш: `Build` → `Clean Project`
- Перезапустите Android Studio

### iOS сборка не работает:
- Убедитесь, что у вас macOS
- Обновите Xcode до последней версии
- Проверьте, что выбрана правильная команда в настройках

### Приложение не запускается:
- Проверьте логи в Android Studio / Xcode
- Убедитесь, что backend доступен
- Проверьте CORS настройки на backend

---

## 📚 Дополнительные ресурсы

- Документация Capacitor: https://capacitorjs.com/docs
- Плагины Capacitor: https://capacitorjs.com/docs/plugins
- Android Studio: https://developer.android.com/studio/intro
- Xcode: https://developer.apple.com/xcode/

---

## 🎯 Следующие шаги

1. ✅ Установите Android Studio
2. ✅ Откройте проект: `npm run cap:android`
3. ✅ Соберите APK
4. ✅ Установите на телефон и протестируйте
5. ✅ При необходимости соберите для iOS (на Mac)

**Ваше приложение готово к сборке!** 🎉
