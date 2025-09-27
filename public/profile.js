/**
 * profile.js
 *
 * Manages the display of the user profile.
 * Loads user data from the backend, renders it in the UI,
 * and provides actions such as editing or deleting the account.
 *
 * Visible messages for the user remain in Spanish.
 */
document.addEventListener("DOMContentLoaded", async () => {
  const nameSpan = document.getElementById("user-name");
  const emailSpan = document.getElementById("user-email");
  const ageSpan = document.getElementById("user-age");
  const createdSpan = document.getElementById("user-created");
  const updatedSpan = document.getElementById("user-updated");
  const editBtn = document.getElementById("edit");
  const deleteBtn = document.getElementById("delete");
  const statusMessage = document.getElementById("status-message");

  const deleteModal = document.getElementById("delete-modal");
  const cancelDeleteBtn = document.getElementById("cancel-delete");
  const confirmDeleteBtn = document.getElementById("confirm-delete");

  /**
   * Displays a message in the interface.
   * @param {string} msg - Message text to display.
   * @param {"success"|"error"} [type="success"] - Type of message.
   */
  function showMessage(msg, type = "success") {
    if (!statusMessage) return;
    statusMessage.textContent = msg;
    statusMessage.className = `status-message ${type}-message`;
  }

  /**
   * Edit button listener
   * Redirects the user to the profile edit page.
   * @event click
   */
  editBtn.addEventListener("click", () => {
    window.location.href = "profile_edit.html";
  });

  /**
   * Delete button listener
   * Opens the delete confirmation modal.
   * @event click
   */
  deleteBtn.addEventListener("click", () => {
    deleteModal.classList.remove("hidden");
  });

  /**
   * Cancel delete listener
   * Closes the delete modal without performing any action.
   * @event click
   */
  cancelDeleteBtn.addEventListener("click", () => {
    deleteModal.classList.add("hidden");
  });

  /**
   * Confirm delete listener
   * Sends a DELETE request to the API to remove the user account.
   * If successful, clears the session and redirects to the sign-in page.
   * @event click
   */
  confirmDeleteBtn.addEventListener("click", async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        showMessage("No encontramos tu sesión. Vuelve a iniciar.", "error");
        return;
      }

      const response = await fetch(
        `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Error al eliminar la cuenta");

      localStorage.removeItem("userId");
      showMessage("Tu cuenta se eliminó con éxito.", "success");

      setTimeout(() => {
        window.location.href = "sign_in.html";
      }, 3000);
    } catch (error) {
      console.error("Error eliminando la cuenta:", error);
      showMessage("No se pudo eliminar la cuenta. Intenta de nuevo.", "error");
    } finally {
      deleteModal.classList.add("hidden");
    }
  });

  try {
    /**
     * Loads the user profile data from the API.
     * If no session exists, redirects the user to the sign-in page.
     */
    const userId = localStorage.getItem("userId");
    console.log("User ID en localStorage:", userId);

    if (!userId) {
      showMessage("No encontramos tu sesión. Vuelve a iniciar.", "error");
      setTimeout(() => {
        window.location.href = "sign_in.html";
      }, 2000);
      return;
    }

    const response = await fetch(
      `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`
    );
    if (!response.ok) throw new Error("Error al cargar los datos del usuario");

    /** 
     * @typedef {Object} User
     * @property {string} firstName - User's first name.
     * @property {string} lastName - User's last name.
     * @property {number|null} age - User's age.
     * @property {string|null} email - User's email.
     * @property {string} createdAt - Account creation date.
     * @property {string} updatedAt - Last update date.
     */

    /** @type {User} */
    const user = await response.json();
    console.log("Usuario recibido:", user);

    nameSpan.textContent = `${user.firstName || ""} ${user.lastName || ""}`;
    ageSpan.textContent = user.age ? `${user.age} años` : "No disponible";
    emailSpan.textContent = user.email || "No disponible";
    createdSpan.textContent = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("es-ES")
      : "No disponible";
    updatedSpan.textContent = user.updatedAt
      ? new Date(user.updatedAt).toLocaleDateString("es-ES")
      : "No disponible";
  } catch (error) {
    console.error("Error cargando perfil:", error);
    showMessage("No se pudo cargar tu perfil.", "error");
  }
});
