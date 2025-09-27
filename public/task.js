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

  // === Caja de mensajes amigables ===
  const messageBox = document.getElementById("message-box");
  function showMessage(msg, type = "info") {
    if (!messageBox) return;
    messageBox.textContent = msg;
    messageBox.className = `message ${type}`; // .message.success / .message.error
    messageBox.style.display = "block";
    setTimeout(() => (messageBox.style.display = "none"), 3000);
  }

  // === Modal de confirmación ===
  const confirmModal = document.getElementById("confirm-modal");
  const confirmYes = document.getElementById("confirm-yes");
  const confirmNo = document.getElementById("confirm-no");
  let taskToDelete = null;

  function showConfirmModal(taskId) {
    taskToDelete = taskId;
    confirmModal.classList.add("show");
  }

  function hideConfirmModal() {
    taskToDelete = null;
    confirmModal.classList.remove("show");
  }

  confirmNo.addEventListener("click", hideConfirmModal);

  confirmYes.addEventListener("click", async () => {
    if (!taskToDelete) return;
    try {
      const response = await fetch(
        `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks/${taskToDelete}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        // 🔥 Eliminar del DOM directamente
        const taskCard = document.querySelector(`.task-card[data-id="${taskToDelete}"]`);
        if (taskCard) {
          // actualizar contador
          let counterId = "";
          if (taskCard.classList.contains("task-pending")) counterId = "pending-count";
          if (taskCard.classList.contains("task-inprogress")) counterId = "inprogress-count";
          if (taskCard.classList.contains("task-completed")) counterId = "completed-count";

          taskCard.remove();

          if (counterId) {
            const counterEl = document.getElementById(counterId);
            if (counterEl) {
              let count = parseInt(counterEl.textContent, 10);
              counterEl.textContent = Math.max(count - 1, 0);
            }
          }
        }
        showMessage("✅ Tarea eliminada correctamente", "success");
        loadTasks();
      } else {
        showMessage("❌ Error al eliminar la tarea", "error");
      }
    } catch (error) {
      console.error(error);
      showMessage("❌ No se pudo conectar al servidor", "error");
    } finally {
      hideConfirmModal();
    }
  });

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
      <div class="task-card ${statusClass}" draggable="true" data-id="${t._id}">
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

    document.getElementById("pending-count").textContent = pendingCounter;
    document.getElementById("inprogress-count").textContent = inprogressCounter;
    document.getElementById("completed-count").textContent = completedCounter;

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
      btn.addEventListener("click", (e) => {
        const taskId = e.currentTarget.dataset.id;
        showConfirmModal(taskId);
      });
    });

    // ======== DRAG & DROP ========
    document.querySelectorAll(".task-card").forEach(card => {
      card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", card.dataset.id);
        card.classList.add("dragging");

        const crt = card.cloneNode(true);
        crt.style.opacity = "1";
        crt.style.transform = "scale(1)";
        crt.style.background = window.getComputedStyle(card).background;
        crt.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
        crt.style.position = "absolute";
        crt.style.top = "-9999px"; 
        document.body.appendChild(crt);

        e.dataTransfer.setDragImage(crt, crt.offsetWidth / 2, crt.offsetHeight / 2);

        setTimeout(() => document.body.removeChild(crt), 0);
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
      });
    });

    [pendingTasks, inprogressTasks, completedTasks].forEach(column => {
      column.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      column.addEventListener("drop", async (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("text/plain");

        let newStatus = "";
        if (column.id === "pending-tasks") newStatus = "pendiente";
        else if (column.id === "inprogress-tasks") newStatus = "en-progreso";
        else if (column.id === "completed-tasks") newStatus = "completada";

        try {
          const response = await fetch(
            `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks/${taskId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: newStatus })
            }
          );

          if (response.ok) {
            loadTasks();
          } else {
            showMessage("❌ No se pudo actualizar la tarea", "error");
          }
        } catch (error) {
          console.error(error);
          showMessage("❌ Error al conectar con el servidor", "error");
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
