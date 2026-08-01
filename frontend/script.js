const API_URL = "http://localhost/task-api/backend/api.php";

const taskForm = document.getElementById("taskForm");
const titreInput = document.getElementById("titreInput");
const taskList = document.getElementById("taskList");

function afficherErreur(message) {
    const div = document.createElement("div");
    div.className = "error-message";
    div.textContent = message;
    document.querySelector(".container").insertBefore(div, taskList);
    setTimeout(() => div.remove(), 4000);
}

async function chargerTaches() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erreur serveur");
        const taches = await response.json();

        taskList.innerHTML = "";
        taches.forEach(tache => afficherTache(tache));
    } catch (error) {
        afficherErreur("Impossible de charger les tâches. Vérifiez que le serveur est actif.");
    }
}

function afficherTache(tache) {
    const li = document.createElement("li");
    if (tache.terminee == 1) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tache.terminee == 1;
    checkbox.addEventListener("change", () => marquerTerminee(tache.id, checkbox.checked, li));

    const span = document.createElement("span");
    span.textContent = tache.titre;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => supprimerTache(tache.id, li));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

async function ajouterTache(titre) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titre })
        });
        if (!response.ok) throw new Error("Erreur lors de l'ajout");
        chargerTaches();
    } catch (error) {
        afficherErreur("Impossible d'ajouter la tâche.");
    }
}

async function marquerTerminee(id, terminee, elementLi) {
    try {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ terminee })
        });
        if (!response.ok) throw new Error("Erreur de mise à jour");
        elementLi.classList.toggle("done", terminee);
    } catch (error) {
        afficherErreur("Impossible de mettre à jour la tâche.");
    }
}

async function supprimerTache(id, elementLi) {
    try {
        const response = await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erreur de suppression");
        elementLi.remove();
    } catch (error) {
        afficherErreur("Impossible de supprimer la tâche.");
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