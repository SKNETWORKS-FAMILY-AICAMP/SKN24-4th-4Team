// [추가] 이용약관 열기 전 회원가입 폼 입력값을 임시 저장하는 변수
let savedSignupState = null;

function openSignup() {
  let html = "";
  html = modalWrapper(`
      <div class="modal-title big">Sign up</div>
      <div class="form-field">
        <label>Nickname</label><input class="form-input" id="signupName" type="text" />
      </div>
      <div class="form-field">
        <label>Email address</label>
        <!--인증 버튼 -->
        <div class="input-btn-row">
          <input class="form-input" id="signupEmail" type="text" placeholder="example@gmail.com" />
          <button class="verify-btn" id="verifyEmailBtn">Verify</button>
        </div>
        <div class="error-text" id="emailError"></div>
        <!--인증 코드 입력-->
        <input class="form-input" id="verifyCode" type="text" placeholder="Enter verification code" />
      </div>
      <div class="form-field">
        <label>Password</label><input class="form-input" id="signupPw" type="password" placeholder="8–16 characters, letters, numbers, and symbols" />
        <div class="error-text" id="pwError"></div>
      </div>
      <div class="form-field">
        <label>Password Confirm</label><input class="form-input" id="signupPw2" type="password" />
        <div class="error-text" id="pw2Error"></div>
      </div>
      <div class="check-row">
        <input id="signupAgree" type="checkbox" />
        <span>I agree to <button class="linklike" onclick="openTerms()">Terms and Conditions (Required)</button></span>
      </div>
      <div style="text-align:center">
        <button class="primary-btn" id="signupSubmit">Sign up</button>
      </div>
    `, "medium");
    openModal(html);
    eventBind();
}

function openTerms(){
  // 이용약관으로 이동하기 전 현재 폼 입력값을 저장 —> 돌아올 때 복원하기 위함 추가
  savedSignupState = {
    name:       document.getElementById("signupName")?.value  || "",
    email:      document.getElementById("signupEmail")?.value || "",
    verifyCode: document.getElementById("verifyCode")?.value  || "",
    pw:         document.getElementById("signupPw")?.value    || "",
    pw2:        document.getElementById("signupPw2")?.value   || "",
  };

  let html = "";
  html = modalWrapper(`
        <div class="modal-title">Terms and Conditions</div>
      <div class="terms-box">
        <strong>1. Privacy Policy</strong><br /><br />
        Privacy Policy<br />
        Last Updated: [DATE]<br /><br />
        We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.<br /><br />
        1. Information We Collect<br />
        - Personal Information: name, email address, contact information<br />
        - Usage Data: IP address, browser type, device information, pages visited<br />
        - Input Data: any information you provide through the chatbot or forms
      </div>
      <div class="terms-box">
        <strong>2. Terms of Service </strong><br /><br />
        Terms of Service<br />
        Last Updated: [DATE]<br /><br />
        By using our service, you agree to the following terms.<br /><br />
        1. Use of Service<br />
        You agree to use the service only for lawful purposes and in accordance with these Terms.<br /><br />
        2. Service Description<br />
        We provide an AI-based chatbot for informational purposes. The information provided is not professional advice.
      </div>
      <div class="modal-actions">
        <button class="primary-btn" id="agreeTerms">Agree</button>
        <button class="secondary-btn" data-close>Cancel</button>
      </div>
    `, "large");
    openModal(html);
    eventBind();
}

function openSignin(){
    let html = "";
    html = modalWrapper(`
      <div class="modal-title big">Sign in</div>

      <div class="form-field">
        <label>Email address</label>
        <input class="form-input" id="signinEmail">
        <div class="error-text" id="signinEmailError"></div>
      </div>

      <div class="form-field">
        <label>Password</label>
        <input class="form-input" id="signinPw" type="password">
        <div class="error-text" id="signinPwError"></div>
      </div>

      <div style="text-align:center;margin-bottom:18px">
        <button class="ghost-btn" id="forgotPw">Did you forget your password?</button>
      </div>
      <div style="text-align:center"><button class="primary-btn" id="signinSubmit">Sign in</button></div>
    `, "medium");
    openModal(html);
    eventBind();
}

function eventBind() {
  //  정규식을 함수 상단으로 이동 — 실시간 검사 리스너와 제출 핸들러가 공유 추가함
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,16}$/;

  //  Sign Up 이메일 실시간 유효성 검사 — 유효하면 오류 문구 즉시 제거 추가함
  const signupEmailInput = document.getElementById("signupEmail");
  if (signupEmailInput) {
    signupEmailInput.addEventListener("input", () => {
      const emailError = document.getElementById("emailError");
      const val = signupEmailInput.value.trim();
      if (val && !emailRegex.test(val)) {
        emailError.textContent = "Please check the email format";
      } else {
        emailError.textContent = "";
      }
    });
  }

  //  Sign Up 비밀번호 실시간 유효성 검사 — 조건 충족 시 오류 문구 즉시 제거 추가
  const signupPwInput = document.getElementById("signupPw");
  if (signupPwInput) {
    signupPwInput.addEventListener("input", () => {
      const pwError = document.getElementById("pwError");
      const val = signupPwInput.value;
      if (val && !passwordRegex.test(val)) {
        pwError.textContent = "Please check the new password";
      } else {
        pwError.textContent = "";
      }
    });
  }

  // Sign Up 비밀번호 확인 실시간 유효성 검사 추가
  const signupPw2Input = document.getElementById("signupPw2");
  if (signupPw2Input) {
    signupPw2Input.addEventListener("input", () => {
      const pw2Error = document.getElementById("pw2Error");
      const pw = document.getElementById("signupPw")?.value;
      const val = signupPw2Input.value;
      if (val && val !== pw) {
        pw2Error.textContent = "Password does not match."; //  문구 변경 수정
        signupPw2Input.classList.add("input-error");
      } else {
        pw2Error.textContent = "";
        signupPw2Input.classList.remove("input-error");
      }
    });
  }

  // Sign In 이메일 실시간 유효성 검사 —> 유효하면 오류 문구 즉시 제거 추가
  const signinEmailInput = document.getElementById("signinEmail");
  if (signinEmailInput) {
    signinEmailInput.addEventListener("input", () => {
      const emailError = document.getElementById("signinEmailError");
      const val = signinEmailInput.value.trim();
      if (val && !emailRegex.test(val)) {
        emailError.textContent = "Please check the email format";
        signinEmailInput.classList.add("input-error");
      } else {
        emailError.textContent = "";
        signinEmailInput.classList.remove("input-error");
      }
    });
  }

  //  Sign In 비밀번호 실시간 유효성 검사 — > 입력하면 오류 문구 즉시 제거 추가
  const signinPwInput = document.getElementById("signinPw");
  if (signinPwInput) {
    signinPwInput.addEventListener("input", () => {
      const pwError = document.getElementById("signinPwError");
      if (signinPwInput.value) {
        pwError.textContent = "";
        signinPwInput.classList.remove("input-error");
      }
    });
  }

  const signupSubmit = document.getElementById("signupSubmit");
  if (signupSubmit) {
    signupSubmit.addEventListener("click", () => {
      const emailInput = document.getElementById("signupEmail");
      const pwInput = document.getElementById("signupPw");
      const pw2Input = document.getElementById("signupPw2");
      const agreed = document.getElementById("signupAgree")?.checked;

      const emailError=document.getElementById("emailError")
      const pwError=document.getElementById("pwError")
      const pw2Error=document.getElementById("pw2Error")

      const email = emailInput.value.trim();
      const pw = pwInput.value;
      const pw2 = pw2Input.value;

      // 초기화
      emailError.textContent = "";
      pwError.textContent = "";
      pw2Error.textContent = "";

      emailInput.classList.remove("input-error");
      pwInput.classList.remove("input-error");
      pw2Input.classList.remove("input-error");

      // 약관 체크
      if (!agreed) return showAlert("Please agree to Terms and Conditions.");

      // 이메일 검사 — [수정] 틀리면 인라인 오류 + 팝업 동시 표시 후 즉시 반환
      if (!emailRegex.test(email)) {
        emailError.textContent = "Please check the email format";
        emailInput.classList.add("input-error");
        showAlert("Please check the email format.");
        return;
      }

      // 비밀번호 검사
      if (!passwordRegex.test(pw)) {
        pwError.textContent = "Please check the new password";
        pwInput.classList.add("input-error");
        return;
      }

      // 비밀번호 확인 검사 — [수정] 문구 변경 + 팝업 추가
      //if (pw !== pw2) return showAlert("Password does not match.");
      if (pw2 === "" || pw !== pw2) {
        pw2Error.textContent = "Password does not match.";
        pw2Input.classList.add("input-error");
        showAlert("Password does not match.");
        return;
      }

      closeModal();
      showAlert("Sign up completed.");
    });
  }

  // 인증 버튼 이벤트 //
  const verifyEmailBtn = document.getElementById("verifyEmailBtn");
  if (verifyEmailBtn) {
    verifyEmailBtn.addEventListener("click", () => {
      const email = document.getElementById("signupEmail").value.trim();
      // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // [수정] 상단 공유 변수로 대체
      const emailError = document.getElementById("emailError");
      if (!emailRegex.test(email)) {
        emailError.textContent = "Please check the email format";
        return;
      }
      emailError.textContent = "";
      // [수정] 인증 메일 발송 후 안내 팝업 문구 변경
      showAlert("Please check your email<br> for the verification code and enter it below.");
    });
  }

  const forgotPw = document.getElementById("forgotPw");
  if (forgotPw) {
    forgotPw.addEventListener("click", () => {
      showAlert("A temporary password has been sent to an<br>email created by the system.");
    });
  }

const signinSubmit = document.getElementById("signinSubmit");
if (signinSubmit) {
  signinSubmit.addEventListener("click", () => {
    const emailInput = document.getElementById("signinEmail");
    const pwInput = document.getElementById("signinPw");
    const emailError = document.getElementById("signinEmailError");
    const pwError = document.getElementById("signinPwError");

    const email = emailInput.value.trim();
    const pw = pwInput.value;
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // [수정] 상단 공유 변수로 대체

    let isValid = true;

    emailError.textContent = "";
    pwError.textContent = "";

    emailInput.classList.remove("input-error");
    pwInput.classList.remove("input-error");

    if (!email) {
      emailError.textContent = "Please enter your email";
      emailInput.classList.add("input-error");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      emailError.textContent = "Please check the email format";
      emailInput.classList.add("input-error");
      showAlert("Please check the email format."); // 이메일 형식 오류 시 팝업 표시 추가
      isValid = false;
    }

    if (!pw) {
      // pwError.textContent = "Please enter your password"; // 비밀번호 안내 문구 미사용 수정
      // pwInput.classList.add("input-error");
      isValid = false;
    }

    if (!isValid) return;

    closeModal();
    window.location.href = "./chat";
  });
}

  const agreeTerms = document.getElementById("agreeTerms");
  if (agreeTerms) {
    agreeTerms.addEventListener("click", () => {
      // 수정 closeModal() 대신 openSignup()으로 회원가입 폼 복귀 후 체크박스 체크
      // closeModal(); -> 모달이 닫혀 signupAgree 요소가 없어서 체크 불가했음
      openSignup();

      // 이용약관 열기 전 저장해 둔 입력값 복원
      if (savedSignupState) {
        const f = savedSignupState;
        const get = (id) => document.getElementById(id);
        if (get("signupName"))  get("signupName").value  = f.name;
        if (get("signupEmail")) get("signupEmail").value = f.email;
        if (get("verifyCode"))  get("verifyCode").value  = f.verifyCode;
        if (get("signupPw"))    get("signupPw").value    = f.pw;
        if (get("signupPw2"))   get("signupPw2").value   = f.pw2;

        // 닉네임 x -> 팝업 표시 후 체크박스 체크 없이 복귀
        if (!f.name.trim()) {
          savedSignupState = null;
          showAlert("Please enter a nickname to continue.");
          return;
        }

        savedSignupState = null; // 복원 완료 후 초기화
      }

      const agreeCheckbox = document.getElementById("signupAgree");
      if (agreeCheckbox) agreeCheckbox.checked = true;
    });
  }

}