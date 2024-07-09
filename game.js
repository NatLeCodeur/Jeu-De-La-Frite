let backgroundImg;
let buttonImages = {};
let friteImg;
let buttons = [];
let gameState = "menu";
let currentImage = null;
let frite = { image: null, position: null, scale: 1.0 };
let niveauxDebloques = ["Niveau 1"];
let bravoDisplayed = false;
let bravoTimer = null;
let returnToMenuTimer = null;
let bonusTimer = null;
let bonusMoveTimer = null;
let levelTimer = null;
let lossTimer = null;
let friteTrouvee = false;
let perduTimer;
let video;
let videoDisplayed = false;

function preload() {
    // Charger les images
    backgroundImg = loadImage('Capture décran .png', () => {
        console.log('Background image loaded');
    }, () => {
        console.error('Failed to load background image');
    });

    buttonImages["Niveau 1"] = loadImage('DALL·E 2023-08-15 13.51.15 - interieur restrauranta frite style dessin  colorie.png', () => {
        console.log('Button image Niveau 1 loaded');
    }, () => {
        console.error('Failed to load button image Niveau 1');
    });

    buttonImages["Niveau 2"] = loadImage('DALL·E 2023-08-20 12.26.23 - interieur restrauranta frite style dessin  colorie2.png', () => {
        console.log('Button image Niveau 2 loaded');
    }, () => {
        console.error('Failed to load button image Niveau 2');
    });

    buttonImages["Niveau 3"] = loadImage('DALL·E 2023-08-20 12.36.48 - une restrauranta frite style dessin  colorie.png', () => {
        console.log('Button image Niveau 3 loaded');
    }, () => {
        console.error('Failed to load button image Niveau 3');
    });

    buttonImages["Niveau Bonus"] = loadImage('DALL·E 2023-08-20 13.33.25 - interieur restrauranta frite style dessin  colorie.png', () => {
        console.log('Button image Niveau Bonus loaded');
    }, () => {
        console.error('Failed to load button image Niveau Bonus');
    });

    friteImg = loadImage('frite-removebg-preview.png', () => {
        console.log('Frite image loaded');
    }, () => {
        console.error('Failed to load frite image');
    });
}

function setup() {
    let canvas = createCanvas(1080, 720);
    canvas.parent(document.body);
    frite.image = friteImg;
}

function draw() {
    if (backgroundImg) {
        image(backgroundImg, 0, 0, width, height);
    } else {
        background(0);
        console.error('Background image not loaded');
    }

    if (gameState === "menu") {
        displayMenu();
    } else if (gameState === "jeu") {
        displayGame();
    } else if (gameState === "loss") {
        displayLoss();
    }
}

function displayMenu() {
    buttons = [];
    let yOffset = (height - ((50 + 20) * Object.keys(buttonImages).length - 20)) / 2;
    let xOffset = 70;

    Object.keys(buttonImages).forEach((nomBouton, i) => {
        let rect = { x: 500 - xOffset, y: yOffset + i * (50 + 20), width: 200, height: 50 };
        let scale = 1.0;
        if (nomBouton === "Niveau 1") scale = 0.75;
        else if (nomBouton === "Niveau 2") scale = 0.5;
        else if (nomBouton === "Niveau 3") scale = 0.25;
        if (niveauxDebloques.includes(nomBouton)) {
            buttons.push({ text: nomBouton, rect: rect, image: buttonImages[nomBouton], scale: scale });
        }
    });

    buttons.forEach(button => {
        fill(255, 0, 0);
        rect(button.rect.x, button.rect.y, button.rect.width, button.rect.height);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(24);
        text(button.text, button.rect.x + button.rect.width / 2, button.rect.y + button.rect.height / 2);
    });
}

function displayGame() {
    if (currentImage) {
        image(currentImage, 0, 0, width, height);
    }
    if (frite.position) {
        let scaledWidth = frite.image.width * frite.scale;
        let scaledHeight = frite.image.height * frite.scale;
        image(frite.image, frite.position.x, frite.position.y, scaledWidth, scaledHeight);

        if (bravoDisplayed && bravoTimer && millis() < bravoTimer) {
            fill(0, 255, 0);
            textAlign(CENTER, CENTER);
            textSize(250);
            text("Bravo!", width / 2, height / 2);
            if (returnToMenuTimer === null) {
                returnToMenuTimer = millis() + 2000;
            }
        } else if (bravoDisplayed && returnToMenuTimer !== null && millis() >= returnToMenuTimer) {
            bravoDisplayed = false;
            gameState = "menu";
            currentImage = null;

            if (niveauxDebloques.includes("Niveau 1") && !niveauxDebloques.includes("Niveau 2")) {
                niveauxDebloques.push("Niveau 2");
            } else if (niveauxDebloques.includes("Niveau 2") && !niveauxDebloques.includes("Niveau 3")) {
                niveauxDebloques.push("Niveau 3");
            } else if (niveauxDebloques.includes("Niveau 3") && !niveauxDebloques.includes("Niveau Bonus")) {
                niveauxDebloques.push("Niveau Bonus");
            }
        }

        if (!friteTrouvee && levelTimer !== null && millis() >= levelTimer) {
            gameState = "loss";
            lossTimer = millis() + 3000; // Afficher "Perdu" pendant 3 secondes
        }

        if (levelTimer !== null) {
            let timeLeft = int((levelTimer - millis()) / 1000);
            fill(0);
            textSize(24);
            text(`Temps restant: ${timeLeft}s`, width - 200, 30);
        }
    }
}

function displayLoss() {
    clear(); // Effacer tout le contenu précédent

    // Afficher l'image du niveau actuel
    if (currentImage) {
        image(currentImage, 0, 0, width, height);
    }

    // Afficher "Perdu" en noir sur l'image du niveau actuel
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(250);
    text("Perdu", width / 2, height / 2);

    // Attendre 2 secondes avant de revenir à l'écran d'accueil
    if (!perduTimer) {
        perduTimer = millis() + 2000;
    }

    // Après 2 secondes, revenir à l'écran d'accueil
    if (millis() >= perduTimer) {
        gameState = "menu"; // Revenir à l'accueil après avoir affiché "Perdu"
        currentImage = null; // Réinitialiser l'image du niveau
        frite.position = null; // Réinitialiser la position de la frite
        bravoDisplayed = false; // Réinitialiser l'état de Bravo affiché
        bravoTimer = null; // Réinitialiser le timer de Bravo
        returnToMenuTimer = null; // Réinitialiser le timer de retour à l'accueil
        niveauxDebloques = ["Niveau 1"]; // Réinitialiser les niveaux débloqués
        perduTimer = null; // Réinitialiser le timer de perte
    }
}

function mousePressed() {
    if (gameState === "menu") {
        buttons.forEach(button => {
            if (mouseX >= button.rect.x && mouseX <= button.rect.x + button.rect.width &&
                mouseY >= button.rect.y && mouseY <= button.rect.y + button.rect.height) {
                currentImage = button.image;
                gameState = "jeu";
                frite.scale = button.scale;
                if (button.text === "Niveau Bonus") {
                    frite.scale = 0.2;
                }
                frite.position = { x: random(0, width - frite.image.width), y: random(0, height - frite.image.height) };
                bonusTimer = millis() + 5000;
                levelTimer = millis() + 10000; // Démarre le timer pour le niveau
                friteTrouvee = false;
                videoDisplayed = false;
            }
        });
    } else if (gameState === "jeu") {
        let d = dist(mouseX, mouseY, frite.position.x + frite.image.width * frite.scale / 2, frite.position.y + frite.image.height * frite.scale / 2);
        if (d < frite.image.width * frite.scale / 2) {
            friteTrouvee = true;
            bravoDisplayed = true;
            bravoTimer = millis() + 2000;
        }
    }
}
