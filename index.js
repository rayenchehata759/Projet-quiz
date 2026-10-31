const meilleurScore = Number(localStorage.getItem("meilleurScore")) || 0;
const affichageMeilleurScore = document.getElementById("meilleur-score");

affichageMeilleurScore.textContent = "Meilleur score : "
    + meilleurScore
    + " / 5";
