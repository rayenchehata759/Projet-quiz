// 1. Les questions
// "reponse" = numéro du bon choix dans la liste "choix" (0 = premier, 1 = deuxième, ...)
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

// 2. Les variables du jeu
let numero = 0;   // numéro de la question en cours (0 = la première)
let score = 0;    // nombre de reponses réponses

// 3. Les éléments de la page
const compteur = document.getElementById("compteur");
const progression = document.getElementById("progression");
const question = document.getElementById("question");
const boutons = document.querySelectorAll(".reponse");
const message = document.getElementById("message");
const suivant = document.getElementById("suivant");

progression.max = questions.length;

// 4. Afficher la question en cours
function afficherQuestion() {
    const q = questions[numero];

    compteur.textContent = "Question " + (numero + 1) + " sur " + questions.length;
    progression.value = numero;
    question.textContent = q.texte;
    message.textContent = "";
    suivant.hidden = true;

    // On remplit les 4 boutons avec les 4 choix
    for (let i = 0; i < boutons.length; i++) {
        boutons[i].textContent = q.choix[i];
        boutons[i].className = "reponse";   // enlève les couleurs de la question d'avant
        boutons[i].disabled = false;
    }
}

// 5. Vérifier la réponse (choix = numéro du bouton cliqué)
function verifier(choix) {
    const q = questions[numero];

    if (choix === q.reponse) {
        score++;
        message.textContent = "Bonne réponse ! " + q.explication;
    } else {
        boutons[choix].classList.add("faux");
        message.textContent = "Raté. " + q.explication;
    }

    // La reponse réponse devient toujours verte
    boutons[q.reponse].classList.add("juste");

    // On bloque les boutons pour ne pas répondre deux fois
    for (let i = 0; i < boutons.length; i++) {
        boutons[i].disabled = true;
    }

    if (numero === questions.length - 1) {
        suivant.textContent = "Voir mon score";
    } else {
        suivant.textContent = "Question suivante";
    }
    suivant.hidden = false;
}

// 6. Quand on clique sur un des 4 boutons
for (let i = 0; i < boutons.length; i++) {
    boutons[i].addEventListener("click", function () {
        verifier(i);
    });
}

// 7. Quand on clique sur "Question suivante"
suivant.addEventListener("click", function () {
    numero++;

    if (numero < questions.length) {
        afficherQuestion();
    } else {
        // Fin du quiz : on garde le score et on va sur la page résultat
        localStorage.setItem("score", score);
        localStorage.setItem("total", questions.length);
        window.location.href = "resultat.html";
    }
});

// 8. Démarrage
afficherQuestion();
