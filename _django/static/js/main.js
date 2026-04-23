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
  let html = "";
  html = modalWrapper(`
        <div class="modal-title">Terms and Conditions</div>
      <div class="terms-box">
        <strong>1. Privacy Policy (개인정보 처리방침)</strong><br /><br />
        Privacy Policy<br />
        Last Updated: [DATE]<br /><br />
        We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.<br /><br />
        1. Information We Collect<br />
        - Personal Information: name, email address, contact information<br />
        - Usage Data: IP address, browser type, device information, pages visited<br />
        - Input Data: any information you provide through the chatbot or forms
      </div>
      <div class="terms-box">
        <strong>2. Terms of Service (이용약관)</strong><br /><br />
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

      // 안내 표시
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,16}$/;
          
      let isValid = true;
      //초기화
      emailError.textContent = "";
      pwError.textContent = "";
      pw2Error.textContent = "";
      

      emailInput.classList.remove("input-error");
      pwInput.classList.remove("input-error");
      pw2Input.classList.remove("input-error");
      
      // 약관 체크
      if (!agreed) return showAlert("Please agree to Terms and Conditions.");
      //이메일 검사
      if (!emailRegex.test(email)) {emailError.textContent = "Please check the email format";
        isValid = false;
      }
      // 비밀번호 검사
      if (!passwordRegex.test(pw)) {
        // 비밀번호 오류 문구 //
        pwError.textContent = "Please check the new password";
        isValid = false;
      }
      // 비밀번호 확인 검사
      //if (pw !== pw2) return showAlert("Password does not match.");
      if (pw2 === "" || pw !== pw2) {
        pw2Error.textContent = "Please check the new password";
        pw2Input.classList.add("input-error");
        isValid = false;
      }
      if (!isValid) return;

      closeModal();
      showAlert("Sign up completed.");
    });
  }

  // 인증 버튼 이벤트 //
  const verifyEmailBtn = document.getElementById("verifyEmailBtn");
  if (verifyEmailBtn) {
    verifyEmailBtn.addEventListener("click", () => {
      const email = document.getElementById("signupEmail").value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailError = document.getElementById("emailError");
      if (!emailRegex.test(email)) {
        emailError.textContent = "Please check the email format";
        return;
      }
      emailError.textContent = "";
      showAlert("Verification email has been sent.");
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      isValid = false;
    }

    if (!pw) {
      pwError.textContent = "Please enter your password";
      pwInput.classList.add("input-error");
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
      closeModal();
      const agreeCheckbox = document.getElementById("signupAgree");
      if (agreeCheckbox) agreeCheckbox.checked = true;
    });
  }

}