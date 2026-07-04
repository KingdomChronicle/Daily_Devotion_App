// ============================================================
// PHASE 7D — SWIPE GESTURE DETECTION ENGINE
// ============================================================
// 
// Architecture: PURE INPUT TRANSLATION LAYER
// 
// Converts mobile swipe gestures → ThemeController commands.
// 
// Integration: Gesture Layer → ThemeController → ThemeState → ThemeDOMBridge → CSS
// 
// CONSTRAINTS:
// - NO DOM manipulation
// - NO ThemeState direct access
// - NO persistence
// - NO keyboard shortcuts
// - NO desktop gestures
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // CONFIGURATION
    // ============================================================

    const CONFIG = {
        /** Minimum horizontal distance for a swipe (px) */
        MIN_SWIPE_DISTANCE: 50,
        
        /** Maximum duration for a swipe (ms) */
        MAX_SWIPE_DURATION: 500,
        
        /** Debounce cooldown between gestures (ms) */
        DEBOUNCE_COOLDOWN: 600,
        
        /** CSS selector for the gesture container */
        CONTAINER_SELECTOR: '#app',
        
        /** CSS selector for excluded elements (no gesture) */
        EXCLUDED_SELECTORS: [
            'input',
            'textarea',
            'select',
            'button',
            '.toolbar',
            '.dialog-overlay',
            '.preview-container',
            '.template-option',
            '[contenteditable="true"]'
        ]
    };

    // ============================================================
    // THEME SEQUENCE (LOCKED — matches 7C canonical order)
    // ============================================================

    const THEME_SEQUENCE = [
        'light',
        'dark',
        'sepia',
        'forest',
        'ocean',
        'midnight'
    ];

    // ============================================================
    // STATE
    // ============================================================

    let _touchStartX = 0;
    let _touchStartY = 0;
    let _touchStartTime = 0;
    let _isTouching = false;
    let _lastGestureTime = 0;
    let _isInitialized = false;

    // ============================================================
    // PURE THEME RESOLVER FUNCTIONS
    // ============================================================

    /**
     * Get the next theme in the sequence.
     * 
     * @param {string} currentTheme - The current active theme
     * @returns {string} The next theme
     */
    function getNextTheme(currentTheme) {
        const index = THEME_SEQUENCE.indexOf(currentTheme);
        if (index === -1) {
            // Fallback: return first theme
            return THEME_SEQUENCE[0];
        }
        const nextIndex = (index + 1) % THEME_SEQUENCE.length;
        return THEME_SEQUENCE[nextIndex];
    }

    /**
     * Get the previous theme in the sequence.
     * 
     * @param {string} currentTheme - The current active theme
     * @returns {string} The previous theme
     */
    function getPreviousTheme(currentTheme) {
        const index = THEME_SEQUENCE.indexOf(currentTheme);
        if (index === -1) {
            // Fallback: return last theme
            return THEME_SEQUENCE[THEME_SEQUENCE.length - 1];
        }
        const prevIndex = (index - 1 + THEME_SEQUENCE.length) % THEME_SEQUENCE.length;
        return THEME_SEQUENCE[prevIndex];
    }

    // ============================================================
    // GESTURE VALIDATION
    // ============================================================

    /**
     * Check if a touch gesture qualifies as a valid swipe.
     * 
     * @param {number} deltaX - Horizontal movement
     * @param {number} deltaY - Vertical movement
     * @param {number} duration - Gesture duration in ms
     * @returns {boolean} true if valid
     */
    function isValidSwipe(deltaX, deltaY, duration) {
        // Must be horizontal enough
        if (Math.abs(deltaX) < CONFIG.MIN_SWIPE_DISTANCE) {
            return false;
        }
        
        // Must be more horizontal than vertical
        if (Math.abs(deltaX) <= Math.abs(deltaY)) {
            return false;
        }
        
        // Must be quick enough
        if (duration > CONFIG.MAX_SWIPE_DURATION) {
            return false;
        }
        
        return true;
    }

    /**
     * Resolve swipe direction.
     * 
     * @param {number} deltaX - Horizontal movement
     * @returns {string} 'left' or 'right'
     */
    function resolveDirection(deltaX) {
        return deltaX < 0 ? 'left' : 'right';
    }

    /**
     * Check if the touch target is excluded from gestures.
     * 
     * @param {HTMLElement} target - The touch target element
     * @returns {boolean} true if target is excluded
     */
    function isExcludedTarget(target) {
        if (!target) return false;
        
        // Check against excluded selectors
        for (const selector of CONFIG.EXCLUDED_SELECTORS) {
            if (target.closest(selector)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Check if debounce cooldown has passed.
     * 
     * @returns {boolean} true if cooldown passed
     */
    function isCooldownPassed() {
        const now = Date.now();
        const elapsed = now - _lastGestureTime;
        return elapsed >= CONFIG.DEBOUNCE_COOLDOWN;
    }

    // ============================================================
    // THEME APPLICATION (ONLY ENTRY POINT: ThemeController)
    // ============================================================

    /**
     * Apply the next theme.
     * 
     * Calls ThemeController.setTheme() with the next theme.
     * This is the ONLY allowed bridge to Phase 7C.
     * 
     * @returns {boolean} true if theme was applied
     */
    function applyNextTheme() {
        try {
            if (typeof window.ThemeController === 'undefined') {
                console.warn('⚠️ Swipe: ThemeController not available');
                return false;
            }
            
            const currentTheme = window.ThemeController.getTheme();
            const nextTheme = getNextTheme(currentTheme);
            
            // Apply through ThemeController (7C contract)
            window.ThemeController.setTheme(nextTheme);
            
            console.log(`👆 Swipe: Next theme → "${nextTheme}"`);
            return true;
            
        } catch (error) {
            console.error('❌ Swipe: Failed to apply next theme:', error.message);
            return false;
        }
    }

    /**
     * Apply the previous theme.
     * 
     * Calls ThemeController.setTheme() with the previous theme.
     * This is the ONLY allowed bridge to Phase 7C.
     * 
     * @returns {boolean} true if theme was applied
     */
    function applyPreviousTheme() {
        try {
            if (typeof window.ThemeController === 'undefined') {
                console.warn('⚠️ Swipe: ThemeController not available');
                return false;
            }
            
            const currentTheme = window.ThemeController.getTheme();
            const previousTheme = getPreviousTheme(currentTheme);
            
            // Apply through ThemeController (7C contract)
            window.ThemeController.setTheme(previousTheme);
            
            console.log(`👆 Swipe: Previous theme → "${previousTheme}"`);
            return true;
            
        } catch (error) {
            console.error('❌ Swipe: Failed to apply previous theme:', error.message);
            return false;
        }
    }

    // ============================================================
    // EVENT HANDLERS
    // ============================================================

    /**
     * Handle touchstart event.
     * 
     * Records the starting position and time of the touch.
     */
    function handleTouchStart(event) {
        // Skip if multiple touches
        if (event.touches.length !== 1) {
            _isTouching = false;
            return;
        }
        
        const touch = event.touches[0];
        const target = event.target;
        
        // Skip excluded targets
        if (isExcludedTarget(target)) {
            _isTouching = false;
            return;
        }
        
        // Record touch start
        _touchStartX = touch.clientX;
        _touchStartY = touch.clientY;
        _touchStartTime = Date.now();
        _isTouching = true;
    }

    /**
     * Handle touchmove event.
     * 
     * Prevents vertical scroll interference and tracks movement.
     */
    function handleTouchMove(event) {
        if (!_isTouching) return;
        
        const touch = event.touches[0];
        const deltaX = touch.clientX - _touchStartX;
        const deltaY = touch.clientY - _touchStartY;
        
        // If vertical movement dominates, treat as scroll
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 20) {
            // Allow vertical scroll — don't prevent default
            return;
        }
        
        // For horizontal swipes, prevent default to avoid page scroll
        if (Math.abs(deltaX) > 20) {
            event.preventDefault();
        }
    }

    /**
     * Handle touchend event.
     * 
     * Validates the gesture and applies theme if valid.
     */
    function handleTouchEnd(event) {
        if (!_isTouching) {
            return;
        }
        
        // Reset touching state
        _isTouching = false;
        
        // Calculate gesture metrics
        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;
        const deltaX = endX - _touchStartX;
        const deltaY = endY - _touchStartY;
        const duration = Date.now() - _touchStartTime;
        
        // Validate gesture
        if (!isValidSwipe(deltaX, deltaY, duration)) {
            return;
        }
        
        // Check debounce
        if (!isCooldownPassed()) {
            console.log('👆 Swipe: Debounced (cooldown active)');
            return;
        }
        
        // Resolve direction and apply theme
        const direction = resolveDirection(deltaX);
        
        if (direction === 'left') {
            // Swipe Left → Next Theme
            if (applyNextTheme()) {
                _lastGestureTime = Date.now();
            }
        } else if (direction === 'right') {
            // Swipe Right → Previous Theme
            if (applyPreviousTheme()) {
                _lastGestureTime = Date.now();
            }
        }
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================

    /**
     * Initialize the Swipe Gesture Engine.
     * 
     * Attaches touch event listeners to the app container.
     */
    function initializeSwipeEngine() {
        // Prevent double initialization
        if (_isInitialized) {
            console.warn('⚠️ Swipe: Already initialized');
            return;
        }
        
        // Get container
        const container = document.querySelector(CONFIG.CONTAINER_SELECTOR);
        if (!container) {
            console.warn('⚠️ Swipe: Container not found');
            return;
        }
        
        // Attach touch events
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        _isInitialized = true;
        
        console.log('👆 Swipe Gesture Engine initialized');
        console.log(`👆 Active zone: ${CONFIG.CONTAINER_SELECTOR}`);
        console.log('👆 Swipe Left → Next Theme');
        console.log('👆 Swipe Right → Previous Theme');
        console.log(`👆 Min distance: ${CONFIG.MIN_SWIPE_DISTANCE}px`);
        console.log(`👆 Max duration: ${CONFIG.MAX_SWIPE_DURATION}ms`);
        console.log(`👆 Debounce: ${CONFIG.DEBOUNCE_COOLDOWN}ms`);
        console.log(`👆 Theme sequence: ${THEME_SEQUENCE.join(' → ')}`);
    }

    // ============================================================
    // EXPOSE TO GLOBAL SCOPE (Optional — for debugging)
    // ============================================================

    /**
     * Expose Swipe Engine for debugging and testing.
     * 
     * @global
     * @type {Object}
     */
    window.SwipeEngine = {
        initialize: initializeSwipeEngine,
        getNextTheme: getNextTheme,
        getPreviousTheme: getPreviousTheme,
        getThemeSequence: function() { return THEME_SEQUENCE.slice(); },
        isExcludedTarget: isExcludedTarget,
        isValidSwipe: isValidSwipe,
        CONFIG: CONFIG
    };

    // ============================================================
    // AUTO-INITIALIZE ON DOM READY
    // ============================================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSwipeEngine);
    } else {
        // DOM already ready
        initializeSwipeEngine();
    }

    console.log('👆 Swipe Gesture Engine module loaded');
    console.log('👆 Phase 7D — Pure Input Translation Layer');
    console.log('👆 Integration: Gesture → ThemeController → ThemeState → ThemeDOMBridge → CSS');

})();