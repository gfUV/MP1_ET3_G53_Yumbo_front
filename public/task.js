/**
 * task.js
 * Maneja tareas: carga, render, navegación, edición y eliminación.
 */

document.addEventListener("DOMContentLoaded", async () => {
  const addTaskBtn = document.getElementById("add-task");
  const aboutUsBtn = document.getElementById("about-us");
  const logoutBtn = document.getElementById("logout");
  const profileBtn = document.getElementById("profile");
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("close-sidebar");

  const pendingTasks = document.getElementById("pending-tasks");
  const inprogressTasks = document.getElementById("inprogress-tasks");
  const completedTasks = document.getElementById("completed-tasks");

  const pendingCount = document.getElementById("pending-count");
  const inprogressCount = document.getElementById("inprogress-count");
  const completedCount = document.getElementById("completed-count");

  // ======== MENÚ LATERAL ========
  function toggleMenu() {
    sidebar.classList.toggle("show");
    overlay.classList.toggle("show");
  }

  hamburger.addEventListener("click", toggleMenu);
  closeBtn.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", toggleMenu);

  // ======== NAVEGACIÓN ========
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

  // ======== CREAR TARJETA ========
  function createTaskCard(t) {
  let statusClass = "";
  if (t.status === "pendiente") statusClass = "task-pending";
  else if (t.status === "en-progreso") statusClass = "task-inprogress";
  else if (t.status === "completada") statusClass = "task-completed";

  return `
    <div class="task-card ${statusClass}">
      <div class="task-header">
        <h4>${t.title}</h4>
      </div>
      <p class="task-detail">${t.detail || "Sin descripción"}</p>
      <div class="task-meta">
        <span class="task-date">📅 ${t.date ? new Date(t.date).toLocaleDateString("es-ES") : "Sin fecha"} ${t.time || ""}</span>
      </div>
      <div class="task-actions">
        <button class="edit-btn" data-id="${t._id}" title="Editar">✏️</button>
        <button class="delete-btn" data-id="${t._id}" title="Eliminar">🗑️</button>
      </div>
    </div>
  `;
}


  // ======== RENDERIZAR TAREAS ========
  function renderTasks(tasks) {
    // Reiniciar columnas con los títulos y bolitas
    pendingTasks.innerHTML = `<h3><span class="status-dot pending"></span> Pendientes (<span id="pending-count">0</span>)</h3>`;
    inprogressTasks.innerHTML = `<h3><span class="status-dot inprogress"></span> En proceso (<span id="inprogress-count">0</span>)</h3>`;
    completedTasks.innerHTML = `<h3><span class="status-dot completed"></span> Completadas (<span id="completed-count">0</span>)</h3>`;

    let pendingCounter = 0;
    let inprogressCounter = 0;
    let completedCounter = 0;

    tasks.forEach((t) => {
      const taskHTML = createTaskCard(t);
      if (t.status === "pendiente") {
        pendingTasks.innerHTML += taskHTML;
        pendingCounter++;
      } else if (t.status === "en-progreso") {
        inprogressTasks.innerHTML += taskHTML;
        inprogressCounter++;
      } else if (t.status === "completada") {
        completedTasks.innerHTML += taskHTML;
        completedCounter++;
      }
    });

    // Actualizar contadores
    document.getElementById("pending-count").textContent = pendingCounter;
    document.getElementById("inprogress-count").textContent = inprogressCounter;
    document.getElementById("completed-count").textContent = completedCounter;

      // === Mensajes motivadores si están vacías ===
    if (pendingCounter === 0) {
      pendingTasks.innerHTML += `<p class="empty-msg">✨ No tienes pendientes. ¡Crea una tarea y organiza tu día!</p>`;
    }
    if (inprogressCounter === 0) {
      inprogressTasks.innerHTML += `<p class="empty-msg">🚀 Nada en proceso aún. ¡Elige una tarea y empieza ya!</p>`;
    }
    if (completedCounter === 0) {
      completedTasks.innerHTML += `<p class="empty-msg">✅ Aquí aparecerán tus logros cuando completes tareas.</p>`;
    }

    // Botón editar
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const taskId = e.currentTarget.dataset.id;
        localStorage.setItem("taskId", taskId);
        window.location.href = "task_edit.html";
      });
    });

    // Botón eliminar
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
              // Recargar tareas para actualizar contadores
              loadTasks();
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

  // ======== CARGAR TAREAS DESDE API ========
  async function loadTasks() {
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
  }

  // Cargar al inicio
  loadTasks();
});
