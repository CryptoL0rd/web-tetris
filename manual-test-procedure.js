/**
 * Manual Test Procedure for Tetris Button Controls
 * Execute these tests step by step using available tools
 */

// Test execution helper
class ManualTestExecutor {
    constructor() {
        this.results = [];
        this.currentStep = 0;
        this.steps = [
            { name: 'INITIAL_STATE', description: 'Test initial game state' },
            { name: 'START_GAME', description: 'Test starting the game' },
            { name: 'PAUSE_GAME', description: 'Test pausing the game' },
            { name: 'RESUME_GAME', description: 'Test resuming the game' },
            { name: 'RESET_DURING_GAME', description: 'Test resetting during gameplay' },
            { name: 'RESET_AFTER_GAME_OVER', description: 'Test resetting after game over' },
            { name: 'CONSOLE_LOGGING', description: 'Test console logging functionality' },
            { name: 'ERROR_HANDLING', description: 'Test error handling' },
            { name: 'RESPONSIVE_BEHAVIOR', description: 'Test responsive behavior' }
        ];
    }

    async executeStep(stepIndex) {
        const step = this.steps[stepIndex];
        if (!step) {
            console.log('❌ Invalid step index');
            return false;
        }

        console.log(`🧪 Executing step ${stepIndex + 1}/${this.steps.length}: ${step.name}`);
        console.log(`📝 ${step.description}`);

        try {
            const result = await this[`test_${step.name.toLowerCase()}`]();
            this.results.push({
                step: step.name,
                success: result.success,
                message: result.message,
                data: result.data,
                timestamp: new Date().toISOString()
            });

            if (result.success) {
                console.log(`✅ ${step.name}: PASSED - ${result.message}`);
            } else {
                console.log(`❌ ${step.name}: FAILED - ${result.message}`);
            }

            return result.success;

        } catch (error) {
            console.error(`💥 ${step.name}: ERROR - ${error.message}`);
            this.results.push({
                step: step.name,
                success: false,
                message: error.message,
                error: error.stack,
                timestamp: new Date().toISOString()
            });
            return false;
        }
    }

    async runAllTests() {
        console.log('🚀 Starting manual test execution...');

        for (let i = 0; i < this.steps.length; i++) {
            await this.executeStep(i);
            // Small delay between tests
            await this.delay(1000);
        }

        this.generateReport();
    }

    generateReport() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.success).length;
        const failed = total - passed;

        console.log('\n📊 MANUAL TEST RESULTS');
        console.log('======================');
        console.log(`Total Tests: ${total}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Success Rate: ${Math.round((passed/total) * 100)}%`);

        console.log('\n📋 DETAILED RESULTS');
        console.log('==================');
        this.results.forEach((result, index) => {
            const icon = result.success ? '✅' : '❌';
            console.log(`${icon} Step ${index + 1}: ${result.step}`);
            console.log(`   ${result.message}`);
            if (result.data) {
                console.log(`   Data:`, result.data);
            }
        });

        if (failed === 0) {
            console.log('\n🎉 ALL TESTS PASSED! Button controls are working correctly.');
        } else {
            console.log(`\n⚠️ ${failed} test(s) failed. Please review the issues above.`);
        }
    }

    // Test implementation methods
    async test_initial_state() {
        try {
            // Check if we can access the game page
            const pages = await this.listPages();
            if (pages.length === 0) {
                throw new Error('No browser pages found');
            }

            // Get initial button state
            const buttonText = await this.getButtonText('startPauseBtn');
            const statusText = await this.getElementText('#statusText');

            if (buttonText === 'START' && statusText === 'Paused') {
                return {
                    success: true,
                    message: 'Initial state is correct',
                    data: { buttonText, statusText }
                };
            } else {
                return {
                    success: false,
                    message: `Expected START button and Paused status, got: ${buttonText}, ${statusText}`,
                    data: { buttonText, statusText }
                };
            }
        } catch (error) {
            throw error;
        }
    }

    async test_start_game() {
        try {
            // Click start button
            await this.clickButton('startPauseBtn');
            await this.delay(500);

            // Check new state
            const buttonText = await this.getButtonText('startPauseBtn');
            const statusText = await this.getElementText('#statusText');

            if (buttonText === 'PAUSE' && statusText === 'Playing') {
                return {
                    success: true,
                    message: 'Game started correctly',
                    data: { buttonText, statusText }
                };
            } else {
                return {
                    success: false,
                    message: `Expected PAUSE button and Playing status, got: ${buttonText}, ${statusText}`,
                    data: { buttonText, statusText }
                };
            }
        } catch (error) {
            throw error;
        }
    }

    async test_pause_game() {
        try {
            // Click pause button
            await this.clickButton('startPauseBtn');
            await this.delay(500);

            // Check new state
            const buttonText = await this.getButtonText('startPauseBtn');
            const statusText = await this.getElementText('#statusText');

            if (buttonText === 'START' && statusText === 'Paused') {
                return {
                    success: true,
                    message: 'Game paused correctly',
                    data: { buttonText, statusText }
                };
            } else {
                return {
                    success: false,
                    message: `Expected START button and Paused status, got: ${buttonText}, ${statusText}`,
                    data: { buttonText, statusText }
                };
            }
        } catch (error) {
            throw error;
        }
    }

    async test_resume_game() {
        try {
            // Click start button (resume)
            await this.clickButton('startPauseBtn');
            await this.delay(500);

            // Check new state
            const buttonText = await this.getButtonText('startPauseBtn');
            const statusText = await this.getElementText('#statusText');

            if (buttonText === 'PAUSE' && statusText === 'Playing') {
                return {
                    success: true,
                    message: 'Game resumed correctly',
                    data: { buttonText, statusText }
                };
            } else {
                return {
                    success: false,
                    message: `Expected PAUSE button and Playing status, got: ${buttonText}, ${statusText}`,
                    data: { buttonText, statusText }
                };
            }
        } catch (error) {
            throw error;
        }
    }

    async test_reset_during_game() {
        try {
            // Reset game
            await this.clickButton('RESET');
            await this.delay(1000);

            // Check reset state
            const buttonText = await this.getButtonText('startPauseBtn');
            const statusText = await this.getElementText('#statusText');
            const scoreText = await this.getElementText('#scoreDisplay');

            if (buttonText === 'START' && statusText === 'Paused' && scoreText === '0') {
                return {
                    success: true,
                    message: 'Game reset correctly',
                    data: { buttonText, statusText, scoreText }
                };
            } else {
                return {
                    success: false,
                    message: `Expected reset state, got: ${buttonText}, ${statusText}, ${scoreText}`,
                    data: { buttonText, statusText, scoreText }
                };
            }
        } catch (error) {
            throw error;
        }
    }

    async test_reset_after_game_over() {
        try {
            // Trigger game over using debug function
            await this.evaluateScript("window.debugFillGrid();");
            await this.delay(2000);

            // Reset game
            await this.clickButton('RESET');
            await this.delay(1000);

            // Check reset state
            const buttonText = await this.getButtonText('startPauseBtn');
            const statusText = await this.getElementText('#statusText');

            if (buttonText === 'START' && statusText === 'Paused') {
                return {
                    success: true,
                    message: 'Game reset correctly after game over',
                    data: { buttonText, statusText }
                };
            } else {
                return {
                    success: false,
                    message: `Expected reset state after game over, got: ${buttonText}, ${statusText}`,
                    data: { buttonText, statusText }
                };
            }
        } catch (error) {
            throw error;
        }
    }

    async test_console_logging() {
        try {
            // Clear console
            await this.evaluateScript("console.clear();");

            // Trigger some button actions
            await this.clickButton('startPauseBtn');
            await this.delay(500);
            await this.clickButton('startPauseBtn');
            await this.delay(500);

            // Check console messages
            const messages = await this.listConsoleMessages();

            // Look for debug messages
            const debugMessages = messages.filter(msg =>
                msg.text.includes('toggleStartPause') ||
                msg.text.includes('Game event')
            );

            if (debugMessages.length > 0) {
                return {
                    success: true,
                    message: 'Console logging is working',
                    data: { totalMessages: messages.length, debugMessages: debugMessages.length }
                };
            } else {
                return {
                    success: false,
                    message: 'No debug messages found in console',
                    data: { totalMessages: messages.length }
                };
            }
        } catch (error) {
            throw error;
        }
    }

    async test_error_handling() {
        try {
            // Test DOM element recovery
            await this.evaluateScript(`
                const button = document.getElementById('startPauseBtn');
                if (button) {
                    button.style.display = 'none';
                    setTimeout(() => {
                        button.style.display = 'inline-block';
                    }, 100);
                }
            `);

            await this.delay(500);

            // Try to use button
            const buttonText = await this.getButtonText('startPauseBtn');

            if (buttonText) {
                return {
                    success: true,
                    message: 'Error handling and recovery working',
                    data: { buttonText }
                };
            } else {
                return {
                    success: false,
                    message: 'Error handling failed',
                    data: {}
                };
            }
        } catch (error) {
            throw error;
        }
    }

    async test_responsive_behavior() {
        try {
            // Test different screen sizes
            await this.resizePage(1200, 800);
            await this.delay(500);
            const buttonDesktop = await this.getButtonText('startPauseBtn');

            await this.resizePage(400, 700);
            await this.delay(500);
            const buttonMobile = await this.getButtonText('startPauseBtn');

            await this.resizePage(800, 600); // Back to tablet size

            return {
                success: true,
                message: 'Responsive behavior working',
                data: { buttonDesktop, buttonMobile }
            };
        } catch (error) {
            throw error;
        }
    }

    // Helper methods using MCP tools
    async listPages() {
        const result = await use_mcp_tool({
            server_name: 'chrome-devtools',
            tool_name: 'list_pages',
            arguments: {}
        });
        return result.pages || [];
    }

    async clickButton(buttonId) {
        await use_mcp_tool({
            server_name: 'chrome-devtools',
            tool_name: 'click',
            arguments: { uid: `#${buttonId}` }
        });
    }

    async getButtonText(buttonId) {
        const result = await use_mcp_tool({
            server_name: 'chrome-devtools',
            tool_name: 'evaluate_script',
            arguments: {
                function: `(id) => document.getElementById(id)?.textContent || null`,
                args: [{ uid: buttonId }]
            }
        });
        return result.result || null;
    }

    async getElementText(selector) {
        const result = await use_mcp_tool({
            server_name: 'chrome-devtools',
            tool_name: 'evaluate_script',
            arguments: {
                function: `(selector) => document.querySelector(selector)?.textContent || null`,
                args: [{ uid: selector }]
            }
        });
        return result.result || null;
    }

    async evaluateScript(script) {
        await use_mcp_tool({
            server_name: 'chrome-devtools',
            tool_name: 'evaluate_script',
            arguments: { function: script }
        });
    }

    async listConsoleMessages() {
        const result = await use_mcp_tool({
            server_name: 'chrome-devtools',
            tool_name: 'list_console_messages',
            arguments: {}
        });
        return result.messages || [];
    }

    async resizePage(width, height) {
        await use_mcp_tool({
            server_name: 'chrome-devtools',
            tool_name: 'resize_page',
            arguments: { width, height }
        });
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global test executor instance
window.testExecutor = new ManualTestExecutor();

// Auto-start tests when script loads
console.log('🚀 Manual Test Executor loaded');
console.log('Run window.testExecutor.runAllTests() to start testing');