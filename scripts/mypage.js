document.addEventListener("DOMContentLoaded", () => {
  let updatedProfileImageUrl = "";

  const headerIcon = document.getElementById("headerIcon");
  const profileMenu = document.getElementById("profileMenu");
  const withdrawBtn = document.getElementById("withdrawBtn");
  const withdrawModal = document.getElementById("withdrawModal");
  const modalCancelBtn = document.getElementById("modalCancelBtn");
  const modalConfirmBtn = document.getElementById("modalConfirmBtn");
  const editInfoBtn = document.getElementById("editInfoBtn");
  const changePwBtn = document.getElementById("changePwBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userInfoForm = document.getElementById("userInfoForm");
  const completeBtn = document.getElementById("completeBtn");
  const profileImageInput = document.getElementById("profileImage");
  const profileChangeBtn = document.querySelector(".profile-change-btn");

  const showToast = (message) => {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => (toast.style.display = "none"), 2000);
  };

  const getCookie = (name) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  const profilImageFromCookie = getCookie("profil_image");
  if (profilImageFromCookie) {
    headerIcon.src = profilImageFromCookie;
  }

  // API: 유저 정보 가져오기
  const fetchUserInfo = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8080/users/${userId}`);
      return await res.json();
    } catch (e) {
      console.error("유저 정보 조회 실패:", e);
      return null;
    }
  };

  // API: 유저 정보 수정
  const updateUserInfo = async (userId, nickname, profileImage) => {
    const body = {
      user_id: userId,
      nickname: nickname
    };
    if (profileImage && profileImage.trim() !== "") {
      body.profile_image = profileImage;
    }
  
    const response = await fetch("http://localhost:8080/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  
    const result = await response.json();
    return result;
  };

  // API: 회원 탈퇴
  const deleteUser = async (userId) => {
    const response = await fetch("http://localhost:8080/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    });
    return await response.json();
  };

  // 메뉴 토글
  headerIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu.style.display =
      profileMenu.style.display === "block" ? "none" : "block";
  });
  document.addEventListener("click", () => (profileMenu.style.display = "none"));
  profileMenu.addEventListener("click", (e) => e.stopPropagation());

  editInfoBtn.addEventListener("click", () => (window.location.href = "mypage.html"));
  changePwBtn.addEventListener("click", () => (window.location.href = "changePw.html"));
  logoutBtn.addEventListener("click", () => alert("로그아웃 되었습니다."));

  // 프로필 이미지 변경 버튼
  profileChangeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    profileImageInput.click();
  });

  profileImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const profileCircle = document.querySelector(".profile-circle");
      profileCircle.style.backgroundImage = `url(${event.target.result})`;
      profileCircle.style.backgroundSize = "cover";
      profileCircle.style.backgroundPosition = "center";
      updatedProfileImageUrl = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  userInfoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("수정완료");
  });

  completeBtn.addEventListener("click", async () => {
    const nickname = document.getElementById("nickname").value.trim();
    const profileImage = updatedProfileImageUrl;
    const userId = parseInt(getCookie("user_id"));
  
    if (!userId) {
      alert("유저 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }
  
    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }
  
    try {
      const result = await updateUserInfo(userId, nickname, profileImage);
      if (result.code === "SU") {
        showToast("회원정보 수정 성공");
      } else {
        alert("회원정보 수정 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("네트워크 오류 발생");
    }
  });

  withdrawBtn.addEventListener("click", () => (withdrawModal.style.display = "flex"));
  modalCancelBtn.addEventListener("click", () => (withdrawModal.style.display = "none"));

  modalConfirmBtn.addEventListener("click", async () => {
    const userId = parseInt(getCookie("user_id"));
    if (!userId) {
      alert("유저 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }
    try {
      const result = await deleteUser(userId);
      if (result.code === "SU") {
        alert(result.message);
        window.location.href = "login.html";
      } else {
        alert("회원 탈퇴 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("네트워크 오류 발생");
    }
  });

  // 유저 정보 불러오기 (nickname 및 profileImage 적용)
  (async () => {
    const userId = parseInt(getCookie("user_id"));
    if (!userId) {
      alert("유저 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }
  
    const userInfo = await fetchUserInfo(userId);
    if (userInfo && userInfo.code === "SU") {
      document.querySelector(".static-email").textContent = userInfo.nickname;
      
      // 이 줄을 삭제하거나 주석 처리하세요
      // document.getElementById("nickname").value = userInfo.nickname;
    
      const profileCircle = document.querySelector(".profile-circle");
      if (userInfo.profileImage && userInfo.profileImage.trim() !== "") {
        profileCircle.style.backgroundImage = `url(${userInfo.profileImage})`;
      } else {
        profileCircle.style.backgroundImage = `url(../data/headerIcon.png)`;
      }
      profileCircle.style.backgroundSize = "cover";
      profileCircle.style.backgroundPosition = "center";
    } else {
      alert("회원 정보를 불러오지 못했습니다.");
    }
  })();
});