/**
 * ***************************************************************************************************************************
 *                                        Mister Potato Canvas Game & Gestió dels Clics a les Categories
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
let zIndexCounter = 1;

for (let part in parts) {
    parts[part].zIndex = zIndexCounter++;
}

function sortByZIndex(partA, partB) {
    return parts[partA].zIndex - parts[partB].zIndex;
}
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sortedParts = Object.keys(parts).sort(sortByZIndex);
    for (let part of sortedParts) {
        if (parts[part].image.src) {
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
// Creació del botó d'eliminar
let deleteMode = false;
const deleteButton = document.getElementById('deleteElement');

// Quan s'activa el mode d'eliminació, canvia l'estil del botó per indicar que està actiu
deleteButton.addEventListener('click', () => {
    deleteMode = !deleteMode;  // Canviam el mode cada vegada que es fa clic en el botó
    deleteButton.style.backgroundColor = deleteMode ? 'red' : '';
});
// Funcionalitat de moviment i guardat d'imatges
canvas.addEventListener('mousedown', (e) => {
    if (deleteMode) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        for (let part in parts) {
            if (x > parts[part].x && x < parts[part].x + parts[part].image.width &&
                y > parts[part].y && y < parts[part].y + parts[part].image.height) {
                parts[part].image.src = "";  // Esborrem la imatge
                drawCanvas();  // Actualitzem el canvas
                break;  // Sortim del bucle una vegada eliminada la part
            }
        }

        deleteMode = false;  // Desactivem el mode d'eliminació
        // Opcional: torna el botó al seu estil original
        deleteButton.style.backgroundColor = '';
        return;  // Evitem la lògica normal de clic al canvas
    }
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    for (let part in parts) {
        if (x > parts[part].x && x < parts[part].x + parts[part].image.width &&
            y > parts[part].y && y < parts[part].y + parts[part].image.height) {
            currentPart = part;

            // Augmenta el zIndex quan es fa clic en una part
            parts[part].zIndex = zIndexCounter++;
            
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
