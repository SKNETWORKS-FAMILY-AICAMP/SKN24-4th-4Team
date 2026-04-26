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
        <!--인증 코드-->
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,16}$/;

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

  // 조건 충족 시 오류 문구 즉시 제거
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
    signupSubmit.addEventListener("click", async () => {
      const emailInput = document.getElementById("signupEmail");
      const pwInput = document.getElementById("signupPw");
      const pw2Input = document.getElementById("signupPw2");

      const name = document.getElementById("signupName").value.trim();
      const email = emailInput.value.trim();
      const verifyCode = document.getElementById("verifyCode").value.trim();
      const pw = pwInput.value;
      const pw2 = pw2Input.value;
      const agreed = document.getElementById("signupAgree")?.checked;

      try {
        await apiRequest("/auth/signup/", "POST", {
          user_nk: name,
          user_email: email,
          verify_code: verifyCode,
          user_pw: pw,
          user_pw_confirm: pw2,
          agree_terms: agreed
        });

        closeModal();
        showAlert("Registration completed successfully.");
        window.location.href = "./chat";
      } catch (e) {
        console.error(e);
      }
    });
  }

  // 인증 버튼 이벤트
  const verifyEmailBtn = document.getElementById("verifyEmailBtn");
  if (verifyEmailBtn) {
    verifyEmailBtn.addEventListener("click", async () => {
      const email = document.getElementById("signupEmail").value.trim();
      const emailError = document.getElementById("emailError");

      if (!emailRegex.test(email)) {
        emailError.textContent = "Please check the email format";
        return;
      }

      emailError.textContent = "";

      try {
        await apiRequest("/auth/signup/verify-code/", "POST", {
          user_email: email
        });

        showAlert("Please check your email<br> for the verification code and enter it below.");
      } catch (e) {
        console.error(e);
      }
    });
  }
  const forgotPw = document.getElementById("forgotPw");
  if (forgotPw) {
    forgotPw.addEventListener("click", async () => {

      const email = document.getElementById("signinEmail").value.trim();

      try {
        await apiRequest("/auth/password/temp/", "POST", {
          user_email: email
        });

        showAlert("A temporary password has been sent to your email.");

      } catch(e){}
    });
  }

const signinSubmit = document.getElementById("signinSubmit");
if (signinSubmit) {
  signinSubmit.addEventListener("click", async () => {
    const email = document.getElementById("signinEmail").value.trim();
    const pw = document.getElementById("signinPw").value;

    try {
      const res = await apiRequest("/auth/login/", "POST", {
        user_email: email,
        user_pw: pw
      });

      closeModal();

      window.location.href = "./chat";

    } catch(e){}
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

        savedSignupState = null;
      }

      const agreeCheckbox = document.getElementById("signupAgree");
      if (agreeCheckbox) agreeCheckbox.checked = true;
    });
  }

}