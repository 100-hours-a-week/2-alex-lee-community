document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    //HACK: 테스트를 위한 코드
    if (email === "test@example.com" && password === "1234") {
        alert("로그인 성공!");
    } else {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
});

document.querySelector(".signup-btn").addEventListener("click", function() {
    window.location.href = "signup.html";
});
