/**
 * task_new.js
 *
 * Handles task creation functionality:
 * - Captures form data for a new task
 * - Sends the data to the backend API
 * - Provides feedback messages on success or error
 *
 * Visible messages for the user remain in Spanish.
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const backBtn = document.getElementById("back");
  const submitBtn = form.querySelector('button[type="submit"]');

  /**
   * Feedback container for displaying messages.
   * If it does not exist in the DOM, it will be created dynamically.
   * @type {HTMLDivElement}
   */
  let feedbackDiv = document.querySelector(".feedback-message");
  if (!feedbackDiv) {
    feedbackDiv = document.createElement("div");
    feedbackDiv.className = "feedback-message";
    form.insertBefore(feedbackDiv, submitBtn);
  }

  /**
   * Back button handler
   * Redirects the user to the main tasks page.
   * @event click
   */
  backBtn.addEventListener("click", () => {
    window.location.href = "task.html";
  });

  /**
   * Form submission handler
   * Collects new task data and sends it to the backend.
   *
   * @event submit
   * @param {SubmitEvent} e - The form submit event
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    feedbackDiv.textContent = "";
    feedbackDiv.className = "feedback-message";

    /** @type {string|null} */
    const userId = localStorage.getItem("userId");

    const data = {
      title: form.title.value,
      detail: form.detail.value,
      date: form.date.value,
      time: form.time.value,
      status: form.status.value,
      userId: userId,
    };

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "⏳ Creando...";

      const res = await fetch(
        "https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error("Error al crear tarea");

      feedbackDiv.textContent = "✅ Tarea creada con éxito";
      feedbackDiv.classList.add("success-message");
      submitBtn.textContent = "✅ Creada";

      setTimeout(() => {
        window.location.href = "task.html";
      }, 1200);
    } catch (error) {
      feedbackDiv.textContent = "❌ " + error.message;
      feedbackDiv.classList.add("error-message");
      submitBtn.disabled = false;
      submitBtn.textContent = "Crear Tarea";
    }
  });
});
