/**
 * task_edit.js
 *
 * Handles task editing functionality:
 * - Loads task data into the form
 * - Allows users to edit details
 * - Sends updated data to the backend
 *
 * Visible messages for the user remain in Spanish.
 */
const backBtn = document.getElementById("back");

/**
 * Back button handler
 * Redirects the user to the main tasks page.
 * @event click
 */
backBtn.addEventListener("click", () => {
  window.location.href = "task.html";
});

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("task-form");
  const submitBtn = form.querySelector("button[type='submit']");

  /**
   * Retrieve task ID from localStorage
   * @type {string|null}
   */
  const taskId = localStorage.getItem("taskId");

  if (!taskId) {
    console.error("No se especificó la tarea a editar.");
    window.location.href = "/task.html";
    return;
  }

  /**
   * Fetch task details from the backend and pre-fill the form.
   */
  try {
    const response = await fetch(
      `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks/${taskId}`
    );
    if (!response.ok) throw new Error("Error al cargar la tarea");

    /** @type {{ title: string, detail: string, date?: string, time?: string, status: string }} */
    const task = await response.json();

    document.getElementById("title").value = task.title || "";
    document.getElementById("detail").value = task.detail || "";
    if (task.date) {
      document.getElementById("date").value = new Date(task.date)
        .toISOString()
        .split("T")[0];
    }
    document.getElementById("time").value = task.time || "";
    document.getElementById("status").value = task.status || "pendiente";
  } catch (error) {
    console.error("No se pudo cargar la tarea:", error);
    window.location.href = "/task.html";
  }

  /**
   * Form submission handler
   * Collects updated task data and sends it to the backend.
   *
   * @event submit
   * @param {SubmitEvent} e - The form submit event
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedTask = {
      title: document.getElementById("title").value.trim(),
      detail: document.getElementById("detail").value.trim(),
      date: document.getElementById("date").value || null,
      time: document.getElementById("time").value || null,
      status: document.getElementById("status").value,
    };

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "⏳ Actualizando...";

      const response = await fetch(
        `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks/${taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        }
      );

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Error al actualizar tarea");
      }

      submitBtn.textContent = "✅ Tarea actualizada";
      setTimeout(() => {
        window.location.href = "/task.html";
      }, 1200);
    } catch (error) {
      console.error("Error al actualizar:", error);
      submitBtn.disabled = false;
      submitBtn.textContent = "❌ Error, intenta de nuevo";
      setTimeout(() => {
        submitBtn.textContent = "💾 Guardar cambios";
      }, 2000);
    }
  });
});
