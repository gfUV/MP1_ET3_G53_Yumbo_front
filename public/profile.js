/**
 * profile.js
 *
 * Maneja la visualización del perfil del usuario.
 * Carga los datos desde el backend, los muestra en la página,
 * y permite acciones como editar o eliminar la cuenta.
 *
 * Los mensajes visibles permanecen en español y siguen buenas prácticas de UX Writing.
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

  // Modal
  const deleteModal = document.getElementById("delete-modal");
  const cancelDeleteBtn = document.getElementById("cancel-delete");
  const confirmDeleteBtn = document.getElementById("confirm-delete");

  /**
   * Mostrar mensajes en la interfaz
   * @param {string} msg - Texto del mensaje
   * @param {"success"|"error"} type - Tipo de mensaje
   */
  function showMessage(msg, type = "success") {
    if (!statusMessage) return;
    statusMessage.textContent = msg;
    statusMessage.className = `status-message ${type}-message`;
  }

  // Botón Editar → ir a edición de perfil
  editBtn.addEventListener("click", () => {
    window.location.href = "profile_edit.html";
  });

  // Botón Eliminar cuenta → abrir modal
  deleteBtn.addEventListener("click", () => {
    deleteModal.classList.remove("hidden");
  });

  // Cancelar eliminación
  cancelDeleteBtn.addEventListener("click", () => {
    deleteModal.classList.add("hidden");
  });

  // Confirmar eliminación
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

      // Eliminación correcta
      localStorage.removeItem("userId");
      showMessage("Tu cuenta se eliminó con éxito.", "success");

      setTimeout(() => {
        window.location.href = "sign_in.html";
      }, 3000); // más tiempo para leer el mensaje
    } catch (error) {
      console.error("Error eliminando la cuenta:", error);
      showMessage("No se pudo eliminar la cuenta. Intenta de nuevo.", "error");
    } finally {
      deleteModal.classList.add("hidden");
    }
  });

  try {
    // Obtener ID del usuario en sesión
    const userId = localStorage.getItem("userId");
    console.log("User ID en localStorage:", userId);

    if (!userId) {
      showMessage("No encontramos tu sesión. Vuelve a iniciar.", "error");
      setTimeout(() => {
        window.location.href = "sign_in.html";
      }, 2000);
      return;
    }

    // Pedir datos al backend
    const response = await fetch(
      `https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`
    );
    if (!response.ok) throw new Error("Error al cargar los datos del usuario");

    /** @type {{ firstName: string, lastName: string, age: number|null, email: string|null, createdAt: string, updatedAt: string }} */
    const user = await response.json();
    console.log("Usuario recibido:", user);

    // Renderizar datos
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
