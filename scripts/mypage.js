document.addEventListener("DOMContentLoaded", () => {
    // 드롭다운 메뉴 토글
    const headerIcon = document.getElementById("headerIcon");
    const profileMenu = document.getElementById("profileMenu");
  
    headerIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (profileMenu.style.display === "block") {
        profileMenu.style.display = "none";
      } else {
        profileMenu.style.display = "block";
      }
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
      alert("비밀번호수정 페이지로 이동 (예시)");
    });
  
    logoutBtn.addEventListener("click", () => {
      alert("로그아웃 되었습니다. (예시)");
    });
  
  
    const profileImageInput = document.getElementById("profileImage");
    profileImageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (event) => {
        const profileCircle = document.querySelector(".profile-circle");
        profileCircle.style.backgroundImage = `url(${event.target.result})`;
        profileCircle.style.backgroundSize = "cover";
        profileCircle.style.backgroundPosition = "center";
      };
      reader.readAsDataURL(file);
    });
  
    const userInfoForm = document.getElementById("userInfoForm");
    userInfoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("회원정보가 수정되었습니다!");
      window.location.href = "main.html";
    });
  
    // 회원 탈퇴 버튼
    const withdrawBtn = document.getElementById("withdrawBtn");
    withdrawBtn.addEventListener("click", () => {
      if (confirm("정말 회원탈퇴 하시겠습니까?")) {
        alert("회원탈퇴 처리되었습니다 (예시).");
        window.location.href = "login.html";
      }
    });
  
    const completeBtn = document.getElementById("completeBtn");
    completeBtn.addEventListener("click", () => {
      alert("수정이 완료되었습니다!");
      window.location.href = "main.html";
    });
  });
  