const userInfoEl = document.getElementById("user-info");

let loginUser = {
  user_id: null,
  user_email: "",
  user_nk: "User Name",
  is_temp_pw: "N"
};

function loadLoginUserFromTemplate() {
  const userInfoEl = document.getElementById("user-info");

  if (userInfoEl) {
    loginUser = JSON.parse(userInfoEl.textContent);
  }
}

const chatState = {
  insurance: new URLSearchParams(location.search).get("insurance"),
  suggestion: "",
  screen:"",
  session_id:"",
  compare: new URLSearchParams(location.search).get("compare") === "true"
};

const insuranceAssets = {
  UnitedHealth: "/static/images/united_main.png",
  Cigna: "/static/images/cigna_chat.png",
  Tricare: "/static/images/tricare_main.png",
  "MSH China": "/static/images/msh_chat.png"
};

const suggestions = [
  "Pre authorization Requirement for Hospitalization",
  "Cost-Sharing Structure",
  "Mental Health Coverage",
  "Dental and Vision Coverage",
  "Outpatient Coverage Availability",
  "Emergency Medical Evacuation",
  "Annual Coverage Limit",
  "Maternity and Prenatal Coverage",
  "Coverage for Pre-existing Conditions",
  "Direct Billing Network Availability"
];

const exampleBotText = `
When the beneficiary receives treatment in their country of nationality, coverage must meet specific conditions.
This policy covers treatment costs only if the beneficiary is temporarily residing in their country of nationality.
Under these circumstances, the beneficiary's stay in their country of nationality is limited, and that period cannot be exceeded
[Source: CGHP Policy Rules CGIC EN 02_2026.pdf / Page: 4].
`;

function renderBottomInput() {
  let stage = document.getElementById("chat_stage");
  if (!stage) return;
  stage.innerHTML +=
  `
    <div class="bottom-input-wrap">
      <div class="bottom-input">
        <textarea class="chat-input" id="chatInput" placeholder="What would you like to know?"></textarea>
        <button class="send-btn" id="sendBtn">➤</button>
      </div>
    </div>
  `;
}

function conversationMarkup() {
  $("#chat_stage").html("");
  userMessageAppend(chatState.suggestion);
  botMessageAppend();
  renderBottomInput();
}

// 챗봇이 파일을 return 했을 때 메시지에 파일 첨부하는 함수
function fileMessageAppend(fileName="Claim.pdf", fileSize= "1.2 MB", fileType="PDF", filePath="/static/images/bot_profile.png") {
  $(".chat-view").append(`
      <div class="file-attachment-wrap">
        <button class="file-attachment" type="button" onclick="downloadAttachedFile('${filePath}')">
          <span class="file-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M7 3.75h6.2L18.25 8.8V20a1.25 1.25 0 0 1-1.25 1.25H7A1.25 1.25 0 0 1 5.75 20V5A1.25 1.25 0 0 1 7 3.75Z" stroke="currentColor" stroke-width="1.8"></path>
              <path d="M13 3.75V8.5h4.75" stroke="currentColor" stroke-width="1.8"></path>
            </svg>
          </span>
          <span class="file-meta">
            <span class="file-name">${fileName}</span>
            <span class="file-size">${fileType} · ${fileSize}</span>
          </span>
        </button>
      </div>`);
}

// 파일 다운로드 함수
function downloadAttachedFile(filePath) {
  const link = document.createElement("a");
  link.href = filePath;
  link.download = filePath.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// user 메시지 추가 함수
function userMessageAppend(message) {
  $("#chat_stage").append(`
      <div class="message-row right">
        <div class="message-bubble-right">
          ${message}
        </div>
    </div>`);
}

// bot 답변 추가 함수
function botMessageAppend(message = exampleBotText) {
  $("#chat_stage").append(`
      <div class="message-row left">
        <div style="width:100%">
          <div class="ask-line">
            <img src="/static/images/bot_profile.png" alt="Bot Avatar" class="ask-avatar">
            <div class="message-bubble-left" style="margin-top:10px">
              ${exampleBotText}
            </div>
          </div>
        </div>
      </div>
    `);
}

function botMessageTableAppend(message) {
}

function renderSelectCardScreen() {
  const stage = document.getElementById("chat_stage");
  if (!stage) return;
    stage.innerHTML = `
      <div class="insurance-title">Please select your insurance</div>
      <div class="insurance-grid" id="cards"></div>
      <div class="insurance-actions">
        <button class="primary-btn" onclick="selectInsurance()">Continue</button>
      </div>
    `;
  const cardsContainer = document.getElementById("cards");
  if (!cardsContainer) return;

  cardsContainer.innerHTML = Object.entries(insuranceAssets)
    .map(
      ([name, src]) => `
        <button class="insurance-card ${chatState.insurance === name ? "active" : ""}" data-insurance="${name}">
          <img src="${src}" alt="${name}">
        </button>
      `
    )
    .join("");
  bindChatEvents();
  return;
}

function submitChatMessage() {
  const textarea = document.getElementById("chatInput");
  const text = textarea ? textarea.value.trim() : "";
  if (!text) {
    showAlert("Please enter the contents.");
    return;
  }

  textarea.value = "";
  document.querySelectorAll(".chip, .prompt-pill").forEach((x) => { x.disabled = false; });
  chatState.suggestion = text;

  if (chatState.screen !== "chat-suggest") {
    chatState.screen = "chat-suggest";
    renderInsuranceChat();
  } else {
    addUserMessage(text);
  }
}

function bindChatInputEvents(sendHandler = submitChatMessage) {
  $("#sendBtn").off("click.chatSend").on("click.chatSend", sendHandler);

  $("#chatInput").off("keydown.chatSend").on("keydown.chatSend", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      $("#sendBtn").trigger("click");
    }
  });
}

function bindChatEvents() {
  bindModalEvents();

  // 최초 화면 보험 선택 이벤트
  document.querySelectorAll("[data-insurance]").forEach((el) => {
    el.addEventListener("click", () => {
      chatState.insurance = el.dataset.insurance;
      $('[data-insurance]').removeClass("active");
      el.classList.add("active");
    });
  });

  // 챗봇 질문 예시 클릭 이벤트: 하나 선택 시 나머지 추천 질문 비활성화
  document.querySelectorAll("[data-fill]").forEach((el) => {
    el.addEventListener("click", () => {
      if (el.disabled) return;

      chatState.suggestion = el.dataset.fill;
      const input = document.getElementById("chatInput");
      if (input) input.value = chatState.suggestion;

      document.querySelectorAll(".chip, .prompt-pill").forEach((x) => {
        x.classList.remove("active");
        if (x !== el) x.disabled = true;
      });
      el.classList.add("active");
      el.disabled = false;
    });
  });

  bindChatInputEvents();
}

function addUserMessage(message) {
  $("#chat_stage").append(`
    <div class="message-row right">
      <div class="message-bubble-right">
        ${message}
      </div>
    </div>`);
   // 챗봇 답변 예시 추가
   $("#chat_stage").append(`
    <div class="message-row left">
      <div style="width:100%">
        <div class="ask-line">
          <img src="/static/images/bot_profile.png" alt="Bot Avatar" class="ask-avatar">
          <div class="message-bubble-left" style="margin-top:10px">
            This is a sample answer to your question: "${message}". The actual answer will depend on the insurance policy details and may vary.  Please consult your insurance provider for accurate information.
          </div>
        </div>
      </div>
    </div>`);
}

function openProfile() {
  const html = modalWrapper(`
    <div class="modal-title">User Information</div>

    <div class="form-field">
      <label>Nick Name</label>
      <input class="form-input" id="profileNickname" value="${loginUser.user_nk || ""}" />
      <div class="error-text" id="profileNicknameError"></div>
    </div>

    <div class="form-field">
      <label>Email address</label>
      <input class="form-input gray" id="profileEmail" value="${loginUser.user_email || ""}" disabled />
    </div>

    <div class="hr"></div>

    <div class="form-field">
      <label>Password</label>
      <input class="form-input" id="profileCurrentPw" type="password" />
      <div class="error-text" id="profileCurrentPwError"></div>
    </div>

    <div class="form-field">
      <label>New Password</label>
      <input class="form-input" id="profileNewPw" type="password" placeholder="8–16 characters, letters, numbers and symbols" />
      <div class="error-text" id="profileNewPwError"></div>
    </div>

    <div class="form-field">
      <label>New Password Confirm</label>
      <input class="form-input" id="profileNewPwConfirm" type="password" />
      <div class="error-text" id="profileNewPwConfirmError"></div>
    </div>

    <div style="text-align:center">
      <button class="primary-btn" id="saveProfile">Save</button>
    </div>

    <div style="text-align:center">
      <button type="button" id="deleteAccountBtn" style="margin-top:10px;font-size:10px;color:gray;text-decoration:underline;background:none;border:0;cursor:pointer;">
        Delete Account
      </button>
    </div>
  `, "medium");

  openModal(html);

  const nicknameRegex = /^[A-Za-z0-9]{1,50}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,16}$/;

  const nicknameInput = document.getElementById("profileNickname");
  const currentPwInput = document.getElementById("profileCurrentPw");
  const newPwInput = document.getElementById("profileNewPw");
  const newPwConfirmInput = document.getElementById("profileNewPwConfirm");

  const nicknameError = document.getElementById("profileNicknameError");
  const currentPwError = document.getElementById("profileCurrentPwError");
  const newPwError = document.getElementById("profileNewPwError");
  const newPwConfirmError = document.getElementById("profileNewPwConfirmError");

  function validateProfilePasswordConfirm() {
    if (newPwConfirmInput.value && newPwConfirmInput.value !== newPwInput.value) {
      newPwConfirmError.textContent = "Password does not match";
      newPwConfirmInput.classList.add("input-error");
    } else {
      newPwConfirmError.textContent = "";
      newPwConfirmInput.classList.remove("input-error");
    }
  }

  nicknameInput.addEventListener("input", () => {
    if (nicknameInput.value && !nicknameRegex.test(nicknameInput.value.trim())) {
      nicknameError.textContent = "Please enter a nickname to continue";
      nicknameInput.classList.add("input-error");
    } else {
      nicknameError.textContent = "";
      nicknameInput.classList.remove("input-error");
    }
  });

  newPwInput.addEventListener("input", () => {
    if (newPwInput.value && !passwordRegex.test(newPwInput.value)) {
      newPwError.textContent = "Please check the new password";
      newPwInput.classList.add("input-error");
    } else {
      newPwError.textContent = "";
      newPwInput.classList.remove("input-error");
    }
    validateProfilePasswordConfirm();
  });

  newPwConfirmInput.addEventListener("input", validateProfilePasswordConfirm);

  document.getElementById("saveProfile").addEventListener("click", async () => {
    const nickname = nicknameInput.value.trim();
    const currentPw = currentPwInput.value;
    const newPw = newPwInput.value;
    const newPwConfirm = newPwConfirmInput.value;

    nicknameError.textContent = "";
    currentPwError.textContent = "";
    newPwError.textContent = "";
    newPwConfirmError.textContent = "";

    nicknameInput.classList.remove("input-error");
    currentPwInput.classList.remove("input-error");
    newPwInput.classList.remove("input-error");
    newPwConfirmInput.classList.remove("input-error");

    if (!nicknameRegex.test(nickname)) {
      nicknameError.textContent = "Please enter a nickname to continue";
      nicknameInput.classList.add("input-error");
      return;
    }

    const wantsPasswordChange = currentPw || newPw || newPwConfirm;

    if (wantsPasswordChange) {
      if (!currentPw) {
        currentPwError.textContent = "Please check the password";
        currentPwInput.classList.add("input-error");
        return;
      }

      if (!passwordRegex.test(newPw)) {
        newPwError.textContent = "Please check the new password";
        newPwInput.classList.add("input-error");
        return;
      }

      if (newPw !== newPwConfirm) {
        newPwConfirmError.textContent = "Password does not match";
        newPwConfirmInput.classList.add("input-error");
        return;
      }
    }

    try {
      await apiRequest("/user/nickname/", "POST", {
        user_nk: nickname
      });

      loginUser.user_nk = nickname;

      const userNameEl = document.getElementById("sidebarUserName");
      if (userNameEl) userNameEl.textContent = nickname;

      if (wantsPasswordChange) {
        await apiRequest("/user/password/", "POST", {
          current_pw: currentPw,
          new_pw: newPw,
          new_pw_confirm: newPwConfirm
        });

        loginUser.is_temp_pw = "N";
      }

      closeModal();
      showAlert("User information saved.");
    } catch (e) {
      console.error(e);
    }
  });

  document.getElementById("deleteAccountBtn").addEventListener("click", () => {
    openAlertSelect("Are you sure you want to delete your account?", "confirmWithdraw");
  });
}

async function confirmWithdraw() {
  try {
    await apiRequest("/user/withdraw/", "POST");
    closeAlert();
    closeModal();
    window.location.href = "/dacare/";
  } catch (e) {
    console.error(e);
  }
}

function openFeedback() {
  const html = modalWrapper(`
    <div class="modal-title">Please give us feedback</div>

    <button class="option-btn o1" data-rate="5">very satisfied</button>
    <button class="option-btn o2" data-rate="4">satisfied</button>
    <button class="option-btn o3" data-rate="3">average</button>
    <button class="option-btn o4" data-rate="2">dissatisfied</button>
    <button class="option-btn o5" data-rate="1">very dissatisfied</button>

    <div class="error-text" id="feedbackRatingError"></div>

    <div style="font-size:12px;margin:14px 0 10px">
      Please leave us valuable comments. It's a great help!
    </div>

    <textarea class="form-textarea" id="feedbackText" maxlength="1000"></textarea>
    <div class="error-text" id="feedbackTextError"></div>

    <div style="height:18px"></div>

    <div style="text-align:center">
      <button class="primary-btn" id="feedbackSubmit">Submit</button>
    </div>
  `, "medium");

  openModal(html);

  let selectedRating = null;

  document.querySelectorAll("[data-rate]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-rate]").forEach((x) => x.classList.remove("active"));
      btn.classList.add("active");
      selectedRating = Number(btn.dataset.rate);
      document.getElementById("feedbackRatingError").textContent = "";
    });
  });

  document.getElementById("feedbackSubmit").addEventListener("click", async () => {
    const feedbackText = document.getElementById("feedbackText").value.trim();
    const ratingError = document.getElementById("feedbackRatingError");
    const textError = document.getElementById("feedbackTextError");

    ratingError.textContent = "";
    textError.textContent = "";

    if (!selectedRating) {
      ratingError.textContent = "Please select a satisfaction level.";
      return;
    }

    if (feedbackText.length > 1000) {
      textError.textContent = "Feedback must be within 1000 characters.";
      return;
    }

    try {
      await apiRequest("/feedback/create/", "POST", {
        satisfaction_level: selectedRating,
        feedback_content: feedbackText
      });

      closeModal();
      showAlert("Feedback submitted successfully.");
    } catch (e) {
      console.error(e);
    }
  });
}

function renderInsuranceChat() {
  $(".dropdown-label").attr("src", insuranceAssets[chatState.insurance]);

  const stage = document.getElementById("chat_stage");
  if (chatState.screen === "chat-suggest") {
    conversationMarkup();
  } else {
    stage.innerHTML = `
      <div class="center-stage">
        <div class="chat-empty-title">What are you curious about?</div>
        <div class="search-bar">
          <textarea id="chatInput" class="search-textarea" placeholder="What would you like to know?"></textarea>
          <button class="send-btn" id="sendBtn">➤</button>
        </div>
        <div class="prompt-row">
          <button class="prompt-pill" data-fill="Pre authorization Requirement for Hospitalization">Pre authorization Requirement for Hospitalization</button>
          <button class="prompt-pill" data-fill="Cost-Sharing Structure">Cost-Sharing Structure</button>
          <button class="prompt-pill" data-fill="Mental Health Coverage">Mental Health Coverage</button>
          <button class="prompt-pill" data-fill="Annual Coverage Limit">Annual Coverage Limit</button>
        </div>
      </div>
    `;
  }
  bindChatEvents();
  return;
}

function selectInsurance(){
  if(chatState.insurance) {
    window.location.href = "./chat?insurance=" + chatState.insurance;
  } else {
    showAlert("Please select an insurance plan to continue.");
  }
}

function renderCompareScreen(){
  const stage = document.getElementById("chat_stage");
  stage.innerHTML = `
    <section class="compare-area">
        <div class="message-row left">
          <div style="width:100%">
            <div class="ask-line">
            <img src="/static/images/bot_profile.png" alt="Bot Avatar" class="ask-avatar">
              <div class="message-bubble-left" style="margin-top:10px">
                Hello! let me help you with comparing. Which would you like to compare? Here are some examples.
              </div>
            </div>
          </div>
        </div>
        <div class="topic-grid" id="topicGrid">
        ${suggestions.map(topic => `<button class="topic-chip" data-topic="${topic}">${topic}</button>`).join("")}
          
        </div>
      </section>
    `;
    renderBottomInput()
    eventCompareBind()
}

function eventCompareBind() {
  const chips = document.querySelectorAll('.topic-chip');

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
      });
    });

    const textarea = document.getElementById('chatInput');
    bindChatInputEvents(function(){
      $("#topicGrid").addClass("hidden");
      const selectedTopics = [...document.querySelectorAll('.topic-chip.selected')].map((el) => el.dataset.topic);
      const message = textarea.value.trim();
      if (!message && selectedTopics.length === 0) return;
      textarea.value = '';
      const compareArea = document.querySelector('.compare-area');
      compareArea.innerHTML += `
      <div class="message-row right">
        <div class="message-bubble-right">
          ${message} - Selected Topics: ${selectedTopics.join(', ')}
        </div>
      </div>`;
      compareArea.innerHTML += `
      <div class="ask-line">
        <img src="/static/images/bot_profile.png" alt="Bot Avatar" class="ask-avatar">
        <div class="message-bubble-left" style="margin-top:10px">Here is the simplified comparison of the standard entry-level plans from the selected providers, based on your requested criteria. Data below is illustrative for reference:[UHCG_Global_Plus_Standard_2026.pdf p.14, Cigna_Global_Health_Options_Silver.pdf p.28
TRICARE_Overseas_Program_Handbook.pdf p.42, MSH_International_Policy_Rules_V8.pdf p.19]</div> 
      </div>`;
      compareArea.innerHTML += `
      <div class="table-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th>Comparison Criteria</th>
                <th>UHCG (Basic)</th>
                <th>Cigna (Silver)</th>
                <th>Tricare (Standard)</th>
                <th>MSH China (Standard)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Annual Coverage Limit</th>
                <td>$1,000,000</td>
                <td>$2,500,000</td>
                <td>Unlimited (Network)</td>
                <td>$1,500,000</td>
              </tr>
              <tr>
                <th>Cost-Sharing Structure</th>
                <td>$500 Deductible then 20% Coinsurance</td>
                <td>$200 Deductible, Direct Co-pay</td>
                <td>$0 Deductible (Prime Network), minimal co-pay</td>
                <td>$300 Deductible, Direct Billing at partner clinics</td>
              </tr>
              <tr>
                <th>Outpatient Coverage</th>
                <td>Full coverage, Direct Billing available</td>
                <td>Specialist Referral often required</td>
                <td>Direct Access (Network), Prior Auth for some</td>
                <td>Direct Billing at limited partner clinics</td>
              </tr>
              <tr>
                <th>Maternity and Prenatal Coverage</th>
                <td>10-month waiting period, standard coverage</td>
                <td>Covered after 6 months, incl. prenatal</td>
                <td>Standard coverage, Network dependent</td>
                <td>Covered up to $10,000 per pregnancy</td>
              </tr>
            </tbody>
          </table>
        </div>`;
    });
}

function compareTableAppend() {

}

function eventBind() {
  // 드롭다운버튼 이벤트
  $(".dropdown-item").click(function(){
      window.location.href = "./chat?insurance=" + $(this).text().trim();
  });

  $(".dropdown-trigger").click(function(){
    if ($(".dropdown-menu").hasClass("hidden")) {
      $(".dropdown-menu").removeClass("hidden");
    } else {
      $(".dropdown-menu").addClass("hidden");
    }
  });
}

function confirmDeleteHistory(event, button) {
  if (event) event.stopPropagation();

  const historyItem = button.closest(".history-item");
  if (!historyItem) return;

  const historyId = historyItem.dataset.historyId;
  if (!historyId) return;

  window.__selectedHistoryId = historyId;
  openAlertSelect("Are you sure you want to delete this history?", "deleteHistory");
}

function deleteHistory() {
  const historyId = window.__selectedHistoryId;
  if (!historyId) return;

  const historyItem = document.querySelector(`.history-item[data-history-id="${historyId}"]`);
  if (historyItem) {
    historyItem.remove();
  }

  window.__selectedHistoryId = null;
  closeAlert();
}

function openForceChangePasswordModal() {
  const html = modalWrapper(`
    <div class="modal-title">Change password</div>

    <div class="form-field">
      <label>Password</label>
      <input class="form-input" id="tempCurrentPw" type="password">
      <div class="error-text" id="tempCurrentPwError"></div>
    </div>

    <div class="form-field">
      <label>New Password</label>
      <input class="form-input" id="tempNewPw" type="password" placeholder="8–16 characters, letters, numbers and symbols">
      <div class="error-text" id="tempNewPwError"></div>
    </div>

    <div class="form-field">
      <label>New Password Confirm</label>
      <input class="form-input" id="tempNewPwConfirm" type="password">
      <div class="error-text" id="tempNewPwConfirmError"></div>
    </div>

    <div style="text-align:center">
      <button class="primary-btn" id="forcePasswordSave">Save</button>
    </div>
  `, "medium", false);

  openModal(html);
  showAlert("Please change your temporary password to continue using the service.");

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,16}$/;

  const currentPwInput = document.getElementById("tempCurrentPw");
  const newPwInput = document.getElementById("tempNewPw");
  const newPwConfirmInput = document.getElementById("tempNewPwConfirm");

  const currentPwError = document.getElementById("tempCurrentPwError");
  const newPwError = document.getElementById("tempNewPwError");
  const newPwConfirmError = document.getElementById("tempNewPwConfirmError");

  function validateTempPasswordConfirm() {
    if (newPwConfirmInput.value && newPwConfirmInput.value !== newPwInput.value) {
      newPwConfirmError.textContent = "Password does not match";
      newPwConfirmInput.classList.add("input-error");
    } else {
      newPwConfirmError.textContent = "";
      newPwConfirmInput.classList.remove("input-error");
    }
  }

  newPwInput.addEventListener("input", () => {
    if (newPwInput.value && !passwordRegex.test(newPwInput.value)) {
      newPwError.textContent = "Please check the new password";
      newPwInput.classList.add("input-error");
    } else {
      newPwError.textContent = "";
      newPwInput.classList.remove("input-error");
    }
    validateTempPasswordConfirm();
  });

  newPwConfirmInput.addEventListener("input", validateTempPasswordConfirm);

  document.getElementById("forcePasswordSave").addEventListener("click", async () => {
    const currentPw = currentPwInput.value;
    const newPw = newPwInput.value;
    const newPwConfirm = newPwConfirmInput.value;

    currentPwError.textContent = "";
    newPwError.textContent = "";
    newPwConfirmError.textContent = "";

    currentPwInput.classList.remove("input-error");
    newPwInput.classList.remove("input-error");
    newPwConfirmInput.classList.remove("input-error");

    if (!currentPw) {
      currentPwError.textContent = "Please check the password";
      currentPwInput.classList.add("input-error");
      return;
    }

    if (!passwordRegex.test(newPw)) {
      newPwError.textContent = "Please check the new password";
      newPwInput.classList.add("input-error");
      return;
    }

    if (newPw !== newPwConfirm) {
      newPwConfirmError.textContent = "Password does not match";
      newPwConfirmInput.classList.add("input-error");
      return;
    }

    try {
      await apiRequest("/user/password/", "POST", {
        current_pw: currentPw,
        new_pw: newPw,
        new_pw_confirm: newPwConfirm
      });

      loginUser.is_temp_pw = "N";
      closeModal();
      showAlert("Password updated successfully.");
    } catch (e) {
      console.error(e);
    }
  });
}



document.addEventListener("DOMContentLoaded", () => {
  loadLoginUserFromTemplate();

  const userNameEl = document.getElementById("sidebarUserName");

  if (userNameEl) {
    userNameEl.textContent = loginUser.user_nk || "User Name";
  }

  if (chatState.insurance) {
    $(".dropdown-trigger").removeClass("hidden");
    renderInsuranceChat();
  } else if (chatState.compare) {
    renderCompareScreen();
  } else {
    renderSelectCardScreen();
  }

  eventBind();

  if (loginUser.is_temp_pw === "Y") {
    setTimeout(() => {
      openForceChangePasswordModal();
    }, 300);
  }
});