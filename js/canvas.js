/**
 * ***************************************************************************************************************************
 *                                        Mister Potato Canvas Game
 * ***************************************************************************************************************************
 */

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let currentPart = null;
let parts = {
    ulls: { image: new Image(), x: 250, y: 150, offsetX: 0, offsetY: 0 },
    nas: { image: new Image(), x: 250, y: 250, offsetX: 0, offsetY: 0 },
    boca: { image: new Image(), x: 250, y: 350, offsetX: 0, offsetY: 0 }
};

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let part in parts) {
        if (parts[part].image.src) { // Comprova que l'imatge té una ruta de font abans de dibuixar-la
            ctx.drawImage(parts[part].image, parts[part].x, parts[part].y);
        }
    }
}

// Gestiona el clic a les miniatures per carregar-les al canvas
document.querySelectorAll('.thumbnails img').forEach(img => {
    img.addEventListener('click', (e) => {
        const category = e.target.closest('.thumbnail-group').getAttribute('data-category');
        parts[category].image.src = e.target.getAttribute('data-src');
        parts[category].image.onload = () => drawCanvas();
    });
});

// Gestiona el clic a les categories per mostrar o amagar les miniatures
document.querySelectorAll('.categories li').forEach(category => {
    category.addEventListener('click', (e) => {
        const selectedCategory = e.target.getAttribute('data-category');

        // Amaga tots els grups de miniatures
        document.querySelectorAll('.thumbnail-group').forEach(group => group.style.display = 'none');

        // Mostra el grup de miniatures corresponent a la categoria seleccionada
        const thumbnailGroup = document.querySelector(`.thumbnail-group[data-category="${selectedCategory}"]`);
        thumbnailGroup.style.display = 'block';
    });
});

// Funcionalitat de moviment i guardat d'imatges
canvas.addEventListener('mousedown', (e) => {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    for (let part in parts) {
        if (x > parts[part].x && x < parts[part].x + parts[part].image.width &&
            y > parts[part].y && y < parts[part].y + parts[part].image.height) {
            currentPart = part;
            parts[part].offsetX = x - parts[part].x;
            parts[part].offsetY = y - parts[part].y;
            drawCanvas();
            break;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (currentPart) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        parts[currentPart].x = x - parts[currentPart].offsetX;
        parts[currentPart].y = y - parts[currentPart].offsetY;

        drawCanvas();
    }
});

canvas.addEventListener('mouseup', () => {
    currentPart = null;
});

document.getElementById('saveImage').addEventListener('click', () => {
    let link = document.createElement('a');
    link.download = 'mister_potato.png';
    link.href = canvas.toDataURL();
    link.click();
});

drawCanvas();
