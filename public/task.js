/**
 * task.js
 *
 * Handles task loading, navigation, and user actions.
 * Provides functionality to view, edit, and delete tasks,
 * as well as manage the hamburger menu across all screens.
 */

document.addEventListener("DOMContentLoaded", async () => {
  const addTaskBtn = document.getElementById("add-task");
  const aboutUsBtn = document.getElementById("about-us");
  const logoutBtn = document.getElementById("logout");
  const profileBtn = document.getElementById("profile");
  const hamburger = document.getElementById("hamburger");
  const navbarRight = document.getElementById("navbar-right");

  const pendingTasks = document.getElementById("pending-tasks");
  const inprogressTasks = document.getElementById("inprogress-tasks");
  const completedTasks = document.getElementById("completed-tasks");

  const countPending = document.getElementById("count-pending");
  const countProgress = document.getElementById("count-progress");
  const countCompleted = document.getElementById("count-completed");

  /**
   * Toggle hamburger menu
   */
  hamburger.addEventListener("click", () => {
    navbarRight.classList.toggle("show");
  });

  profileBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
  });

  addTaskBtn.addEventListener("click", () => {
    window.location.href = "task_new.html";
  });

  aboutUsBtn.addEventListener("click", () => {
    window.location.href = "about_us.html";
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userId");
    window.location.href = "sign_in.html";
  });

  /**
   * Crear tarjeta de tarea
   */
  function createTaskCard(t) {
    return `
      <div class="task-card">
        <div class="task-header">
          <span>${t.title}</span>
        </div>
        <div class="task-detail">${t.detail || ""}</div>
        <div class="task-date">
          ${t.date ? new Date(t.date).toLocaleDateString("es-ES") : "Sin fecha"} 
          ${t.time || ""}
        </div>
        <div class="task-actions">
          <button class="edit-btn" data-id="${t._id}" title="Editar">✏️</button>
          <button class="delete-btn" data-id="${t._id}" title="Eliminar">🗑️</button>
        </div>
      </div>
    `;
  }

  /**
   * Actualizar contadores y mensajes vacíos
   */
  function updateColumns() {
    const sets = [
      { container: pendingTasks, count: countPending },
      { container: inprogressTasks, count: countProgress },
      { container: completedTasks, count: countCompleted }
    ];

    sets.forEach(({ container, count }) => {
      const tasks = container.querySelectorAll(".task-card");
      const emptyMsg = container.querySelector(".empty-msg");
      count.textContent = tasks.length;
      emptyMsg.style.display = tasks.length === 0 ? "block" : "none";
    });
  }

  /**
   * Renderizar tareas
   */
  function renderTasks(tasks) {
    pendingTasks.innerHTML = `<h3>Pendientes (<span id="count-pending">0</span>)</h3><p class="empty-msg">No hay tareas pendientes</p>`;
    inprogressTasks.innerHTML = `<h3>En proceso (<span id="count-progress">0</span>)</h3><p class="empty-msg">No hay tareas en proceso</p>`;
    completedTasks.innerHTML = `<h3>Completadas (<span id="count-completed">0</span>)</h3><p class="empty-msg">No hay tareas completadas</p>`;

    tasks.forEach((t) => {
      const taskHTML = createTaskCard(t);
      if (t.status === "pendiente") {
        pendingTasks.innerHTML += taskHTML;
      } else if (t.status === "en-progreso") {
        inprogressTasks.innerHTML += taskHTML;
      } else if (t.status === "completada") {
        completedTasks.innerHTML += taskHTML;
      }
    });

    // eventos editar
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const taskId = e.currentTarget.dataset.id;
        localStorage.setItem("taskId", taskId);
        window.location.href = "task_edit.html";
      });
    });

    // eventos eliminar
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const taskId = e.currentTarget.dataset.id;
        if (confirm("¿Seguro que deseas eliminar esta tarea?")) {
          try {
            const response = await fetch(
              `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks/${taskId}`,
              { method: "DELETE" }
            );
            if (response.ok) {
              e.target.closest(".task-card").remove();
              updateColumns();
            } else {
              alert("❌ Error al eliminar la tarea");
            }
          } catch (error) {
            console.error(error);
            alert("❌ No se pudo conectar al servidor");
          }
        }
      });
    });

    updateColumns();
  }

  /**
   * Cargar tareas desde backend
   */
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      pendingTasks.innerHTML = "<p style='color:red;'>⚠ No se encontró un usuario en sesión.</p>";
