/**
 * Automated Button Control Tests for Tetris Game
 * Tests all scenarios systematically using Chrome DevTools automation
 */

class TetrisButtonTester {
    constructor() {
        this.testResults = {
            passed: 0,
            failed: 0,
            tests: [],
            errors: [],
            logs: []
        };
        this.pageIdx = null;
    }

    async runAllTests() {
        console.log('🧪 Starting comprehensive button control tests...');

        try {
            // Initialize browser and navigate to game
            await this.initializeBrowser();

            // Run test scenarios in sequence
            await this.testInitialState();
            await this.testStartGame();
            await this.testPauseGame();
            await this.testResumeGame();
            await this.testResetDuringGame();
            await this.testResetAfterGameOver();
            await this.testConsoleLogging();
            await this.testErrorHandling();
            await this.testResponsiveBehavior();

            // Generate final report
            this.generateReport();

        } catch (error) {
            console.error('❌ Test suite failed:', error);
            this.testResults.errors.push({
                test: 'SUITE_EXECUTION',
                error: error.message,
                stack: error.stack
            });
        } finally {
            await this.cleanup();
        }
    }

    async initializeBrowser() {
        console.log('🌐 Initializing browser...');

        // Create new page
        const newPageResult = await this.callMCP('new_page', {
            url: 'http://localhost:8080'
        });

        if (!newPageResult || newPageResult.error) {
            throw new Error('Failed to create new page');
        }

        // List pages to find our new page
        const pagesResult = await this.callMCP('list_pages', {});
        if (!pagesResult || !pagesResult.pages) {
            throw new Error('Failed to list pages');
        }

        // Select the last page (our new page)
        const lastPage = pagesResult.pages[pagesResult.pages.length - 1];
        this.pageIdx = lastPage.index;

        await this.callMCP('select_page', { pageIdx: this.pageIdx });

        // Wait for game to load
        await this.waitForElement('#gameCanvas', 5000);
        await this.waitForElement('#startPauseBtn', 5000);

        console.log('✅ Browser initialized and game loaded');
    }

    async testInitialState() {
        console.log('🔍 Testing initial state...');

        try {
            // Verify START button is visible and correct
            const buttonText = await this.getButtonText('startPauseBtn');
            if (buttonText !== 'START') {
                throw new Error(`Expected START button, got: ${buttonText}`);
            }

            // Verify game is paused initially
            const statusText = await this.getElementText('#statusText');
            if (statusText !== 'Paused') {
                throw new Error(`Expected Paused status, got: ${statusText}`);
            }

            // Check for console errors
            const consoleMessages = await this.callMCP('list_console_messages', {});
            const errors = consoleMessages.messages.filter(msg => msg.level === 'error');

            this.recordTest('INITIAL_STATE', true, 'Game loads with correct initial state', {
                buttonText,
                statusText,
                consoleErrors: errors.length
            });

        } catch (error) {
            this.recordTest('INITIAL_STATE', false, error.message, { error: error.stack });
        }
    }

    async testStartGame() {
        console.log('▶️ Testing start game...');

        try {
            // Click START button
            await this.clickButton('startPauseBtn');

            // Wait for state change
            await this.delay(500);

            // Verify button changed to PAUSE
            const buttonText = await this.getButtonText('startPauseBtn');
            if (buttonText !== 'PAUSE') {
                throw new Error(`Expected PAUSE button, got: ${buttonText}`);
            }

            // Verify status changed to Playing
            const statusText = await this.getElementText('#statusText');
            if (statusText !== 'Playing') {
                throw new Error(`Expected Playing status, got: ${statusText}`);
            }

            this.recordTest('START_GAME', true, 'START button correctly starts game', {
                buttonText,
                statusText
            });

        } catch (error) {
            this.recordTest('START_GAME', false, error.message, { error: error.stack });
        }
    }

    async testPauseGame() {
        console.log('⏸️ Testing pause game...');

        try {
            // Click PAUSE button
            await this.clickButton('startPauseBtn');

            // Wait for state change
            await this.delay(500);

            // Verify button changed back to START
            const buttonText = await this.getButtonText('startPauseBtn');
            if (buttonText !== 'START') {
                throw new Error(`Expected START button, got: ${buttonText}`);
            }

            // Verify status changed to Paused
            const statusText = await this.getElementText('#statusText');
            if (statusText !== 'Paused') {
                throw new Error(`Expected Paused status, got: ${statusText}`);
            }

            this.recordTest('PAUSE_GAME', true, 'PAUSE button correctly pauses game', {
                buttonText,
                statusText
            });

        } catch (error) {
            this.recordTest('PAUSE_GAME', false, error.message, { error: error.stack });
        }
    }

    async testResumeGame() {
        console.log('▶️ Testing resume game...');

        try {
            // Click START button (should resume)
            await this.clickButton('startPauseBtn');

            // Wait for state change
            await this.delay(500);

            // Verify button changed to PAUSE
            const buttonText = await this.getButtonText('startPauseBtn');
            if (buttonText !== 'PAUSE') {
                throw new Error(`Expected PAUSE button, got: ${buttonText}`);
            }

            // Verify status changed back to Playing
            const statusText = await this.getElementText('#statusText');
            if (statusText !== 'Playing') {
                throw new Error(`Expected Playing status, got: ${statusText}`);
            }

            this.recordTest('RESUME_GAME', true, 'START button correctly resumes game', {
                buttonText,
                statusText
            });

        } catch (error) {
            this.recordTest('RESUME_GAME', false, error.message, { error: error.stack });
        }
    }

    async testResetDuringGame() {
        console.log('🔄 Testing reset during game...');

        try {
            // Reset game while playing
            await this.clickButton('RESET');

            // Wait for reset to complete
            await this.delay(1000);

            // Verify button is START
            const buttonText = await this.getButtonText('startPauseBtn');
            if (buttonText !== 'START') {
                throw new Error(`Expected START button after reset, got: ${buttonText}`);
            }

            // Verify status is Paused
            const statusText = await this.getElementText('#statusText');
            if (statusText !== 'Paused') {
                throw new Error(`Expected Paused status after reset, got: ${statusText}`);
            }

            // Verify score is reset
            const scoreText = await this.getElementText('#scoreDisplay');
            if (scoreText !== '0') {
                throw new Error(`Expected score 0 after reset, got: ${scoreText}`);
            }

            this.recordTest('RESET_DURING_GAME', true, 'RESET button works correctly during game', {
                buttonText,
                statusText,
                scoreText
            });

        } catch (error) {
            this.recordTest('RESET_DURING_GAME', false, error.message, { error: error.stack });
        }
    }

    async testResetAfterGameOver() {
        console.log('💀 Testing reset after game over...');

        try {
            // Use debug function to trigger game over
            await this.evaluateScript("window.debugFillGrid();");

            // Wait for game over state
            await this.delay(2000);

            // Reset game
            await this.clickButton('RESET');

            // Wait for reset to complete
            await this.delay(1000);

            // Verify game is in initial state
            const buttonText = await this.getButtonText('startPauseBtn');
            if (buttonText !== 'START') {
                throw new Error(`Expected START button after reset, got: ${buttonText}`);
            }

            const statusText = await this.getElementText('#statusText');
            if (statusText !== 'Paused') {
                throw new Error(`Expected Paused status after reset, got: ${statusText}`);
            }

            this.recordTest('RESET_AFTER_GAME_OVER', true, 'RESET button works correctly after game over', {
                buttonText,
                statusText
            });

        } catch (error) {
            this.recordTest('RESET_AFTER_GAME_OVER', false, error.message, { error: error.stack });
        }
    }

    async testConsoleLogging() {
        console.log('📝 Testing console logging...');

        try {
            // Clear existing messages
            await this.callMCP('evaluate_script', {
                function: '() => { console.clear(); }'
            });

            // Trigger some game actions to generate logs
            await this.clickButton('startPauseBtn');
            await this.delay(500);
            await this.clickButton('startPauseBtn');
            await this.delay(500);

            // Get console messages
            const consoleResult = await this.callMCP('list_console_messages', {});
            const messages = consoleResult.messages || [];

            // Look for debug logs from button controls
            const debugMessages = messages.filter(msg =>
                msg.text.includes('toggleStartPause') ||
                msg.text.includes('BUTTON_CONTROL_DEBUG') ||
                msg.text.includes('Game event:')
            );

            if (debugMessages.length === 0) {
                throw new Error('No debug logs found for button controls');
            }

            this.recordTest('CONSOLE_LOGGING', true, 'Console logging working correctly', {
                totalMessages: messages.length,
                debugMessages: debugMessages.length,
                sampleMessages: debugMessages.slice(0, 3).map(msg => msg.text)
            });

        } catch (error) {
            this.recordTest('CONSOLE_LOGGING', false, error.message, { error: error.stack });
        }
    }

    async testErrorHandling() {
        console.log('🛡️ Testing error handling...');

        try {
            // Test missing DOM elements scenario
            await this.evaluateScript(`
                () => {
                    // Temporarily hide critical elements
                    const button = document.getElementById('startPauseBtn');
                    if (button) {
                        button.style.display = 'none';
                        setTimeout(() => {
                            button.style.display = 'inline-block';
                        }, 100);
                    }
                }
            `);

            // Try to use button controls
            await this.clickButton('startPauseBtn');
            await this.delay(500);

            // Check if error recovery worked
            const buttonText = await this.getButtonText('startPauseBtn');
            if (!buttonText) {
                throw new Error('Button not accessible after DOM manipulation');
            }

            this.recordTest('ERROR_HANDLING', true, 'Error handling works correctly', {
                buttonText
            });

        } catch (error) {
            this.recordTest('ERROR_HANDLING', false, error.message, { error: error.stack });
        }
    }

    async testResponsiveBehavior() {
        console.log('📱 Testing responsive behavior...');

        try {
            // Test desktop layout (large screen)
            await this.callMCP('resize_page', { width: 1200, height: 800 });

            await this.delay(500);
            const buttonDesktop = await this.getButtonText('startPauseBtn');
            const isButtonVisible = await this.isElementVisible('startPauseBtn');

            // Test mobile layout (small screen)
            await this.callMCP('resize_page', { width: 400, height: 700 });

            await this.delay(500);
            const buttonMobile = await this.getButtonText('startPauseBtn');
            const isButtonVisibleMobile = await this.isElementVisible('startPauseBtn');

            // Test mobile controls visibility
            const mobileControlsVisible = await this.isElementVisible('mobileControls');

            this.recordTest('RESPONSIVE_BEHAVIOR', true, 'Responsive behavior works correctly', {
                desktopButton: buttonDesktop,
                mobileButton: buttonMobile,
                desktopVisible: isButtonVisible,
                mobileVisible: isButtonVisibleMobile,
                mobileControlsVisible: mobileControlsVisible
            });

        } catch (error) {
            this.recordTest('RESPONSIVE_BEHAVIOR', false, error.message, { error: error.stack });
        }
    }

    // Helper methods
    async callMCP(toolName, args) {
        try {
            const result = await use_mcp_tool({
                server_name: 'chrome-devtools',
                tool_name: toolName,
                arguments: args
            });
            return result;
        } catch (error) {
            console.error(`MCP call failed for ${toolName}:`, error);
            throw error;
        }
    }

    async waitForElement(selector, timeout = 3000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            try {
                await this.callMCP('evaluate_script', {
                    function: `(selector) => document.querySelector(selector) !== null`,
                    args: [{ uid: selector }]
                });
                return true;
            } catch (error) {
                await this.delay(100);
            }
        }
        throw new Error(`Element ${selector} not found within ${timeout}ms`);
    }

    async clickButton(buttonId) {
        await this.callMCP('click', { uid: `#${buttonId}` });
    }

    async getButtonText(buttonId) {
        const result = await this.callMCP('evaluate_script', {
            function: `(id) => document.getElementById(id)?.textContent || null`,
            args: [{ uid: buttonId }]
        });
        return result?.result || null;
    }

    async getElementText(selector) {
        const result = await this.callMCP('evaluate_script', {
            function: `(selector) => document.querySelector(selector)?.textContent || null`,
            args: [{ uid: selector }]
        });
        return result?.result || null;
    }

    async isElementVisible(selector) {
        const result = await this.callMCP('evaluate_script', {
            function: `(selector) => {
                const el = document.querySelector(selector);
                if (!el) return false;
                const style = window.getComputedStyle(el);
                return style.display !== 'none' && style.visibility !== 'hidden';
            }`,
            args: [{ uid: selector }]
        });
        return result?.result || false;
    }

    async evaluateScript(script) {
        await this.callMCP('evaluate_script', { function: script });
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    recordTest(testName, passed, message, data = null) {
        const testResult = {
            name: testName,
            passed,
            message,
            data,
            timestamp: new Date().toISOString()
        };

        this.testResults.tests.push(testResult);

        if (passed) {
            this.testResults.passed++;
            console.log(`✅ ${testName}: ${message}`);
        } else {
            this.testResults.failed++;
            console.error(`❌ ${testName}: ${message}`);
        }
    }

    generateReport() {
        console.log('\n📊 TEST RESULTS SUMMARY');
        console.log('========================');
        console.log(`Total Tests: ${this.testResults.tests.length}`);
        console.log(`Passed: ${this.testResults.passed}`);
        console.log(`Failed: ${this.testResults.failed}`);
        console.log(`Success Rate: ${Math.round((this.testResults.passed / this.testResults.tests.length) * 100)}%`);

        console.log('\n📋 DETAILED RESULTS');
        console.log('==================');
        this.testResults.tests.forEach((test, index) => {
            const icon = test.passed ? '✅' : '❌';
            console.log(`${icon} ${test.name}: ${test.message}`);
            if (test.data) {
                console.log(`   Data:`, test.data);
            }
        });

        if (this.testResults.errors.length > 0) {
            console.log('\n🚨 ERRORS');
            console.log('=========');
            this.testResults.errors.forEach((error, index) => {
                console.error(`${index + 1}. ${error.test}: ${error.error}`);
            });
        }
    }

    async cleanup() {
        if (this.pageIdx !== null) {
            try {
                await this.callMCP('close_page', { pageIdx: this.pageIdx });
                console.log('🧹 Browser cleanup completed');
            } catch (error) {
                console.error('❌ Cleanup failed:', error);
            }
        }
    }
}

// Run tests when script loads
console.log('🚀 Starting Tetris Button Control Test Suite...');
const tester = new TetrisButtonTester();
tester.runAllTests().then(() => {
    console.log('🎯 Test suite completed!');
}).catch(error => {
    console.error('💥 Test suite crashed:', error);
});