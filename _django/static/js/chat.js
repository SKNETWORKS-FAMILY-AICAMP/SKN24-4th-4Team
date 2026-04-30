const userInfoEl = document.getElementById("user-info");

let loginUser = {
  user_id: null,
  user_email: "",
  user_nk: "",
  is_temp_pw: ""
};

function loadLoginUserFromTemplate() {
  const userInfoEl = document.getElementById("user-info");

  if (userInfoEl) {
    loginUser = JSON.parse(userInfoEl.textContent);
  }
}

const chatState = {
  insurance: new URLSearchParams(location.search).get("insurance"),
  screen:"",
  chat_id:new URLSearchParams(location.search).get("chat_id"),
  session_id:"",
  compare: new URLSearchParams(location.search).get("compare") === "true"
};

const insuranceAssets = {
  UnitedHealth: "/static/images/united_main.png",
  Cigna: "/static/images/cigna_chat.png",
  Tricare: "/static/images/tricare_main.png",
  "MSH China": "/static/images/msh_chat.png"
};

// 보험사별 비교 시 추천 질문 리스트
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

// 챗봇 화면 하단 입력창 렌더링 함수
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
function botMessageAppend(message) {
  $("#chat_stage").append(`
      <div class="message-row left">
        <div style="width:100%">
          <div class="ask-line">
            <img src="/static/images/bot_profile.png" alt="Bot Avatar" class="ask-avatar">
            <div class="message-bubble-left" style="margin-top:10px">
              ${message}
            </div>
          </div>
        </div>
      </div>
    `);
}

// 보험 선택 화면 렌더링 함수
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

// sendBtn의 이벤트
function bindChatInputEvents(sendHandler = sendChatMessage) {
  $("#sendBtn").off("click.chatSend").on("click.chatSend", sendHandler);

  $("#chatInput").off("keydown.chatSend").on("keydown.chatSend", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      $("#sendBtn").trigger("click");
    }
  });
}

function bindFillEvents() {
  // 챗봇 질문 예시 클릭 이벤트: 하나 선택 시 나머지 추천 질문 비활성화
  document.querySelectorAll("[data-fill]").forEach((el) => {
    el.addEventListener("click", () => {
      const text = el.dataset.fill;
      const input = document.getElementById("chatInput");
      if (input) input.value = text;

      document.querySelectorAll(".chip, .prompt-pill").forEach((x) => {
        x.classList.remove("active");
        x.classList.add("disabled");
      });
      el.classList.add("active");
      el.classList.remove("disabled");
      el.disabled = false;
    });
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

  bindFillEvents();
  bindChatInputEvents();
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
    if (!nicknameInput.value || !nicknameRegex.test(nicknameInput.value.trim())) {
      nicknameError.textContent = "Please check the nickname";
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
      openAlert("User information saved.");
    } catch (e) {
      console.error(e);
    }
  });

  document.getElementById("deleteAccountBtn").addEventListener("click", () => {
  openWithdrawPasswordModal();
});
}

/* 즉시 탈퇴 -> password 입력 후 delete account까지 하도록 기능 추가함*/
/*탈퇴 확인*/
function openWithdrawPasswordModal() {
  const html = modalWrapper(`
    <div class="modal-title" style="margin-bottom:28px;">Delete Account</div>

    <div class="withdraw-message">
      To continue, please enter your password.<br><br>
      Please note that deleting your account is permanent and cannot be undone.
    </div>

    <div class="form-field">
      <input class="form-input" id="withdrawPassword" type="password" placeholder="Enter your password" />
      <div class="error-text" id="withdrawPasswordError"></div>
    </div>

    <div class="withdraw-btn-wrap">
      <button class="primary-btn" id="confirmWithdrawBtn">Delete Account</button>
      <button type="button" class="secondary-btn" id="cancelWithdrawBtn">Cancel</button>
    </div>
  `, "medium");

  openModal(html);

  const passwordInput = document.getElementById("withdrawPassword");
  const passwordError = document.getElementById("withdrawPasswordError");
  const confirmBtn = document.getElementById("confirmWithdrawBtn");
  const cancelBtn = document.getElementById("cancelWithdrawBtn");

  cancelBtn.addEventListener("click", closeModal);

  confirmBtn.addEventListener("click", async () => {
    const password = passwordInput.value.trim();

    passwordError.textContent = "";
    passwordInput.classList.remove("input-error");

    if (!password) {
      passwordError.textContent = "Please enter your password.";
      passwordInput.classList.add("input-error");
      return;
    }

    try {
      await confirmWithdraw(password);
    } catch (e) {
      passwordError.textContent = "Incorrect password. Please try again.";
      passwordInput.classList.add("input-error");
    }
  });
}

async function confirmWithdraw(password) {
  // 수정: 키 이름을 'password' → 'current_pw'로 변경 (서버 WithdrawForm 필드명과 일치)
  await apiRequest("/user/withdraw/", "POST", {
    current_pw: password
  });
  closeModal();
  // 수정: 즉시 redirect하면 사용자가 탈퇴 완료를 확인 못 함
  //       → 성공 알림 표시 후 Confirm 클릭 시 랜딩 페이지로 이동
  openAlert("Your account has been successfully deleted.");
  document.querySelector("#alert-root .primary-btn").addEventListener("click", () => {
    window.location.href = "/dacare/";
  });
}


function openFeedback() {
  const html = modalWrapper(`
    <div class="withdraw-modal">
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

    <div style="text-align:right;font-size:12px;color:#777;margin-top:4px">
      <span id="feedbackCount">0</span>/1000
    </div>

    <div class="error-text" id="feedbackTextError"></div>
    <div style="height:18px"></div>

    <div style="text-align:center">
      <button class="primary-btn" id="feedbackSubmit">Submit</button>
    </div>
  `, "medium");

  openModal(html);

  const feedbackTextInput = document.getElementById("feedbackText");
  const feedbackCount = document.getElementById("feedbackCount");

  if (feedbackTextInput && feedbackCount) {
    feedbackTextInput.addEventListener("input", () => {
      feedbackCount.textContent = feedbackTextInput.value.length;
    });
  }

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

    if (!feedbackText) {
      textError.textContent = "Please enter your feedback.";
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
      openAlert("Feedback submitted successfully.");
    } catch (e) {
      console.error(e);
    }
  });
}


// 보험 선택 후 챗봇 화면 렌더링 함수
function renderInsuranceChat() {
  $(".dropdown-label").attr("src", insuranceAssets[chatState.insurance]);

  if (chatState.chat_id) {
    loadChatHistory_dtl(chatState.chat_id);
  } else {
    // 최초 채팅 화면 그리기
    const stage = document.getElementById("chat_stage");
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
    openAlert("Please select an insurance plan to continue.");
  }
}

// 보험사별 비교
function renderCompareScreen(){
  if(chatState.chat_id) {
    loadChatHistory_dtl(chatState.chat_id);
  } else {
    botMessageAppend("Hello! let me help you with comparing. Which would you like to compare? Here are some examples.");
    // 챗봇 답변 아래에 비교 항목 추천
    const stage = document.getElementById("chat_stage");
    stage.innerHTML += `
      <div class="topic-grid compare-topic-dock" id="topicGrid">
      ${suggestions.map(topic => `<button class="topic-chip" data-topic="${topic}">${topic}</button>`).join("")}
      </div>
    `;
    renderBottomInput();

    const chips = document.querySelectorAll('.topic-chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
      });
    });
  }

  bindChatEvents();
  bindChatInputEvents();
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

async function deleteHistory() {
  const historyId = window.__selectedHistoryId;
  if (!historyId) return;

  try {
      await apiRequest("/chat/delete/", "POST", {
        chat_id: historyId
      });
      const historyItem = document.querySelector(`.history-item[data-history-id="${historyId}"]`);
      if (historyItem) {
        historyItem.remove();
      }

      window.__selectedHistoryId = null;
      closeAlert();
      location.reload(true);
    } catch (e) {
      console.error(e);
    }
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
  openAlert("Please change your temporary password to continue using the service.");

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
      openAlert("Password updated successfully.");
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
  renderChatHistory();

  eventBind();

  if (loginUser.is_temp_pw === "Y") {
    setTimeout(() => {
      openForceChangePasswordModal();
    }, 300);
  }
});

function sendChatMessage() {
  const textarea = document.getElementById("chatInput");
  const text = textarea ? textarea.value.trim() : "";
  if (!text) {
    openAlert("Please enter the contents.");
    return;
  }

  var selectedTopics = [];
  if($("#topicGrid").hasClass("hidden") === false) {
    selectedTopics = [...document.querySelectorAll('.topic-chip.selected')].map((el) => el.dataset.topic);
    $("#topicGrid").addClass("hidden");
    $("#topicGrid").empty();
  }

  textarea.value = "";
  document.querySelectorAll(".chip, .prompt-pill").forEach((x) => { x.disabled = false; });
  textarea.value = "";

  // 최초 채팅 시작이 아닌경우 먼저 사용자 메시지 화면에 append
  var sessionId = chatState.session_id ? chatState.session_id : null;
  if(sessionId) {
      userMessageAppend(text);
  }

  var params = {
    user_id: loginUser.user_id,
    message: text,
    insurance_name: chatState.compare ? "compare" : chatState.insurance,
    chat_id: chatState.chat_id ? chatState.chat_id : null,
    session_id: chatState.session_id ? chatState.session_id : null,
    comparison_criteria: selectedTopics
  };
  // api로 메세지 보내는 부분
  apiRequest("/chat/send/", "POST", params).then((response) => {
      // 최초 메시지 전송 시에만 user message append (session_id가 없을 때)
      if(!chatState.chat_id) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.append('chat_id', response['chat_id']);

        // URL 업데이트 (페이지 리로드 포함)
        window.location.href = currentUrl.toString();
      }
      bot_message = response['bot_message'];
      botMessageAppend(bot_message.answer); // response.bot_reply는 챗봇의 답변이라고 가정

      // response에 claim_form, compare_table, related_questions가 있는 경우
      if (bot_message.claim_form) {
        fileMessageAppend(bot_message.claim_form);
      }
      if (bot_message.compare_table) {
        // 챗봇 답변 아래에 비교 테이블 추가하는 함수 호출
        compareTableAppend(bot_message.compare_table);
      }
      if (bot_message.related_questions) {
        // 챗봇 답변 아래에 관련 질문 리스트 추가하는 함수 호출
        relatedQuestionsAppend(bot_message.related_questions);
      }
    }).catch((error) => {
      // 메시지 전송 실패 시의 처리
      console.error("Failed to send message:", error);
      openAlert("Failed to send message. Please try again.");
    });
}

function loadChatHistory_dtl(chat_id) {
  var params = {
    chat_id: chat_id,
    insurance_name: chatState.insurance ? chatState.insurance : "compare"
  };
  // chat_id에 해당하는 대화 기록을 불러와서 화면에 렌더링하는 함수
  apiRequest(`/chat/detail/`, "POST", params).then((response) => {
    chatState.session_id = response.session_id; // 서버에서 세션 ID 받아오기
    renderChatHistory_dtl(response.messages);
  }).catch((error) => {
    console.error("Failed to load chat history:", error);
    openAlert("Failed to load chat history. Please try again.");
  });
}

function renderChatHistory_dtl(history_list) {
  const stage = document.getElementById("chat_stage");
  stage.innerHTML = "";
  renderBottomInput();
  history_list.forEach((entry) => {
    if (entry.bot_yn === "N") {
      userMessageAppend(entry.chat_content);
    } else if (entry.bot_yn === "Y") {
      botMessageAppend(entry.chat_content);
      // response에 claim_form, compare_table, related_questions가 있는 경우
      content_all = entry.chat_content_all;
      if (content_all.claim_form) {
        fileMessageAppend(content_all.claim_form);
      }
      if (content_all.compare_table) {
        // 챗봇 답변 아래에 비교 테이블 추가하는 함수 호출
        compareTableAppend(content_all.compare_table);
      }
      if (content_all.related_questions) {
        // 챗봇 답변 아래에 관련 질문 리스트 추가하는 함수 호출
        relatedQuestionsAppend(content_all.related_questions);
      }
    }
  });
  bindChatInputEvents();
}

function renderChatHistory() {
  // 대화 기록 리스트를 불러와서 화면에 렌더링하는 함수
  apiRequest(`/chat/list/`, "GET").then((response) => {
    $.each(response, function(idx, history) {
      document.getElementById("historyList").innerHTML += (`
        <div class="history-item" data-history-id="${history.chat_id}" onclick="window.location.href='${history.insurance_name === "Compare" ? `./chat?compare=true&chat_id=${history.chat_id}` : `./chat?insurance=${history.insurance_name}&chat_id=${history.chat_id}`}'">
            <button class="history-btn" type="button">${history.reg_dt} - ${history.insurance_name}</button>
            <button class="history-delete-btn" type="button" aria-label="Delete history" onclick="confirmDeleteHistory(event, this)">✕</button>
        </div>
      `);
    });
  }).catch((error) => {
    console.error("Failed to load chat history:", error);
    openAlert("Failed to load chat history. Please try again.");
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

// 챗봇이 파일을 return 했을 때 메시지에 파일 첨부하는 함수
function fileMessageAppend(claim_form) {
  $.each(claim_form, function(idx, value) {
    $("#chat_stage").append(`
        <div class="file-attachment-wrap">
          <button class="file-attachment" type="button" onclick="downloadAttachedFile('${value.claim_form_name}')">
            <span class="file-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7 3.75h6.2L18.25 8.8V20a1.25 1.25 0 0 1-1.25 1.25H7A1.25 1.25 0 0 1 5.75 20V5A1.25 1.25 0 0 1 7 3.75Z" stroke="currentColor" stroke-width="1.8"></path>
                <path d="M13 3.75V8.5h4.75" stroke="currentColor" stroke-width="1.8"></path>
              </svg>
            </span>
            <span class="file-meta">
              <span class="file-name">${value.claim_form_name}</span>
              <!-- <span class="file-size">${value.file_type} · ${value.file_size}</span> -->
            </span>
          </button>
        </div>`);
  });
}

// 파일 다운로드 함수
function downloadAttachedFile(fileName) {
  // fastapi에서 파일 다운로드를 처리하는 엔드포인트로 요청을 보내는 함수
  // fastapi 주소 가져오는 api 호출
  apiRequest("/download-url/", "GET").then((response) => {
    const downloadUrl = response.download_url; // fastapi에서 반환된 다운로드 URL
    window.open(`${downloadUrl}/download/${chatState.insurance}/${fileName}`, "_blank");
  }).catch((error) => {
    console.error("Failed to get download URL:", error);
    openAlert("Failed to download file. Please try again.");
  });
}

// 챗봇 답변 아래에 비교 테이블 추가하는 함수
function compareTableAppend(compare_table) {
  $("#chat_stage").append(`
    <div class="table-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                ${compare_table.header.map(header => `<th>${header}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${compare_table.body.map(row => `
                  <tr>
                    ${row.map((cell, index) => 
                      index === 0 ? `<th>${cell}</th>` : `<td>${cell}</td>`
                    ).join("")}
                  </tr>
                `).join("")}
            </tbody>
          </table>
        </div>`);
}

// 챗봇 답변 아래에 관련 질문 리스트 추가하는 함수
function relatedQuestionsAppend(related_questions) {
  $("#chat_stage").append(`
      <div class="prompt-row message-row left">
        ${related_questions.map(question => `<button class="prompt-pill" data-fill="${question}">${question}</button>`).join("")}
      </div>`);
    bindFillEvents();
}