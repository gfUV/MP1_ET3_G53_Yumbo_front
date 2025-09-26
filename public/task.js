/**
 * task.js
 *
 * Maneja el tablero de tareas: carga desde el backend,
 * crea tarjetas, permite eliminar, mover y actualizar.
 */

document.addEventListener("DOMContentLoaded", async () => {
  const tasksColumns = {
    pending: document.getElementById("pending-tasks"),
    inprogress: document.getElementById("inprogress-tasks"),
    completed: document.getElementById("completed-tasks"),
  };

  const counters = {
    pending: document.getElementById("pending-count"),
    inprogress: document.getElementById("inprogress-count"),
    completed: document.getElementById("completed-count"),
  };

  // Modal de confirmación
  const confirmModal = document.getElementById("confirm-modal");
  const confirmMessage = document.getElementById("confirm-message");
  const confirmYes = document.getElementById("confirm-yes");
  const confirmNo = document.getElementById("confirm-no");
  let taskToDelete = null;

  /**
   * Mostrar modal de confirmación
   */
  function showConfirmModal(message, taskId) {
    confirmMessage.textContent = message;
    confirmModal.classList.remove("hidden");
    taskToDelete = taskId;
  }

  /**
   * Ocultar modal de confirmación
   */
  function hideConfirmModal() {
    confirmModal.classList.add("hidden");
    taskToDelete = null;
  }

  confirmNo.addEventListener("click", hideConfirmModal);

  /**
   * Crear tarjeta de tarea
   */
  function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.dataset.id = task.id;

    card.innerHTML = `
      <h4>${task.title}</h4>
      <p>${task.description || ""}</p>
      <div class="task-actions">
        <button class="delete-btn">🗑 Eliminar</button>
      </div>
    `;

    // Acción de eliminar
    card.querySelector(".delete-btn").addEventListener("click", () => {
      showConfirmModal("¿Eliminar esta tarea?", task.id);
    });

    return card;
  }

  /**
   * Cargar todas las tareas desde el backend
   */
  async function loadTasks() {
    try {
      const response = await fetch(
        "https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks"
      );
      if (!response.ok) throw new Error("Error al cargar tareas");

      const tasks = await response.json();

      // Limpiar columnas
      Object.values(tasksColumns).forEach((col) => (col.innerHTML = ""));

      // Renderizar
      tasks.forEach((task) => {
        const card = createTaskCard(task);
        if (task.status === "inprogress") {
          tasksColumns.inprogress.appendChild(card);
        } else if (task.status === "completed") {
          tasksColumns.completed.appendChild(card);
        } else {
          tasksColumns.pending.appendChild(card);
        }
      });

      updateCounters();
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  }

  /**
   * Actualizar contadores de cada columna
   */
  function updateCounters() {
    counters.pending.textContent =
      tasksColumns.pending.querySelectorAll(".task-card").length;
    counters.inprogress.textContent =
      tasksColumns.inprogress.querySelectorAll(".task-card").length;
    counters.completed.textContent =
      tasksColumns.completed.querySelectorAll(".task-card").length;
  }

  /**
   * Confirmar eliminación de tarea
   */
  confirmYes.addEventListener("click", async () => {
    if (!taskToDelete) return;
    try {
      const response = await fetch(
        `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks/${taskToDelete}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        // Eliminar la tarjeta directamente del DOM
        const card = document.querySelector(
          `.task-card[data-id="${taskToDelete}"]`
        );
        if (card) card.remove();

        // Actualizar contadores
        updateCounters();
      } else {
        alert("❌ Error al eliminar la tarea");
      }
    } catch (error) {
      console.error("Error eliminando tarea:", error);
      alert("❌ No se pudo conectar al servidor");
    } finally {
      hideConfirmModal();
    }
  });

  // Cargar las tareas al iniciar
  loadTasks();
});
