# 🏗️ Архитектура игрового движка TETRIS

## Академическая документация

**Курс:** Структуры данных и алгоритмы в веб-программировании
**Тема:** Проектирование архитектуры игрового движка
**Уровень:** Продвинутый

---

## 📋 Содержание

1. [Введение](#введение)
2. [Архитектурные принципы](#архитектурные-принципы)
3. [Компонентная архитектура](#компонентная-архитектура)
4. [Шаблоны проектирования](#шаблоны-проектирования)
5. [Алгоритмическая основа](#алгоритмическая-основа)
6. [Система производительности](#система-производительности)
7. [Обработка ошибок и надежность](#обработка-ошибок-и-надежность)
8. [Заключение](#заключение)

---

## Введение

### Контекст проекта

Проект **Academic Tetris** представляет собой комплексную реализацию классической игры Тетрис в веб-среде, разработанную как демонстрацию применения фундаментальных концепций компьютерных наук в современной веб-разработке. Архитектура системы спроектирована с учетом академических требований к качеству кода, расширяемости и демонстрации лучших практик программирования.

### Цели архитектурного проектирования

1. **Модульность**: Разделение системы на независимые, слабо связанные компоненты
2. **Расширяемость**: Легкость добавления новых функций без изменения существующего кода
3. **Тестируемость**: Возможность независимого тестирования каждого компонента
4. **Производительность**: Оптимизация для достижения целевых показателей производительности
5. **Надежность**: Graceful degradation и восстановление после ошибок

### Ключевые архитектурные решения

Архитектура основана на принципах объектно-ориентированного проектирования с применением классических шаблонов программирования, адаптированных для веб-среды.

---

## Архитектурные принципы

### 1. Принцип единственной ответственности (SRP)

Каждый класс имеет четко определенную область ответственности:

```javascript
// ❌ Нарушение SRP - класс делает слишком много
class Game {
    constructor() {
        this.canvas = null;
        this.audio = null;
        this.storage = null;
        this.network = null;
    }
}

// ✅ Соблюдение SRP - разделение ответственности
class CanvasRenderer {
    constructor(canvas) { /* отвечает только за рендеринг */ }
}

class AudioManager {
    constructor() { /* отвечает только за аудио */ }
}

class GameState {
    constructor() { /* управляет состоянием игры */ }
}
```

### 2. Принцип открытости/закрытости (OCP)

Система открыта для расширения, но закрыта для модификации:

```javascript
// ✅ Расширяемая архитектура через стратегии рендеринга
class Renderer {
    constructor(strategy) {
        this.strategy = strategy;
    }

    render(gameState) {
        return this.strategy.render(gameState);
    }
}

class CanvasRenderer {
    render(gameState) { /* Canvas-specific rendering */ }
}

class WebGLRenderer {
    render(gameState) { /* WebGL-specific rendering */ }
}
```

### 3. Принцип подстановки Барбары Лисков (LSP)

Производные классы могут заменять базовые без нарушения корректности:

```javascript
// ✅ LSP-compliant архитектура
class InputHandler {
    handleInput(event) { /* базовая обработка */ }
}

class KeyboardHandler extends InputHandler {
    handleInput(event) { /* специфичная обработка клавиатуры */ }
}

class TouchHandler extends InputHandler {
    handleInput(event) { /* специфичная обработка касаний */ }
}

// Использование
const inputHandler = isMobile() ? new TouchHandler() : new KeyboardHandler();
```

---

## Компонентная архитектура

### Диаграмма компонентов

```
┌─────────────────────────────────────────────────────────────────┐
│                       Tetris Game Engine                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │   Logger    │  │ ErrorHandler│  │ Performance │  │ Settings │ │
│  │  System     │  │   System    │  │  Manager    │  │ Manager  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │InputManager │  │AudioManager │  │RenderEngine │  │GameState │ │
│  │             │  │             │  │             │  │          │ │
│  │-Keyboard    │  │-Sound FX    │  │-Canvas      │  │-Grid     │ │
│  │-Touch       │  │-Music      │  │-Animations  │  │-Score    │ │
│  │-Gamepad     │  │-Volume     │  │-Particles   │  │-Level    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Основные компоненты

#### 1. Система логирования (Logger)

**Ответственность:** Централизованное логирование всех событий системы

**Архитектурные особенности:**
- Многоуровневая система логирования (DEBUG, INFO, WARN, ERROR, CRITICAL)
- Структурированное хранение логов с метаданными
- Экспорт логов для анализа производительности

**Реализация:**
```javascript
class Logger {
    constructor() {
        this.levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, CRITICAL: 4 };
        this.currentLevel = this.levels.INFO;
        this.logHistory = [];
        this.maxHistorySize = 1000;
    }

    log(level, message, context = 'SYSTEM', data = null) {
        // Структурированное логирование с контекстом
        const entry = {
            timestamp: Date.now(),
            level,
            context,
            message,
            data
        };

        this.addToHistory(entry);
        this.outputToConsole(entry);
    }
}
```

#### 2. Система обработки ошибок (ErrorHandler)

**Ответственность:** Обеспечение надежности системы через graceful degradation

**Архитектурные особенности:**
- Стратегии восстановления для различных типов ошибок
- Классификация ошибок по контексту и критичности
- Пользовательские уведомления об ошибках

**Реализация:**
```javascript
class ErrorHandler {
    constructor(logger) {
        this.logger = logger;
        this.errorQueue = [];
        this.recoveryStrategies = new Map();
        this.initializeRecoveryStrategies();
    }

    async handleError(error, context = 'UNKNOWN', showUserNotification = true) {
        // 1. Логирование ошибки
        this.logger.log('ERROR', `Error in ${context}: ${error.message}`, context);

        // 2. Поиск стратегии восстановления
        const strategyKey = this.getErrorType(context);
        const recoveryStrategy = this.recoveryStrategies.get(strategyKey);

        // 3. Попытка восстановления
        if (recoveryStrategy) {
            const recovered = await recoveryStrategy(error);
            if (recovered) {
                this.logger.log('INFO', `Successfully recovered from ${strategyKey}`, context);
                return true;
            }
        }

        // 4. Уведомление пользователя при неудачном восстановлении
        if (showUserNotification) {
            this.showUserNotification(strategyKey);
        }

        return false;
    }
}
```

#### 3. Система управления производительностью (PerformanceManager)

**Ответственность:** Оптимизация производительности под целевое устройство

**Архитектурные особенности:**
- Адаптивная частота кадров (30-60 FPS)
- Автоматическое определение возможностей устройства
- Энергосберегающие режимы для мобильных устройств

**Реализация:**
```javascript
class PerformanceManager {
    constructor() {
        this.targetFPS = 60;
        this.isMobile = this.detectMobileDevice();
        this.isLowEndDevice = this.detectLowEndDevice();
        this.frameTime = 1000 / this.targetFPS;

        this.optimizeForDevice();
    }

    shouldRender(currentTime) {
        if (!this.isLowEndDevice) return true;

        const deltaTime = currentTime - this.lastFrameTime;
        return deltaTime >= this.frameTime;
    }

    optimizeForDevice() {
        if (this.isLowEndDevice) {
            this.targetFPS = 30;
            this.frameTime = 1000 / this.targetFPS;
            this.applyLowEndOptimizations();
        }
    }
}
```

---

## Шаблоны проектирования

### 1. Шаблон Модуль (Module Pattern)

Используется для инкапсуляции функциональности компонентов:

```javascript
const TetrisGame = (function() {
    // Приватные переменные и методы
    let gameState = {};
    let animationId = null;

    // Публичный API
    return {
        init: function(canvas) { /* инициализация игры */ },
        start: function() { /* запуск игры */ },
        pause: function() { /* пауза игры */ }
    };
})();
```

### 2. Шаблон Наблюдатель (Observer Pattern)

Реализован для обновления пользовательского интерфейса:

```javascript
class GameState extends EventEmitter {
    constructor() {
        super();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
    }

    setScore(newScore) {
        this.score = newScore;
        this.emit('scoreChanged', { score: newScore });
    }

    clearLines(count) {
        this.lines += count;
        this.emit('linesCleared', { lines: this.lines, count });
    }
}
```

### 3. Шаблон Стратегия (Strategy Pattern)

Применен для различных стратегий рендеринга:

```javascript
class RenderStrategy {
    render(gameState) {
        throw new Error('Abstract method');
    }
}

class Canvas2DRenderer extends RenderStrategy {
    render(gameState) {
        // Canvas 2D рендеринг
        this.renderGrid(gameState.grid);
        this.renderCurrentPiece(gameState.currentPiece);
    }
}

class WebGLRenderer extends RenderStrategy {
    render(gameState) {
        // WebGL рендеринг
        this.renderWithShaders(gameState);
    }
}
```

### 4. Шаблон Команда (Command Pattern)

Используется для инкапсуляции игровых команд:

```javascript
class Command {
    execute() { throw new Error('Abstract method'); }
    undo() { throw new Error('Abstract method'); }
}

class MoveLeftCommand extends Command {
    constructor(game) {
        super();
        this.game = game;
        this.previousCol = null;
    }

    execute() {
        this.previousCol = this.game.currentPiece.col;
        return this.game.movePieceLeft();
    }

    undo() {
        this.game.currentPiece.col = this.previousCol;
    }
}
```

---

## Алгоритмическая основа

### 1. Алгоритм обнаружения коллизий

**Временная сложность:** O(n), где n - количество клеток фигуры

```javascript
isValidPosition(piece, row, col, rotation = 0) {
    // Получаем повернутую форму фигуры
    const shape = this.getRotatedShape(piece, rotation);

    // Проверяем каждую клетку фигуры
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const newRow = row + r;
                const newCol = col + c;

                // Проверки границ и коллизий
                if (newRow < 0 || newRow >= this.ROWS ||
                    newCol < 0 || newCol >= this.COLS ||
                    this.grid[newRow][newCol] !== 0) {
                    return false;
                }
            }
        }
    }
    return true;
}
```

### 2. Алгоритм очистки линий

**Алгоритм:**
1. Сканирование игрового поля на наличие заполненных линий
2. Удаление заполненных линий
3. Сдвиг верхних линий вниз
4. Добавление новых пустых линий сверху

**Оптимизация:** O(m) время, где m - количество строк

```javascript
clearLines() {
    const linesToClear = [];

    // Шаг 1: Поиск заполненных линий
    for (let row = 0; row < this.ROWS; row++) {
        if (this.grid[row].every(cell => cell !== 0)) {
            linesToClear.push(row);
        }
    }

    if (linesToClear.length === 0) return 0;

    // Шаг 2: Удаление линий (снизу вверх)
    for (let i = linesToClear.length - 1; i >= 0; i--) {
        const rowIndex = linesToClear[i];
        this.grid.splice(rowIndex, 1);
        this.grid.unshift(Array(this.COLS).fill(0));
    }

    return linesToClear.length;
}
```

### 3. Алгоритм поворота матрицы

**SRS (Super Rotation System)** реализация для тетромино:

```javascript
rotateMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = Array(cols).fill().map(() => Array(rows).fill(0));

    // Поворот по часовой стрелке
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            rotated[j][rows - 1 - i] = matrix[i][j];
        }
    }

    return rotated;
}
```

---

## Система производительности

### Оптимизации рендеринга

#### 1. Adaptive Frame Rate
```javascript
class AdaptiveFrameRate {
    constructor(targetFPS = 60) {
        this.targetFPS = targetFPS;
        this.frameTime = 1000 / targetFPS;
        this.lastFrameTime = 0;
        this.fpsHistory = [];
    }

    shouldRender(currentTime) {
        const deltaTime = currentTime - this.lastFrameTime;
        if (deltaTime >= this.frameTime) {
            this.lastFrameTime = currentTime;
            this.recordFrame(currentTime);
            return true;
        }
        return false;
    }

    recordFrame(timestamp) {
        this.fpsHistory.push(timestamp);
        if (this.fpsHistory.length > 60) {
            this.fpsHistory.shift();
        }
    }

    getAverageFPS() {
        if (this.fpsHistory.length < 2) return this.targetFPS;
        const totalTime = this.fpsHistory[this.fpsHistory.length - 1] - this.fpsHistory[0];
        return Math.round(1000 / (totalTime / (this.fpsHistory.length - 1)));
    }
}
```

#### 2. Canvas optimizations
```javascript
optimizeCanvasRendering() {
    const canvas = this.ctx.canvas;
    const ctx = this.ctx;

    // Отключение сглаживания для пиксельной графики
    ctx.imageSmoothingEnabled = false;

    // Оптимизация для мобильных устройств
    if (this.isMobile) {
        canvas.style.imageRendering = 'optimizeSpeed';
        canvas.style.imageRendering = 'pixelated';
    }

    // Hardware acceleration
    canvas.style.transform = 'translateZ(0)';
    canvas.style.willChange = 'transform';
}
```

### Механизмы энергосбережения

#### Mobile Battery Optimization
```javascript
enableBatterySavingMode() {
    if (!this.isMobile) return;

    // Уменьшение частоты обновлений
    this.targetFPS = 30;

    // Отключение тяжелых анимаций
    this.disableComplexAnimations();

    // Уменьшение качества рендеринга
    this.reduceRenderQuality();

    // Мониторинг заряда батареи
    this.monitorBatteryLevel();
}
```

---

## Обработка ошибок и надежность

### Стратегии восстановления

#### 1. Canvas Error Recovery
```javascript
async recoverFromCanvasError(error) {
    this.logger.log('INFO', 'Attempting canvas error recovery', 'CANVAS');

    // Попытка 1: Software rendering fallback
    const canvas = document.getElementById('gameCanvas');
    if (canvas && !canvas.style.imageRendering) {
        canvas.style.imageRendering = 'pixelated';
        this.logger.log('INFO', 'Applied software rendering fallback', 'CANVAS');
        return true;
    }

    // Попытка 2: Canvas recreation
    try {
        const newCanvas = this.recreateCanvas();
        this.reinitializeContext(newCanvas);
        return true;
    } catch (fallbackError) {
        this.logger.log('ERROR', 'Canvas recreation failed', 'CANVAS', fallbackError);
        return false;
    }
}
```

#### 2. Storage Error Recovery
```javascript
async recoverFromStorageError(error) {
    this.logger.log('INFO', 'Attempting storage error recovery', 'STORAGE');

    // Попытка 1: Очистка corrupted данных
    try {
        localStorage.clear();
        this.logger.log('INFO', 'Cleared corrupted localStorage', 'STORAGE');
        return true;
    } catch (clearError) {
        // Попытка 2: Memory storage fallback
        if (typeof window !== 'undefined') {
            window.tetrisMemoryStorage = {};
            this.logger.log('INFO', 'Switched to memory storage fallback', 'STORAGE');
            return true;
        }
    }

    return false;
}
```

### Механизмы graceful degradation

#### Progressive Enhancement
```javascript
initializeWithFallbacks() {
    try {
        // Попытка полной инициализации
        this.initializeFullFeatures();
    } catch (error) {
        this.logger.log('WARN', 'Full initialization failed, trying reduced mode', 'INIT');

        try {
            // Попытка инициализации с ограниченными возможностями
            this.initializeReducedFeatures();
        } catch (reducedError) {
            // Минимальный рабочий режим
            this.initializeMinimalMode();
        }
    }
}
```

---

## Заключение

### Достигнутые цели архитектуры

1. **✅ Модульность**: Система разделена на 8 основных компонентов
2. **✅ Расширяемость**: Легкость добавления новых стратегий рендеринга и управления
3. **✅ Тестируемость**: Каждый компонент может тестироваться независимо
4. **✅ Производительность**: Достижение целевых 60 FPS на большинстве устройств
5. **✅ Надежность**: Graceful degradation при ошибках

### Академическая ценность

Проект демонстрирует применение фундаментальных концепций компьютерных наук:

- **Алгоритмическая сложность**: Анализ и оптимизация алгоритмов коллизий и рендеринга
- **Шаблоны проектирования**: Практическое применение классических паттернов в веб-контексте
- **Управление памятью**: Эффективное использование ресурсов браузера
- **Асинхронное программирование**: Работа с requestAnimationFrame и событиями
- **Кросс-платформенность**: Адаптация под различные устройства и браузеры

### Рекомендации по дальнейшему развитию

1. **Архитектурные улучшения**:
   - Внедрение Flux-архитектуры для управления состоянием
   - Интеграция с WebAssembly для критических алгоритмов
   - Реализация многопоточности через Web Workers

2. **Функциональные расширения**:
   - Сетевая многопользовательская игра
   - Расширенная система достижений
   - Интеграция с социальными сетями

3. **Оптимизации производительности**:
   - Внедрение объектных пулов для повторно используемых объектов
   - Предварительная компиляция критических функций
   - Оптимизация памяти через типизированные массивы

---

**Авторы документации:** Академическая команда проекта TETRIS
**Версия документа:** 2.0.0
**Дата последнего обновления:** Январь 2024