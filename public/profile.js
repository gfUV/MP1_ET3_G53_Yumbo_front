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
  const backBtn = document.getElementById("back");
  const statusMessage = document.getElementById("status-message");

  /**
   * Mostrar mensajes en la interfaz
   * @param {string} msg - Texto del mensaje
   * @param {"success"|"error"} type - Tipo de mensaje
   */
  function showMessage(msg, type = "success") {
    statusMessage.textContent = msg;
    statusMessage.className = `status-message ${type}-message`;
  }

  // Botón Editar → ir a edición de perfil
  editBtn.addEventListener("click", () => {
    window.location.href = "profile_edit.html";
  });

  // Botón Eliminar cuenta
  deleteBtn.addEventListener("click", async () => {
    const confirmar = confirm(
      "¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
    );
    if (!confirmar) return;

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
        window.location.href = "sign_up.html";
      }, 2000);
    } catch (error) {
      console.error("Error eliminando la cuenta:", error);
      showMessage("No se pudo eliminar la cuenta. Intenta de nuevo.", "error");
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

    showMessage("Perfil cargado correctamente.", "success");
  } catch (error) {
    console.error("Error cargando perfil:", error);
    showMessage("No se pudo cargar tu perfil.", "error");
  }

  // Botón Volver → tareas
  backBtn.addEventListener("click", () => {
    window.location.href = "/task.html";
  });
});
