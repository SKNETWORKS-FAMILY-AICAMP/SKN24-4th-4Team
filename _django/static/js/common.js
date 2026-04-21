function modalWrapper(inner, size = "medium") {
  return `
    <div class="backdrop" data-close></div>
    <section class="modal ${size}">
      <button class="close-btn" data-close><img src="/static/images/close.png" alt="close"></button>
      ${inner}
    </section>
  `;
}

function openModal(type) {
  const root = document.getElementById("modal-root");
  let html = "";

  if (type === "terms") {
    html = modalWrapper(`
      <div class="modal-title">Terms and Conditions</div>
      <div class="terms-box">
        <strong>1. Privacy Policy (개인정보 처리방침)</strong><br><br>
        Privacy Policy<br>
        Last Updated: [DATE]<br><br>
        We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.<br><br>
        1. Information We Collect<br>
        - Personal Information: name, email address, contact information<br>
        - Usage Data: IP address, browser type, device information, pages visited<br>
        - Input Data: any information you provide through the chatbot or forms
      </div>
      <div class="terms-box">
        <strong>2. Terms of Service (이용약관)</strong><br><br>
        Terms of Service<br>
        Last Updated: [DATE]<br><br>
        By using our service, you agree to the following terms.<br><br>
        1. Use of Service<br>
        You agree to use the service only for lawful purposes and in accordance with these Terms.<br><br>
        2. Service Description<br>
        We provide an AI-based chatbot for informational purposes. The information provided is not professional advice.
      </div>
      <div class="modal-actions">
        <button class="primary-btn" id="agreeTerms">Agree</button>
        <button class="secondary-btn" data-close>Cancel</button>
      </div>
    `, "large");
  }

  if (type === "signup") {
    html = modalWrapper(`
      <div class="modal-title big">Sign up</div>
      <div class="form-field"><label>Name</label><input class="form-input" id="signupName"></div>
      <div class="form-field"><label>Email address</label><input class="form-input" id="signupEmail"></div>
      <div class="form-field"><label>Password</label><input class="form-input" id="signupPw" type="password"></div>
      <div class="form-field"><label>Password Confirm</label><input class="form-input" id="signupPw2" type="password"></div>
      <div class="check-row">
        <input id="signupAgree" type="checkbox">
        <span>I agree to <button class="linklike" data-open="terms">Terms and Conditions (Required)</button></span>
      </div>
      <div style="text-align:center"><button class="primary-btn" id="signupSubmit">Sign up</button></div>
    `, "medium");
  }

  if (type === "signin") {
    html = modalWrapper(`
      <div class="modal-title big">Sign in</div>
      <div class="form-field"><label>Email address</label><input class="form-input" id="signinEmail"></div>
      <div class="form-field"><label>Password</label><input class="form-input" id="signinPw" type="password"></div>
      <div style="text-align:center;margin-bottom:18px">
        <button class="ghost-btn" id="forgotPw">Did you forget your password?</button>
      </div>
      <div style="text-align:center"><button class="primary-btn" id="signinSubmit">Sign in</button></div>
    `, "medium");
  }

  if (type === "profile") {
    html = modalWrapper(`
      <div class="modal-title">User Information</div>
      <div class="form-field"><label>Name</label><input class="form-input" value="User Name"></div>
      <div class="form-field"><label>Email address</label><input class="form-input gray" value="user@example.com" disabled></div>
      <div class="hr"></div>
      <div class="form-field"><label>Password</label><input class="form-input" type="password"></div>
      <div class="form-field"><label>New Password</label><input class="form-input" type="password"></div>
      <div class="form-field"><label>New Password Confirm</label><input class="form-input" type="password"></div>
      <div style="text-align:center"><button class="primary-btn" id="saveProfile">Save</button></div>
    `, "medium");
  }

  if (type === "feedback") {
    html = modalWrapper(`
      <div class="modal-title">Please give us feedback</div>
      <button class="option-btn o1" data-rate="very satisfied">very satisfied</button>
      <button class="option-btn o2" data-rate="satisfied">satisfied</button>
      <button class="option-btn o3" data-rate="average">average</button>
      <button class="option-btn o4" data-rate="dissatisfied">dissatisfied</button>
      <button class="option-btn o5" data-rate="very dissatisfied">very dissatisfied</button>
      <div style="font-size:12px;margin:14px 0 10px">Please leave us valuable comments. It's a great help!</div>
      <textarea class="form-textarea" id="feedbackText"></textarea>
      <div style="height:18px"></div>
      <div style="text-align:center"><button class="primary-btn" id="feedbackSubmit">Submit</button></div>
    `, "medium");
  }

  if (type === "alert") {
    html = modalWrapper(`
      <div class="alert-text" id="alertText"></div>
      <button class="primary-btn" data-close>Confirm</button>
    `, "small");
  }

  root.innerHTML = html;
  bindModalEvents();
}

function closeModal() {
  document.getElementById("modal-root").innerHTML = "";
}

function showAlert(message) {
  openModal("alert");
  const target = document.getElementById("alertText");
  if (target) target.innerHTML = message;
}

function bindPageEvents() {
  document.querySelectorAll("[data-nav]").forEach(el => {
    el.addEventListener("click", () => navigate(el.dataset.nav));
  });

  document.querySelectorAll("[data-open]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(el.dataset.open);
    });
  });

  document.querySelectorAll("[data-insurance]").forEach(el => {
    el.addEventListener("click", () => {
      state.insurance = el.dataset.insurance;
      navigate("select");
    });
  });

  document.querySelectorAll("[data-fill]").forEach(el => {
    el.addEventListener("click", () => {
      state.suggestion = el.dataset.fill;
      const input = document.getElementById("chatInput");
      if (input) input.value = state.suggestion;
      document.querySelectorAll(".chip, .prompt-pill").forEach(x => x.classList.remove("active"));
      if (el.classList.contains("chip")) el.classList.add("active");
    });
  });

  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      state.attachedFile = file ? file.name : "";
      navigate("chat-attach");
    });
  }

  const sendBtn = document.getElementById("sendBtn");
  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      const input = document.getElementById("chatInput");
      const text = input ? input.value.trim() : "";
      if (text) state.suggestion = text;
      if (state.attachedFile) return navigate("chat-attach");
      if (suggestions.includes(state.suggestion)) return navigate("chat-suggest");
      return navigate("chat-chat");
    });
  }
}

function bindModalEvents() {
  document.querySelectorAll("[data-close]").forEach(el => {
    el.addEventListener("click", closeModal);
  });

  document.querySelectorAll("[data-open]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(el.dataset.open);
    });
  });

  const agreeTerms = document.getElementById("agreeTerms");
  if (agreeTerms) {
    agreeTerms.addEventListener("click", () => {
      const cb = document.getElementById("signupAgree");
      if (cb) cb.checked = true;
      closeModal();
    });
  }

  const signupSubmit = document.getElementById("signupSubmit");
  if (signupSubmit) {
    signupSubmit.addEventListener("click", () => {
      const email = document.getElementById("signupEmail").value.trim();
      const pw = document.getElementById("signupPw").value;
      const pw2 = document.getElementById("signupPw2").value;
      const agreed = document.getElementById("signupAgree").checked;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!agreed) return showAlert("Please agree to Terms and Conditions.");
      if (!emailRegex.test(email)) return showAlert("Please check the email format.");
      if (pw !== pw2) return showAlert("Password does not match.");

      closeModal();
      showAlert("Sign up completed.");
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
      closeModal();
      navigate("select");
    });
  }

  const saveProfile = document.getElementById("saveProfile");
  if (saveProfile) {
    saveProfile.addEventListener("click", () => {
      closeModal();
      showAlert("User information saved.");
    });
  }

  document.querySelectorAll("[data-rate]").forEach(el => {
    el.addEventListener("click", () => {
      state.rating = el.dataset.rate;
      document.querySelectorAll("[data-rate]").forEach(x => x.classList.remove("active"));
      el.classList.add("active");
    });
  });

  const feedbackSubmit = document.getElementById("feedbackSubmit");
  if (feedbackSubmit) {
    feedbackSubmit.addEventListener("click", () => {
      if (!state.rating) return showAlert("Please select a satisfaction level.");
      closeModal();
      showAlert("Feedback submitted.");
    });
  }
}