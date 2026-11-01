// 1. Les questions
const questions = [
    {
        texte: "Quelle méthode sélectionne un élément à partir de son id ?",
        choix: ["document.getElementById()", "document.querySelectorAll()", "document.getElementByClass()", "document.selectById()"],
        reponse: 0,
        explication: "getElementById() renvoie l'élément dont l'id est donné."
    },
    {
        texte: "Comment réagir au clic sur un bouton ?",
        choix: ["btn.onclick = alert", "btn.addEventListener(\"click\", fonction)", "btn.listen(\"click\")", "btn.click(fonction)"],
        reponse: 1,
        explication: "addEventListener() attache une fonction à un événement."
    },
    {
        texte: "Quelle instruction change la couleur de fond d'un élément ?",
        choix: ["element.color = \"red\"", "element.style.background-color = \"red\"", "element.style.backgroundColor = \"red\"", "element.css(\"red\")"],
        reponse: 2,
        explication: "En JavaScript, on écrit backgroundColor (sans tiret, avec une majuscule)."
    },
    {
        texte: "Que renvoie parseFloat(\"3.5abc\") ?",
        choix: ["NaN", "3", "3.5", "\"3.5\""],
        reponse: 2,
        explication: "parseFloat() lit le nombre au début du texte et s'arrête au premier caractère invalide."
    },
    {
        texte: "Comment lire une valeur enregistrée dans le localStorage ?",
        choix: ["localStorage.get(\"cle\")", "localStorage.getItem(\"cle\")", "localStorage.read(\"cle\")", "document.localStorage(\"cle\")"],
        reponse: 1,
        explication: "getItem(cle) renvoie la valeur enregistrée avec setItem()."
    }
];

const meilleurScore = Number(localStorage.getItem("meilleurScore")) || 0;
// 2. Les variables du jeu
let numero = 0;   // numéro de la question en cours (0 = la première)
let score = 0;    // nombre de bonnes réponses

// Durée maximale accordée pour répondre à une question, en secondes.
const DUREE_QUESTION = 10;
// Temps restant pour la question en cours
let tempsRestant = DUREE_QUESTION;
// Identifiant du compte à rebours
let minuteurId;
// Indique si la question est déjà verrouillée.
let questionVerrouillee = false;


const compteur = document.getElementById("compteur");
const progression = document.getElementById("progression");
const question = document.getElementById("question");
const boutons = document.querySelectorAll(".reponse");
const message = document.getElementById("message");
const suivant = document.getElementById("suivant");

const chronometre = document.getElementById("chronometre");

progression.max = questions.length;

// 4. Afficher la question en cours
function afficherQuestion() {
    const q = questions[numero];

    // Arrête le minuteur
    clearInterval(minuteurId);
    questionVerrouillee = false;
    // Le compte à rebours repart a 10 sec
    tempsRestant = DUREE_QUESTION;
    compteur.textContent = "Question " + (numero + 1) + " sur " + questions.length;
    progression.value = numero;
    question.textContent = q.texte;
    message.textContent = "";
    suivant.hidden = true;

    // Affiche immédiatement 10s
    mettreAJourChronometre();
    // Exécute la fonction  toutes les 1 s
    minuteurId = setInterval(() => {
        
        tempsRestant--;
        // Actualise le chrono
        mettreAJourChronometre();

        // arret du miniteur quand le temp est finit
        if (tempsRestant <= 0) {
            clearInterval(minuteurId);
            // Termine la question et attend le clic sur le bouton suivant.
            gererExpiration();
        }
    }, 1000);

    
    for (let i = 0; i < boutons.length; i++) {
        boutons[i].textContent = q.choix[i];
        boutons[i].className = "reponse";   // enlève les couleurs de lancienne question
        boutons[i].disabled = false;
    }
}

function mettreAJourChronometre() {
    
    chronometre.textContent = "Temps restant : " + tempsRestant + " s";

    // Ajoute ou retire la classe CSS "urgent" dans les 3 dernières secondes.
    chronometre.classList.toggle("urgent", tempsRestant <= 3);
}

function verrouillerQuestion() {
    // Mémorise que la question ne peut plus être répondue.
    questionVerrouillee = true;
    for (let i = 0; i < boutons.length; i++) {
        // Désactive les bouton de reponses
        boutons[i].disabled = true;
    }
}

function calculerPoints() {
    const tempsUtilise = DUREE_QUESTION - tempsRestant;

    if (tempsUtilise <= 3) {
        return 1;
    }

    if (tempsUtilise <= 7) {
        return 0.5;
    }

    return 0.25;
}

function gererExpiration() {
    // Bloque les réponses
    verrouillerQuestion();
    // Montre la bonne réponse en vert
    boutons[questions[numero].reponse].classList.add("juste");

    // Informe l'utilisateur que son temps est écoulé.
    message.textContent = "Temps écoulé ! " + questions[numero].explication;

    // Adapte le texte du bouton selon la position dans le quiz.
    suivant.textContent = numero === questions.length - 1
        ? "Voir mon score"
        : "Question suivante";

    // Rend le bouton visible pour passer a la question suiv
    suivant.hidden = false;
}


function verifier(choix) {
    const q = questions[numero];

    
    if (questionVerrouillee) {
        return;
    }

    // arret du chrono
    clearInterval(minuteurId);
    
    questionVerrouillee = true;

    if (choix === q.reponse) {
        const points = calculerPoints();
        score += points;
        message.textContent = "Bonne réponse ! +" + points + " point "
            + q.explication;

    } else {
        boutons[choix].classList.add("faux");
        message.textContent = "Raté. " + q.explication;
    }

    // La reponse réponse devient toujours verte
    boutons[q.reponse].classList.add("juste");

    // On bloque les boutons pour ne pas répondre deux fois
    verrouillerQuestion();

    if (numero === questions.length - 1) {
        suivant.textContent = "Voir mon score";
    } else {
        suivant.textContent = "Question suivante";
    }
    suivant.hidden = false;
}

function passerQuestion() {
    // Passe à l'index de la question suivante après le clic.
    numero++;

    if (numero < questions.length) {
        //chrono redemarre pour la question suivante
        afficherQuestion();
    } else {
        // Fin du quiz,on garde le meilleur score 
        localStorage.setItem("score", score);
        localStorage.setItem("total", questions.length);
        if (score > meilleurScore) {
            localStorage.setItem("meilleurScore", score);
        }
        window.location.href = "resultat.html";
    }
}


for (let i = 0; i < boutons.length; i++) {
    boutons[i].addEventListener("click", function () {
        verifier(i);
    });
}


suivant.addEventListener("click", function () {
    passerQuestion();
});

// Demarrage du quiz
afficherQuestion();
