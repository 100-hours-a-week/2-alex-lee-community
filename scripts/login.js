// 즉시 실행 함수(IIFE)로 전역 오염을 최소화하고 함수형 프로그래밍 스타일을 적용
(() => {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const signupBtn = document.querySelector(".signup-btn");
  
    // 쿠키 저장 함수 (유효기간 없이 저장하여 세션 쿠키로 사용)
    const setCookie = (name, value) => {
      document.cookie = name + "=" + encodeURIComponent(value) + "; path=/";
    };
  
    // 로그인 API 호출 함수 (Async/Await 사용)
    const loginApi = async (email, password) => {
      try {
        const response = await fetch("/users/signin", {
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
  
    // 로그인 폼 제출 이벤트 처리 (익명함수 활용)
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      
      const result = await loginApi(email, password);
      if (result.data.code === "SU") {
        // user_id와 profil_image를 쿠키에 저장 (세션 쿠키)
        setCookie("user_id", result.data.user_id);
        setCookie("profil_image", result.data.profil_image);
        window.location.href = "main.html";
      } else {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    });
  
    // 회원가입 버튼 클릭 시 회원가입 페이지로 이동 (익명함수 활용)
    signupBtn.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  })();
  