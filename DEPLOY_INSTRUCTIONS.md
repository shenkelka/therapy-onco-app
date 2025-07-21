# Инструкции по загрузке в GitHub

Поскольку git команды заблокированы в Replit, вам нужно вручную загрузить файлы в ваш GitHub репозиторий.

## Шаг 1: Скачать файлы проекта

Скачайте все файлы из вашего Replit проекта:

### Основные файлы для загрузки:
- `package.json` - зависимости проекта
- `package-lock.json` - точные версии зависимостей
- `tsconfig.json` - настройки TypeScript
- `vite.config.ts` - настройки Vite
- `tailwind.config.ts` - настройки Tailwind CSS
- `postcss.config.js` - настройки PostCSS
- `components.json` - настройки Shadcn/ui
- `drizzle.config.ts` - настройки Drizzle ORM
- `README.md` - описание проекта
- `.gitignore` - игнорируемые файлы

### Папки для загрузки:
- `client/` - весь фронтенд
- `server/` - весь бэкенд  
- `shared/` - общие схемы
- `attached_assets/` - ресурсы дизайна

## Шаг 2: Загрузка в GitHub

1. Зайдите в ваш репозиторий: https://github.com/shenkelka/therapy-onco-app
2. Нажмите "uploading an existing file" или "Add file" → "Upload files"
3. Перетащите все файлы и папки в область загрузки
4. Добавьте commit message: "Initial commit - therapy journal app"
5. Нажмите "Commit changes"

## Шаг 3: Настройка для деплоя

После загрузки файлов вы можете задеплоить приложение на:

### Vercel (рекомендуется)
1. Зайдите на vercel.com
2. Подключите GitHub аккаунт
3. Импортируйте репозиторий therapy-onco-app
4. Vercel автоматически определит настройки проекта

### Netlify
1. Зайдите на netlify.com
2. "New site from Git" → выберите ваш репозиторий
3. Build command: `npm run build`
4. Publish directory: `dist`

### Railway
1. Зайдите на railway.app
2. "Deploy from GitHub repo"
3. Выберите therapy-onco-app
4. Railway автоматически определит настройки

## Переменные окружения

Для продакшен деплоя может понадобиться настроить:
- `NODE_ENV=production`
- `DATABASE_URL` (если будете использовать реальную БД)

## Структура проекта готова!

Ваше приложение содержит:
✓ Полноценный фронтенд на React + TypeScript
✓ Backend API на Express
✓ Мобильный дизайн с мягкой цветовой палитрой
✓ Дневник терапии с отслеживанием лечения
✓ Систему взаимопомощи
✓ Блок персонализированных рекомендаций
✓ Демо-данные для тестирования