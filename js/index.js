import { createCard, setDownload } from './createCard.js';
import { initializeForm } from './formHandler.js';

// Initialize everything after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize form
    initializeForm();

    // Initialize canvas
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    // Initialize canvas with cardback
    const cardback = new Image();
    cardback.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.drawImage(cardback, 0, 0, canvas.width, canvas.height);
    };
    cardback.src = "img/cardback.png";
});

// Card creation function
export async function submit() {
    try {
        const result = await createCard();
        console.log('Card created successfully', result);
    } catch (error) {
        console.error("Error creating card:", error);
    }
}

// Download function
export function download(el) {
    try {
        setDownload(el);
    } catch (error) {
        console.error("Error downloading card:", error);
    }
}

// Make functions available globally
window.submit = submit;
window.download = download;