//  이용약관/개인정보 동의 상태와 회원가입 폼 데이터를 전역 변수로 보존
window.__agreements = window.__agreements || { terms: false, privacy: false };
window.__signupFormData = window.__signupFormData || { name: '', email: '', verifyCode: '', pw: '', pw2: '' };

// 이용약관 팝업 열기 전 현재 폼 데이터를 전역 변수에 저장하는 함수
function saveSignupData() {
  window.__signupFormData = {
    name: document.getElementById('signupName')?.value || '',
    email: document.getElementById('signupEmail')?.value || '',
    verifyCode: document.getElementById('verifyCode')?.value || '',
    pw: document.getElementById('signupPw')?.value || '',
    pw2: document.getElementById('signupPw2')?.value || '',
  };
}

// 수정-> openSignup: 단일 체크박스 -> 이용약관/개인정보 각각 분리된 2개 체크박스
// 수정-> 이용약관 팝업에서 돌아올 때 폼 데이터 및 동의 상태를 복원
function openSignup() {
  const d = window.__signupFormData;
  // 팝업에서 두 항목 모두 동의했으면 단일 체크박스를 미리 체크 상태로 렌더링
  const allAgreed = (window.__agreements.terms && window.__agreements.privacy) ? 'checked' : '';

  let html = modalWrapper(`
      <div class="modal-title big">Sign up</div>
      <div class="form-field">
        <label>Nickname</label><input class="form-input" id="signupName" type="text" />
        <!-- <div class="error-text" id="nameError"></div> -->
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
        <input id="signupAgree" type="checkbox" ${allAgreed} />
        <span>[Required] I agree to all <button class="linklike" onclick="saveSignupData();openTerms()">Terms &amp; Privacy Policy (View)</button></span>
      </div>
      <div style="text-align:center">
        <button class="primary-btn" id="signupSubmit">Sign up</button>
      </div>
    `, "medium");
  openModal(html);

  // 이용약관 팝업 → 회원가입 폼 복귀 시 입력 데이터 복원
  const nameEl = document.getElementById('signupName');
  const emailEl = document.getElementById('signupEmail');
  const verifyEl = document.getElementById('verifyCode');
  const pwEl = document.getElementById('signupPw');
  const pw2El = document.getElementById('signupPw2');
  if (nameEl && d.name) nameEl.value = d.name;
  if (emailEl && d.email) emailEl.value = d.email;
  if (verifyEl && d.verifyCode) verifyEl.value = d.verifyCode;
  if (pwEl && d.pw) pwEl.value = d.pw;
  if (pw2El && d.pw2) pw2El.value = d.pw2;

  [nameEl, emailEl, verifyEl, pwEl, pw2El].forEach((el) => {
    if (el) el.addEventListener('input', saveSignupData);
  });

  eventBind();
}

// 수정: openTerms ->단일 내용 박스 -> 이용약관/개인정보 각각 독립 체크박스 포함
// 수정: 내용을 실제 이용약관/개인정보 처리방침으로 교체 (영문)
// 수정: Agree 버튼 -> 두 체크박스 모두 체크해야 활성화
function openTerms() {
  let html = modalWrapper(`
      <button class="close-btn" id="cancelTerms" type="button"><img src="/static/images/close.png" alt="close"></button>
      <div class="modal-title">Terms &amp; Privacy Policy</div>

      <div class="terms-section-label">[Required] Terms of Service</div>
      <div class="terms-box scrollable">
        <strong>Article 1 (Purpose)</strong><br />
        These Terms govern the rights, obligations, and responsibilities of users and DACRE when using the AI chatbot and related services provided by DACRE.<br /><br />
        <strong>Article 2 (Member Registration and Account Management)</strong><br />
        1. Users apply for membership by completing the registration form and agreeing to these Terms.<br />
        2. Members are responsible for managing their own ID and password and must not allow third parties to use them. Suspected unauthorized use must be reported to the service immediately.<br />
        3. Members may request account deletion at any time, and the service will process it promptly.<br /><br />
        <strong>Article 3 (AI Service Use and Disclaimer)</strong><br />
        1. This service is an AI chatbot based on a large language model (LLM). Answers are generated from trained data and do not guarantee completeness, accuracy, or currency of information.<br />
        2. Answers on specialized topics (e.g., insurance products, historical facts) are for reference only and cannot serve as legally binding advice or evidence. Users must verify accuracy independently.<br />
        3. The service is not liable for damages caused by incorrect answers (hallucinations) or inappropriate responses due to AI technical limitations, unless there is intentional or gross negligence.<br /><br />
        <strong>Article 4 (User Obligations and Prohibited Activities)</strong><br />
        Users must not engage in the following activities:<br />
        1. Theft of others&#39; information or registration of false facts<br />
        2. Exploiting AI model vulnerabilities to overload the system or induce abnormal responses (e.g., prompt injection)<br />
        3. Entering sensitive personal information of oneself or third parties in the chat window<br />
        4. Infringing on the service&#39;s intellectual property rights or interfering with its operations
      </div>
      <div class="check-row terms-check-row">
        <input id="termsCheck" type="checkbox" ${window.__agreements.terms ? 'checked' : ''} />
        <span>[Required] I agree to the Terms of Service</span>
      </div>

      <div class="terms-section-label">[Required] Privacy Policy Collection &amp; Use</div>
      <div class="terms-box scrollable">
        DACRE collects the minimum personal information necessary for service provision and strives to protect the rights and interests of users.<br /><br />
        <table class="terms-table">
          <thead>
            <tr><th>Items Collected</th><th>Purpose</th><th>Retention Period</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Email address, password, nickname</td>
              <td>Member registration, identity verification, service guidance</td>
              <td>Until membership withdrawal</td>
            </tr>
            <tr>
              <td>Chatbot conversation records</td>
              <td>AI response optimization (RAG), service quality improvement &amp; error correction</td>
              <td>Until withdrawal or purpose achieved</td>
            </tr>
            <tr>
              <td>Access IP, cookies, service usage records</td>
              <td>Fraud prevention &amp; service analytics</td>
              <td>6 months (pursuant to applicable laws)</td>
            </tr>
          </tbody>
        </table>
        <br />
        <strong>Right to Refuse Consent</strong><br />
        Users have the right to refuse consent for the collection and use of personal information. However, refusal to consent to required items may restrict membership registration and service use.
      </div>
      <div class="check-row terms-check-row">
        <input id="privacyCheck" type="checkbox" ${window.__agreements.privacy ? 'checked' : ''} />
        <span>[Required] I agree to the Privacy Policy Collection &amp; Use</span>
      </div>

      <div class="modal-actions">
        <button class="primary-btn" id="agreeTerms">Agree</button>
        <button class="secondary-btn" id="cancelTermsBtn" type="button">Cancel</button>
      </div>
    `, "large", false);
  openModal(html);
  eventBind();
}

function openForgotPassword() {
  const html = modalWrapper(`
    <div class="modal-title big">Temporary Password</div>
    <div class="form-field">
      <label>Email address</label>
      <input class="form-input" id="resetPwEmail" type="text" placeholder="example@gmail.com" />
      <div class="error-text" id="resetPwEmailError"></div>
    </div>
    <div style="text-align:center">
      <button class="primary-btn" id="sendTempPwBtn">Submit</button>
    </div>
    <div style="text-align:center;margin-top:12px">
      <button class="ghost-btn" id="backToSigninBtn" type="button">Back to sign in</button>
    </div>
  `, "medium");

  openModal(html);
  eventBind();
}

function openSignin() {
  let html = modalWrapper(`
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

  function validateSignupPasswordConfirm() {
    const pwInput = document.getElementById("signupPw");
    const pw2Input = document.getElementById("signupPw2");
    const pw2Error = document.getElementById("pw2Error");
    if (!pwInput || !pw2Input || !pw2Error) return;

    if (pw2Input.value && pw2Input.value !== pwInput.value) {
      pw2Error.textContent = "Password does not match.";
      pw2Input.classList.add("input-error");
    } else {
      pw2Error.textContent = "";
      pw2Input.classList.remove("input-error");
    }
  }

  // const signupNameInput = document.getElementById("signupName");
  // if (signupNameInput) {
  //   signupNameInput.addEventListener("input", () => {
  //     const nameError = document.getElementById("nameError");
  //     const val = signupNameInput.value.trim();
  //     if (val && !/^.{2,50}$/.test(val)) {
  //       nameError.textContent = "Please check the name format";
  //     } else {
  //       nameError.textContent = "";
  //     }
  //   });
  // }

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
      validateSignupPasswordConfirm();
    });
  }

  // Sign Up 비밀번호 확인 실시간 유효성 검사 추가
  const signupPw2Input = document.getElementById("signupPw2");
  if (signupPw2Input) {
    signupPw2Input.addEventListener("input", validateSignupPasswordConfirm);
  }

  // Sign In 이메일 실시간 유효성 검사
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

  // Sign In 비밀번호 실시간 유효성 검사
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
      const agreed = document.getElementById("signupAgree")?.checked;
      const allRequiredAgreed = !!(window.__agreements?.terms && window.__agreements?.privacy);

      const name = document.getElementById("signupName").value.trim();
      const email = emailInput.value.trim();
      const verifyCode = document.getElementById("verifyCode")?.value.trim() || "";
      const pw = pwInput.value;
      const pw2 = pw2Input.value;

      // 약관 동의 미체크 시 제출 차단
      if (!agreed || !allRequiredAgreed) return openAlert("Please agree to both required Terms and Privacy Policy.");

      try {
        await apiRequest("/auth/signup/", "POST", {
          user_nk: name,
          user_email: email,
          verify_code: verifyCode,
          user_pw: pw,
          user_pw_confirm: pw2,
          agree_terms: allRequiredAgreed
        });

        // 회원가입 완료 시 전역 상태 초기화
        window.__agreements = { terms: false, privacy: false };
        window.__signupFormData = { name: '', email: '', verifyCode: '', pw: '', pw2: '' };
        closeModal();
        openAlert("Registration completed successfully.", "./chat");
        // window.location.href = "./chat";
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

        openAlert("Please check your email<br>Enter your authentication code in 3 minutes and enter it below.");
      } catch (e) {
        console.error(e);
      }
    });
  }

  const forgotPw = document.getElementById("forgotPw");
  if (forgotPw) {
    forgotPw.addEventListener("click", () => {
      closeModal();
      openForgotPassword();
    });
  }

  const resetPwEmailInput = document.getElementById("resetPwEmail");
  if (resetPwEmailInput) {
    resetPwEmailInput.addEventListener("input", () => {
      const emailError = document.getElementById("resetPwEmailError");
      const val = resetPwEmailInput.value.trim();

      if (val && !emailRegex.test(val)) {
        emailError.textContent = "Please check the email format";
        resetPwEmailInput.classList.add("input-error");
      } else {
        emailError.textContent = "";
        resetPwEmailInput.classList.remove("input-error");
      }
    });
  }

  const sendTempPwBtn = document.getElementById("sendTempPwBtn");
  if (sendTempPwBtn) {
    sendTempPwBtn.addEventListener("click", async () => {
      const emailInput = document.getElementById("resetPwEmail");
      const emailError = document.getElementById("resetPwEmailError");
      const email = emailInput.value.trim();

      emailError.textContent = "";
      emailInput.classList.remove("input-error");

      if (!emailRegex.test(email)) {
        emailError.textContent = "Please check the email format";
        emailInput.classList.add("input-error");
        return;
      }

      try {
        await apiRequest("/auth/password/temp/", "POST", { user_email: email });
        closeModal();
        openAlert("A temporary password has been sent to your email.");
      } catch (e) {
        console.error(e);
      }
    });
  }

  const backToSigninBtn = document.getElementById("backToSigninBtn");
  if (backToSigninBtn) {
    backToSigninBtn.addEventListener("click", openSignin);
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

  // 이용약관 팝업 내 체크박스 이벤트: 두 박스 모두 체크 시 Agree 버튼 활성화
  const termsCheck = document.getElementById("termsCheck");
  const privacyCheck = document.getElementById("privacyCheck");
  const agreeTermsBtn = document.getElementById("agreeTerms");

  function updateAgreementState() {
    window.__agreements = {
      terms: !!termsCheck?.checked,
      privacy: !!privacyCheck?.checked
    };
  }

  if (termsCheck) termsCheck.addEventListener("change", updateAgreementState);
  if (privacyCheck) privacyCheck.addEventListener("change", updateAgreementState);

  const cancelTerms = document.getElementById("cancelTerms");
  const cancelTermsBtn = document.getElementById("cancelTermsBtn");
  if (cancelTerms && cancelTermsBtn) {
    cancelTerms.addEventListener("click", closeTermsAndReturnSignup);
    cancelTermsBtn.addEventListener("click", closeTermsAndReturnSignup);
  }

  // Agree 클릭 시 두 항목이 모두 선택되지 않았으면 알림만 띄우고 약관 팝업은 유지
  if (agreeTermsBtn) {
    agreeTermsBtn.addEventListener("click", () => {
      updateAgreementState();
      if (!window.__agreements.terms || !window.__agreements.privacy) {
        openAlert("Please agree to both required Terms and Privacy Policy.");
        return;
      }
      openSignup();
    });
  }
}

// 회원가입 폼 데이터와 동의 상태를 초기화하는 함수
function resetSignupState() {
  window.__signupFormData = {
    name: "",
    email: "",
    verifyCode: "",
    pw: "",
    pw2: ""
  };

  window.__agreements = {
    terms: false,
    privacy: false
  };
}

function closeTermsAndReturnSignup() {
  // saveSignupData();
  openSignup();
}