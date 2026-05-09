export function showToast(message, type = "info", duration = 3000) {
    // Create container if it doesn't exist
    let container = document.querySelector(".toast-container");

    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    // Toast content
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    // Show animation
    setTimeout(() => toast.classList.add("show"), 10);

    // Remove function
    const removeToast = () => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    };

    // Auto remove
    const timer = setTimeout(removeToast, duration);

    // Manual close
    toast.querySelector(".toast-close").addEventListener("click", () => {
        clearTimeout(timer);
        removeToast();
    });
}