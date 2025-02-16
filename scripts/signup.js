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

async function validateAll() {
  const emailValue = signupEmail.value.trim();
  const passwordValue = signupPassword.value;
  const passwordCheckValue = signupPasswordCheck.value;
  const nicknameValue = signupNickname.value.trim();

  const isEmailValid = validateEmail(emailValue);
  const isPasswordValid = validatePassword(passwordValue);
  const isPasswordCheckValid = validatePasswordCheck(passwordValue, passwordCheckValue);
  const isNicknameValid = validateNickname(nicknameValue);

  const allValid = 
    isEmailValid && 
    !isEmailDuplicate && 
    isPasswordValid && 
    isPasswordCheckValid && 
    isNicknameValid && 
    !isNicknameDuplicate;

  if (allValid) {
    signupBtn.disabled = false;
    signupBtn.classList.add("active");
  } else {
    signupBtn.disabled = true;
    signupBtn.classList.remove("active");
  }
}

[signupEmail, signupPassword, signupPasswordCheck, signupNickname].forEach(input => {
  input.addEventListener("input", () => {
    validateAll();
  });
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  await validateAll();
  if (signupBtn.disabled) return;

  alert("회원가입이 성공적으로 완료되었습니다!");
  window.location.href = "login.html";
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
    document.querySelector(".plus-icon").style.display = "none";
  };
  reader.readAsDataURL(file);
});

toLoginBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});
