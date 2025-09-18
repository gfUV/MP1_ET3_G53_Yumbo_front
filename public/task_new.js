/**
 * Handles task creation form submission and sends task data to the backend API.
 * 
 * @fileoverview This script listens for form submission, collects task data,
 * sends it to the backend, and provides user feedback based on the response.
 * 
 * @author  
 */
const backBtn =document.getElementById("back");
backBtn.addEventListener("click", () =>{
  window.location.href = "task.html";
})

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  /**
   * Handles the submit event of the task creation form.
   * Prevents default form submission, builds task data,
   * sends it to the backend API, and provides feedback to the user.
   * 
   * @async
   * @param {Event} e - The submit event.
   * @returns {Promise<void>}
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

  const userId = localStorage.getItem("userId"); // 👈 Recuperamos el ID del usuario logueado


    /** @type {Object} Task data from the form */
    const data = {
      title: form.title.value,
      detail: form.detail.value,
      date: form.date.value,
      time: form.time.value,
      status: form.status.value,
      userId: userId   // 👈 lo agregamos al payload
    };

    try {
      const res = await fetch("https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al crear tarea");

      alert("✅ Tarea creada con éxito");
      window.location.href = "task.html"; 
    } catch (error) {
      alert("❌ " + error.message);
    }
  });
});
