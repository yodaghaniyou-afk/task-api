const API_URL = "http://localhost/task-api/backend/api.php";

const taskForm = document.getElementById("taskForm");
const titreInput = document.getElementById("titreInput");
const taskList = document.getElementById("taskList");

async function chargerTaches() {
    try {
        const response = await fetch(API_URL);
        const taches = await response.json();

        taskList.innerHTML = "";
        taches.forEach(tache => {
            afficherTache(tache);
        });
    } catch (error) {
        console.error("Erreur lors du chargement :", error);
    }
}

function afficherTache(tache) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = tache.titre;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => supprimerTache(tache.id, li));

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

async function ajouterTache(titre) {
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titre })
        });
        chargerTaches();
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
    }
}

async function supprimerTache(id, elementLi) {
    try {
        await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
        elementLi.remove();
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
    }
}

taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titre = titreInput.value.trim();
    if (titre !== "") {
        await ajouterTache(titre);
        titreInput.value = "";
    }
});

chargerTaches();