document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("navToggle");

  if (!sidebar || !toggleBtn) {
    console.error("Sidebar elements not found");
    return;
  }

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
});
