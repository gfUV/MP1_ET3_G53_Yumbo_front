/**
 * task_edit.js
 *
 * Handles the task editing functionality.
 * Loads task data into the form, allows the user to edit it,
 * and updates the task on the backend.
 * 
 * Visible messages for the user remain in Spanish.
 * 
 * @author
 */

const backBtn = document.getElementById("back");

/**
 * Back button listener
 * Redirects the user back to the task list page.
 * @event click
 */
backBtn.addEventListener("click", () => {
  window.location.href = "task.html";
});

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("task-form");

  /**
   * Task ID stored in localStorage (set previously in task.js)
   * @type {string|null}
   */
  const taskId = localStorage.getItem("taskId");

  if (!taskId) {
    alert("❌ No se especificó la tarea a editar.");
    window.location.href = "/task.html";
    return;
  }

  /**
   * Load task data from backend and pre-fill form fields
   */
  try {
    const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks/${taskId}`);
    if (!response.ok) throw new Error("Error al cargar la tarea");

    /** @type {{ title: string, detail: string, date: string, time: string, status: string }} */
    const task = await response.json();

    // Fill form inputs
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
    console.error(error);
    alert("❌ No se pudo cargar la tarea.");
    window.location.href = "/task.html";
  }

  /**
   * Form submission handler
   * Sends updated task data to the backend via PUT request.
   * 
   * @event submit
   * @param {SubmitEvent} e - The form submit event
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    /** @type {{ title: string, detail: string, date: string|null, time: string|null, status: string }} */
    const updatedTask = {
      title: document.getElementById("title").value.trim(),
      detail: document.getElementById("detail").value.trim(),
      date: document.getElementById("date").value || null,
      time: document.getElementById("time").value || null,
      status: document.getElementById("status").value,
    };

    try {
      const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      console.log("Respuesta update:", response.status, response.statusText);

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "Error al actualizar tarea");
      }

      alert("✅ Tarea actualizada correctamente");
      window.location.href = "/task.html"; 
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("❌ No se pudo actualizar la tarea");
    }
  });
});
