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

  /**
   * Toggles the hamburger menu visibility.
   * @function
   */
  hamburger.addEventListener("click", () => {
    navbarRight.classList.toggle("show");
  });

  /**
   * Redirects the user to the profile page.
   * @function
   */
  profileBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
  });

  /**
   * Redirects the user to the new task creation page.
   * @function
   */
  addTaskBtn.addEventListener("click", () => {
    window.location.href = "task_new.html";
  });

  /**
   * Redirects the user to the "About Us" page.
   * @function
   */
  aboutUsBtn.addEventListener("click", () => {
    window.location.href = "about_us.html";
  });

  /**
   * Logs out the user by clearing session data and redirecting to sign-in.
   * @function
   */
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userId");
    window.location.href = "sign_in.html";
  });

  /**
   * Creates the HTML structure for a task card.
   * @function
   * @param {Object} t - Task object.
   * @param {string} t._id - Unique task identifier.
   * @param {string} t.title - Task title.
   * @param {string} [t.detail] - Task description or detail.
   * @param {string} [t.date] - Task date (ISO format).
   * @param {string} [t.time] - Task time (HH:mm format).
   * @param {string} t.status - Task status ("pendiente", "en-progreso", "completada").
   * @returns {string} HTML string representing a task card.
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
   * Renders tasks into their respective columns and attaches events.
   * @function
   * @param {Array<Object>} tasks - List of task objects.
   */
  function renderTasks(tasks) {
    pendingTasks.innerHTML = "<h3>Pendientes</h3>";
    inprogressTasks.innerHTML = "<h3>En proceso</h3>";
    completedTasks.innerHTML = "<h3>Completadas</h3>";

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

    /** Attach edit events */
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const taskId = e.currentTarget.dataset.id;
        localStorage.setItem("taskId", taskId);
        window.location.href = "task_edit.html";
      });
    });

    /** Attach delete events */
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
  }

  /**
   * Loads tasks from the backend API and renders them.
   * Displays error messages in case of failure.
   * @async
   * @function
   */
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      pendingTasks.innerHTML = "<p style='color:red;'>⚠ No se encontró un usuario en sesión.</p>";
      return;
    }

    const response = await fetch(
      `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks?userId=${userId}`
    );
    if (!response.ok) throw new Error("Error al cargar tareas");

    const tasks = await response.json();
    if (tasks.length === 0) {
      pendingTasks.innerHTML += "<p>No hay tareas registradas.</p>";
    } else {
      renderTasks(tasks);
    }
  } catch (error) {
    console.error(error);
    pendingTasks.innerHTML = `<p style="color:red;">❌ ${error.message}</p>`;
  }
});
