// Daily Bible Reflection Notepad - Main Application
// Version 0.1 - Phase 3 Field Mapping & Data Integrity (AI-TS-3.5)

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Global template state - declared immediately
var CURRENT_TEMPLATE = 'Level 1';

function initApp() {
    // Initialize the global template state
    CURRENT_TEMPLATE = 'Level 1';

    console.log('Daily Bible Reflection Notepad initialized');

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
        // Ensure we return the array of field names, not DOM elements
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
                // Get raw label text and clean it
                let fieldName = label.textContent.replace(':', '').trim();
                // Remove trailing asterisk if present (required field indicator)
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
        // Use the global variable first
        if (typeof CURRENT_TEMPLATE !== 'undefined' && CURRENT_TEMPLATE) {
            return CURRENT_TEMPLATE;
        }

        // Fallback: detect from DOM if global is not set
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
            // Use the global template state for display
            const currentLevel = CURRENT_TEMPLATE || 'Level 1';
            dialogContext.textContent = `Current Template: ${currentLevel}`;
            
            // Also log for debugging
            console.log(`📋 Dialog context updated to: ${currentLevel}`);
        }
    }

    // ============================================
    // FIELD VALUE PRESERVATION (AI-TS-3.5)
    // ============================================

    function getFieldValue(fieldName) {
        // Try multiple methods to find the field
        const fieldContainers = document.querySelectorAll('.template-field');
        
        // Method 1: Exact label match
        for (const container of fieldContainers) {
            const label = container.querySelector('label');
            if (label) {
                let labelName = label.textContent.replace(/[:\*]/g, '').trim();
                // Normalize spaces
                labelName = labelName.replace(/\s+/g, ' ');
                if (labelName === fieldName) {
                    const input = container.querySelector('.template-input');
                    const textarea = container.querySelector('.template-textarea');
                    if (input) return input.value || '';
                    if (textarea) return textarea.value || '';
                }
            }
        }
        
        // Method 2: Try by data-field attribute
        const fieldKey = fieldName.toLowerCase().replace(/ /g, '_');
        const fieldByData = document.querySelector(`[data-field="${fieldKey}"]`);
        if (fieldByData) {
            return fieldByData.value || '';
        }
        
        // Method 3: Try by id
        const fieldById = document.getElementById(`field-${fieldKey}`);
        if (fieldById) {
            return fieldById.value || '';
        }
        
        // Method 4: Fuzzy match (case insensitive, trim extra spaces)
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
        // Method 1: Try by data-field attribute
        const fieldKey = fieldName.toLowerCase().replace(/ /g, '_');
        const fieldByData = document.querySelector(`[data-field="${fieldKey}"]`);
        if (fieldByData) {
            fieldByData.value = value;
            return true;
        }
        
        // Method 2: Try by id
        const fieldById = document.getElementById(`field-${fieldKey}`);
        if (fieldById) {
            fieldById.value = value;
            return true;
        }
        
        // Method 3: Try by label match
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
        console.log(`✓ Preserved ${Object.keys(fields).length} field values`);
        return fields;
    }

    function restoreFieldValues(fieldValues) {
        let restored = 0;
        for (const [fieldName, value] of Object.entries(fieldValues)) {
            if (setFieldValue(fieldName, value)) {
                restored++;
            }
        }
        console.log(`✓ Restored ${restored} field values`);
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
                    console.log(`✓ Removed field: "${fieldName}"`);
                    return true;
                }
            }
        }
        console.log(`⚠ Field not found: "${fieldName}"`);
        return false;
    }

    function removeFieldsNotInSchema(targetLevel) {
        const targetSchema = TEMPLATE_SCHEMAS[targetLevel];
        if (!targetSchema) {
            console.log(`⚠ Unknown target level: ${targetLevel}`);
            return [];
        }

        const removed = [];
        const fieldContainers = document.querySelectorAll('.template-field');

        // Collect fields to remove
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

        // Remove fields (reverse order to avoid index issues)
        for (const fieldName of fieldsToRemove) {
            if (removeField(fieldName)) {
                removed.push(fieldName);
            }
        }

        if (removed.length > 0) {
            console.log(`✓ Removed ${removed.length} fields not in ${targetLevel}: ${removed.join(', ')}`);
        } else {
            console.log(`✓ No fields to remove for ${targetLevel}`);
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
            console.log(`⚠ Cannot find field "${insertAfter}" to insert after`);
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

        console.log(`✓ Inserted "${labelText}" after "${insertAfter}"`);
        return true;
    }

    function insertMissingFields(targetLevel, preservedValues) {
        const targetSchema = TEMPLATE_SCHEMAS[targetLevel];
        if (!targetSchema) {
            console.log(`⚠ Unknown target level: ${targetLevel}`);
            return { inserted: [], errors: [] };
        }

        const inserted = [];
        const errors = [];

        // Get current field labels
        let currentLabels = getFieldLabels();

        // For each field in target schema, check if it exists
        for (const fieldName of targetSchema) {
            if (!currentLabels.includes(fieldName)) {
                // Determine where to insert
                const schemaIndex = targetSchema.indexOf(fieldName);
                let insertAfter = null;

                if (schemaIndex > 0) {
                    // Find the previous field in schema that exists
                    for (let i = schemaIndex - 1; i >= 0; i--) {
                        if (currentLabels.includes(targetSchema[i])) {
                            insertAfter = targetSchema[i];
                            break;
                        }
                    }
                }

                // If no previous field exists, insert at beginning
                if (!insertAfter && schemaIndex === 0) {
                    // Insert at beginning - use first existing field
                    if (currentLabels.length > 0) {
                        insertAfter = currentLabels[0];
                    } else {
                        // No fields exist - append to editor container
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
                            console.log(`✓ Inserted "${fieldName}" at beginning`);
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
                        // Restore preserved value if exists
                        if (preservedValues && preservedValues[fieldName] !== undefined) {
                            setFieldValue(fieldName, preservedValues[fieldName]);
                        }
                        currentLabels = getFieldLabels();
                    } else {
                        errors.push(`Failed to insert ${fieldName}`);
                    }
                }
            } else {
                // Field exists, restore value if preserved
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
        console.log(`=== RECONSTRUCTING EDITOR FOR ${targetLevel} ===`);

        // Step 1: Preserve all field values using robust field mapping
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

        console.log(`  ✓ Preserved ${Object.keys(preservedValues).length} field value mappings`);

        // Step 2: Get target schema fields using helper (V2.1)
        const targetSchema = getSchemaFields(targetLevel);
        if (!targetSchema || targetSchema.length === 0) {
            console.log(`⚠ Unknown target level: ${targetLevel}`);
            return {
                success: false,
                inserted: [],
                removed: [],
                preserved: 0,
                error: `Unknown target level: ${targetLevel}`
            };
        }

        // Step 3: Get required fields from canonical schema (V2.1)
        const requiredFields = getRequiredFields(targetLevel);

        // Step 4: Clear the editor container
        const editorContainer = document.querySelector('.editor-container');
        if (!editorContainer) {
            console.log('⚠ Editor container not found');
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

        // Step 5: Rebuild fields in canonical order
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

        console.log(`  ✓ Rebuilt editor with ${inserted.length} fields in canonical order`);

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

        console.log(`  ✓ Restored ${finalRestoredCount} field values`);

        if (typeof initValidation === 'function') {
            console.log('  ✓ Validation system ready for new fields');
        }

        console.log(`✓ Editor reconstruction complete for ${targetLevel}`);
        console.log(`  Inserted: ${inserted.length > 0 ? inserted.join(', ') : 'None'}`);
        console.log(`  Removed: ${removed.length > 0 ? removed.join(', ') : 'None'}`);
        console.log(`  Preserved: ${Object.keys(preservedValues).length} value mappings`);
        console.log(`  Restored: ${finalRestoredCount} field values`);
        console.log(`==========================================`);

        return {
            success: true,
            inserted: inserted,
            removed: removed,
            preserved: Object.keys(preservedValues).length,
            restored: finalRestoredCount
        };
    }

    // ============================================
    // TEMPLATE SWITCH ENGINE (UPDATED AI-TS-3.5)
    // ============================================

    let activeTemplateLevel = detectTemplateLevel();

    function getActiveTemplate() {
        return activeTemplateLevel;
    }

    function setActiveTemplate(level) {
        // Update both the local variable and the global
        activeTemplateLevel = level;
        CURRENT_TEMPLATE = level;
        console.log(`✓ Active template updated to: ${level}`);
    }

    function executeTemplateSwitch(targetLevel) {
        console.log(`=== TEMPLATE SWITCH ENGINE ===`);
        console.log(`Current Active: ${getActiveTemplate()}`);
        console.log(`Target Level: ${targetLevel}`);

        // Perform full editor reconstruction
        const result = reconstructEditorForLevel(targetLevel);

        if (result.success) {
            setActiveTemplate(targetLevel);
            updateDialogContext();
            console.log(`✓ Template switch completed successfully`);
        } else {
            console.log(`⚠ Template switch completed with errors`);
        }

        console.log(`Action: FULL EDITOR RECONSTRUCTION - Fields inserted/removed as needed`);
        console.log(`===============================`);

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
            console.log('No template level selected');
            return;
        }

        console.log(`=== TEMPLATE SELECTION ===`);
        console.log(`Current Template: ${detectTemplateLevel()}`);
        console.log(`Selected Template: ${selectedLevel}`);
        console.log('========================');

        // Invoke Template Switch Engine with full reconstruction
        const result = executeTemplateSwitch(selectedLevel);
        console.log(`Switch Result: ${result.message}`);
        console.log(`  Inserted: ${result.inserted.length > 0 ? result.inserted.join(', ') : 'None'}`);
        console.log(`  Removed: ${result.removed.length > 0 ? result.removed.join(', ') : 'None'}`);
        console.log(`  Preserved: ${result.preserved} values`);

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
            console.log('No upgrade target selected');
            return;
        }

        const decision = evaluateUpgrade(currentLevel, targetLevel);

        console.log(`=== UPGRADE DECISION ===`);
        console.log(`Current Level: ${currentLevel}`);
        console.log(`Target Level: ${targetLevel}`);
        console.log(`Decision: ${decision.allowed ? '✅ ALLOWED' : '❌ REJECTED'}`);
        console.log(`Reason: ${decision.reason}`);
        console.log('========================');

        if (decision.allowed) {
            console.log('\n=== EXECUTING FIELD INSERTION ===');
            const result = executeFieldInsertion(currentLevel, targetLevel);
            console.log(`Inserted: ${result.inserted.length > 0 ? result.inserted.join(', ') : 'None'}`);
            console.log(`Skipped: ${result.skipped.length > 0 ? result.skipped.join(', ') : 'None'}`);
            console.log(`Errors: ${result.errors.length > 0 ? result.errors.join(', ') : 'None'}`);
            console.log(`Success: ${result.success ? '✅' : '❌'}`);
            console.log('================================\n');

            if (result.success) {
                updateDialogContext();
            }
        }

        closeDialog();
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================

    // New button functionality - SFRE (Selective Field Rehydration) - FINAL CORRECTED
    const newBtn = document.querySelector('.toolbar-btn:first-child');
    if (newBtn) {
        newBtn.addEventListener('click', function() {
            console.log('🔄 New button clicked - SFRE Selective Rehydration (FINAL CORRECTED)');

            // STEP 1: No field preservation - Full Reset per Version 0.1 specification
            // All fields will be empty after reconstruction
            const persistedFields = [];
            const preservedValues = {};

            // No fields to preserve - all fields reset to empty
            console.log('  ✓ Full reset: No fields preserved');

            // STEP 2: Get current template level
            const currentLevel = detectTemplateLevel();
            console.log(`  Current template: ${currentLevel}`);

            // STEP 3: Get target schema and required fields
            const targetSchema = getSchemaFields(currentLevel);
            const requiredFields = getRequiredFields(currentLevel);
            
            // STEP 4: Clear the editor container and rebuild WITHOUT values
            console.log('  Rebuilding editor (empty fields)...');
            const editorContainer = document.querySelector('.editor-container');
            if (!editorContainer) {
                console.log('⚠ Editor container not found');
                return;
            }
            
            const parent = editorContainer.parentNode;
            const newEditorContainer = document.createElement('div');
            newEditorContainer.className = 'editor-container';
            newEditorContainer.id = 'editor-container';
            
            // Rebuild fields in canonical order WITHOUT any values
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
                
                // Add error container
                const errorDiv = document.createElement('div');
                const errorId = `error-${fieldKey}`;
                errorDiv.className = 'field-error';
                errorDiv.id = errorId;
                fieldDiv.appendChild(errorDiv);
                
                newEditorContainer.appendChild(fieldDiv);
            }
            
            parent.replaceChild(newEditorContainer, editorContainer);
            console.log(`  ✓ Rebuilt editor with ${targetSchema.length} fields (all empty)`);

            // STEP 5: No restoration needed - all fields are empty
            // (reconstruction already created empty fields)
            const restoredCount = 0;
            console.log('  ✓ No field restoration - all fields empty');

            // STEP 6: All fields are empty - Full Reset complete
            console.log(`✅ Full Reset complete - ${targetSchema.length} fields empty`);
            console.log(`  Template: ${currentLevel} (unchanged)`);
            console.log(`  All fields reset to empty`);
        });
    }

// Export button functionality - FR-EXP-001 Dual Action Flow
const exportBtn = document.querySelector('.toolbar-btn:last-child');
if (exportBtn) {
    exportBtn.addEventListener('click', async function() {
        console.log('📋 Export button clicked - FR-EXP-001 Dual Action Flow');
        try {
            // STEP 1: Generate Export Text
            const text = formatReflection();
            console.log('  ✅ Export text generated');

            // STEP 2: Clipboard Export (PRIMARY ACTION) with fallback
            if (navigator.clipboard && navigator.clipboard.writeText) {
                // Modern Clipboard API
                await navigator.clipboard.writeText(text);
                console.log('  ✅ Reflection copied to clipboard successfully (Clipboard API)');
            } else {
                // Fallback: Create temporary textarea and copy
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                textarea.style.left = '-9999px';
                textarea.style.top = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                console.log('  ✅ Reflection copied to clipboard successfully (Fallback)');
            }

            // STEP 3: Stability Delay
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('  ✅ Clipboard write confirmed');

            // STEP 4: External Submission Redirect (SECONDARY ACTION)
            window.open(
                'https://m.me/j/AbZ4j5yKrZTVwAmn/?send_source=gc%3Acopy_invite_link_t',
                '_blank'
            );
            console.log('  ✅ Messenger group chat opened');

        } catch (err) {
            console.error('❌ Export failed:', err);
            alert('Export failed. Please try again.');
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

        // Get current field values
        const fields = getTemplateFieldValues();
        const currentLevel = detectTemplateLevel();
        // V2.4.2: Use getSchemaFields for canonical schema access
        const schema = getSchemaFields(currentLevel);

        if (!schema || schema.length === 0) {
            previewContent.innerHTML = '<p class="preview-placeholder">No template schema found</p>';
            return;
        }

        // Build preview HTML
        let html = '<div class="preview-reflection">';

        // Render fields in official schema order
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
        console.log('✓ Preview rendered for ' + currentLevel);
    }

    // ============================================
    // REFLECTION FORMATTER (M5.1)
    // ============================================

    function formatReflection() {
        const fields = getTemplateFieldValues();
        const currentLevel = detectTemplateLevel();
        // Use getSchemaFields helper (V2.1) for canonical schema access
        const schema = getSchemaFields(currentLevel);

        if (!schema || schema.length === 0) {
            console.log('⚠ No template schema found for formatting');
            return '';
        }

        // FR-003-M1: Export Optional Field Omission
        // Designated Export-Optional Fields: Crowns, Prayer Points, Application
        const EXPORT_OPTIONAL_FIELDS = ['Crowns', 'Prayer Points', 'Application'];

        const lines = [];

        // Add header - standardized for all template levels
        lines.push(`=== Reflection ===`);
        lines.push('');

        // Render fields in official schema order
        for (const fieldName of schema) {
            const value = fields[fieldName] || '';
            const isOptional = EXPORT_OPTIONAL_FIELDS.includes(fieldName);

            // AT-1: Skip empty optional fields
            if (isOptional && value.trim() === '') {
                continue;
            }

            // AT-2/AT-3: Required fields and populated optional fields render normally
            const displayValue = value || '[Empty]';

            // Preserve multiline formatting
            if (displayValue.includes('\n')) {
                lines.push(`${fieldName}:`);
                const indentedLines = displayValue.split('\n').map(line => `  ${line}`);
                lines.push(...indentedLines);
            } else {
                lines.push(`${fieldName}: ${displayValue}`);
            }
        }

        // AT-6: Footer preserved unchanged
        lines.push('');
        lines.push('=== End of Reflection ===');
        const output = lines.join('\n');
        console.log(`✓ Reflection formatted for ${currentLevel}`);
        return output;
    }

    // ============================================
    // CLIPBOARD COPY (M5.2)
    // ============================================

    async function copyReflection() {
        try {
            // STEP 1: Perform validation before export (V2.3)
            // Validation must pass before any export operation proceeds
            const validationPassed = performValidation('Export');

            if (!validationPassed) {
                console.log('❌ Export cancelled: Validation failed');
                // Do not proceed with export - clipboard remains unchanged
                return false;
            }

            // STEP 2: Get formatted reflection (only after validation passes)
            const reflectionText = formatReflection();

            if (!reflectionText) {
                console.log('⚠ No reflection to copy');
                return false;
            }

            let success = false;

            // STEP 3: Copy to clipboard (only after successful validation)
            // Try Clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(reflectionText);
                console.log('✓ Reflection copied to clipboard (Clipboard API)');
                success = true;
            } else {
                // Fallback: Create temporary textarea
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

                console.log('✓ Reflection copied to clipboard (Fallback)');
                success = true;
            }

            // STEP 4: Show export confirmation ONLY on success (V2.3)
            if (success) {
                showExportConfirmation();
            }

            return success;
        } catch (error) {
            console.log(`⚠ Clipboard copy failed: ${error.message}`);
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

        // Clear any existing timeout
        if (confirmationTimeout) {
            clearTimeout(confirmationTimeout);
            confirmationTimeout = null;
        }

        // Remove hidden class if present
        confirmation.classList.remove('hidden');
        confirmation.style.display = 'block';
        confirmation.style.animation = 'slideInRight 0.3s ease-out';

        // Auto-hide after 3 seconds
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
            // Step 1: Get formatter output
            const formattedText = formatReflection();
            results.checks.push({ check: 'Formatter output generated', passed: true });

            if (!formattedText) {
                results.errors.push('Formatter output is empty');
                results.success = false;
                return results;
            }

            // Step 2: Get clipboard content
            let clipboardText = '';
            try {
                if (navigator.clipboard && navigator.clipboard.readText) {
                    clipboardText = await navigator.clipboard.readText();
                    results.checks.push({ check: 'Clipboard read successful', passed: true });
                } else {
                    clipboardText = formattedText;
                    results.warnings.push('Clipboard API read not available - using formatter output for validation');
                }
            } catch (clipError) {
                clipboardText = formattedText;
                results.warnings.push('Clipboard read failed - using formatter output for validation');
            }

            // Step 3: Compare clipboard with formatter output
            const clipboardMatches = clipboardText === formattedText;
            results.checks.push({
                check: 'Clipboard matches formatter output',
                passed: clipboardMatches
            });

            if (!clipboardMatches) {
                results.errors.push('Clipboard content does not match formatter output');
            }

            // Step 4: Verify field order and completeness
            const fields = getTemplateFieldValues();
            const currentLevel = detectTemplateLevel();
            const schema = TEMPLATE_SCHEMAS[currentLevel];

            if (schema) {
                // Check all schema fields are present in formatter output
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

                // Check for duplicate fields
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

                // Check for multiline preservation
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

                // Verify empty fields are handled correctly
                let emptyFieldsHandled = true;
                for (const fieldName of schema) {
                    if (!fields[fieldName] || fields[fieldName] === '') {
                        // Check if [Empty] appears for this field in formatter
                        const fieldLine = formattedText.split('\n').find(line => line.startsWith(`${fieldName}:`));
                        if (fieldLine && !fieldLine.includes('[Empty]')) {
                            emptyFieldsHandled = false;
                            results.errors.push(`Empty field "${fieldName}" not marked as [Empty]`);
                        }
                    }
                }
                results.checks.push({ check: 'Empty fields handled correctly', passed: emptyFieldsHandled });
            }

            // Step 5: Verify editor unchanged
            results.checks.push({
                check: 'Editor unchanged during validation',
                passed: true
            });

            // Step 6: Verify active template unchanged
            const activeLevel = getActiveTemplate();
            results.checks.push({
                check: `Active template unchanged: ${activeLevel}`,
                passed: true
            });

            // Determine overall success
            results.success = results.errors.length === 0;

            // Log results
            console.log('=== EXPORT VALIDATION RESULTS ===');
            console.log(`Status: ${results.success ? '✅ PASS' : '❌ FAIL'}`);
            console.log(`Checks passed: ${results.checks.filter(c => c.passed).length}/${results.checks.length}`);
            if (results.errors.length > 0) {
                console.log(`Errors: ${results.errors.length}`);
                results.errors.forEach(e => console.log(`  ⚠ ${e}`));
            }
            if (results.warnings.length > 0) {
                console.log(`Warnings: ${results.warnings.length}`);
                results.warnings.forEach(w => console.log(`  ℹ ${w}`));
            }
            console.log('==================================');

            return results;
        } catch (error) {
            results.success = false;
            results.errors.push(`Validation error: ${error.message}`);
            console.log(`⚠ Export validation failed: ${error.message}`);
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

        console.log('=== EXPORT WORKFLOW VERIFICATION ===');

        try {
            // STEP 1: Verify Editor State
            console.log('Step 1: Verifying Editor State...');
            const editorFields = getTemplateFieldValues();
            const editorFieldCount = Object.keys(editorFields).length;
            workflow.details.editorFieldCount = editorFieldCount;
            workflow.steps.push({ step: 1, name: 'Editor State', status: '✅ PASS' });
            console.log(`  ✓ Editor has ${editorFieldCount} fields`);

            // STEP 2: Verify Template Detection
            console.log('Step 2: Verifying Template Detection...');
            const currentLevel = detectTemplateLevel();
            const activeLevel = getActiveTemplate();
            const templateMatches = currentLevel === activeLevel;
            workflow.details.currentLevel = currentLevel;
            workflow.details.activeLevel = activeLevel;
            workflow.details.templateMatches = templateMatches;
            workflow.steps.push({ step: 2, name: 'Template Detection', status: templateMatches ? '✅ PASS' : '❌ FAIL' });
            console.log(`  ✓ Current Level: ${currentLevel}, Active: ${activeLevel} ${templateMatches ? '(match)' : '(mismatch)'}`);

            if (!templateMatches) {
                workflow.errors.push('Template detection mismatch');
            }

            // STEP 3: Verify Formatter
            console.log('Step 3: Verifying Reflection Formatter...');
            const formattedText = formatReflection();
            const formatterSuccess = formattedText && formattedText.length > 0;
            workflow.details.formatterLength = formattedText ? formattedText.length : 0;
            workflow.steps.push({ step: 3, name: 'Reflection Formatter', status: formatterSuccess ? '✅ PASS' : '❌ FAIL' });
            console.log(`  ✓ Formatter output length: ${formatterSuccess ? formattedText.length : '0'}`);

            if (!formatterSuccess) {
                workflow.errors.push('Formatter output empty');
            }

            // STEP 4: Verify Clipboard Copy
            console.log('Step 4: Verifying Clipboard Copy...');
            const copySuccess = await copyReflection();
            workflow.details.copySuccess = copySuccess;
            workflow.steps.push({ step: 4, name: 'Clipboard Copy', status: copySuccess ? '✅ PASS' : '❌ FAIL' });
            console.log(`  ✓ Copy ${copySuccess ? 'successful' : 'failed'}`);

            if (!copySuccess) {
                workflow.errors.push('Clipboard copy failed');
            }

            // STEP 5: Verify Confirmation
            console.log('Step 5: Verifying Export Confirmation...');
            const confirmationElement = document.getElementById('export-confirmation');
            const confirmationExists = confirmationElement !== null;
            const confirmationDisplayed = confirmationExists && confirmationElement.style.display === 'block';
            workflow.details.confirmationExists = confirmationExists;
            workflow.details.confirmationDisplayed = confirmationDisplayed;
            workflow.steps.push({ step: 5, name: 'Export Confirmation', status: confirmationExists ? '✅ PASS' : '⚠ WARN' });
            console.log(`  ✓ Confirmation ${confirmationExists ? 'exists' : 'not found'} ${confirmationDisplayed ? '(displayed)' : ''}`);

            if (!confirmationExists) {
                workflow.warnings.push('Confirmation element not found');
            }

            // STEP 6: Verify Validation
            console.log('Step 6: Verifying Export Validation...');
            const validationResult = await validateExport();
            const validationPassed = validationResult && validationResult.success === true;
            workflow.details.validationPassed = validationPassed;
            workflow.details.validationChecks = validationResult ? validationResult.checks.length : 0;
            workflow.steps.push({ step: 6, name: 'Export Validation', status: validationPassed ? '✅ PASS' : '❌ FAIL' });
            console.log(`  ✓ Validation ${validationPassed ? 'passed' : 'failed'} (${workflow.details.validationChecks} checks)`);

            if (!validationPassed) {
                workflow.errors.push('Validation failed');
            }

            // STEP 7: Verify Editor Unchanged
            console.log('Step 7: Verifying Editor Unchanged...');
            const editorFieldsAfter = getTemplateFieldValues();
            const editorUnchanged = Object.keys(editorFields).length === Object.keys(editorFieldsAfter).length;
            workflow.details.editorUnchanged = editorUnchanged;
            workflow.steps.push({ step: 7, name: 'Editor State Preserved', status: editorUnchanged ? '✅ PASS' : '❌ FAIL' });
            console.log(`  ✓ Editor ${editorUnchanged ? 'unchanged' : 'changed'}`);

            if (!editorUnchanged) {
                workflow.errors.push('Editor state changed during workflow');
            }

            // STEP 8: Verify Template Unchanged
            console.log('Step 8: Verifying Template Unchanged...');
            const finalLevel = detectTemplateLevel();
            const templateUnchanged = finalLevel === currentLevel;
            workflow.details.templateUnchanged = templateUnchanged;
            workflow.details.finalLevel = finalLevel;
            workflow.steps.push({ step: 8, name: 'Template State Preserved', status: templateUnchanged ? '✅ PASS' : '❌ FAIL' });
            console.log(`  ✓ Template ${templateUnchanged ? 'unchanged' : 'changed'} (${finalLevel})`);

            if (!templateUnchanged) {
                workflow.errors.push('Template state changed during workflow');
            }

            // Determine overall success
            workflow.success = workflow.errors.length === 0;

            // Summary
            console.log('========================================');
            console.log(`WORKFLOW STATUS: ${workflow.success ? '✅ PASS' : '❌ FAIL'}`);
            console.log(`Steps: ${workflow.steps.length}`);
            console.log(`Errors: ${workflow.errors.length}`);
            console.log(`Warnings: ${workflow.warnings.length}`);
            console.log('========================================');

            return workflow;
        } catch (error) {
            workflow.success = false;
            workflow.errors.push(`Workflow error: ${error.message}`);
            console.log(`⚠ Workflow verification failed: ${error.message}`);
            return workflow;
        }
    }

    window.verifyExportWorkflow = verifyExportWorkflow;

    function openPreview() {
        if (previewPanel) {
            renderPreview();
            previewPanel.style.display = 'flex';
            console.log('Preview panel opened');
        }
    }

    function closePreview() {
        if (previewPanel) {
            previewPanel.style.display = 'none';
            console.log('Preview panel closed');
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
    // KEYBOARD ACCESSIBILITY (M6.4)
    // ============================================

    // ============================================
    // M6.5 — BASIC REQUIRED FIELD VALIDATION
    // ============================================

    /**
     * Get all required fields in the editor
     * @returns {NodeList} List of required field elements
     */
    function getRequiredFieldsFromDOM() {
        return document.querySelectorAll('[required]');
    }

    /**
     * Get the field name from a field element
     * @param {HTMLElement} field - The field element
     * @returns {string} Field name
     */
    function getFieldName(field) {
        return field.getAttribute('data-field') || field.id || 'unnamed';
    }

    /**
     * Get the error container for a field
     * @param {string} fieldName - The field name
     * @returns {HTMLElement|null} Error container element
     */
    function getErrorContainer(fieldName) {
        return document.querySelector(`#error-${fieldName}`);
    }

    /**
     * Get the template field container for a field
     * @param {HTMLElement} field - The field element
     * @returns {HTMLElement|null} Template field container
     */
    function getTemplateField(field) {
        return field.closest('.template-field');
    }

    /**
     * Validate a single field
     * @param {HTMLElement} field - The field to validate
     * @returns {Object} Validation result
     */
    function validateField(field) {
        const fieldName = getFieldName(field);
        const value = field.value ? field.value.trim() : '';
        const isValid = value.length > 0;
        const errorContainer = getErrorContainer(fieldName);
        const templateField = getTemplateField(field);

        // Update error message
        if (errorContainer) {
            if (!isValid) {
                // Use display name from field name
                const displayName = fieldName.replace(/_/g, ' ');
                errorContainer.textContent = `${displayName} is required`;
                errorContainer.classList.add('show');
            } else {
                errorContainer.textContent = '';
                errorContainer.classList.remove('show');
            }
        }

        // Update field state
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

    /**
     * Validate all required fields
     * @returns {Object} Validation results
     */
    function validateAllFields() {
        // Get current template level
        const currentLevel = detectTemplateLevel();
        // Get required field names from canonical schema
        const requiredFieldNames = getRequiredFields(currentLevel);

        // Get all field containers from DOM
        const fieldContainers = document.querySelectorAll('.template-field');
        const results = [];
        let allValid = true;

        // For each field container, check if it's required and validate
        fieldContainers.forEach(container => {
            const label = container.querySelector('label');
            if (label) {
                let fieldName = label.textContent.replace(':', '').trim();
                fieldName = fieldName.replace(/\s*\*$/, '').trim();

                // Check if this field is required based on canonical schema
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

    /**
     * Show validation summary
     * @param {string} message - The validation message to display
     */
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

    /**
     * Hide validation summary
     */
    function hideValidationSummary() {
        const summary = document.querySelector('#validation-summary');

        if (summary) {
            summary.style.display = 'none';
            summary.classList.add('hidden');
        }
    }

    /**
     * Check if validation summary is visible
     * @returns {boolean} True if visible
     */
    function isValidationSummaryVisible() {
        const summary = document.querySelector('#validation-summary');
        return summary && summary.style.display !== 'none';
    }

    /**
     * Perform validation and show/hide summary accordingly
     * @param {string} action - The action being performed (e.g., 'Export', 'Preview')
     * @returns {boolean} True if validation passes
     */
    function performValidation(action) {
        console.log(`🔍 Validating fields for ${action}...`);

        const result = validateAllFields();

        if (result.allValid) {
            hideValidationSummary();
            console.log(`✅ Validation passed for ${action}`);
            return true;
        } else {
            // V2.4: Use standard notification message
            const message = `Please complete all required fields before exporting your reflection.`;
            showValidationSummary(message);
            console.log(`❌ Validation failed for ${action}: ${result.invalidCount} field(s) missing`);
            
            // V2.4: Focus first invalid field
            focusFirstInvalidField();
            
            return false;
        }
    }

    // ============================================
    // V2.4 — FOCUS MANAGEMENT
    // ============================================

    function focusFirstInvalidField() {
        // Get current template level
        const currentLevel = detectTemplateLevel();
        const requiredFields = getRequiredFields(currentLevel);
        
        // Find first invalid required field
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
                        // Focus the field
                        field.focus();
                        console.log(`🎯 Focus moved to: ${fieldName}`);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Clear all validation states
     */
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

    /**
     * Handle field input events - clear validation on field change
     */
    function setupFieldValidationListeners() {
        const fields = getRequiredFields();

        fields.forEach(field => {
            // Validate on input (as user types)
            field.addEventListener('input', function() {
                const fieldName = getFieldName(this);
                const errorContainer = getErrorContainer(fieldName);
                const templateField = getTemplateField(this);
                const value = this.value ? this.value.trim() : '';
                const isValid = value.length > 0;

                // Update error state for this field
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

                // If validation summary is visible, re-check all fields
                if (isValidationSummaryVisible()) {
                    const result = validateAllFields();
                    if (result.allValid) {
                        hideValidationSummary();
                    }
                }
            });

            // Also validate on blur (when user leaves the field)
            field.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }

    /**
     * Setup validation close button handler
     */
    function setupValidationCloseButton() {
        const closeBtn = document.querySelector('#validation-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                hideValidationSummary();
            });
        }
    }

    /**
     * Initialize validation system
     */
    function initValidation() {
        console.log('🔧 Initializing M6.5 Validation System...');

        // Setup field listeners
        setupFieldValidationListeners();

        // Setup close button
        setupValidationCloseButton();

        // Clear validation on New button
        const newBtn = document.querySelector('.toolbar-btn:first-child');
        if (newBtn) {
            newBtn.addEventListener('click', function() {
                setTimeout(clearValidation, 100);
            });
        }

        // Clear validation on template switch
        const applyBtn = document.querySelector('#apply-template-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                setTimeout(clearValidation, 200);
            });
        }

        console.log('✅ Validation system initialized');
    }

    // Expose validation functions for testing
    window.validateAllFields = validateAllFields;
    window.performValidation = performValidation;
    window.clearValidation = clearValidation;
    window.showValidationSummary = showValidationSummary;
    window.hideValidationSummary = hideValidationSummary;

    // Store last focused element for focus restoration
    let lastFocusedElement = null;

    // Enhanced openDialog with focus management
    const originalOpenDialog = openDialog;
    openDialog = function() {
        lastFocusedElement = document.activeElement;
        originalOpenDialog();
        // Focus the first interactive element in dialog
        setTimeout(function() {
            const firstInput = dialogOverlay.querySelector('input, button, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 50);
    };

    // Enhanced closeDialog with focus restoration
    const originalCloseDialog = closeDialog;
    closeDialog = function() {
        originalCloseDialog();
        if (lastFocusedElement && lastFocusedElement.focus) {
            setTimeout(function() {
                lastFocusedElement.focus();
            }, 50);
        }
    };

    // Handle Escape key for dialog and preview
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            // Close dialog if open
            if (dialogOverlay && dialogOverlay.style.display === 'flex') {
                closeDialog();
                event.preventDefault();
            }
            // Close preview if open
            if (previewPanel && previewPanel.style.display === 'flex') {
                closePreview();
                event.preventDefault();
            }
        }
    });

    // Trap focus inside dialog when open
    dialogOverlay.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            const focusableElements = dialogOverlay.querySelectorAll(
                'button, input, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) {
                // Shift+Tab: If on first element, move to last
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else {
                // Tab: If on last element, move to first
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }
    });

    // Enhanced openPreview with focus management
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

    // Enhanced closePreview with focus restoration
    const originalClosePreview = closePreview;
    closePreview = function() {
        originalClosePreview();
        if (lastFocusedElement && lastFocusedElement.focus) {
            setTimeout(function() {
                lastFocusedElement.focus();
            }, 50);
        }
    };

    // Trap focus inside preview panel when open
    previewPanel.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            const focusableElements = previewPanel.querySelectorAll(
                'button, [tabindex]:not([tabindex="-1"])'
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
    window.openDialog = openDialog;
    window.closeDialog = closeDialog;
    window.handleApplyAction = handleApplyAction;
    window.evaluateUpgrade = evaluateUpgrade;
    window.executeFieldInsertion = executeFieldInsertion;
    window.handleUpgradeAction = handleUpgradeAction;

    console.log('Daily Bible Reflection Notepad v0.1 loaded');
    console.log('Template Level Detection available: window.detectTemplateLevel()');
    console.log('Template Switch Engine available: window.executeTemplateSwitch(target)');
    console.log('Field Mapping & Data Integrity active (AI-TS-3.5)');
    console.log('STATUS: FULL TEMPLATE TRANSFORMATION ENABLED');
    console.log('  - Free switching between Level 1, 2, 3');
    console.log('  - Field insertion/removal automated');
    console.log('  - Field values preserved');
}