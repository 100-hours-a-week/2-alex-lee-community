document.addEventListener("DOMContentLoaded", () => {
    const headerIcon = document.getElementById("headerIcon");
    const profileMenu = document.getElementById("profileMenu");
  
    headerIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.style.display = (profileMenu.style.display === "block") ? "none" : "block";
    });
  
    document.addEventListener("click", () => {
      profileMenu.style.display = "none";
    });
    profileMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  
    const editInfoBtn = document.getElementById("editInfoBtn");
    const changePwBtn = document.getElementById("changePwBtn");
    const logoutBtn = document.getElementById("logoutBtn");
  
    editInfoBtn.addEventListener("click", () => {
        window.location.href = "mypage.html";
    });
  
    changePwBtn.addEventListener("click", () => {
        window.location.href = "changePw.html";
    });
  
    logoutBtn.addEventListener("click", () => {
      alert("Logged out (example).");
 
    });
  
    const changePwForm = document.getElementById("changePwForm");
    changePwForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const currentPassword = document.getElementById("currentPassword").value.trim();
      const newPassword = document.getElementById("newPassword").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();
  
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("New passwords do not match!");
        return;
      }
  
      alert("Password changed successfully!");
      window.location.href = "main.html";
    });
  });
  