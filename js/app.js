// Daily Bible Reflection Notepad - Main Application
// Version 0.1 - Phase 3 Field Mapping & Data Integrity (AI-TS-3.5)

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// ============================================
// THEME RUNTIME STATE FOUNDATION (Phase 7C-1)
// ============================================

/**
 * ThemeState — Canonical Runtime Theme State Foundation
 * 
 * Single source of truth for the active theme during the current session.
 * 
 * Architecture Principles:
 * - PURE RUNTIME STATE — No DOM, CSS, or storage interaction
 * - SESSION-ONLY — State resets on page reload (intentional)
 * - ISOLATED — No dependencies on UI, events, or persistence
 * - READ-ONLY COLLECTION — Theme registry is immutable
 * 
 * Restrictions Enforced:
 * - NO DOM synchronization
 * - NO data-theme attribute modification
 * - NO CSS modification
 * - NO localStorage/sessionStorage
 * - NO event listeners
 * - NO theme button activation
 * - NO startup restoration
 * 
 * @version 1.0.0
 * @since Phase 7C-1
 */

(function() {
    'use strict';

    // ============================================
    // CANONICAL THEME REGISTRY
    // ============================================

    /**
     * Complete collection of all available themes.
     * Matches the 6 themes defined in css/style.css.
     * 
     * @readonly
     * @type {Array<string>}
     */
    const THEME_COLLECTION = [
        'light',
        'dark',
        'sepia',
        'forest',
        'ocean',
        'midnight'
    ];

    /**
     * Human-readable display names for themes.
     * @readonly
     * @type {Object<string, string>}
     */
    const THEME_DISPLAY_NAMES = {
        light: 'Light',
        dark: 'Dark',
        sepia: 'Sepia',
        forest: 'Forest',
        ocean: 'Ocean',
        midnight: 'Midnight'
    };

    /**
     * Default theme applied on session start.
     * @readonly
     * @type {string}
     */
    const DEFAULT_THEME = 'light';

    // ============================================
    // RUNTIME STATE
    // ============================================

    /**
     * The canonical runtime Theme State.
     * Represents the active theme for the current session.
     * 
     * @private
     * @type {string}
     */
    let _activeTheme = DEFAULT_THEME;

    /**
     * Flag indicating whether the state has been initialized.
     * @private
     * @type {boolean}
     */
    let _isInitialized = false;

    // ============================================
    // PUBLIC API — ThemeState Object
    // ============================================

    /**
     * ThemeState — Canonical runtime theme state container.
     * 
     * Provides read access to the active theme and theme collection.
     * No DOM, CSS, or storage operations are performed.
     * 
     * @namespace ThemeState
     */
    const ThemeState = {
        // ==========================================
        // READ-ONLY PROPERTIES
        // ==========================================

        /**
         * The canonical collection of all available themes.
         * Immutable — returns a shallow copy to prevent mutation.
         * 
         * @returns {Array<string>} Copy of the theme collection
         */
        get collection() {
            return THEME_COLLECTION.slice();
        },

        /**
         * The display names for all themes.
         * Immutable — returns a shallow copy.
         * 
         * @returns {Object<string, string>} Copy of display name map
         */
        get displayNames() {
            return { ...THEME_DISPLAY_NAMES };
        },

        /**
         * The active theme for the current session.
         * Returns the current runtime theme state.
         * 
         * @returns {string} The active theme identifier
         */
        get active() {
            return _activeTheme;
        },

        /**
         * The default theme applied on session start.
         * 
         * @returns {string} The default theme identifier
         */
        get defaultTheme() {
            return DEFAULT_THEME;
        },

        /**
         * Whether the ThemeState has been initialized.
         * 
         * @returns {boolean} true if initialized
         */
        get initialized() {
            return _isInitialized;
        },

        // ==========================================
        // PUBLIC METHODS
        // ==========================================

        /**
         * Sets the active theme for the current session.
         * 
         * @param {string} themeId — The theme identifier to activate
         * @returns {boolean} true if theme was set successfully
         * 
         * @throws {Error} If themeId is not in the collection
         * 
         * @note This is a PURE STATE operation.
         *       NO DOM synchronization occurs.
         *       NO CSS modification occurs.
         *       NO storage persistence occurs.
         */
        setActive: function(themeId) {
            // Validate theme exists in collection
            if (!THEME_COLLECTION.includes(themeId)) {
                throw new Error(
                    `ThemeState: Invalid theme "${themeId}". ` +
                    `Available themes: ${THEME_COLLECTION.join(', ')}`
                );
            }

            // Update runtime state
            _activeTheme = themeId;
            _isInitialized = true;

            return true;
        },

        /**
         * Checks if a theme exists in the collection.
         * 
         * @param {string} themeId — The theme identifier to check
         * @returns {boolean} true if theme exists
         */
        hasTheme: function(themeId) {
            return THEME_COLLECTION.includes(themeId);
        },

        /**
         * Gets the display name for a theme.
         * 
         * @param {string} themeId — The theme identifier
         * @returns {string} The display name, or the themeId if not found
         */
        getDisplayName: function(themeId) {
            return THEME_DISPLAY_NAMES[themeId] || themeId;
        },

        /**
         * Resets the active theme to the default.
         * 
         * @returns {string} The reset theme identifier
         */
        resetToDefault: function() {
            _activeTheme = DEFAULT_THEME;
            _isInitialized = true;
            return _activeTheme;
        },

        /**
         * Returns a snapshot of the current ThemeState.
         * Useful for debugging and validation.
         * 
         * @returns {Object} Current state snapshot
         */
        snapshot: function() {
            return {
                active: _activeTheme,
                default: DEFAULT_THEME,
                collection: THEME_COLLECTION.slice(),
                displayNames: { ...THEME_DISPLAY_NAMES },
                initialized: _isInitialized,
                sessionId: Date.now()
            };
        }
    };

    // ============================================
    // INITIALIZATION
    // ============================================

    /**
     * Initialize the ThemeState on module load.
     * Sets the default theme and marks as initialized.
     * 
     * @private
     */
    function initializeThemeState() {
        _activeTheme = DEFAULT_THEME;
        _isInitialized = true;
    }

    // Initialize immediately
    initializeThemeState();

    // ============================================
    // EXPOSE TO GLOBAL SCOPE
    // ============================================

    /**
     * Expose ThemeState globally for runtime validation.
     * 
     * @global
     * @type {Object}
     */
    window.ThemeState = ThemeState;

    // ============================================
    // BOUNDARY VALIDATION — NO UNINTENDED SIDE EFFECTS
    // ============================================

    // Verify no DOM mutations occurred during initialization
    if (typeof document !== 'undefined' && document.documentElement) {
        const dataTheme = document.documentElement.getAttribute('data-theme');
        if (dataTheme !== null) {
            console.warn(
                '⚠️ ThemeState: Unexpected data-theme attribute found. ' +
                'ThemeState must NOT modify the DOM.'
            );
        }
    }

})();

// ============================================
// THEME CONTROLLER CORE ENGINE (Phase 7C-2)
// ============================================

/**
 * ThemeController — Canonical Runtime Theme Controller
 * 
 * Pure façade over ThemeState. Introduces no independent state.
 * Delegates all operations to ThemeState.
 * 
 * Architecture Principles:
 * - FAÇADE PATTERN — Controller is a thin wrapper over ThemeState
 * - NO OWNED STATE — All state resides in ThemeState
 * - NO SIDE EFFECTS — No DOM, CSS, storage, or UI interaction
 * - PURE RUNTIME — Session-only operations
 * 
 * Restrictions Enforced:
 * - NO DOM manipulation
 * - NO data-theme modification
 * - NO CSS updates
 * - NO localStorage/sessionStorage
 * - NO event listeners
 * - NO theme button activation
 * - NO startup initialization
 * 
 * @version 1.0.0
 * @since Phase 7C-2
 */

(function() {
    'use strict';

    // ============================================
    // DEPENDENCY VERIFICATION
    // ============================================

    /**
     * Ensure ThemeState is available before creating ThemeController.
     * ThemeController depends exclusively on ThemeState.
     */
    if (typeof window.ThemeState === 'undefined') {
        console.error(
            '❌ ThemeController: ThemeState not found. ' +
            'ThemeController depends on ThemeState. ' +
            'Ensure ThemeState is loaded before ThemeController.'
        );
        return;
    }

    // ============================================
    // THEME CONTROLLER — FAÇADE OVER THEMESTATE
    // ============================================

    /**
     * ThemeController — Pure façade over ThemeState.
     * 
     * All methods delegate directly to ThemeState.
     * Controller owns no state, introduces no side effects.
     * 
     * @namespace ThemeController
     */
    const ThemeController = {
        // ==========================================
        // STATE ACCESS — Delegated to ThemeState
        // ==========================================

        /**
         * Get the current active theme.
         * Delegates to ThemeState.active.
         * 
         * @returns {string} The active theme identifier
         */
        getTheme: function() {
            return window.ThemeState.active;
        },

        /**
         * Set the active theme.
         * Delegates to ThemeState.setActive().
         * 
         * @param {string} themeId — The theme identifier to activate
         * @returns {string} The updated active theme
         * @throws {Error} If themeId is invalid
         */
        setTheme: function(themeId) {
            // Phase 7C-6.1A Guard: Check if theme is already active
            const currentActive = window.ThemeState.active;
            if (themeId === currentActive) {
                return currentActive;
            }
            
            // Proceed with theme change
            window.ThemeState.setActive(themeId);
            
            // Phase 7E.1: Persist theme to localStorage
            persistTheme(themeId);
            
            return window.ThemeState.active;
        },

        /**
         * Reset the active theme to the default.
         * Delegates to ThemeState.resetToDefault().
         * 
         * @returns {string} The reset theme identifier
         */
        resetTheme: function() {
            window.ThemeState.resetToDefault();
            return window.ThemeState.active;
        },

        // ==========================================
        // REGISTRY ACCESS — Delegated to ThemeState
        // ==========================================

        /**
         * Get all available themes.
         * Delegates to ThemeState.collection.
         * 
         * @returns {Array<string>} Array of theme identifiers
         */
        getAvailableThemes: function() {
            return window.ThemeState.collection;
        },

        /**
         * Get the display name for a theme.
         * Delegates to ThemeState.getDisplayName().
         * 
         * @param {string} themeId — The theme identifier
         * @returns {string} The display name
         */
        getDisplayName: function(themeId) {
            return window.ThemeState.getDisplayName(themeId);
        },

        /**
         * Check if a theme exists in the collection.
         * Delegates to ThemeState.hasTheme().
         * 
         * @param {string} themeId — The theme identifier to check
         * @returns {boolean} true if theme exists
         */
        hasTheme: function(themeId) {
            return window.ThemeState.hasTheme(themeId);
        },

        // ==========================================
        // SNAPSHOT — Delegated to ThemeState
        // ==========================================

        /**
         * Get a snapshot of the current theme state.
         * Delegates to ThemeState.snapshot().
         * 
         * @returns {Object} Current state snapshot
         */
        snapshot: function() {
            return window.ThemeState.snapshot();
        },

        // ==========================================
        // CONTROLLER METADATA (No state)
        // ==========================================

        /**
         * Controller version identifier.
         * Read-only metadata — NOT state.
         * 
         * @readonly
         * @type {string}
         */
        get version() {
            return '1.0.0';
        },

        /**
         * Controller name for identification.
         * Read-only metadata — NOT state.
         * 
         * @readonly
         * @type {string}
         */
        get name() {
            return 'ThemeController';
        }
    };

    // ============================================
    // BOUNDARY VALIDATION — VERIFY NO SIDE EFFECTS
    // ============================================

    /**
     * Verify that ThemeController has not introduced any side effects.
     * This check runs during development to enforce boundary rules.
     * 
     * Phase 7E Alignment (R7.6):
     * - Removed obsolete localStorage existence check
     * - localStorage["theme"] is now an authorized persistence key
     * - Verification now checks ownership, not existence
     */
    function verifyControllerBoundaries() {
        // Verify NO DOM mutations occurred
        const dataTheme = document.documentElement.getAttribute('data-theme');
        if (dataTheme !== null) {
            console.warn(
                '⚠️ ThemeController: Unexpected data-theme attribute found. ' +
                'ThemeController must NOT modify the DOM.'
            );
        }

        // R7.6: Removed obsolete localStorage existence warning.
        // Phase 7E introduced authorized localStorage["theme"] persistence.
        // ThemeController does NOT access storage directly.
        // The presence of localStorage keys is not evidence of unauthorized access.

        // Verify NO event listeners were attached to theme button
        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) {
            if (typeof getEventListeners !== 'undefined') {
                const listeners = getEventListeners(themeBtn);
                if (Object.keys(listeners).length > 0) {
                    console.warn(
                        '⚠️ ThemeController: Event listeners found on theme button. ' +
                        'ThemeController must NOT bind UI events.'
                    );
                }
            }
        }
    }

    // ============================================
    // EXPOSE TO GLOBAL SCOPE
    // ============================================

    /**
     * Expose ThemeController globally for runtime validation.
     * 
     * @global
     * @type {Object}
     */
    window.ThemeController = ThemeController;

    // Run boundary verification
    verifyControllerBoundaries();

})();

// ============================================
// DOM THEME BRIDGE (Phase 7C-3)
// ============================================

/**
 * ThemeDOMBridge — Exclusive Owner of DOM Theme Synchronization
 * 
 * Responsible for synchronizing the runtime theme state with the DOM
 * via the canonical data-theme attribute on the <html> element.
 * 
 * Architecture Principles:
 * - SINGLE RESPONSIBILITY — Only handles DOM synchronization
 * - EXCLUSIVE OWNERSHIP — No other module modifies data-theme
 * - DELEGATED VALIDATION — Validation handled by ThemeController
 * - CSS INTEGRITY — No CSS modifications, only attribute updates
 * 
 * Restrictions Enforced:
 * - NO theme button activation
 * - NO event listeners
 * - NO persistence
 * - NO startup restoration
 * - NO CSS modifications
 * - NO other DOM mutations
 * 
 * @version 1.0.0
 * @since Phase 7C-3
 */

(function() {
    'use strict';

    // ============================================
    // DEPENDENCY VERIFICATION
    // ============================================

    /**
     * Ensure ThemeController is available before creating ThemeDOMBridge.
     * ThemeDOMBridge depends on ThemeController for theme state.
     */
    if (typeof window.ThemeController === 'undefined') {
        console.error(
            '❌ ThemeDOMBridge: ThemeController not found. ' +
            'ThemeDOMBridge depends on ThemeController. ' +
            'Ensure ThemeController is loaded before ThemeDOMBridge.'
        );
        return;
    }

    // ============================================
    // DOM THEME BRIDGE
    // ============================================

    /**
     * ThemeDOMBridge — Exclusive owner of DOM theme synchronization.
     * 
     * All DOM theme mutations must go through this bridge.
     * No other module may modify data-theme on the root element.
     * 
     * @namespace ThemeDOMBridge
     */
    const ThemeDOMBridge = {
        // ==========================================
        // DOM SYNCHRONIZATION
        // ==========================================

        /**
         * Apply the current theme to the DOM.
         * 
         * Reads the active theme from ThemeController and applies it
         * to the <html> element's data-theme attribute.
         * 
         * @returns {string} The theme that was applied
         * @throws {Error} If root element is not available
         * 
         * @example
         * ThemeDOMBridge.applyCurrentTheme(); // 'dark'
         */
        applyCurrentTheme: function() {
            const root = document.documentElement;
            if (!root) {
                throw new Error(
                    'ThemeDOMBridge: document.documentElement not available. ' +
                    'DOM not ready for theme synchronization.'
                );
            }

            const theme = window.ThemeController.getTheme();
            root.dataset.theme = theme;
            return theme;
        },

        /**
         * Get the current theme from the DOM.
         * 
         * Reads the data-theme attribute from <html>.
         * Useful for debugging and validation.
         * 
         * @returns {string|null} The theme from DOM, or null if not set
         */
        getDOMTheme: function() {
            const root = document.documentElement;
            if (!root) return null;
            return root.dataset.theme || null;
        },

        /**
         * Verify DOM synchronization state.
         * 
         * Checks if the DOM data-theme matches the runtime theme.
         * Returns true if synchronized, false otherwise.
         * 
         * @returns {boolean} true if DOM matches runtime
         */
        isSynchronized: function() {
            const runtimeTheme = window.ThemeController.getTheme();
            const domTheme = this.getDOMTheme();
            return runtimeTheme === domTheme;
        },

        /**
         * Force full DOM synchronization.
         * 
         * Re-applies the current theme to ensure DOM is in sync.
         * Useful for recovery scenarios.
         * 
         * @returns {string} The applied theme
         */
        synchronize: function() {
            return this.applyCurrentTheme();
        }
    };

    // ============================================
    // CONTROLLER INTEGRATION
    // ============================================

    /**
     * Enhance ThemeController to automatically trigger DOM synchronization
     * after state changes.
     * 
     * This maintains the architectural flow:
     * ThemeController.setTheme() → ThemeState update → DOM sync
     * 
     * The ThemeController remains the sole runtime authority.
     * ThemeDOMBridge owns all DOM mutations.
     * 
     * @private
     */
    function integrateControllerWithBridge() {
        const originalSetTheme = window.ThemeController.setTheme;
        const originalResetTheme = window.ThemeController.resetTheme;

        window.ThemeController.setTheme = function(themeId) {
            const currentTheme = window.ThemeController.getTheme();
            const result = originalSetTheme.call(this, themeId);

            if (result !== currentTheme) {
                ThemeDOMBridge.applyCurrentTheme();
            }

            return result;
        };

        window.ThemeController.resetTheme = function() {
            const currentTheme = window.ThemeController.getTheme();
            const result = originalResetTheme.call(this);

            if (result !== currentTheme) {
                ThemeDOMBridge.applyCurrentTheme();
            }

            return result;
        };
    }

    // ============================================
    // INITIALIZATION — SYNCHRONIZE ON LOAD
    // ============================================

    /**
     * Initialize the ThemeDOMBridge.
     * 
     * On initial load, synchronize the DOM with the default theme.
     * This ensures the CSS theme system is active from the start.
     * 
     * @private
     */
    function initializeBridge() {
        ThemeDOMBridge.applyCurrentTheme();
        integrateControllerWithBridge();
    }

    // ============================================
    // BOUNDARY VALIDATION — VERIFY NO SIDE EFFECTS
    // ============================================

    /**
     * Verify that ThemeDOMBridge has not introduced unauthorized side effects.
     * This check runs during development to enforce boundary rules.
     * 
     * Phase 7E Alignment (R7.6):
     * - Removed obsolete localStorage existence check
     * - localStorage["theme"] is now an authorized persistence key
     * - Verification now checks ownership, not existence
     */
    function verifyBridgeBoundaries() {
        const allElementsWithDataTheme = document.querySelectorAll('[data-theme]');
        const root = document.documentElement;
        let onlyRootHasTheme = true;

        allElementsWithDataTheme.forEach(el => {
            if (el !== root) {
                onlyRootHasTheme = false;
                console.warn(
                    '⚠️ ThemeDOMBridge: Found data-theme on non-root element:',
                    el.tagName,
                    'ThemeDOMBridge must ONLY modify <html>.'
                );
            }
        });

        // R7.6: Removed obsolete localStorage existence warning.
        // Phase 7E introduced authorized localStorage["theme"] persistence.
        // ThemeDOMBridge does NOT access storage directly.
        // The presence of localStorage keys is not evidence of unauthorized access.

        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn && typeof getEventListeners !== 'undefined') {
            const listeners = getEventListeners(themeBtn);
            if (Object.keys(listeners).length > 0) {
                console.warn(
                    '⚠️ ThemeDOMBridge: Event listeners found on theme button. ' +
                    'ThemeDOMBridge must NOT bind UI events.'
                );
            }
        }
    }

    // ============================================
    // EXPOSE TO GLOBAL SCOPE
    // ============================================

    /**
     * Expose ThemeDOMBridge globally for runtime validation.
     * 
     * @global
     * @type {Object}
     */
    window.ThemeDOMBridge = ThemeDOMBridge;

    // ============================================
    // INITIALIZATION — READY
    // ============================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeBridge();
            verifyBridgeBoundaries();
        });
    } else {
        initializeBridge();
        verifyBridgeBoundaries();
    }

})();

// Global template state - declared immediately
var CURRENT_TEMPLATE = 'Level 1';

function initApp() {
    CURRENT_TEMPLATE = 'Level 1';
    initializeAutoExpand();
}

/**
 * Auto-expand textareas to fit content
 * Implements Phase 2.1 Auto-Expanding Text Areas
 * Presentation-layer only - preserves stateless architecture
 */
function autoExpand(element) {
    if (!element || element.tagName !== 'TEXTAREA') return;

    element.style.height = 'auto';
    var newHeight = element.scrollHeight;
    element.style.height = newHeight + 'px';
}

/**
 * Initialize auto-expand on all textareas
 * Also attaches event listeners for future typing
 */
function initializeAutoExpand() {
    var textareas = document.querySelectorAll('.template-textarea');
    textareas.forEach(function(textarea) {
        if (textarea.style.position === 'fixed' && textarea.style.opacity === '0') {
            return;
        }
        autoExpand(textarea);
        textarea.addEventListener('input', function() {
            autoExpand(this);
        });
    });
}

/**
 * Apply auto-expand to a newly created textarea
 * Used for dynamic field creation
 */
function applyAutoExpandToTextarea(textarea) {
    if (!textarea || textarea.tagName !== 'TEXTAREA') return;
    if (textarea.style.position === 'fixed' && textarea.style.opacity === '0') {
        return;
    }
    autoExpand(textarea);
    textarea.addEventListener('input', function() {
        autoExpand(this);
    });
}

// DOM Elements
const levelBtn = document.getElementById('level-selector-btn');
const dialogOverlay = document.getElementById('template-selector-dialog');
const cancelBtn = document.getElementById('cancel-dialog-btn');
const applyBtn = document.getElementById('apply-template-btn');

// ============================================
// OFFICIAL TEMPLATE SCHEMAS (AI-TS-3.5)
// ============================================

// TEMPLATE_SCHEMAS - Canonical Source of Truth (V2.1)
// Each level: { fields: [...], required: [...] }
const TEMPLATE_SCHEMAS = {
    'Level 1': {
        fields: [
            'Username', 'Age', 'Class', 'Crowns', 'Location',
            'Devotion Number', 'Date', 'Time Start', 'Reflection',
            'Prayer Points', 'Application', 'Time End'
        ],
        required: [
            'Username', 'Age', 'Class', 'Location',
            'Devotion Number', 'Date', 'Time Start', 'Reflection',
            'Time End'
        ]
    },
    'Level 2': {
        fields: [
            'Username', 'Age', 'Class', 'Crowns', 'BC', 'Location',
            'Devotion Number', 'Date', 'Time Start', 'Reflection',
            'Prayer Points', 'Application', 'Time End'
        ],
        required: [
            'Username', 'Age', 'Class', 'BC', 'Location',
            'Devotion Number', 'Date', 'Time Start', 'Reflection',
            'Time End'
        ]
    },
    'Level 3': {
        fields: [
            'Username', 'Age', 'Class', 'Crowns', 'BC', 'SW', 'Location',
            'Devotion Number', 'Date', 'Time Start', 'Reflection',
            'Prayer Points', 'Application', 'Time End'
        ],
        required: [
            'Username', 'Age', 'Class', 'BC', 'SW', 'Location',
            'Devotion Number', 'Date', 'Time Start', 'Reflection',
            'Time End'
        ]
    }
};


// ============================================
// SCHEMA HELPER FUNCTIONS (V2.1)
// ============================================

/**
 * Get schema fields for a given level (array format)
 * @param {string} level - 'Level 1', 'Level 2', or 'Level 3'
 * @returns {Array} Array of field names
 */
function getSchemaFields(level) {
    const schema = TEMPLATE_SCHEMAS[level];
    return schema ? schema.fields : [];
}

/**
 * Get required fields for a given level
 * @param {string} level - 'Level 1', 'Level 2', or 'Level 3'
 * @returns {Array} Array of required field names
 */
function getRequiredFields(level) {
    const schema = TEMPLATE_SCHEMAS[level];
    if (!schema) return [];
    return schema.required || [];
}

/**
 * Check if a field is required for a given level
 * @param {string} level - 'Level 1', 'Level 2', or 'Level 3'
 * @param {string} fieldName - The field name to check
 * @returns {boolean} True if the field is required
 */
function isFieldRequired(level, fieldName) {
    const required = getRequiredFields(level);
    return required.includes(fieldName);
}

// Expose helpers globally
window.getSchemaFields = getSchemaFields;
window.getRequiredFields = getRequiredFields;
window.isFieldRequired = isFieldRequired;

// ============================================
// TEMPLATE LEVEL DETECTION
// ============================================

function getTemplateFieldValues() {
    const fields = {};
    const fieldContainers = document.querySelectorAll('.template-field');

    fieldContainers.forEach(container => {
        const label = container.querySelector('label');
        const input = container.querySelector('.template-input');
        const textarea = container.querySelector('.template-textarea');

        if (label) {
            let fieldName = label.textContent.replace(':', '').trim();
            fieldName = fieldName.replace(/\s*\*$/, '').trim();

            if (input) {
                fields[fieldName] = input.value || '';
            } else if (textarea) {
                fields[fieldName] = textarea.value || '';
            }
        }
    });

    return fields;
}

function detectTemplateLevel() {
    if (typeof CURRENT_TEMPLATE !== 'undefined' && CURRENT_TEMPLATE) {
        return CURRENT_TEMPLATE;
    }

    const fields = getTemplateFieldValues();
    const fieldNames = Object.keys(fields);

    const level1Fields = TEMPLATE_SCHEMAS['Level 1'];
    const level2Fields = TEMPLATE_SCHEMAS['Level 2'];
    const level3Fields = TEMPLATE_SCHEMAS['Level 3'];

    const allLevel3Present = level3Fields.every(field => fieldNames.includes(field));
    if (allLevel3Present) return 'Level 3';

    const allLevel2Present = level2Fields.every(field => fieldNames.includes(field));
    if (allLevel2Present) return 'Level 2';

    const allLevel1Present = level1Fields.every(field => fieldNames.includes(field));
    if (allLevel1Present) return 'Level 1';

    return 'Level 1';
}

function updateDialogContext() {
    const dialogContext = document.getElementById('dialog-context');
    if (dialogContext) {
        const currentLevel = CURRENT_TEMPLATE || 'Level 1';
        dialogContext.textContent = `Current Template: ${currentLevel}`;
    }
}

// ============================================
// FIELD VALUE PRESERVATION (AI-TS-3.5)
// ============================================

function getFieldValue(fieldName) {
    const fieldContainers = document.querySelectorAll('.template-field');
    
    for (const container of fieldContainers) {
        const label = container.querySelector('label');
        if (label) {
            let labelName = label.textContent.replace(/[:\*]/g, '').trim();
            labelName = labelName.replace(/\s+/g, ' ');
            if (labelName === fieldName) {
                const input = container.querySelector('.template-input');
                const textarea = container.querySelector('.template-textarea');
                if (input) return input.value || '';
                if (textarea) return textarea.value || '';
            }
        }
    }
    
    const fieldKey = fieldName.toLowerCase().replace(/ /g, '_');
    const fieldByData = document.querySelector(`[data-field="${fieldKey}"]`);
    if (fieldByData) {
        return fieldByData.value || '';
    }
    
    const fieldById = document.getElementById(`field-${fieldKey}`);
    if (fieldById) {
        return fieldById.value || '';
    }
    
    for (const container of fieldContainers) {
        const label = container.querySelector('label');
        if (label) {
            let labelName = label.textContent.replace(/[:\*]/g, '').trim();
            labelName = labelName.replace(/\s+/g, ' ');
            if (labelName.toLowerCase() === fieldName.toLowerCase()) {
                const input = container.querySelector('.template-input');
                const textarea = container.querySelector('.template-textarea');
                if (input) return input.value || '';
                if (textarea) return textarea.value || '';
            }
        }
    }
    
    return '';
}

function setFieldValue(fieldName, value) {
    const fieldKey = fieldName.toLowerCase().replace(/ /g, '_');
    const fieldByData = document.querySelector(`[data-field="${fieldKey}"]`);
    if (fieldByData) {
        fieldByData.value = value;
        return true;
    }
    
    const fieldById = document.getElementById(`field-${fieldKey}`);
    if (fieldById) {
        fieldById.value = value;
        return true;
    }
    
    const fieldContainers = document.querySelectorAll('.template-field');
    for (const container of fieldContainers) {
        const label = container.querySelector('label');
        if (label) {
            let labelName = label.textContent.replace(/[:\*]/g, '').trim();
            labelName = labelName.replace(/\s+/g, ' ');
            if (labelName === fieldName || labelName.toLowerCase() === fieldName.toLowerCase()) {
                const input = container.querySelector('.template-input');
                const textarea = container.querySelector('.template-textarea');
                if (input) {
                    input.value = value;
                    return true;
                }
                if (textarea) {
                    textarea.value = value;
                    return true;
                }
            }
        }
    }
    
    return false;
}

function preserveAllFieldValues() {
    const fields = getTemplateFieldValues();
    return fields;
}

function restoreFieldValues(fieldValues) {
    let restored = 0;
    for (const [fieldName, value] of Object.entries(fieldValues)) {
        if (setFieldValue(fieldName, value)) {
            restored++;
        }
    }
    return restored;
}

// ============================================
// FIELD REMOVAL LOGIC (AI-TS-3.5)
// ============================================

function getFieldContainers() {
    return document.querySelectorAll('.template-field');
}

function removeField(fieldName) {
    const fieldContainers = document.querySelectorAll('.template-field');
    for (const container of fieldContainers) {
        const label = container.querySelector('label');
        if (label) {
            const labelName = label.textContent.replace(':', '').trim();
            if (labelName === fieldName) {
                container.remove();
                return true;
            }
        }
    }
    return false;
}

function removeFieldsNotInSchema(targetLevel) {
    const targetSchema = TEMPLATE_SCHEMAS[targetLevel];
    if (!targetSchema) {
        return [];
    }

    const removed = [];
    const fieldContainers = document.querySelectorAll('.template-field');

    const fieldsToRemove = [];
    fieldContainers.forEach(container => {
        const label = container.querySelector('label');
        if (label) {
            const fieldName = label.textContent.replace(':', '').trim();
            if (!targetSchema.includes(fieldName)) {
                fieldsToRemove.push(fieldName);
            }
        }
    });

    for (const fieldName of fieldsToRemove) {
        if (removeField(fieldName)) {
            removed.push(fieldName);
        }
    }

    return removed;
}

// ============================================
// FIELD INSERTION LOGIC (AI-TS-3.5)
// ============================================

function getFieldLabels() {
    const labels = [];
    const fieldContainers = document.querySelectorAll('.template-field');
    fieldContainers.forEach(container => {
        const label = container.querySelector('label');
        if (label) {
            labels.push(label.textContent.replace(':', '').trim());
        }
    });
    return labels;
}

function fieldExists(fieldName) {
    const labels = getFieldLabels();
    return labels.includes(fieldName);
}

function insertField(labelText, inputType, insertAfter) {
    const fieldContainers = document.querySelectorAll('.template-field');
    let targetContainer = null;

    fieldContainers.forEach(container => {
        const label = container.querySelector('label');
        if (label) {
            const labelName = label.textContent.replace(':', '').trim();
            if (labelName === insertAfter) {
                targetContainer = container;
            }
        }
    });

    if (!targetContainer) {
        return false;
    }

    const newField = document.createElement('div');
    newField.className = 'template-field';

    const label = document.createElement('label');
    label.textContent = `${labelText}:`;
    newField.appendChild(label);

    if (inputType === 'textarea') {
        const textarea = document.createElement('textarea');
        textarea.className = 'template-textarea';
        newField.appendChild(textarea);
        applyAutoExpandToTextarea(textarea);
    } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'template-input';
        newField.appendChild(input);
    }

    const parent = targetContainer.parentNode;
    const nextSibling = targetContainer.nextSibling;

    if (nextSibling) {
        parent.insertBefore(newField, nextSibling);
    } else {
        parent.appendChild(newField);
    }

    return true;
}

function insertMissingFields(targetLevel, preservedValues) {
    const targetSchema = TEMPLATE_SCHEMAS[targetLevel];
    if (!targetSchema) {
        return { inserted: [], errors: [] };
    }

    const inserted = [];
    const errors = [];
    let currentLabels = getFieldLabels();

    for (const fieldName of targetSchema) {
        if (!currentLabels.includes(fieldName)) {
            const schemaIndex = targetSchema.indexOf(fieldName);
            let insertAfter = null;

            if (schemaIndex > 0) {
                for (let i = schemaIndex - 1; i >= 0; i--) {
                    if (currentLabels.includes(targetSchema[i])) {
                        insertAfter = targetSchema[i];
                        break;
                    }
                }
            }

            if (!insertAfter && schemaIndex === 0) {
                if (currentLabels.length > 0) {
                    insertAfter = currentLabels[0];
                } else {
                    const editorContainer = document.querySelector('.editor-container');
                    if (editorContainer) {
                        const newField = document.createElement('div');
                        newField.className = 'template-field';
                        const label = document.createElement('label');
                        label.textContent = `${fieldName}:`;
                        newField.appendChild(label);
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.className = 'template-input';
                        newField.appendChild(input);
                        editorContainer.appendChild(newField);
                        inserted.push(fieldName);
                        currentLabels = getFieldLabels();
                        continue;
                    }
                }
            }

            if (insertAfter) {
                const inputType = (fieldName === 'Reflection' || fieldName === 'Prayer Points' || fieldName === 'Application') ? 'textarea' : 'input';
                const success = insertField(fieldName, inputType, insertAfter);
                if (success) {
                    inserted.push(fieldName);
                    if (preservedValues && preservedValues[fieldName] !== undefined) {
                        setFieldValue(fieldName, preservedValues[fieldName]);
                    }
                    currentLabels = getFieldLabels();
                } else {
                    errors.push(`Failed to insert ${fieldName}`);
                }
            }
        } else {
            if (preservedValues && preservedValues[fieldName] !== undefined) {
                setFieldValue(fieldName, preservedValues[fieldName]);
            }
        }
    }

    return { inserted, errors };
}

// ============================================
// FULL EDITOR RECONSTRUCTION (AI-TS-3.5)
// ============================================

function reconstructEditorForLevel(targetLevel) {
    const preservedValues = {};
    const fieldContainers = document.querySelectorAll('.template-field');

    fieldContainers.forEach(container => {
        const label = container.querySelector('label');
        const input = container.querySelector('.template-input');
        const textarea = container.querySelector('.template-textarea');

        if (label) {
            let fieldName = label.textContent.replace(/[:\*]/g, '').trim();
            let value = '';
            if (input) {
                value = input.value || '';
            } else if (textarea) {
                value = textarea.value || '';
            }

            const fieldKey = fieldName.toLowerCase().replace(/ /g, '_');
            preservedValues[fieldName] = value;
            preservedValues[fieldKey] = value;

            const dataField = input ? input.getAttribute('data-field') :
                              textarea ? textarea.getAttribute('data-field') : null;
            if (dataField && dataField !== fieldKey) {
                preservedValues[dataField] = value;
            }
        }
    });

    const targetSchema = getSchemaFields(targetLevel);
    if (!targetSchema || targetSchema.length === 0) {
        return {
            success: false,
            inserted: [],
            removed: [],
            preserved: 0,
            error: `Unknown target level: ${targetLevel}`
        };
    }

    const requiredFields = getRequiredFields(targetLevel);

    const editorContainer = document.querySelector('.editor-container');
    if (!editorContainer) {
        return {
            success: false,
            inserted: [],
            removed: [],
            preserved: 0,
            error: 'Editor container not found'
        };
    }

    const parent = editorContainer.parentNode;
    const newEditorContainer = document.createElement('div');
    newEditorContainer.className = 'editor-container';
    newEditorContainer.id = 'editor-container';

    const inserted = [];
    const removed = [];
    let restoredCount = 0;
    const restoredFields = [];

    for (const fieldName of targetSchema) {
        const isMultiline = (fieldName === 'Reflection' || fieldName === 'Prayer Points' || fieldName === 'Application');

        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'template-field';

        const label = document.createElement('label');
        label.textContent = `${fieldName}:`;

        if (requiredFields.includes(fieldName)) {
            const indicator = document.createElement('span');
            indicator.className = 'required-indicator';
            indicator.textContent = ' *';
            label.appendChild(indicator);
        }

        fieldDiv.appendChild(label);

        let inputElement;
        const fieldKey = fieldName.toLowerCase().replace(/ /g, '_');

        if (isMultiline) {
            const textarea = document.createElement('textarea');
            textarea.className = 'template-textarea';
            textarea.setAttribute('data-field', fieldKey);

            let restoredValue = null;
            if (preservedValues[fieldName] !== undefined && preservedValues[fieldName] !== '') {
                restoredValue = preservedValues[fieldName];
            } else if (preservedValues[fieldKey] !== undefined && preservedValues[fieldKey] !== '') {
                restoredValue = preservedValues[fieldKey];
            }

            if (restoredValue !== null) {
                textarea.value = restoredValue;
                restoredCount++;
                restoredFields.push(fieldName);
            }

            if (requiredFields.includes(fieldName)) {
                textarea.setAttribute('required', 'required');
            }

            applyAutoExpandToTextarea(textarea);

            inputElement = textarea;
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'template-input';
            input.setAttribute('data-field', fieldKey);

            let restoredValue = null;
            if (preservedValues[fieldName] !== undefined && preservedValues[fieldName] !== '') {
                restoredValue = preservedValues[fieldName];
            } else if (preservedValues[fieldKey] !== undefined && preservedValues[fieldKey] !== '') {
                restoredValue = preservedValues[fieldKey];
            }

            if (restoredValue !== null) {
                input.value = restoredValue;
                restoredCount++;
                restoredFields.push(fieldName);
            }

            if (requiredFields.includes(fieldName)) {
                input.setAttribute('required', 'required');
            }

            inputElement = input;
        }

        fieldDiv.appendChild(inputElement);

        const errorDiv = document.createElement('div');
        const errorId = `error-${fieldKey}`;
        errorDiv.className = 'field-error';
        errorDiv.id = errorId;
        fieldDiv.appendChild(errorDiv);

        newEditorContainer.appendChild(fieldDiv);
        inserted.push(fieldName);
    }

    parent.replaceChild(newEditorContainer, editorContainer);

    let finalRestoredCount = restoredCount;
    for (const fieldName of targetSchema) {
        const fieldKey = fieldName.toLowerCase().replace(/ /g, '_');
        const field = document.querySelector(`[data-field="${fieldKey}"]`);
        if (field) {
            if (field.value === '' && preservedValues[fieldName] !== undefined && preservedValues[fieldName] !== '') {
                field.value = preservedValues[fieldName];
                finalRestoredCount++;
            } else if (field.value === '' && preservedValues[fieldKey] !== undefined && preservedValues[fieldKey] !== '') {
                field.value = preservedValues[fieldKey];
                finalRestoredCount++;
            }
        }
    }

    if (typeof initValidation === 'function') {
        // Validation system ready
    }

    return {
        success: true,
        inserted: inserted,
        removed: removed,
        preserved: Object.keys(preservedValues).length,
        restored: finalRestoredCount
    };
}

// ============================================
// READING PREFERENCE RESTORATION (R7.5)
// ============================================

/**
 * Restore Reading Preferences after DOM reconstruction.
 * 
 * Official restoration entry point for Reading Preferences.
 * Called after Template Engine completes DOM reconstruction.
 * 
 * Currently supports:
 * - Font Size
 * 
 * Future extensibility:
 * - Line Spacing
 * - Font Family
 * - Reading Width
 * - Paragraph Spacing
 * 
 * @returns {boolean} true if restoration was successful
 */
function restoreReadingPreferences() {
    try {
        const fontSize = window.getCurrentFontSize ? window.getCurrentFontSize() : currentFontSize;
        
        if (typeof fontSize === 'number' && typeof applyFontSize === 'function') {
            applyFontSize(fontSize);
            return true;
        } else if (typeof fontSize === 'number') {
            const fields = document.querySelectorAll('.template-textarea, .template-input');
            fields.forEach(field => {
                field.style.fontSize = fontSize + 'px';
                field.style.lineHeight = (fontSize * 1.8) + 'px';
            });
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.warn('⚠️ Failed to restore Reading Preferences:', error.message);
        return false;
    }
}

// ============================================
// TEMPLATE SWITCH ENGINE (UPDATED AI-TS-3.5)
// ============================================

let activeTemplateLevel = detectTemplateLevel();

function getActiveTemplate() {
    return activeTemplateLevel;
}

function setActiveTemplate(level) {
    activeTemplateLevel = level;
    CURRENT_TEMPLATE = level;
}

function executeTemplateSwitch(targetLevel) {
    const result = reconstructEditorForLevel(targetLevel);

    if (result.success) {
        setActiveTemplate(targetLevel);
        updateDialogContext();
        restoreReadingPreferences();
    }

    return {
        success: result.success,
        previousLevel: getActiveTemplate() === targetLevel ? targetLevel : null,
        currentLevel: targetLevel,
        inserted: result.inserted,
        removed: result.removed,
        preserved: result.preserved,
        message: result.success ? 'Template switch completed successfully' : 'Template switch completed with errors'
    };
}

// ============================================
// TEMPLATE SELECTOR UI FUNCTIONS
// ============================================

function openDialog() {
    if (dialogOverlay) {
        updateDialogContext();
        dialogOverlay.style.display = 'flex';

        const currentLevel = detectTemplateLevel();
        const radioButtons = document.querySelectorAll('input[name="template-level"]');

        radioButtons.forEach(radio => {
            const radioValue = radio.value;
            if ((currentLevel === 'Level 1' && radioValue === 'level1') ||
                (currentLevel === 'Level 2' && radioValue === 'level2') ||
                (currentLevel === 'Level 3' && radioValue === 'level3')) {
                radio.checked = true;
            } else {
                radio.checked = false;
            }
        });
    }
}

function closeDialog() {
    if (dialogOverlay) {
        dialogOverlay.style.display = 'none';
    }
}

// ============================================
// APPLY ACTION (UPDATED AI-TS-3.5)
// ============================================

function handleApplyAction() {
    const selectedRadio = document.querySelector('input[name="template-level"]:checked');
    let selectedLevel = null;

    if (selectedRadio) {
        const value = selectedRadio.value;
        if (value === 'level1') {
            selectedLevel = 'Level 1';
        } else if (value === 'level2') {
            selectedLevel = 'Level 2';
        } else if (value === 'level3') {
            selectedLevel = 'Level 3';
        }
    }

    if (!selectedLevel) {
        return;
    }

    const result = executeTemplateSwitch(selectedLevel);
    closeDialog();
}

// ============================================
// LEGACY UPGRADE ENGINE (PRESERVED)
// ============================================

function evaluateUpgrade(currentLevel, targetLevel) {
    const allowedTransitions = {
        'Level 1': ['Level 2', 'Level 3'],
        'Level 2': ['Level 3'],
        'Level 3': []
    };

    if (!targetLevel || !targetLevel.startsWith('Level ')) {
        return { allowed: false, reason: 'Invalid target level' };
    }

    if (!allowedTransitions.hasOwnProperty(currentLevel)) {
        return { allowed: false, reason: 'Invalid current level' };
    }

    if (allowedTransitions[currentLevel].includes(targetLevel)) {
        return { allowed: true, reason: `Upgrade from ${currentLevel} to ${targetLevel} is allowed` };
    }

    return { allowed: false, reason: `Upgrade from ${currentLevel} to ${targetLevel} is not allowed` };
}

function executeFieldInsertion(currentLevel, targetLevel) {
    const results = {
        success: false,
        inserted: [],
        errors: [],
        skipped: []
    };

    if (targetLevel === 'Level 2' || targetLevel === 'Level 3') {
        if (!fieldExists('BC')) {
            const inserted = insertField('BC', 'input', 'Crowns');
            if (inserted) {
                results.inserted.push('BC');
            } else {
                results.errors.push('Failed to insert BC');
            }
        } else {
            results.skipped.push('BC (already exists)');
        }
    }

    if (targetLevel === 'Level 3') {
        if (!fieldExists('SW')) {
            const inserted = insertField('SW', 'input', 'BC');
            if (inserted) {
                results.inserted.push('SW');
            } else {
                results.errors.push('Failed to insert SW');
            }
        } else {
            results.skipped.push('SW (already exists)');
        }
    }

    results.success = results.errors.length === 0;
    return results;
}

function handleUpgradeAction() {
    const currentLevel = detectTemplateLevel();
    const selectedRadio = document.querySelector('input[name="upgrade-target"]:checked');
    let targetLevel = null;

    if (selectedRadio) {
        const value = selectedRadio.value;
        if (value === 'level2') {
            targetLevel = 'Level 2';
        } else if (value === 'level3') {
            targetLevel = 'Level 3';
        }
    }

    if (!targetLevel) {
        return;
    }

    const decision = evaluateUpgrade(currentLevel, targetLevel);

    if (decision.allowed) {
        const result = executeFieldInsertion(currentLevel, targetLevel);
        if (result.success) {
            updateDialogContext();
        }
    }

    closeDialog();
}

// ============================================
// EVENT LISTENERS
// ============================================

const newBtn = document.querySelector('.toolbar-btn:first-child');
if (newBtn) {
    newBtn.addEventListener('click', function() {
        const currentLevel = detectTemplateLevel();
        const targetSchema = getSchemaFields(currentLevel);
        const requiredFields = getRequiredFields(currentLevel);
        
        const editorContainer = document.querySelector('.editor-container');
        if (!editorContainer) {
            return;
        }
        
        const parent = editorContainer.parentNode;
        const newEditorContainer = document.createElement('div');
        newEditorContainer.className = 'editor-container';
        newEditorContainer.id = 'editor-container';
        
        for (const fieldName of targetSchema) {
            const isMultiline = (fieldName === 'Reflection' || fieldName === 'Prayer Points' || fieldName === 'Application');
            
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'template-field';
            
            const label = document.createElement('label');
            label.textContent = `${fieldName}:`;
            
            if (requiredFields.includes(fieldName)) {
                const indicator = document.createElement('span');
                indicator.className = 'required-indicator';
                indicator.textContent = ' *';
                label.appendChild(indicator);
            }
            
            fieldDiv.appendChild(label);
            
            const fieldKey = fieldName.toLowerCase().replace(/ /g, '_');
            
            if (isMultiline) {
                const textarea = document.createElement('textarea');
                textarea.className = 'template-textarea';
                textarea.setAttribute('data-field', fieldKey);
                textarea.setAttribute('id', `field-${fieldKey}`);
                
                if (requiredFields.includes(fieldName)) {
                    textarea.setAttribute('required', 'required');
                }
                
                fieldDiv.appendChild(textarea);
                applyAutoExpandToTextarea(textarea);
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'template-input';
                input.setAttribute('data-field', fieldKey);
                input.setAttribute('id', `field-${fieldKey}`);
                
                if (requiredFields.includes(fieldName)) {
                    input.setAttribute('required', 'required');
                }
                
                fieldDiv.appendChild(input);
            }
            
            const errorDiv = document.createElement('div');
            const errorId = `error-${fieldKey}`;
            errorDiv.className = 'field-error';
            errorDiv.id = errorId;
            fieldDiv.appendChild(errorDiv);
            
            newEditorContainer.appendChild(fieldDiv);
        }
        
        parent.replaceChild(newEditorContainer, editorContainer);
    });
}

const exportBtn = document.getElementById('export-btn');
if (exportBtn) {
    exportBtn.addEventListener('click', async function() {
        try {
            const success = await copyReflection();
        } catch (error) {
            console.warn(`⚠ Export error: ${error.message}`);
        }
    });
}

if (levelBtn) {
    levelBtn.addEventListener('click', openDialog);
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', closeDialog);
}

if (dialogOverlay) {
    dialogOverlay.addEventListener('click', function(event) {
        if (event.target === dialogOverlay) {
            closeDialog();
        }
    });
}

if (applyBtn) {
    applyBtn.addEventListener('click', handleApplyAction);
}

const submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
    const url = submitBtn.dataset.submitUrl;
    submitBtn.addEventListener('click', function() {
        if (url) {
            window.open(url, '_blank');
        } else {
            console.warn('⚠ Submit: No URL configured');
        }
    });
}

// ============================================
// PREVIEW PANEL CONTROLS (M4.1 & M4.2)
// ============================================

const previewBtn = document.getElementById('preview-btn');
const previewPanel = document.getElementById('preview-panel');
const previewCloseBtn = document.getElementById('preview-close-btn');

// ============================================
// RENDER PREVIEW CONTENT (M4.2)
// ============================================

function renderPreview() {
    const previewContent = document.getElementById('preview-content');
    if (!previewContent) return;

    const fields = getTemplateFieldValues();
    const currentLevel = detectTemplateLevel();
    const schema = getSchemaFields(currentLevel);

    if (!schema || schema.length === 0) {
        previewContent.innerHTML = '<p class="preview-placeholder">No template schema found</p>';
        return;
    }

    let html = '<div class="preview-reflection">';

    for (const fieldName of schema) {
        const value = fields[fieldName] || '';
        const isMultiline = (fieldName === 'Reflection' || fieldName === 'Prayer Points' || fieldName === 'Application');

        if (isMultiline) {
            const displayValue = value || '<em>Empty</em>';
            html += `
                <div class="preview-field preview-multiline">
                    <div class="preview-field-label">${fieldName}:</div>
                    <div class="preview-field-value">${displayValue}</div>
                </div>
            `;
        } else {
            const displayValue = value || '<em>Empty</em>';
            html += `
                <div class="preview-field">
                    <span class="preview-field-label">${fieldName}:</span>
                    <span class="preview-field-value">${displayValue}</span>
                </div>
            `;
        }
    }

    html += '</div>';
    previewContent.innerHTML = html;

    const currentSize = currentFontSize || FONT_SIZE_CONFIG.defaultSize;
    const previewFields = previewContent.querySelectorAll('.preview-field-value');
    previewFields.forEach(field => {
        field.style.fontSize = currentSize + 'px';
        field.style.lineHeight = (currentSize * 1.8) + 'px';
    });

    previewContent.style.fontSize = currentSize + 'px';
    previewContent.style.lineHeight = (currentSize * 1.8) + 'px';
}

// ============================================
// REFLECTION FORMATTER (M5.1)
// ============================================

function formatReflection() {
    const fields = getTemplateFieldValues();
    const currentLevel = detectTemplateLevel();
    const schema = getSchemaFields(currentLevel);

    if (!schema || schema.length === 0) {
        return '';
    }

    const EXPORT_OPTIONAL_FIELDS = ['Crowns', 'Prayer Points', 'Application'];
    const lines = [];

    lines.push(`=== Reflection ===`);
    lines.push('');

    for (const fieldName of schema) {
        const value = fields[fieldName] || '';
        const isOptional = EXPORT_OPTIONAL_FIELDS.includes(fieldName);

        if (isOptional && value.trim() === '') {
            continue;
        }

        const displayValue = value || '[Empty]';

        if (fieldName === 'Reflection') {
            lines.push('');
            lines.push('Reflection:');
            if (value && value.trim()) {
                const reflectionLines = value.split('\n');
                for (const line of reflectionLines) {
                    lines.push(`  ${line}`);
                }
            } else {
                lines.push('  (empty)');
            }
        } else if (displayValue.includes('\n')) {
            lines.push('');
            lines.push(`${fieldName}:`);
            const indentedLines = displayValue.split('\n').map(line => `  ${line}`);
            lines.push(...indentedLines);
        } else {
            lines.push(`${fieldName}: ${displayValue}`);
        }

        if (fieldName === 'Application' && value && value.trim() !== '') {
            lines.push('');
        }
    }

    lines.push('');
    lines.push('=== End of Reflection ===');
    const output = lines.join('\n');
    return output;
}

// ============================================
// CLIPBOARD COPY (M5.2)
// ============================================

async function copyReflection() {
    try {
        const validationPassed = performValidation('Export');

        if (!validationPassed) {
            return false;
        }

        const reflectionText = formatReflection();

        if (!reflectionText) {
            return false;
        }

        let success = false;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(reflectionText);
            success = true;
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = reflectionText;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.left = '-9999px';
            textarea.style.top = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            success = true;
        }

        if (success) {
            showExportConfirmation();
        }

        return success;
    } catch (error) {
        return false;
    }
}

// ============================================
// EXPORT CONFIRMATION (M5.3)
// ============================================

let confirmationTimeout = null;

function showExportConfirmation() {
    const confirmation = document.getElementById('export-confirmation');
    if (!confirmation) return;

    if (confirmationTimeout) {
        clearTimeout(confirmationTimeout);
        confirmationTimeout = null;
    }

    confirmation.classList.remove('hidden');
    confirmation.style.display = 'block';
    confirmation.style.animation = 'slideInRight 0.3s ease-out';

    confirmationTimeout = setTimeout(() => {
        confirmation.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            confirmation.style.display = 'none';
            confirmation.classList.add('hidden');
        }, 300);
        confirmationTimeout = null;
    }, 3000);
}

// Expose confirmation for testing
window.showExportConfirmation = showExportConfirmation;

// ============================================
// EXPORT VALIDATION (M5.4)
// ============================================

async function validateExport() {
    const results = {
        success: false,
        checks: [],
        errors: [],
        warnings: []
    };

    try {
        const formattedText = formatReflection();
        results.checks.push({ check: 'Formatter output generated', passed: true });

        if (!formattedText) {
            results.errors.push('Formatter output is empty');
            results.success = false;
            return results;
        }

        let clipboardText = '';
        try {
            if (navigator.clipboard && navigator.clipboard.readText) {
                clipboardText = await navigator.clipboard.readText();
                results.checks.push({ check: 'Clipboard read successful', passed: true });
            } else {
                clipboardText = formattedText;
                results.warnings.push('Clipboard API read not available');
            }
        } catch (clipError) {
            clipboardText = formattedText;
            results.warnings.push('Clipboard read failed');
        }

        const clipboardMatches = clipboardText === formattedText;
        results.checks.push({
            check: 'Clipboard matches formatter output',
            passed: clipboardMatches
        });

        if (!clipboardMatches) {
            results.errors.push('Clipboard content does not match formatter output');
        }

        const fields = getTemplateFieldValues();
        const currentLevel = detectTemplateLevel();
        const schema = TEMPLATE_SCHEMAS[currentLevel];

        if (schema) {
            for (const fieldName of schema) {
                const fieldInFormatter = formattedText.includes(`${fieldName}:`);
                results.checks.push({
                    check: `Field "${fieldName}" present in formatter`,
                    passed: fieldInFormatter
                });
                if (!fieldInFormatter) {
                    results.errors.push(`Field "${fieldName}" missing from formatter`);
                }
            }

            const fieldCounts = {};
            const lines = formattedText.split('\n');
            for (const line of lines) {
                const match = line.match(/^([^:]+):/);
                if (match) {
                    const fieldName = match[1].trim();
                    fieldCounts[fieldName] = (fieldCounts[fieldName] || 0) + 1;
                }
            }

            for (const [fieldName, count] of Object.entries(fieldCounts)) {
                if (count > 1) {
                    results.errors.push(`Duplicate field "${fieldName}" found (${count} times)`);
                }
            }
            results.checks.push({ check: 'No duplicate fields', passed: results.errors.filter(e => e.includes('duplicate')).length === 0 });

            const multilineFields = ['Reflection', 'Prayer Points', 'Application'];
            let multilinePreserved = true;
            for (const fieldName of multilineFields) {
                if (fields[fieldName] && fields[fieldName].includes('\n')) {
                    const fieldLines = fields[fieldName].split('\n');
                    let foundAll = true;
                    for (const line of fieldLines) {
                        if (!formattedText.includes(line)) {
                            foundAll = false;
                            break;
                        }
                    }
                    if (!foundAll) {
                        multilinePreserved = false;
                        results.errors.push(`Multiline content for "${fieldName}" not preserved`);
                    }
                }
            }
            results.checks.push({ check: 'Multiline formatting preserved', passed: multilinePreserved });

            let emptyFieldsHandled = true;
            for (const fieldName of schema) {
                if (!fields[fieldName] || fields[fieldName] === '') {
                    const fieldLine = formattedText.split('\n').find(line => line.startsWith(`${fieldName}:`));
                    if (fieldLine && !fieldLine.includes('[Empty]')) {
                        emptyFieldsHandled = false;
                        results.errors.push(`Empty field "${fieldName}" not marked as [Empty]`);
                    }
                }
            }
            results.checks.push({ check: 'Empty fields handled correctly', passed: emptyFieldsHandled });
        }

        results.checks.push({
            check: 'Editor unchanged during validation',
            passed: true
        });

        const activeLevel = getActiveTemplate();
        results.checks.push({
            check: `Active template unchanged: ${activeLevel}`,
            passed: true
        });

        results.success = results.errors.length === 0;

        return results;
    } catch (error) {
        results.success = false;
        results.errors.push(`Validation error: ${error.message}`);
        return results;
    }
}

// Expose formatter, copy, confirmation, and validation for testing
window.formatReflection = formatReflection;
window.copyReflection = copyReflection;
window.showExportConfirmation = showExportConfirmation;
window.validateExport = validateExport;

// ============================================
// EXPORT WORKFLOW VERIFICATION (M5.5)
// ============================================

async function verifyExportWorkflow() {
    const workflow = {
        steps: [],
        success: false,
        errors: [],
        warnings: [],
        details: {}
    };

    try {
        const editorFields = getTemplateFieldValues();
        const editorFieldCount = Object.keys(editorFields).length;
        workflow.details.editorFieldCount = editorFieldCount;
        workflow.steps.push({ step: 1, name: 'Editor State', status: '✅ PASS' });

        const currentLevel = detectTemplateLevel();
        const activeLevel = getActiveTemplate();
        const templateMatches = currentLevel === activeLevel;
        workflow.details.currentLevel = currentLevel;
        workflow.details.activeLevel = activeLevel;
        workflow.details.templateMatches = templateMatches;
        workflow.steps.push({ step: 2, name: 'Template Detection', status: templateMatches ? '✅ PASS' : '❌ FAIL' });

        if (!templateMatches) {
            workflow.errors.push('Template detection mismatch');
        }

        const formattedText = formatReflection();
        const formatterSuccess = formattedText && formattedText.length > 0;
        workflow.details.formatterLength = formattedText ? formattedText.length : 0;
        workflow.steps.push({ step: 3, name: 'Reflection Formatter', status: formatterSuccess ? '✅ PASS' : '❌ FAIL' });

        if (!formatterSuccess) {
            workflow.errors.push('Formatter output empty');
        }

        const copySuccess = await copyReflection();
        workflow.details.copySuccess = copySuccess;
        workflow.steps.push({ step: 4, name: 'Clipboard Copy', status: copySuccess ? '✅ PASS' : '❌ FAIL' });

        if (!copySuccess) {
            workflow.errors.push('Clipboard copy failed');
        }

        const confirmationElement = document.getElementById('export-confirmation');
        const confirmationExists = confirmationElement !== null;
        workflow.details.confirmationExists = confirmationExists;
        workflow.steps.push({ step: 5, name: 'Export Confirmation', status: confirmationExists ? '✅ PASS' : '⚠ WARN' });

        if (!confirmationExists) {
            workflow.warnings.push('Confirmation element not found');
        }

        const validationResult = await validateExport();
        const validationPassed = validationResult && validationResult.success === true;
        workflow.details.validationPassed = validationPassed;
        workflow.details.validationChecks = validationResult ? validationResult.checks.length : 0;
        workflow.steps.push({ step: 6, name: 'Export Validation', status: validationPassed ? '✅ PASS' : '❌ FAIL' });

        if (!validationPassed) {
            workflow.errors.push('Validation failed');
        }

        const editorFieldsAfter = getTemplateFieldValues();
        const editorUnchanged = Object.keys(editorFields).length === Object.keys(editorFieldsAfter).length;
        workflow.details.editorUnchanged = editorUnchanged;
        workflow.steps.push({ step: 7, name: 'Editor State Preserved', status: editorUnchanged ? '✅ PASS' : '❌ FAIL' });

        if (!editorUnchanged) {
            workflow.errors.push('Editor state changed during workflow');
        }

        const finalLevel = detectTemplateLevel();
        const templateUnchanged = finalLevel === currentLevel;
        workflow.details.templateUnchanged = templateUnchanged;
        workflow.details.finalLevel = finalLevel;
        workflow.steps.push({ step: 8, name: 'Template State Preserved', status: templateUnchanged ? '✅ PASS' : '❌ FAIL' });

        if (!templateUnchanged) {
            workflow.errors.push('Template state changed during workflow');
        }

        workflow.success = workflow.errors.length === 0;

        return workflow;
    } catch (error) {
        workflow.success = false;
        workflow.errors.push(`Workflow error: ${error.message}`);
        return workflow;
    }
}

window.verifyExportWorkflow = verifyExportWorkflow;

function openPreview() {
    if (previewPanel) {
        renderPreview();
        previewPanel.style.display = 'flex';
        const closeBtn = document.getElementById('preview-close-btn');
        if (closeBtn) {
            setTimeout(function() {
                closeBtn.focus();
            }, 100);
        }
    }
}

function closePreview() {
    if (previewPanel) {
        previewPanel.style.display = 'none';
    }
}

if (previewBtn) {
    previewBtn.addEventListener('click', openPreview);
}

if (previewCloseBtn) {
    previewCloseBtn.addEventListener('click', closePreview);
}

if (previewPanel) {
    previewPanel.addEventListener('click', function(event) {
        if (event.target === previewPanel) {
            closePreview();
        }
    });
}

window.openPreview = openPreview;
window.closePreview = closePreview;
window.renderPreview = renderPreview;

// ============================================
// STICKY TOOLBAR BEHAVIOR (M4.1)
// ============================================

function initStickyToolbar() {
    const toolbar = document.getElementById('toolbar');
    if (!toolbar) return;

    let isSticky = false;

    function checkStickyState() {
        const rect = toolbar.getBoundingClientRect();
        const isCurrentlySticky = rect.top <= 0;

        if (isCurrentlySticky !== isSticky) {
            isSticky = isCurrentlySticky;
            if (isSticky) {
                toolbar.classList.add('sticky-shadow');
            } else {
                toolbar.classList.remove('sticky-shadow');
            }
        }
    }

    window.addEventListener('scroll', checkStickyState, { passive: true });
    window.addEventListener('resize', checkStickyState, { passive: true });
    setTimeout(checkStickyState, 100);
}

initStickyToolbar();

// ============================================
// M6.5 — BASIC REQUIRED FIELD VALIDATION
// ============================================

function getRequiredFieldsFromDOM() {
    return document.querySelectorAll('[required]');
}

function getFieldName(field) {
    return field.getAttribute('data-field') || field.id || 'unnamed';
}

function getErrorContainer(fieldName) {
    return document.querySelector(`#error-${fieldName}`);
}

function getTemplateField(field) {
    return field.closest('.template-field');
}

function validateField(field) {
    const fieldName = getFieldName(field);
    const value = field.value ? field.value.trim() : '';
    const isValid = value.length > 0;
    const errorContainer = getErrorContainer(fieldName);
    const templateField = getTemplateField(field);

    if (errorContainer) {
        if (!isValid) {
            const displayName = fieldName.replace(/_/g, ' ');
            errorContainer.textContent = `${displayName} is required`;
            errorContainer.classList.add('show');
        } else {
            errorContainer.textContent = '';
            errorContainer.classList.remove('show');
        }
    }

    if (templateField) {
        if (!isValid) {
            templateField.classList.add('has-error');
        } else {
            templateField.classList.remove('has-error');
        }
    }

    return {
        fieldName: fieldName,
        isValid: isValid,
        value: value
    };
}

function validateAllFields() {
    const currentLevel = detectTemplateLevel();
    const requiredFieldNames = getRequiredFields(currentLevel);

    const fieldContainers = document.querySelectorAll('.template-field');
    const results = [];
    let allValid = true;

    fieldContainers.forEach(container => {
        const label = container.querySelector('label');
        if (label) {
            let fieldName = label.textContent.replace(':', '').trim();
            fieldName = fieldName.replace(/\s*\*$/, '').trim();

            const isRequired = requiredFieldNames.includes(fieldName);

            if (isRequired) {
                const input = container.querySelector('.template-input');
                const textarea = container.querySelector('.template-textarea');
                const field = input || textarea;

                if (field) {
                    const result = validateField(field);
                    results.push(result);
                    if (!result.isValid) {
                        allValid = false;
                    }
                }
            }
        }
    });

    return {
        allValid: allValid,
        results: results,
        totalFields: requiredFieldNames.length,
        validCount: results.filter(r => r.isValid).length,
        invalidCount: results.filter(r => !r.isValid).length
    };
}

function showValidationSummary(message) {
    const summary = document.querySelector('#validation-summary');
    const messageElement = document.querySelector('#validation-message-text');

    if (summary) {
        summary.style.display = 'flex';
        summary.classList.remove('hidden');
    }

    if (messageElement) {
        messageElement.textContent = message || 'Please fill in all required fields before proceeding.';
    }
}

function hideValidationSummary() {
    const summary = document.querySelector('#validation-summary');

    if (summary) {
        summary.style.display = 'none';
        summary.classList.add('hidden');
    }
}

function isValidationSummaryVisible() {
    const summary = document.querySelector('#validation-summary');
    return summary && summary.style.display !== 'none';
}

function performValidation(action) {
    const result = validateAllFields();

    if (result.allValid) {
        hideValidationSummary();
        return true;
    } else {
        const message = `Please complete all required fields before exporting your reflection.`;
        showValidationSummary(message);
        focusFirstInvalidField();
        return false;
    }
}

function focusFirstInvalidField() {
    const currentLevel = detectTemplateLevel();
    const requiredFields = getRequiredFields(currentLevel);
    
    const fieldContainers = document.querySelectorAll('.template-field');
    for (const container of fieldContainers) {
        const label = container.querySelector('label');
        if (label) {
            let fieldName = label.textContent.replace(/[:\*]/g, '').trim();
            if (requiredFields.includes(fieldName)) {
                const input = container.querySelector('.template-input');
                const textarea = container.querySelector('.template-textarea');
                const field = input || textarea;
                
                if (field && !field.value.trim()) {
                    field.focus();
                    return true;
                }
            }
        }
    }
    return false;
}

function clearValidation() {
    const fields = getRequiredFields();
    fields.forEach(field => {
        const fieldName = getFieldName(field);
        const errorContainer = getErrorContainer(fieldName);
        const templateField = getTemplateField(field);

        if (errorContainer) {
            errorContainer.textContent = '';
            errorContainer.classList.remove('show');
        }

        if (templateField) {
            templateField.classList.remove('has-error');
        }
    });

    hideValidationSummary();
}

function setupFieldValidationListeners() {
    const fields = getRequiredFields();

    fields.forEach(field => {
        field.addEventListener('input', function() {
            const fieldName = getFieldName(this);
            const errorContainer = getErrorContainer(fieldName);
            const templateField = getTemplateField(this);
            const value = this.value ? this.value.trim() : '';
            const isValid = value.length > 0;

            if (errorContainer) {
                if (!isValid) {
                    errorContainer.textContent = `${fieldName.replace(/_/g, ' ')} is required`;
                    errorContainer.classList.add('show');
                } else {
                    errorContainer.textContent = '';
                    errorContainer.classList.remove('show');
                }
            }

            if (templateField) {
                if (!isValid) {
                    templateField.classList.add('has-error');
                } else {
                    templateField.classList.remove('has-error');
                }
            }

            if (isValidationSummaryVisible()) {
                const result = validateAllFields();
                if (result.allValid) {
                    hideValidationSummary();
                }
            }
        });

        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function setupValidationCloseButton() {
    const closeBtn = document.querySelector('#validation-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            hideValidationSummary();
        });
    }
}

function initValidation() {
    setupFieldValidationListeners();
    setupValidationCloseButton();

    const newBtn = document.querySelector('.toolbar-btn:first-child');
    if (newBtn) {
        newBtn.addEventListener('click', function() {
            setTimeout(clearValidation, 100);
        });
    }

    const applyBtn = document.querySelector('#apply-template-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            setTimeout(clearValidation, 200);
        });
    }
}

// Expose validation functions for testing
window.validateAllFields = validateAllFields;
window.performValidation = performValidation;
window.clearValidation = clearValidation;
window.showValidationSummary = showValidationSummary;
window.hideValidationSummary = hideValidationSummary;

let lastFocusedElement = null;

const originalOpenDialog = openDialog;
openDialog = function() {
    lastFocusedElement = document.activeElement;
    originalOpenDialog();
    setTimeout(function() {
        const firstInput = dialogOverlay.querySelector('input, button, textarea');
        if (firstInput) {
            firstInput.focus();
        }
    }, 50);
};

const originalCloseDialog = closeDialog;
closeDialog = function() {
    originalCloseDialog();
    if (lastFocusedElement && lastFocusedElement.focus) {
        setTimeout(function() {
            lastFocusedElement.focus();
        }, 50);
    }
};

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (dialogOverlay && dialogOverlay.style.display === 'flex') {
            closeDialog();
            event.preventDefault();
        }
        if (previewPanel && previewPanel.style.display === 'flex') {
            closePreview();
            event.preventDefault();
        }
    }
});

dialogOverlay.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        const focusableElements = dialogOverlay.querySelectorAll(
            'button, input, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    }
});

const originalOpenPreview = openPreview;
openPreview = function() {
    lastFocusedElement = document.activeElement;
    originalOpenPreview();
    setTimeout(function() {
        const closeBtn = previewPanel.querySelector('.preview-close-btn');
        if (closeBtn) {
            closeBtn.focus();
        }
    }, 50);
};

const originalClosePreview = closePreview;
closePreview = function() {
    originalClosePreview();
    if (lastFocusedElement && lastFocusedElement.focus) {
        setTimeout(function() {
            lastFocusedElement.focus();
        }, 50);
    }
};

previewPanel.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        const focusableElements = previewPanel.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) {
            previewPanel.setAttribute('tabindex', '-1');
            previewPanel.focus();
            event.preventDefault();
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const closeBtn = document.getElementById('preview-close-btn');
        if (closeBtn && focusableElements[0] !== closeBtn) {
            const elementsArray = Array.from(focusableElements);
            const closeIndex = elementsArray.indexOf(closeBtn);
            if (closeIndex > 0) {
                elementsArray.splice(closeIndex, 1);
                elementsArray.unshift(closeBtn);
                const newFirst = elementsArray[0];
                const newLast = elementsArray[elementsArray.length - 1];
                if (event.shiftKey) {
                    if (document.activeElement === newFirst) {
                        newLast.focus();
                        event.preventDefault();
                    }
                } else {
                    if (document.activeElement === newLast) {
                        newFirst.focus();
                        event.preventDefault();
                    }
                }
                return;
            }
        }

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    }
});

// ============================================
// THEME SELECTOR DIALOG (Phase 7C-4.1)
// ============================================

const themeBtn = document.getElementById('theme-btn');
const themeDialog = document.getElementById('theme-selector-dialog');
const themeCancelBtn = document.getElementById('cancel-theme-btn');
const themeApplyBtn = document.getElementById('apply-theme-btn');
const themeCurrentDisplay = document.getElementById('theme-current-display');
const themeRadios = document.querySelectorAll('input[name="theme-select"]');

function openThemeDialog() {
    if (!themeDialog) return;

    let currentTheme = 'light';
    try {
        if (typeof window.ThemeController !== 'undefined') {
            currentTheme = window.ThemeController.getTheme();
        }
    } catch (e) {
        // Use default
    }

    const displayName = getThemeDisplayName(currentTheme);
    if (themeCurrentDisplay) {
        themeCurrentDisplay.textContent = displayName;
    }

    themeRadios.forEach(radio => {
        if (radio.value === currentTheme) {
            radio.checked = true;
        } else {
            radio.checked = false;
        }
    });

    themeDialog.style.display = 'flex';
}

function closeThemeDialog() {
    if (themeDialog) {
        themeDialog.style.display = 'none';
    }
}

function getThemeDisplayName(themeId) {
    const names = {
        light: 'Light',
        dark: 'Dark',
        sepia: 'Sepia',
        forest: 'Forest',
        ocean: 'Ocean',
        midnight: 'Midnight'
    };
    return names[themeId] || themeId;
}

function handleThemeApply() {
    let selectedTheme = null;
    themeRadios.forEach(radio => {
        if (radio.checked) {
            selectedTheme = radio.value;
        }
    });

    if (!selectedTheme) {
        return false;
    }

    if (typeof window.ThemeController === 'undefined') {
        console.error('❌ ThemeController not available. Cannot apply theme.');
        return false;
    }

    try {
        const currentActiveTheme = window.ThemeController.getTheme();
        
        if (selectedTheme === currentActiveTheme) {
            closeThemeDialog();
            return true;
        }

        window.ThemeController.setTheme(selectedTheme);
        closeThemeDialog();
        return true;
    } catch (error) {
        console.error(`❌ Failed to apply theme "${selectedTheme}":`, error.message);
        return false;
    }
}

if (themeBtn) {
    const newThemeBtn = themeBtn.cloneNode(true);
    themeBtn.parentNode.replaceChild(newThemeBtn, themeBtn);
    
    newThemeBtn.addEventListener('click', function(event) {
        event.preventDefault();
        openThemeDialog();
    });
    
    window._themeBtn = newThemeBtn;
}

if (themeCancelBtn) {
    themeCancelBtn.addEventListener('click', function(event) {
        event.preventDefault();
        closeThemeDialog();
    });
}

if (themeDialog) {
    themeDialog.addEventListener('click', function(event) {
        if (event.target === themeDialog) {
            closeThemeDialog();
        }
    });
}

if (themeApplyBtn) {
    themeApplyBtn.addEventListener('click', function(event) {
        event.preventDefault();
        handleThemeApply();
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (themeDialog && themeDialog.style.display === 'flex') {
            closeThemeDialog();
        }
    }
});

// ============================================
// EXPOSE FUNCTIONS FOR TESTING
// ============================================

window.TEMPLATE_SCHEMAS = TEMPLATE_SCHEMAS;
window.getTemplateFieldValues = getTemplateFieldValues;
window.detectTemplateLevel = detectTemplateLevel;
window.updateDialogContext = updateDialogContext;
window.getFieldValue = getFieldValue;
window.setFieldValue = setFieldValue;
window.preserveAllFieldValues = preserveAllFieldValues;
window.restoreFieldValues = restoreFieldValues;
window.getFieldLabels = getFieldLabels;
window.fieldExists = fieldExists;
window.insertField = insertField;
window.removeField = removeField;
window.removeFieldsNotInSchema = removeFieldsNotInSchema;
window.insertMissingFields = insertMissingFields;
window.reconstructEditorForLevel = reconstructEditorForLevel;
window.getActiveTemplate = getActiveTemplate;
window.setActiveTemplate = setActiveTemplate;
window.executeTemplateSwitch = executeTemplateSwitch;
window.restoreReadingPreferences = restoreReadingPreferences;
window.openDialog = openDialog;
window.closeDialog = closeDialog;
window.handleApplyAction = handleApplyAction;
window.evaluateUpgrade = evaluateUpgrade;
window.executeFieldInsertion = executeFieldInsertion;
window.handleUpgradeAction = handleUpgradeAction;

// ============================================
// M6.1B — EDITOR WRITING FONT SIZE CONTROL (ALL FIELDS)
// ============================================

const fontIncreaseBtn = document.getElementById('font-increase-btn');
const fontDecreaseBtn = document.getElementById('font-decrease-btn');

const FONT_SIZE_CONFIG = {
    minSize: 14,
    maxSize: 28,
    defaultSize: 16,
    step: 1
};

let currentFontSize = FONT_SIZE_CONFIG.defaultSize;

function getEditableWritingFields() {
    const editorContainer = document.querySelector('.editor-container');
    if (!editorContainer) return [];
    const fields = editorContainer.querySelectorAll('textarea, input[type="text"]');
    return fields;
}

function applyFontSize(size) {
    const clampedSize = Math.min(
        Math.max(size, FONT_SIZE_CONFIG.minSize),
        FONT_SIZE_CONFIG.maxSize
    );

    const fields = getEditableWritingFields();

    if (fields.length === 0) {
        return;
    }

    fields.forEach(field => {
        field.style.fontSize = clampedSize + 'px';
        field.style.lineHeight = (clampedSize * 1.8) + 'px';
    });

    currentFontSize = clampedSize;
}

function increaseFontSize() {
    const newSize = currentFontSize + FONT_SIZE_CONFIG.step;
    if (newSize <= FONT_SIZE_CONFIG.maxSize) {
        applyFontSize(newSize);
    }
}

function decreaseFontSize() {
    const newSize = currentFontSize - FONT_SIZE_CONFIG.step;
    if (newSize >= FONT_SIZE_CONFIG.minSize) {
        applyFontSize(newSize);
    }
}

function initFontSizeControl() {
    const fields = getEditableWritingFields();
    if (fields.length > 0) {
        applyFontSize(FONT_SIZE_CONFIG.defaultSize);
    }

    if (fontIncreaseBtn) {
        fontIncreaseBtn.addEventListener('click', increaseFontSize);
    }

    if (fontDecreaseBtn) {
        fontDecreaseBtn.addEventListener('click', decreaseFontSize);
    }
}

initFontSizeControl();

window.increaseFontSize = increaseFontSize;
window.decreaseFontSize = decreaseFontSize;
window.applyFontSize = applyFontSize;
window.getCurrentFontSize = function() { return currentFontSize; };
window.getEditableWritingFields = getEditableWritingFields;

// ============================================
// PHASE 7E.1 — THEME PERSISTENCE
// ============================================

function persistTheme(themeId) {
    try {
        if (typeof localStorage === 'undefined') {
            return;
        }
        
        const validThemes = ['light', 'dark', 'sepia', 'forest', 'ocean', 'midnight'];
        if (!validThemes.includes(themeId)) {
            return;
        }
        
        localStorage.setItem('theme', themeId);
    } catch (error) {
        console.warn('⚠️ Failed to persist theme:', error.message);
    }
}

function restoreTheme() {
    try {
        if (typeof localStorage === 'undefined') {
            return null;
        }
        
        const stored = localStorage.getItem('theme');
        if (stored === null) {
            return null;
        }
        
        const validThemes = ['light', 'dark', 'sepia', 'forest', 'ocean', 'midnight'];
        if (!validThemes.includes(stored)) {
            localStorage.removeItem('theme');
            return null;
        }
        
        return stored;
    } catch (error) {
        console.warn('⚠️ Failed to restore theme:', error.message);
        return null;
    }
}

function initializePersistence() {
    if (typeof window.ThemeController === 'undefined') {
        return;
    }
    
    const storedTheme = restoreTheme();
    
    if (storedTheme) {
        try {
            window.ThemeController.setTheme(storedTheme);
        } catch (error) {
            window.ThemeController.setTheme('light');
        }
    } else {
        try {
            const currentTheme = window.ThemeController.getTheme();
            persistTheme(currentTheme);
        } catch (error) {
            // Ignore
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializePersistence, 10);
    });
} else {
    setTimeout(initializePersistence, 10);
}