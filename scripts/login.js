(() => {
  // 로그인 관련 요소
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const signupBtn = document.querySelector(".signup-btn");

  // 쿠키 저장 함수
  const setCookie = (name, value) => {
    document.cookie = name + "=" + encodeURIComponent(value) + "; path=/";
  };

  // 로그인 API 호출
  const loginApi = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8080/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      alert("네트워크 오류 발생했습니다.");
    }
  };


  // 로그인 폼 이벤트
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
  
      const result = await loginApi(email, password);
  
      if (!result) return; // 네트워크 오류 등으로 응답 없을 경우 종료
  
      if (result.data.code === "SU") {
        setCookie("user_id", result.data.user_id);
        window.location.href = "main.html";
      } else if (result.data.code === "SF") {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (result.data.code === "ISE") {
        alert("서버 오류가 발생했습니다.");
      } else {
        alert("로그인에 실패했습니다.");
      }
    });
  }

  // 회원가입 버튼 클릭 시 이동
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  }
})();
