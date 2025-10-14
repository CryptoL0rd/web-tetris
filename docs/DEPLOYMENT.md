# 🚀 Инструкции по развертыванию TETRIS

## Руководство по развертыванию веб-приложения

**Версия:** 2.0.0
**Среда развертывания:** Веб-браузеры, статические хостинги
**Статус:** Готово к развертыванию

---

## 📋 Содержание

1. [Обзор развертывания](#обзор-развертывания)
2. [Локальное развертывание](#локальное-развертывание)
3. [Производственное развертывание](#производственное-развертывание)
4. [Облачные платформы](#облачные-платформы)
5. [Контейнеризация](#контейнеризация)
6. [CDN и оптимизация](#cdn-и-оптимизация)
7. [Мониторинг и логирование](#мониторинг-и-логирование)
8. [Безопасность развертывания](#безопасность-развертывания)
9. [Откат и резервное копирование](#откат-и-резервное-копирование)
10. [Устранение неполадок развертывания](#устранение-неполадок-развертывания)

---

## Обзор развертывания

### Типы развертывания

Проект **Academic Tetris** поддерживает несколько стратегий развертывания:

1. **Локальное развертывание**: Для разработки и тестирования
2. **Статический хостинг**: Развертывание на платформах типа GitHub Pages, Netlify, Vercel
3. **Традиционный веб-хостинг**: Развертывание на Apache, Nginx серверах
4. **Контейнеризация**: Docker-контейнеры для изолированного развертывания
5. **CDN развертывание**: Глобальное распределение через Content Delivery Network

### Требования к развертыванию

#### Минимальные требования

- **Дисковое пространство**: Менее 1 MB для основных файлов
- **Память**: 512 MB RAM для базовой работы
- **Сеть**: Стабильное интернет-соединение для загрузки ресурсов
- **Безопасность**: HTTPS поддержка для полной функциональности

---

## Локальное развертывание

### Быстрый запуск для разработки

#### Способ 1: Python HTTP Server (Рекомендуемый)

```bash
# Переход в директорию проекта
cd /path/to/web-tetris

# Запуск встроенного HTTP сервера Python
python3 -m http.server 8000

# Альтернатива для старых версий Python
python -m SimpleHTTPServer 8000

# Доступ к игре
# Откройте браузер и перейдите на http://localhost:8000
```

**Преимущества:**
- ✅ Не требует установки дополнительного ПО
- ✅ Подходит для всех операционных систем
- ✅ Автоматическая обработка MIME типов
- ✅ Поддержка HTTPS через дополнительные инструменты

**Недостатки:**
- ❌ Ограниченная поддержка HTTPS
- ❌ Нет сжатия ресурсов
- ❌ Минимальные возможности мониторинга

#### Способ 2: Node.js HTTP Server

```bash
# Установка http-server глобально (если не установлен)
npm install -g http-server

# Запуск сервера с оптимизациями
http-server /path/to/web-tetris \
    --port 8000 \
    --cors \
    --gzip \
    --cache=-1 \
    --open

# Параметры:
# --port 8000    : порт сервера
# --cors         : включение CORS заголовков
# --gzip         : сжатие ресурсов
# --cache=-1     : отключение кеширования для разработки
# --open         : автоматическое открытие браузера
```

#### Способ 3: PHP Built-in Server

```bash
# Запуск PHP сервера (если PHP установлен)
php -S localhost:8000

# Или с указанием корневой директории
php -S localhost:8000 -t /path/to/web-tetris

# Для поддержки .htaccess файлов
php -S localhost:8000 -t /path/to/web-tetris /path/to/web-tetris/index.php
```

### Локальное развертывание с HTTPS

#### Использование mkcert для локального HTTPS

```bash
# Установка mkcert (для создания локальных сертификатов)
# macOS
brew install mkcert

# Linux
sudo apt install libnss3-tools
wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64
chmod +x mkcert-v1.4.3-linux-amd64
sudo mv mkcert-v1.4.3-linux-amd64 /usr/local/bin/mkcert

# Создание локального Certificate Authority
mkcert -install

# Создание сертификата для localhost
mkcert localhost 127.0.0.1 ::1

# Запуск сервера с HTTPS
python3 -m http.server 8000 --bind 127.0.0.1 --ssl-cert localhost.pem --ssl-key localhost-key.pem
```

---

## Производственное развертывание

### Статический хостинг

#### Конфигурация для статических файлов

Проект готов к развертыванию как статическое веб-приложение:

```javascript
// Проверка готовности к статическому развертыванию
const deploymentCheck = {
    // Проверка отсутствия серверной логики
    hasServerSideCode: false,

    // Проверка использования только Web APIs
    usesOnlyWebAPIs: true,

    // Проверка размера ресурсов
    totalSize: calculateTotalSize(),

    // Рекомендации по развертыванию
    recommendations: [
        'Использовать CDN для статических ресурсов',
        'Включить gzip сжатие',
        'Настроить правильные заголовки безопасности',
        'Включить кеширование для оптимальной производительности'
    ]
};
```

#### Необходимые заголовки безопасности

```http
# Рекомендуемые заголовки безопасности для production
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
```

### Веб-серверы

#### Apache конфигурация

**`.htaccess` для Apache:**

```apache
# .htaccess для Tetris проекта
<IfModule mod_rewrite.c>
    # Включение перезаписи URL
    RewriteEngine On

    # Обработка основных файлов
    RewriteRule ^index\.html$ - [L]

    # Fallback для SPA-подобного поведения
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Настройка MIME типов
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType text/css .css
    AddType audio/mpeg .mp3
    AddType image/png .png
    AddType image/x-icon .ico
    AddEncoding gzip .js .css .html
</IfModule>

# Кеширование статических ресурсов
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType audio/mpeg "access plus 1 month"
</IfModule>
```

#### Nginx конфигурация

**Конфигурация виртуального хоста:**

```nginx
# nginx.conf для Tetris проекта
server {
    listen 80;
    server_name tetris.example.com;
    root /var/www/tetris;
    index index.html tetris-enhanced.html;

    # Заголовки безопасности
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Кеширование статических ресурсов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|mp3)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        gzip_vary on;
        gzip_min_length 1024;
        gzip_proxied expired no-cache no-store private must-revalidate auth;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss;
    }

    # Основной маршрут
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # API эндпоинты (если используются)
    location /api/ {
        proxy_pass http://backend-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Облачные платформы

### GitHub Pages

#### Автоматическое развертывание

```bash
# Создание репозитория на GitHub
git init
git add .
git commit -m "Initial commit: Academic Tetris v2.0.0"
git remote add origin https://github.com/username/tetris.git
git push -u origin main

# Включение GitHub Pages
# 1. Перейти в Settings -> Pages
# 2. Выбрать Source: GitHub Actions
```

**GitHub Actions workflow:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci

      - name: Build (если требуется)
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

#### Ручное развертывание

```bash
# Клонирование репозитория
git clone https://github.com/username/tetris.git
cd tetris

# Создание ветки gh-pages
git checkout -b gh-pages

# Удаление ненужных файлов для production
rm -rf docs/ tests/ .git/
# Оставить только необходимые файлы: index.html, tetris-enhanced.html, assets/

# Фиксация изменений
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Включение Pages в настройках репозитория
```

### Netlify

#### Автоматическое развертывание

**`netlify.toml` конфигурация:**

```toml
[build]
  publish = "."
  command = "echo 'No build step required for static site'"

[build.environment]
  NODE_VERSION = "16"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = false
  minify = true

[build.processing.js]
  bundle = false
  minify = true

[build.processing.html]
  pretty_urls = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### CLI развертывание

```bash
# Установка Netlify CLI
npm install -g netlify-cli

# Авторизация
netlify login

# Развертывание сайта
netlify deploy --prod --dir=. --site=your-site-id

# Параметры развертывания:
# --prod       : production развертывание
# --dir=.      : директория для развертывания
# --site=      : ID сайта в Netlify
```

### Vercel

#### Конфигурация развертывания

**`vercel.json`:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

#### CLI команды

```bash
# Установка Vercel CLI
npm install -g vercel

# Развертывание проекта
vercel --prod

# Привязка к существующему проекту
vercel --prod --confirm
```

---

## Контейнеризация

### Docker развертывание

#### Dockerfile для Nginx

```dockerfile
# Базовый образ с Nginx
FROM nginx:alpine

# Метаданные образа
LABEL maintainer="Academic Tetris Team"
LABEL version="2.0.0"
LABEL description="Academic Tetris web application"

# Копирование файлов приложения
COPY . /usr/share/nginx/html

# Копирование кастомной конфигурации Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Создание не-root пользователя
RUN addgroup -g 1001 -S tetris && \
    adduser -S tetris -u 1001

# Установка правильных разрешений
RUN chown -R tetris:tetris /usr/share/nginx/html && \
    chown -R tetris:tetris /var/cache/nginx && \
    chown -R tetris:tetris /var/log/nginx && \
    chown -R tetris:tetris /etc/nginx/conf.d

# Переключение на не-root пользователя
USER tetris

# Проверка здоровья контейнера
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Экспорт порта
EXPOSE 80

# Команда запуска
CMD ["nginx", "-g", "daemon off;"]
```

#### Кастомная конфигурация Nginx для Docker

```nginx
# nginx.conf для Docker контейнера
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Заголовки безопасности
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Обработка основных файлов
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кеширование статических ресурсов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|mp3)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

#### Docker Compose для полного развертывания

```yaml
# docker-compose.yml для Tetris приложения
version: '3.8'

services:
  tetris-web:
    build: .
    ports:
      - "8000:80"
    environment:
      - NODE_ENV=production
      - VIRTUAL_HOST=tetris.local
    volumes:
      - ./logs:/var/log/nginx
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Опциональный сервис мониторинга
  tetris-monitor:
    image: nginx:alpine
    ports:
      - "8001:80"
    volumes:
      - ./monitoring.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - tetris-web
    profiles:
      - monitoring

# Сети для изоляции
networks:
  default:
    name: tetris-network
    driver: bridge

# Volumes для постоянного хранения
volumes:
  tetris-logs:
    driver: local
```

#### Сборка и запуск контейнера

```bash
# Сборка образа
docker build -t academic-tetris:2.0.0 .

# Запуск контейнера
docker run -d \
    --name tetris-app \
    -p 8000:80 \
    --restart unless-stopped \
    academic-tetris:2.0.0

# Проверка работы контейнера
docker ps -f name=tetris-app
docker logs tetris-app

# Доступ к игре: http://localhost:8000
```

### Kubernetes развертывание

#### Манифесты для Kubernetes

**Deployment:**

```yaml
# tetris-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tetris-web
  labels:
    app: tetris
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tetris
  template:
    metadata:
      labels:
        app: tetris
    spec:
      containers:
      - name: tetris
        image: academic-tetris:2.0.0
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
```

**Service:**

```yaml
# tetris-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: tetris-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
  selector:
    app: tetris
```

---

## CDN и оптимизация

### Настройка CloudFlare

#### Конфигурация CloudFlare для Tetris

```javascript
// CloudFlare Workers для оптимизации
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = new URL(request.url)

    // Кеширование статических ресурсов
    if (url.pathname.match(/\.(js|css|png|jpg|mp3)$/)) {
        const cache = caches.default
        let response = await cache.match(request)

        if (!response) {
            response = await fetch(request)
            response = new Response(response.body, response)
            response.headers.set('Cache-Control', 'public, max-age=31536000')
            event.waitUntil(cache.put(request, response.clone()))
        }

        return response
    }

    // Основная логика приложения
    return fetch(request)
}
```

### Оптимизация ресурсов

#### Минификация и сжатие

```bash
# Установка инструментов оптимизации
npm install -g html-minifier-terser
npm install -g terser
npm install -g clean-css-cli

# Минификация HTML
html-minifier-terser \
    --collapse-whitespace \
    --remove-comments \
    --remove-optional-tags \
    --remove-redundant-attributes \
    --use-short-doctype \
    index.html > index.min.html

# Минификация JavaScript (если разделен)
terser tetris.js \
    --compress \
    --mangle \
    --output tetris.min.js

# Минификация CSS
cleancss tetris.css \
    --level 2 \
    --output tetris.min.css
```

#### Предзагрузка критических ресурсов

```html
<!-- Предзагрузка важных ресурсов в head -->
<link rel="preload" href="assets/sounds/line_clear.mp3" as="audio">
<link rel="preload" href="assets/images/favicon.ico" as="image">

<!-- DNS prefetch для внешних ресурсов -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//api.example.com">
```

---

## Мониторинг и логирование

### Настройка мониторинга

#### Метрики производительности

```javascript
// Интеграция с Google Analytics 4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID', {
    'custom_map': {
        'dimension1': 'game_version',
        'dimension2': 'device_type',
        'metric1': 'score',
        'metric2': 'play_time'
    }
});

// Отслеживание игровых событий
tetrisGame.on('gameStarted', () => {
    gtag('event', 'game_start', {
        'game_version': '2.0.0',
        'device_type': getDeviceType()
    });
});

tetrisGame.on('gameOver', (data) => {
    gtag('event', 'game_end', {
        'score': data.score,
        'level': data.level,
        'lines': data.lines,
        'play_time': data.playTime
    });
});
```

#### Логирование ошибок

```javascript
// Интеграция с сервисом логирования ошибок
window.addEventListener('error', (event) => {
    const errorData = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };

    // Отправка в сервис логирования
    sendToLoggingService('frontend_error', errorData);
});

window.addEventListener('unhandledrejection', (event) => {
    const errorData = {
        reason: event.reason,
        promise: event.promise,
        timestamp: new Date().toISOString()
    };

    sendToLoggingService('unhandled_promise_rejection', errorData);
});
```

### Инструменты мониторинга

#### Рекомендуемые сервисы

1. **Google Analytics 4**: Для отслеживания пользовательского поведения
2. **Sentry**: Для мониторинга ошибок и производительности
3. **LogRocket**: Для записи сессий пользователей
4. **DataDog**: Для комплексного мониторинга веб-приложений

---

## Безопасность развертывания

### Защита от распространенных угроз

#### Content Security Policy (CSP)

**Строгая CSP политика:**

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    audio-src 'self' https:;
    font-src 'self';
    connect-src 'self' https://api.example.com;
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
">
```

#### Защита от XSS атак

```javascript
// Валидация и очистка пользовательского ввода
class InputSanitizer {
    static sanitizeInput(input) {
        // Экранирование HTML символов
        return input
            .replace(/&/g, '&')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/g, '"')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    static validateKeyBinding(keyCode) {
        // Валидация кодов клавиш
        const allowedKeys = [
            'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp',
            'Space', 'KeyP', 'KeyR', 'KeyZ', 'KeyM'
        ];
        return allowedKeys.includes(keyCode);
    }
}
```

### HTTPS и сертификаты

#### Получение SSL сертификата

```bash
# Использование Let's Encrypt для бесплатного сертификата
sudo certbot certonly \
    --webroot \
    -w /var/www/tetris \
    -d tetris.example.com \
    --email admin@example.com \
    --agree-tos \
    --no-eff-email

# Автоматическое обновление сертификата
sudo crontab -e
# Добавить: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Откат и резервное копирование

### Стратегия отката

#### Версионное управление развертываний

```bash
# Создание релиза перед развертыванием
git tag -a v2.0.0-production -m "Production release v2.0.0"
git push origin v2.0.0-production

# В случае необходимости отката
git revert HEAD --no-edit
git push origin main
```

#### Автоматический откат при ошибках

```javascript
// Мониторинг работоспособности после развертывания
class DeploymentMonitor {
    async monitorDeployment(timeout = 300000) { // 5 минут
        const startTime = Date.now();

        return new Promise((resolve, reject) => {
            const checkHealth = async () => {
                try {
                    const response = await fetch('/health');
                    if (response.ok) {
                        resolve('Deployment successful');
                    } else {
                        throw new Error('Health check failed');
                    }
                } catch (error) {
                    if (Date.now() - startTime > timeout) {
                        reject(new Error('Deployment failed - rolling back'));
                        this.rollback();
                    } else {
                        setTimeout(checkHealth, 5000);
                    }
                }
            };

            checkHealth();
        });
    }

    async rollback() {
        console.log('Starting rollback procedure...');

        // 1. Остановка текущего развертывания
        await this.stopCurrentDeployment();

        // 2. Восстановление предыдущей версии
        await this.restorePreviousVersion();

        // 3. Перезапуск сервиса
        await this.restartService();

        console.log('Rollback completed');
    }
}
```

### Резервное копирование

#### Стратегия резервного копирования

```bash
#!/bin/bash
# backup-tetris.sh - скрипт резервного копирования

BACKUP_DIR="/backup/tetris"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Создание директории резервной копии
mkdir -p $BACKUP_DIR/$TIMESTAMP

# Копирование важных файлов
cp -r /var/www/tetris/* $BACKUP_DIR/$TIMESTAMP/

# Копирование базы данных (если используется)
if [ -f /var/lib/tetris/database.db ]; then
    cp /var/lib/tetris/database.db $BACKUP_DIR/$TIMESTAMP/
fi

# Копирование конфигурации
cp /etc/nginx/sites-available/tetris $BACKUP_DIR/$TIMESTAMP/nginx.conf
cp /etc/ssl/certs/tetris.crt $BACKUP_DIR/$TIMESTAMP/
cp /etc/ssl/private/tetris.key $BACKUP_DIR/$TIMESTAMP/

# Сжатие резервной копии
tar -czf $BACKUP_DIR/tetris_backup_$TIMESTAMP.tar.gz -C $BACKUP_DIR $TIMESTAMP

# Удаление старых резервных копий (старше 30 дней)
find $BACKUP_DIR -type f -name "*.tar.gz" -mtime +30 -delete

# Логирование резервного копирования
echo "$(date): Backup completed successfully" >> $BACKUP_DIR/backup.log
```

---

## Устранение неполадок развертывания

### Распространенные проблемы

#### 1. Проблемы с MIME типами

**Симптом:** JavaScript файлы не загружаются, ресурсы недоступны

**Диагностика:**
```bash
# Проверка MIME типов
curl -I http://your-domain.com/tetris.js

# Должно вернуть:
# Content-Type: application/javascript
```

**Решение:**
```nginx
# Добавление правильных MIME типов в Nginx
location ~* \.(js|css)$ {
    add_header Content-Type application/javascript;
    add_header Content-Type text/css;
}
```

#### 2. Проблемы с HTTPS

**Симптом:** Смешанное содержимое, проблемы с localStorage

**Диагностика:**
```bash
# Проверка сертификата
curl -vI https://your-domain.com

# Проверка цепочки сертификатов
openssl s_client -connect your-domain.com:443
```

#### 3. Проблемы с кешированием

**Симптом:** Старые версии файлов загружаются после обновления

**Решение:**
```nginx
# Отключение кеширования для development
location ~* \.(js|css|html)$ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    expires 0;
}
```

### Инструменты диагностики

#### Локальная диагностика

```bash
# Проверка доступности порта
netstat -tlnp | grep :8000

# Проверка процессов
ps aux | grep python

# Проверка логов
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

#### Онлайн инструменты

1. **GTmetrix**: Анализ скорости загрузки сайта
2. **Google PageSpeed Insights**: Оптимизация производительности
3. **SSL Labs**: Проверка SSL сертификата
4. **Security Headers**: Анализ заголовков безопасности

### Планы действий при чрезвычайных ситуациях

#### Сценарий критического сбоя

```javascript
class EmergencyHandler {
    static async handleCriticalFailure(error) {
        console.error('CRITICAL FAILURE:', error);

        // 1. Немедленное уведомление администратора
        await this.notifyAdmin(error);

        // 2. Переключение на резервный режим
        this.enableFallbackMode();

        // 3. Сбор диагностической информации
        const diagnostics = this.collectDiagnostics();

        // 4. Попытка автоматического восстановления
        const recovered = await this.attemptRecovery();

        if (!recovered) {
            // 5. Показать пользователю сообщение об ошибке
            this.showUserErrorMessage();
        }
    }
}
```

---

## Заключение

### Контрольный список развертывания

#### Перед развертыванием

- [ ] Тестирование на локальной среде
- [ ] Проверка всех зависимостей
- [ ] Валидация конфигурации
- [ ] Проверка безопасности
- [ ] Резервное копирование текущей версии

#### Во время развертывания

- [ ] Мониторинг процесса развертывания
- [ ] Проверка работоспособности после развертывания
- [ ] Тестирование основных функций
- [ ] Проверка производительности
- [ ] Мониторинг ошибок

#### После развертывания

- [ ] Настройка мониторинга
- [ ] Проверка логов
- [ ] Тестирование на различных устройствах
- [ ] Проверка безопасности
- [ ] Документирование развертывания

### Поддержка и сопровождение

#### Рекомендации по сопровождению

1. **Регулярные обновления**:
   - Обновление зависимостей безопасности
   - Мониторинг уязвимостей
   - Обновление сертификатов SSL

2. **Мониторинг производительности**:
   - Настройка оповещений о проблемах
   - Регулярный анализ логов
   - Оптимизация ресурсов

3. **Резервное копирование**:
   - Автоматическое резервное копирование
   - Тестирование восстановления
   - Мониторинг места хранения

### Контакты поддержки

- **Техническая поддержка**: support@tetris.example.com
- **Экстренные проблемы**: emergency@tetris.example.com
- **Документация**: docs.tetris.example.com
- **Исходный код**: github.com/username/tetris

---

**Версия руководства:** 2.0.0
**Последнее обновление:** Январь 2024
**Авторы:** Академическая команда проекта TETRIS