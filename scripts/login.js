document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // 기본 제출 동작 방지

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "test@example.com" && password === "1234") {
        alert("로그인 성공!");
        // 로그인 후 메인 페이지로 이동 가능 (예: location.href = "main.html")
    } else {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
});

document.querySelector(".signup-btn").addEventListener("click", function() {
    alert("회원가입 페이지로 이동합니다.");
});
