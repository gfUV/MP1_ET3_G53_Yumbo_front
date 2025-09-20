// Espera que el HTML cargue
document.addEventListener("DOMContentLoaded", () => {
  const aboutBtn = document.getElementById("about");

  if (aboutBtn) {
    aboutBtn.addEventListener("click", () => {
      // Redirige a la vista sobre nosotros
      window.location.href = "about_us.html";
    });
  }
});
