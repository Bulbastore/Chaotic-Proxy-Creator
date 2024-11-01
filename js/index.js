// Import the functions from the modules
import { createCard, setDownload } from './createCard.js';

// Export the submit function to be used by the HTML
export async function submit() {
    try {
        await createCard();
    } catch (error) {
        console.error("Error creating card:", error);
    }
}

// Export the download function to be used by the HTML
export function download(el) {
    try {
        setDownload(el);
    } catch (error) {
        console.error("Error downloading card:", error);
    }
}

// Make the functions available to the window object (for HTML onclick handlers)
window.submit = submit;
window.download = download;