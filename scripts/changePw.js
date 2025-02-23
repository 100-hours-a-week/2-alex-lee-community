// 쿠키에서 특정 이름의 값을 추출(순수함수)
const getCookie = name =>
  document.cookie
    .split('; ')
    .reduce((acc, curr) => {
      const [key, value] = curr.split('=');
      return key === name ? decodeURIComponent(value) : acc;
    }, '');

// 비밀번호 입력값 검증(순수함수)
const validatePasswords = (newPw, confirmPw) => {
  if (!newPw || !confirmPw) return "모든 필드를 입력해주세요.";
  if (newPw !== confirmPw) return "비밀번호가 일치하지 않습니다.";
  return "";
};

// 비밀번호 수정 API 호출 (Async/Await 사용)
const updatePassword = async (userId, newPassword) => {
  try {
    const response = await fetch('/users/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, password: newPassword })
    });
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    alert("네트워크 오류 발생했습니다.");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // 프로필 메뉴 토글 관련 이벤트 처리
  const headerIcon = document.getElementById("headerIcon");
  const profileMenu = document.getElementById("profileMenu");

  const profilImageFromCookie = getCookie("profil_image");
  if (profilImageFromCookie) {
    headerIcon.src = profilImageFromCookie;
  }

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

  // 내비게이션 버튼 이벤트 처리
  const editInfoBtn = document.getElementById("editInfoBtn");
  const changePwBtn = document.getElementById("changePwBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  editInfoBtn.addEventListener("click", () => window.location.href = "mypage.html");
  changePwBtn.addEventListener("click", () => window.location.href = "changePw.html");
  logoutBtn.addEventListener("click", () => alert("Logged out (example)."));

  // 비밀번호 수정 폼 제출 이벤트 처리
  const changePwForm = document.getElementById("changePwForm");
  changePwForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // 비밀번호 검증
    const validationError = validatePasswords(newPassword, confirmPassword);
    if (validationError) {
      alert(validationError);
      return;
    }

    // 쿠키에서 user_id 추출
    const userId = getCookie("user_id");
    if (!userId) {
      alert("유저 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    // API 호출하여 비밀번호 수정
    const result = await updatePassword(userId, newPassword);
    if (result.data.code === "SU") {
      alert("비밀번호 변경 성공했습니다.");
    } else {
      alert("비밀번호 변경 실패했습니다.");
    }
  });
});
