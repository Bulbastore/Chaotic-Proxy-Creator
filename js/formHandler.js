// Form initialization function
export function initializeForm() {
    // Set up event listeners
    const typeSelect = document.getElementById('type');
    if (typeSelect) {
        typeSelect.addEventListener('change', updateFields);
    }

    // Initialize sliders
    setupSliders();

    // Initial field update
    updateFields();
}

// Field visibility management
function updateFields() {
    const type = document.getElementById('type')?.value;
    const allFields = document.querySelectorAll('.input-field, .number-slider');
    
    // Hide all fields first
    allFields.forEach(field => field.style.display = 'none');

    // Skip if no type selected
    if (!type) return;

    const typeFields = {
        attack: ['art-field', 'name-field', 'set-field', 'rarity-field', 'subtype-field', 
                'unique-field', 'ability-field', 'artist-field', 'elements'],
        battlegear: ['art-field', 'name-field', 'set-field', 'rarity-field', 'subtype-field', 
                    'unique-field', 'legendary-field', 'ability-field', 'artist-field'],
        creature: ['art-field', 'name-field', 'subname-field', 'set-field', 'rarity-field', 
                  'subtype-field', 'unique-field', 'legendary-field', 'loyal-field', 
                  'ability-field', 'flavor-field', 'artist-field', 'tribe-field', 'elements', 
                  'energy-slider', 'courage-slider', 'power-slider', 'wisdom-slider', 
                  'speed-slider', 'mc-slider'],
        location: ['art-field', 'name-field', 'subname-field', 'set-field', 'rarity-field', 
                  'subtype-field', 'ability-field', 'flavor-field', 'artist-field'],
        mugic: ['art-field', 'name-field', 'subname-field', 'set-field', 'rarity-field', 
               'subtype-field', 'unique-field', 'ability-field', 'flavor-field', 
               'artist-field', 'tribe-field', 'mc-slider']
    };

    // Show relevant fields for selected type
    if (typeFields[type]) {
        typeFields[type].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'flex';
            }
        });
    }
}

// Slider initialization
function setupSliders() {
    const sliderConfigs = [
        { id: 'energy', type: 'stats' },
        { id: 'courage', type: 'stats' },
        { id: 'power', type: 'stats' },
        { id: 'wisdom', type: 'stats' },
        { id: 'speed', type: 'stats' },
        { id: 'mc', type: 'small' }
    ];

    sliderConfigs.forEach(config => {
        setupSlider(config.id, config.type);
    });
}

// Individual slider setup
function setupSlider(id, type) {
    const slider = document.getElementById(`${id}-slider`);
    const input = document.getElementById(id);
    const ticksContainer = document.getElementById(`${id}-ticks`);
    
    // Add error checking
    if (!slider) {
        console.error(`Slider not found for ${id}`);
        return;
    }
    if (!input) {
        console.error(`Input not found for ${id}`);
        return;
    }
    if (!ticksContainer) {
        console.error(`Ticks container not found for ${id}`);
        return;
    }
    
    if (!slider || !input || !ticksContainer) return;

    // Configure ticks based on slider type
    const ticks = type === 'stats' ? [0, 55, 110, 165, 220] :
                 type === 'small' ? [0, 1, 2, 3, 4, 5] : 
                 [0, 10, 25, 35, 50];

    // Create tick marks
    ticksContainer.innerHTML = ticks.map(value => `
        <div class="tick" style="left: ${(value / slider.max) * 100}%">
            <div class="tick-mark"></div>
            <div class="tick-label">${value}</div>
        </div>
    `).join('');

    // Helper function for rounding to nearest 5
    const getClosestMultipleOf5 = num => Math.round(num / 5) * 5;

    // Slider event listeners
    slider.addEventListener('input', (e) => {
        const value = type === 'small' ? 
            parseInt(e.target.value) : 
            getClosestMultipleOf5(parseInt(e.target.value));
        input.value = value;
    });

    // Number input event listeners
    input.addEventListener('input', (e) => {
        let value = parseInt(e.target.value) || 0;
        value = Math.max(slider.min, Math.min(slider.max, value));
        slider.value = value;
    });

    input.addEventListener('blur', (e) => {
        let value = parseInt(e.target.value) || 0;
        value = Math.max(slider.min, Math.min(slider.max, value));
        if (type !== 'small') {
            value = getClosestMultipleOf5(value);
        }
        input.value = value;
        slider.value = value;
    });
}