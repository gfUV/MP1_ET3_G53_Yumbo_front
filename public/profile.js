/**
 * This script manages the profile view functionality.
 * It loads the logged-in user's data from the backend,
 * displays it in the profile page, and provides navigation options.
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

   /**
   * Edit button listener
   * Redirects the user to the profile edit page.
   * @event click
   */
  editBtn.addEventListener("click", () => {
    window.location.href = "profile_edit.html"; 
  });

  try {
     /**
     * Step 1: Retrieve user ID from localStorage
     */
    const userId = localStorage.getItem("userId");
    console.log("User ID desde localStorage:", userId);

    if (!userId) {
      alert("❌ No se encontró el usuario en sesión");
      window.location.href = "sign_in.html";
      return;
    }

    /**
     * Step 2: Fetch user data from the backend
     * @type {Response}
     */
    const response = await fetch(`https://mp1-et3-g53-yumbo-back.onrender.com/api/v1/users/${userId}`);
    if (!response.ok) throw new Error("Error al cargar los datos del usuario");

    /**
     * Step 3: Parse response JSON into user object
     * @type {{ firstName: string, lastName: string, age: number|null, email: string|null, createdAt: string, updatedAt: string }}
     */
    const u = await response.json();
    console.log("Usuario recibido del backend:", u);

    const user = u;

    /**
     * Step 4: Render user data into HTML elements
     */
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
    console.error("❌ Error cargando perfil:", error);
    alert("❌ No se pudo cargar el perfil.");
  }

  /**
   * Back button listener
   * Redirects the user to the task page.
   * @event click
   */
  document.getElementById("back").addEventListener("click", () => {
    window.location.href = "/task.html";
  });
});
