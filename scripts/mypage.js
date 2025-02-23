document.addEventListener("DOMContentLoaded", () => {
  // 상태 관리: 수정된 프로필 이미지 Data URL
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

  // 토스트 메시지 표시 함수 (순수 함수)
  const showToast = (message) => {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => (toast.style.display = "none"), 2000);
  };
  

  // 쿠키에서 값을 가져오는 헬퍼 함수 (순수 함수)
  const getCookie = (name) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  const profilImageFromCookie = getCookie("profil_image");
  if (profilImageFromCookie) {
    headerIcon.src = profilImageFromCookie;
  }

  // API 호출 함수: 회원 정보 수정 (PATCH /users/information)
  const updateUserInfo = async (userId, nickname, profileImage) => {
    const response = await fetch("/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        nickname: nickname,
        profile_image: profileImage
      })
    });
    if (response.status === 201) return response.json();
    else return response.json();
  };

  // API 호출 함수: 회원 탈퇴 (DELETE /users)
  const deleteUser = async (userId) => {
    const response = await fetch("/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    });
    if (response.status === 201) return response.json();
    else return response.json();
  };

  // 헤더 아이콘 클릭 시 프로필 메뉴 토글
  headerIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
  });
  document.addEventListener("click", () => (profileMenu.style.display = "none"));
  profileMenu.addEventListener("click", (e) => e.stopPropagation());

  editInfoBtn.addEventListener("click", () => (window.location.href = "mypage.html"));
  changePwBtn.addEventListener("click", () => (window.location.href = "changePw.html"));
  logoutBtn.addEventListener("click", () => alert("로그아웃 되었습니다."));

  // '변경' 버튼 클릭 시 파일 선택창 호출 (순수 함수형 이벤트 핸들러)
  profileChangeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    profileImageInput.click();
  });

  // 파일 선택 후 프로필 이미지 업데이트 (FileReader 활용)
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

  // 회원 정보 수정 폼 제출 시 토스트 메시지("수정완료") 표시
  userInfoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("수정완료");
  });

  // "수정완료" 버튼 클릭 시 회원 정보 수정 API 호출
  completeBtn.addEventListener("click", async () => {
    const nickname = document.getElementById("nickname").value;
    const profileImage = updatedProfileImageUrl;
    const userId = parseInt(getCookie("user_id"));
    if (!userId) {
      alert("유저 정보가 없습니다. 다시 로그인해주세요.");
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

  // 회원 탈퇴 모달 처리
  withdrawBtn.addEventListener("click", () => (withdrawModal.style.display = "flex"));
  modalCancelBtn.addEventListener("click", () => (withdrawModal.style.display = "none"));
  
  // "확인" 버튼 클릭 시 회원 탈퇴 API 호출
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
        // 탈퇴 성공 후 로그인 페이지로 이동
        window.location.href = "login.html";
      } else {
        alert("회원 탈퇴 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("네트워크 오류 발생");
    }
  });
});
