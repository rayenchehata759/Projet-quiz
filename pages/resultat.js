// 1. Récupérer le score enregistré par quiz.js
const score = Number(localStorage.getItem("score"));
const total = Number(localStorage.getItem("total"));

// 2. Si on arrive ici sans avoir fait le quiz, on retourne à l'accueil
if (total === 0) {
    window.location.href = "../index.html";
}

// 3. Afficher le score
document.getElementById("score").textContent = score + " / " + total;

// 4. Afficher un commentaire selon le score
let commentaire;
if (score === total) {
    commentaire = "Parfait, tu maîtrises ce sujet !";
} else if (score >= total / 2) {
    commentaire = "Bon résultat, quelques points à revoir.";
} else {
    commentaire = "Il reste du travail : relis le cours et réessaie.";
}
document.getElementById("commentaire").textContent = commentaire;
