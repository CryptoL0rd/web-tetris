# 🔌 API документация TETRIS

## Программный интерфейс игрового движка

**Версия API:** 2.0.0
**Статус:** Стабильный
**Совместимость:** ES6+

---

## 📋 Содержание

1. [Обзор API](#обзор-api)
2. [Основные классы](#основные-классы)
3. [Интерфейсы и типы](#интерфейсы-и-типы)
4. [Методы игрового движка](#методы-игрового-движка)
5. [События и коллбэки](#события-и-коллбэки)
6. [Примеры использования](#примеры-использования)
7. [Расширения и плагины](#расширения-и-плагины)
8. [Отладка и диагностика](#отладка-и-диагностика)

---

## Обзор API

### Архитектура API

API игрового движка TETRIS построен на принципах объектно-ориентированного программирования с четким разделением ответственности между компонентами.

### Основные принципы

- **Единственная ответственность**: Каждый класс имеет четко определенную цель
- **Открытость для расширения**: Легкость добавления новой функциональности
- **Строгая типизация**: Использование JSDoc аннотаций для документирования типов
- **Независимость**: Минимальные зависимости между компонентами

---

## Основные классы

### 1. TetrisGame

Основной класс игрового движка, координирующий все аспекты игры.

#### Конструктор

```javascript
/**
 * Создание экземпляра игры TETRIS
 * @param {HTMLCanvasElement} canvas - Основной canvas элемент для рендеринга
 * @param {Object} options - Параметры конфигурации игры
 * @param {HTMLCanvasElement} options.nextPieceCanvas - Canvas для предпросмотра следующей фигуры
 * @param {Object} options.grid - Параметры игрового поля
 * @param {number} options.grid.cols - Количество колонок (по умолчанию: 10)
 * @param {number} options.grid.rows - Количество рядов (по умолчанию: 20)
 * @param {Object} options.performance - Параметры производительности
 * @param {number} options.performance.targetFPS - Целевая частота кадров (по умолчанию: 60)
 */
const game = new TetrisGame(canvas, {
    nextPieceCanvas: nextPieceCanvas,
    grid: { cols: 10, rows: 20 },
    performance: { targetFPS: 60 }
});
```

#### Свойства экземпляра

| Свойство | Тип | Описание |
|----------|-----|----------|
| `score` | `number` | Текущий счет игрока |
| `level` | `number` | Текущий уровень сложности |
| `lines` | `number` | Количество очищенных линий |
| `isPaused` | `boolean` | Состояние паузы игры |
| `isGameOver` | `boolean` | Состояние завершения игры |
| `currentPiece` | `Object|null` | Текущая активная фигура |
| `nextPiece` | `Object|null` | Следующая фигура |
| `grid` | `Array<Array>` | Игровое поле |

### 2. Logger

Система централизованного логирования для отслеживания событий и диагностики.

#### Конструктор

```javascript
/**
 * Создание системы логирования
 * @param {Object} options - Параметры конфигурации
 * @param {string} options.level - Минимальный уровень логирования ('DEBUG', 'INFO', 'WARN', 'ERROR')
 * @param {number} options.maxHistorySize - Максимальное количество записей в истории (по умолчанию: 1000)
 */
const logger = new Logger({
    level: 'INFO',
    maxHistorySize: 1000
});
```

#### Методы

##### log(level, message, context, data)

Основной метод логирования с поддержкой различных уровней детализации.

```javascript
/**
 * Запись сообщения в лог
 * @param {string} level - Уровень важности ('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL')
 * @param {string} message - Текст сообщения
 * @param {string} context - Контекст (компонент системы)
 * @param {Object} data - Дополнительные данные для логирования
 */
logger.log('INFO', 'Игра запущена', 'GAME_ENGINE', {
    sessionId: 'sess_12345',
    userAgent: navigator.userAgent
});
```

##### Специализированные методы логирования

```javascript
// Логирование игровых событий
logger.logGameEvent('LINES_CLEARED', { lines: 4, points: 800 });

// Логирование действий пользователя
logger.logUserAction('HARD_DROP', { piece: 'T', distance: 5 });

// Логирование производительности
logger.logPerformance({
    fps: 60,
    memoryUsage: '45MB',
    renderTime: '8ms'
});
```

### 3. ErrorHandler

Система обработки ошибок с механизмами восстановления.

#### Конструктор

```javascript
/**
 * Создание системы обработки ошибок
 * @param {Logger} logger - Экземпляр логгера для записи ошибок
 */
const errorHandler = new ErrorHandler(logger);
```

#### Методы

##### handleError(error, context, showNotification)

Обработка ошибок с попыткой автоматического восстановления.

```javascript
/**
 * Обработка ошибки с классификацией и восстановлением
 * @param {Error} error - Объект ошибки JavaScript
 * @param {string} context - Контекст возникновения ошибки
 * @param {boolean} showNotification - Показывать уведомление пользователю
 * @returns {boolean} Успешность восстановления
 */
try {
    riskyOperation();
} catch (error) {
    const recovered = await errorHandler.handleError(error, 'CANVAS_RENDER');
    if (!recovered) {
        // Обработка неудачного восстановления
        showErrorMessage('Произошла критическая ошибка');
    }
}
```

### 4. PerformanceManager

Система оптимизации производительности под целевое устройство.

#### Конструктор

```javascript
/**
 * Создание менеджера производительности
 * @param {Object} options - Параметры конфигурации
 * @param {number} options.targetFPS - Целевая частота кадров
 * @param {boolean} options.adaptive - Адаптивная оптимизация
 */
const performanceManager = new PerformanceManager({
    targetFPS: 60,
    adaptive: true
});
```

#### Методы

##### shouldRender(currentTime)

Определение необходимости рендеринга кадра для поддержания целевой производительности.

```javascript
/**
 * Проверка необходимости рендеринга текущего кадра
 * @param {number} currentTime - Текущее время от requestAnimationFrame
 * @returns {boolean} Необходимость рендеринга
 */
function gameLoop(currentTime) {
    if (performanceManager.shouldRender(currentTime)) {
        updateGame();
        render();
    }

    requestAnimationFrame(gameLoop);
}
```

### 5. SettingsManager

Управление настройками игры с сохранением в localStorage.

#### Конструктор

```javascript
/**
 * Создание менеджера настроек
 * @param {Object} defaultSettings - Стандартные настройки по умолчанию
 */
const settingsManager = new SettingsManager({
    theme: 'matrix',
    soundEnabled: true,
    volume: 70,
    gridSize: 10
});
```

#### Методы

##### setTheme(themeName)

Установка цветовой темы игры.

```javascript
/**
 * Установка цветовой темы
 * @param {string} themeName - Название темы ('classic', 'dark', 'neon', 'matrix')
 */
settingsManager.setTheme('neon');
```

##### saveSettings()

Сохранение текущих настроек в постоянное хранилище.

```javascript
/**
 * Сохранение настроек в localStorage
 */
settingsManager.saveSettings();
```

---

## Интерфейсы и типы

### Определения типов

#### Piece (фигура)

```javascript
/**
 * @typedef {Object} Piece
 * @property {string} type - Тип фигуры ('I', 'O', 'T', 'S', 'Z', 'J', 'L')
 * @property {number[][]} shape - Матрица формы фигуры
 * @property {string} color - Цвет фигуры в hex формате
 * @property {number} row - Текущая строка позиции
 * @property {number} col - Текущая колонка позиции
 * @property {number} rotation - Текущее состояние поворота (0-3)
 */
```

#### GameState (состояние игры)

```javascript
/**
 * @typedef {Object} GameState
 * @property {number} score - Текущий счет
 * @property {number} level - Текущий уровень
 * @property {number} lines - Количество очищенных линий
 * @property {boolean} isPaused - Состояние паузы
 * @property {boolean} isGameOver - Состояние завершения игры
 * @property {Piece|null} currentPiece - Активная фигура
 * @property {Piece|null} nextPiece - Следующая фигура
 */
```

#### Settings (настройки)

```javascript
/**
 * @typedef {Object} Settings
 * @property {string} theme - Название темы
 * @property {boolean} soundEnabled - Включение звуковых эффектов
 * @property {boolean} musicEnabled - Включение фоновой музыки
 * @property {number} volume - Уровень громкости (0-100)
 * @property {number} gridSize - Размер игрового поля
 * @property {boolean} showGhostPiece - Показать ghost piece
 */
```

---

## Методы игрового движка

### Методы управления игрой

#### startGame()

Запуск новой игровой сессии.

```javascript
/**
 * Запуск новой игры
 * @returns {boolean} Успешность запуска
 */
const success = tetrisGame.startGame();
```

#### togglePause()

Переключение состояния паузы.

```javascript
/**
 * Пауза/продолжение игры
 * @returns {boolean} Новое состояние паузы
 */
const isNowPaused = tetrisGame.togglePause();
```

#### gameOver()

Завершение текущей игровой сессии.

```javascript
/**
 * Завершение игры
 * @returns {Object} Финальные результаты игры
 */
const results = tetrisGame.gameOver();
// results = { score: 1500, level: 8, lines: 45, playTime: 120000 }
```

### Методы управления фигурами

#### movePiece(direction)

Перемещение активной фигуры в указанном направлении.

```javascript
/**
 * Перемещение фигуры
 * @param {string} direction - Направление ('left', 'right', 'down')
 * @returns {boolean} Успешность перемещения
 */
const moved = tetrisGame.movePiece('left');
```

#### rotatePiece()

Поворот активной фигуры по часовой стрелке.

```javascript
/**
 * Поворот фигуры
 * @returns {boolean} Успешность поворота
 */
const rotated = tetrisGame.rotatePiece();
```

#### hardDropPiece()

Мгновенное падение фигуры до упора (Hard Drop).

```javascript
/**
 * Жесткое падение фигуры
 * @returns {number} Расстояние падения (для расчета очков)
 */
const dropDistance = tetrisGame.hardDropPiece();
```

### Методы получения состояния

#### getGameState()

Получение текущего состояния игры.

```javascript
/**
 * Получение текущего состояния игры
 * @returns {GameState} Объект состояния игры
 */
const state = tetrisGame.getGameState();
console.log(`Score: ${state.score}, Level: ${state.level}`);
```

#### getGrid()

Получение копии игрового поля.

```javascript
/**
 * Получение копии игрового поля
 * @returns {number[][]} Двумерный массив игрового поля
 */
const grid = tetrisGame.getGrid();
// grid[row][col] содержит тип блока (0 - пусто, 1-7 - типы фигур)
```

#### getStatistics()

Получение игровой статистики.

```javascript
/**
 * Получение статистики игрока
 * @returns {Object} Статистические данные
 */
const stats = tetrisGame.getStatistics();
// stats = { gamesPlayed: 42, highScore: 15680, totalLines: 387 }
```

---

## События и коллбэки

### Система событий

Игровой движок использует пользовательскую систему событий для уведомления о важных игровых событиях.

#### Подписка на события

```javascript
/**
 * Подписка на игровые события
 * @param {string} eventName - Название события
 * @param {Function} callback - Функция-обработчик события
 */
tetrisGame.on('linesCleared', (data) => {
    console.log(`Очищено линий: ${data.count}`);
    updateScoreDisplay(data.points);
});

tetrisGame.on('gameOver', (data) => {
    console.log(`Игра окончена! Финальный счет: ${data.score}`);
    showGameOverScreen(data);
});

tetrisGame.on('levelUp', (data) => {
    console.log(`Повышение уровня! Новый уровень: ${data.newLevel}`);
    showLevelUpAnimation();
});
```

#### Доступные события

| Событие | Параметры | Описание |
|---------|-----------|----------|
| `gameStarted` | `{ timestamp }` | Запуск новой игры |
| `gamePaused` | `{ wasPlaying }` | Пауза игры |
| `gameResumed` | `{ wasPaused }` | Продолжение игры |
| `gameOver` | `{ score, level, lines, playTime }` | Завершение игры |
| `pieceSpawned` | `{ piece, position }` | Появление новой фигуры |
| `linesCleared` | `{ count, points, newLevel }` | Очистка линий |
| `levelUp` | `{ oldLevel, newLevel }` | Повышение уровня |
| `hardDrop` | `{ piece, distance, bonusPoints }` | Жесткое падение |

### Коллбэки жизненного цикла

#### Настройка коллбэков при инициализации

```javascript
const game = new TetrisGame(canvas, {
    callbacks: {
        onUpdate: (deltaTime) => {
            // Выполняется при каждом обновлении игры
            updateUI(deltaTime);
        },
        onRender: (interpolation) => {
            // Выполняется при каждом рендере
            updateAnimations(interpolation);
        },
        onError: (error, context) => {
            // Обработка ошибок игрового движка
            handleGameError(error, context);
        }
    }
});
```

---

## Примеры использования

### Пример 1: Базовое использование

```javascript
// Инициализация игры
const canvas = document.getElementById('gameCanvas');
const nextPieceCanvas = document.getElementById('nextPieceCanvas');

const game = new TetrisGame(canvas, {
    nextPieceCanvas: nextPieceCanvas,
    grid: { cols: 10, rows: 20 }
});

// Запуск игровой сессии
game.on('gameStarted', () => {
    console.log('Игра начата!');
});

game.on('linesCleared', (data) => {
    console.log(`Очищено ${data.count} линий, +${data.points} очков`);
});

game.on('gameOver', (data) => {
    console.log(`Игра окончена! Счет: ${data.score}`);
});

// Начать игру
game.startGame();
```

### Пример 2: Расширенная интеграция

```javascript
class TetrisIntegration {
    constructor(container) {
        this.container = container;
        this.game = null;
        this.ui = new TetrisUI();
        this.audio = new TetrisAudio();
        this.statistics = new StatisticsTracker();
    }

    async initialize() {
        try {
            // Создание canvas элементов
            const gameCanvas = this.createGameCanvas();
            const nextPieceCanvas = this.createNextPieceCanvas();

            // Инициализация игрового движка
            this.game = new TetrisGame(gameCanvas, {
                nextPieceCanvas: nextPieceCanvas,
                performance: { targetFPS: 60 }
            });

            // Настройка обработчиков событий
            this.setupEventHandlers();

            // Загрузка ресурсов
            await this.loadAssets();

            // Инициализация пользовательского интерфейса
            this.ui.initialize(this.game);

            console.log('Tetris интеграция завершена успешно');

        } catch (error) {
            console.error('Ошибка инициализации:', error);
            this.handleInitializationError(error);
        }
    }

    setupEventHandlers() {
        // Обработчик завершения игры
        this.game.on('gameOver', (data) => {
            this.statistics.recordGame(data);
            this.ui.showGameOverScreen(data);
            this.audio.playGameOverSound();
        });

        // Обработчик очистки линий
        this.game.on('linesCleared', (data) => {
            this.ui.updateScore(data.points);
            this.audio.playLineClearSound();
            this.ui.showLineClearEffect(data.count);
        });

        // Обработчик ошибок
        this.game.on('error', (error) => {
            this.handleGameError(error);
        });
    }

    async loadAssets() {
        // Загрузка звуковых эффектов
        this.audio.loadSounds([
            'line_clear.mp3',
            'game_over.mp3',
            'piece_rotate.mp3'
        ]);

        // Загрузка изображений
        await this.ui.loadSprites();
    }
}

// Использование интеграции
const tetrisApp = new TetrisIntegration(document.getElementById('tetris-container'));
tetrisApp.initialize();
```

### Пример 3: Кастомные расширения

```javascript
// Создание плагина для анализа игры
class GameAnalyzer {
    constructor(game) {
        this.game = game;
        this.analytics = [];
        this.setupAnalytics();
    }

    setupAnalytics() {
        // Анализ эффективности размещения
        this.game.on('pieceSpawned', (data) => {
            this.analyzePiecePlacement(data.piece);
        });

        // Анализ комбо-атак
        this.game.on('linesCleared', (data) => {
            if (data.count >= 4) {
                this.recordTetris(data);
            }
        });
    }

    analyzePiecePlacement(piece) {
        const efficiency = this.calculatePlacementEfficiency(piece);
        this.analytics.push({
            type: 'placement',
            piece: piece.type,
            efficiency: efficiency,
            timestamp: Date.now()
        });
    }

    calculatePlacementEfficiency(piece) {
        // Анализ того, насколько эффективно размещена фигура
        const grid = this.game.getGrid();
        const holes = this.countHoles(grid);
        const height = this.getMaxHeight(grid);

        return {
            holeCount: holes,
            maxHeight: height,
            score: Math.max(0, 100 - holes * 10 - height * 2)
        };
    }

    getAnalyticsReport() {
        return {
            totalPieces: this.analytics.length,
            averageEfficiency: this.calculateAverageEfficiency(),
            tetrisCount: this.countTetris(),
            recommendations: this.generateRecommendations()
        };
    }
}

// Использование анализатора
const analyzer = new GameAnalyzer(tetrisGame);
game.on('gameOver', () => {
    const report = analyzer.getAnalyticsReport();
    console.log('Аналитический отчет:', report);
});
```

### Пример 4: Интеграция с внешними сервисами

```javascript
class TetrisCloudIntegration {
    constructor(game, config) {
        this.game = game;
        this.apiKey = config.apiKey;
        this.endpoint = config.endpoint;
        this.sessionId = this.generateSessionId();
    }

    async syncGameState() {
        const gameState = this.game.getGameState();

        try {
            await fetch(`${this.endpoint}/sessions/${this.sessionId}/state`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(gameState)
            });
        } catch (error) {
            console.error('Ошибка синхронизации:', error);
        }
    }

    async submitScore(scoreData) {
        try {
            const response = await fetch(`${this.endpoint}/scores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    ...scoreData,
                    sessionId: this.sessionId,
                    timestamp: new Date().toISOString()
                })
            });

            return await response.json();
        } catch (error) {
            console.error('Ошибка отправки счета:', error);
            return null;
        }
    }

    setupAutoSync() {
        // Автоматическая синхронизация каждые 30 секунд
        setInterval(() => {
            this.syncGameState();
        }, 30000);

        // Синхронизация при важных событиях
        this.game.on('linesCleared', () => {
            this.syncGameState();
        });

        this.game.on('gameOver', (data) => {
            this.syncGameState();
            this.submitScore(data);
        });
    }
}

// Использование облачной интеграции
const cloudIntegration = new TetrisCloudIntegration(tetrisGame, {
    apiKey: 'your-api-key',
    endpoint: 'https://api.tetris-cloud.com'
});

cloudIntegration.setupAutoSync();
```

---

## Расширения и плагины

### Архитектура плагинов

Система поддерживает расширение функциональности через плагины.

#### Создание плагина

```javascript
class TetrisPlugin {
    constructor(game, options = {}) {
        this.game = game;
        this.options = options;
        this.enabled = true;
    }

    /**
     * Инициализация плагина
     */
    initialize() {
        if (this.options.autoStart !== false) {
            this.start();
        }
    }

    /**
     * Запуск плагина
     */
    start() {
        this.setupEventListeners();
        this.onStart();
    }

    /**
     * Остановка плагина
     */
    stop() {
        this.removeEventListeners();
        this.onStop();
    }

    /**
     * Переопределение для настройки обработчиков событий
     */
    setupEventListeners() {
        // Абстрактный метод для переопределения
    }

    /**
     * Переопределение для очистки обработчиков
     */
    removeEventListeners() {
        // Абстрактный метод для переопределения
    }

    /**
     * Переопределение для действий при запуске
     */
    onStart() {
        // Абстрактный метод для переопределения
    }

    /**
     * Переопределение для действий при остановке
     */
    onStop() {
        // Абстрактный метод для переопределения
    }
}
```

#### Регистрация плагина

```javascript
// Регистрация плагина в игровом движке
tetrisGame.registerPlugin('analytics', new AnalyticsPlugin(tetrisGame));
tetrisGame.registerPlugin('achievements', new AchievementsPlugin(tetrisGame));

// Включение/отключение плагинов
tetrisGame.enablePlugin('analytics');
tetrisGame.disablePlugin('achievements');
```

### Встроенные плагины

#### StatisticsPlugin

Автоматический сбор игровой статистики.

```javascript
const statsPlugin = new StatisticsPlugin(tetrisGame, {
    autoSave: true,
    saveInterval: 60000, // Каждую минуту
    exportFormats: ['json', 'csv']
});

// Автоматический экспорт статистики
statsPlugin.exportData('json');
```

#### AchievementsPlugin

Система достижений и наград.

```javascript
const achievementsPlugin = new AchievementsPlugin(tetrisGame, {
    notifications: true,
    soundEffects: true
});

// Доступные достижения
achievementsPlugin.unlockAchievement('FIRST_TETRIS');
achievementsPlugin.checkProgress('SPEED_DEMON');
```

---

## Отладка и диагностика

### Режим отладки

#### Включение отладочного режима

```javascript
// Включение отладки через URL параметры
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('debug') === 'true') {
    tetrisGame.enableDebugMode();
}

// Программное включение отладки
tetrisGame.enableDebugMode({
    showFPS: true,
    showGrid: true,
    showCollisionBoxes: true,
    logLevel: 'DEBUG'
});
```

#### Доступные инструменты отладки

```javascript
// Отображение панели отладки
tetrisGame.showDebugPanel();

// Логирование текущего состояния
tetrisGame.logCurrentState();

// Профилирование производительности
tetrisGame.startProfiling();
setTimeout(() => {
    const profile = tetrisGame.stopProfiling();
    console.log('Профиль производительности:', profile);
}, 10000);
```

### Диагностические методы

#### Получение диагностической информации

```javascript
// Получение полной диагностики системы
const diagnostics = tetrisGame.getDiagnostics();

// Структура диагностической информации
diagnostics = {
    version: '2.0.0',
    performance: {
        fps: 60,
        memoryUsage: '45MB',
        renderTime: '8ms'
    },
    errors: {
        count: 0,
        lastError: null,
        errorHistory: []
    },
    state: {
        score: 1500,
        level: 8,
        lines: 45,
        isPaused: false,
        isGameOver: false
    },
    plugins: [
        { name: 'statistics', enabled: true },
        { name: 'achievements', enabled: false }
    ]
};
```

#### Логирование диагностики

```javascript
// Автоматическое логирование диагностики
tetrisGame.on('diagnosticUpdate', (diagnostics) => {
    if (diagnostics.performance.fps < 30) {
        console.warn('Низкая производительность:', diagnostics.performance);
    }

    if (diagnostics.errors.count > 0) {
        console.error('Обнаружены ошибки:', diagnostics.errors);
    }
});
```

---

## Заключение

### Возможности API

API игрового движка TETRIS предоставляет:

- **Полный контроль**: Над всеми аспектами игрового процесса
- **Расширяемость**: Легкость добавления новой функциональности
- **Надежность**: Встроенные механизмы обработки ошибок
- **Производительность**: Оптимизированные алгоритмы для плавной игры
- **Отладка**: Комплексные инструменты для диагностики и профилирования

### Рекомендации по использованию

1. **Изучите документацию**: Ознакомьтесь со всеми доступными методами и событиями
2. **Используйте типизацию**: Применяйте JSDoc аннотации для лучшей разработки
3. **Обрабатывайте ошибки**: Всегда используйте try-catch блоки для критичных операций
4. **Оптимизируйте производительность**: Используйте инструменты профилирования
5. **Тестируйте интеграции**: Проводите тщательное тестирование при интеграции с внешними системами

### Поддержка и развитие

- **Документация**: Регулярно обновляемая техническая документация
- **Примеры**: Готовые примеры интеграции для различных сценариев
- **Сообщество**: Активное сообщество разработчиков и пользователей
- **Поддержка**: Техническая поддержка для корпоративных клиентов

---

**Версия API:** 2.0.0
**Дата последнего обновления:** Январь 2024
**Команда разработки:** Академическая команда проекта TETRIS