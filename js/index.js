import { createCard, setDownload, updateCommonConfig } from "./createCard.js";

/* Event Listeners */
// Disables the download button while image is not built
const downloadbtn = document.getElementById("download");
downloadbtn.addEventListener("click", function(event) {
    if (downloadbtn.classList.contains("isDisabled")) {
        event.preventDefault();
    }
});

const updatebtn = document.getElementById("update");

// Toggles between showing type specific inputs
// Clears values not shared between types
const changeType = document.getElementById("type");
changeType.addEventListener("change", function() {
    document.getElementById("type-form").reset();
    downloadbtn.classList.add("isDisabled");
    
    const prevType = document.getElementsByClassName("form-show");

    Array.from(prevType).forEach(el => {
        el.classList.remove("form-show");
    });

    updateCommonConfig("type", this.value);
    
    // Call updateFields to show relevant fields based on selected type
    updateFields();

    updatebtn.classList.remove("isDisabled");
});

// Adds the uploaded art to the config
const uploadArt = document.getElementById("art");
uploadArt.addEventListener("change", function() {
    if (this.files.length > 0) {
        const reader = new FileReader();
        reader.onload = () => {
            updateCommonConfig("art", reader.result);
        };
        reader.readAsDataURL(this.files[0]);
    }
}, false);

/* Exposed functions */
export function submit() {
    if (!updatebtn.classList.contains("isDisabled")) {
        createCard().then(() => {
            downloadbtn.classList.remove("isDisabled");
        });
    }
}

export function download (el) {
    if (!downloadbtn.classList.contains("isDisabled")) {
        setDownload(el);
    }
}

// Function to update displayed fields based on selected card type
function updateFields() {
    const type = document.getElementById('type').value;
    const allFields = document.querySelectorAll('.input-field');
    allFields.forEach(field => field.style.display = 'none'); // Hide all fields by default

    const typeFields = {
        attack: ['art-field', 'name-field', 'set-field', 'rarity-field', 'subtype-field', 'unique-field', 'ability-field', 'artist-field', 'base-field', 'bp-field', 'elements', 'energy', 'courage', 'power', 'wisdom', 'speed', 'mc'],
        battlegear: ['art-field', 'name-field', 'set-field', 'rarity-field', 'subtype-field', 'unique-field', 'legendary-field', 'ability-field', 'artist-field'],
        creature: ['art-field', 'name-field', 'subname-field', 'set-field', 'rarity-field', 'subtype-field', 'unique-field', 'legendary-field', 'loyal-field', 'ability-field', 'flavor-field', 'artist-field', 'tribe-field', 'elements', 'energy', 'courage', 'power', 'wisdom', 'speed', 'mc'],
        location: ['name-field', 'subname-field', 'set-field', 'rarity-field', 'subtype-field', 'unique-field', 'ability-field', 'flavor-field', 'artist-field', 'initiative-field'],
        mugic: ['name-field', 'subname-field', 'set-field', 'rarity-field', 'subtype-field', 'unique-field', 'ability-field', 'flavor-field', 'artist-field', 'tribe-field', 'mc'],
    };

    if (typeFields[type]) {
        typeFields[type].forEach(id => document.getElementById(id).style.display = 'flex');
    }
}