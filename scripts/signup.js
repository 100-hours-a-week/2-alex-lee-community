const profileImageInput = document.getElementById("profileImage");
const profileHelperText = document.getElementById("profileHelperText");
const signupEmail = document.getElementById("signupEmail");
const emailHelperText = document.getElementById("emailHelperText");
const signupPassword = document.getElementById("signupPassword");
const passwordHelperText = document.getElementById("passwordHelperText");
const signupPasswordCheck = document.getElementById("signupPasswordCheck");
const passwordCheckHelperText = document.getElementById("passwordCheckHelperText");
const signupNickname = document.getElementById("signupNickname");
const nicknameHelperText = document.getElementById("nicknameHelperText");
const signupForm = document.getElementById("signupForm");
const signupBtn = document.getElementById("signupBtn");
const toLoginBtn = document.getElementById("toLoginBtn");

const emailRegex = /^[A-Za-z\.]+@[A-Za-z\.]+\.[A-Za-z\.]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,20}$/;
const nicknameRegex = /^[^\s]{1,10}$/;

let profileImageData = "";

// 유효성 검사 함수들
function validateEmail(email) {
  if (!emailRegex.test(email)) {
    emailHelperText.textContent = "올바른 이메일 형식이 아닙니다. (영문, @, .만 사용)";
    return false;
  }
  emailHelperText.textContent = "";
  return true;
}

function validatePassword(password) {
  if (!passwordRegex.test(password)) {
    passwordHelperText.textContent = "8~20자, 대문자/소문자/특수문자 각각 최소 1개 이상 포함";
    return false;
  }
  passwordHelperText.textContent = "";
  return true;
}

function validatePasswordCheck(password, passwordCheck) {
  if (password !== passwordCheck) {
    passwordCheckHelperText.textContent = "비밀번호가 일치하지 않습니다.";
    return false;
  }
  passwordCheckHelperText.textContent = "";
  return true;
}

function validateNickname(nickname) {
  if (!nicknameRegex.test(nickname)) {
    nicknameHelperText.textContent = "공백 없이 최대 10자까지 가능합니다.";
    return false;
  }
  nicknameHelperText.textContent = "";
  return true;
}

// 모든 유효성 검사 후 버튼 활성화
async function validateAll() {
  const emailValue = signupEmail.value.trim();
  const passwordValue = signupPassword.value;
  const passwordCheckValue = signupPasswordCheck.value;
  const nicknameValue = signupNickname.value.trim();

  const isEmailValid = validateEmail(emailValue);
  const isPasswordValid = validatePassword(passwordValue);
  const isPasswordCheckValid = validatePasswordCheck(passwordValue, passwordCheckValue);
  const isNicknameValid = validateNickname(nicknameValue);

  const allValid = isEmailValid && isPasswordValid && isPasswordCheckValid && isNicknameValid;
  if (allValid) {
    signupBtn.disabled = false;
    signupBtn.classList.add("active");
  } else {
    signupBtn.disabled = true;
    signupBtn.classList.remove("active");
  }
}

// 회원가입 API 호출
async function signupApi(email, password, nickname, profileImage) {
  try {
    const response = await fetch('http://localhost:8080/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        nickname,
        profile_image: profileImage
      })
    });

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    alert("네트워크 오류 발생했습니다.");
    return {
      status: 500,
      data: { code: "ISE", message: "Internal Server Error." }
    };
  }
}

// 입력값 변화 시 유효성 검사
[signupEmail, signupPassword, signupPasswordCheck, signupNickname].forEach(input =>
  input.addEventListener("input", () => {
    validateAll();
  })
);

// 회원가입 폼 제출 이벤트 처리
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await validateAll();
  if (signupBtn.disabled) return;

  const emailValue = signupEmail.value.trim();
  const passwordValue = signupPassword.value;
  const nicknameValue = signupNickname.value.trim();
  const profileImageValue = profileImageData || "";

  const result = await signupApi(emailValue, passwordValue, nicknameValue, profileImageValue);

  switch (result.data.code) {
    case "SU":
      alert("회원가입이 성공적으로 완료되었습니다!");
      window.location.href = "login.html";
      break;
    case "DUP":
      alert("이미 등록된 이메일입니다.");
      emailHelperText.textContent = "이미 사용 중인 이메일입니다.";
      break;
    case "BR":
      alert("입력값이 잘못되었습니다. 다시 확인해주세요.");
      break;
    case "ISE":
    default:
      alert("서버 오류로 회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
      break;
  }
});

// 프로필 이미지 업로드 처리
profileImageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    profileImageData = event.target.result;
    const profileCircle = document.querySelector(".profile-circle");
    profileCircle.style.backgroundImage = `url(${profileImageData})`;
    profileCircle.style.backgroundSize = "cover";
    profileCircle.style.backgroundPosition = "center";
    document.querySelector(".plus-icon").style.display = "none";
  };
  reader.readAsDataURL(file);
});

// 로그인 페이지 이동
toLoginBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});
