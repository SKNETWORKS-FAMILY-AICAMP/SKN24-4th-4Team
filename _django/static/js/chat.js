const chatState = {
  insurance: new URLSearchParams(location.search).get("insurance"),
  suggestion: "",
  screen:"",
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

// 보험선택
function renderInsuranceCards() {
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
}

function renderBottomInput() {
  return `
    <div class="bottom-input-wrap">
      <div class="bottom-input">
        <textarea class="chat-input" id="chatInput" placeholder="What would you like to know?"></textarea>
        <button class="send-btn" id="sendBtn">➤</button>
      </div>
    </div>
  `;
}

function conversationMarkup(extra = "") {
  return `
    <div class="chat-view">
      <div class="message-row right">
        <div class="message-bubble-right">
          ${chatState.suggestion || `Will the beneficiary be covered if they receive treatment in their country of nationality?<br>If there are limitations, what are they?`}
        </div>
      </div>

      <div class="message-row left">
        <div style="width:100%">
          <div class="ask-line"><span class="ask-avatar">🤖</span><span>What plan do you have?</span></div>
          <div class="message-bubble-left" style="margin-top:10px">
            When the beneficiary receives treatment in their country of nationality, coverage must meet specific conditions.
            This policy covers treatment costs only if the beneficiary is temporarily residing in their country of nationality.
            Under these circumstances, the beneficiary's stay in their country of nationality is limited, and that period cannot be exceeded
            [Source: CGHP Policy Rules CGIC EN 02_2026.pdf / Page: 4].
          </div>
          ${extra}
        </div>
      </div>
    </div>
    ${renderBottomInput()}
  `;
}

function renderSelectCardScreen() {
  const stage = document.getElementById("chat_stage");
  if (!stage) return;
    stage.innerHTML = `
      <div class="insurance-title">Please select your insurance.</div>
      <div class="insurance-grid" id="cards"></div>
      <div class="insurance-actions">
        <button class="primary-btn" onclick="selectInsurance()">Continue</button>
      </div>
    `;
    renderInsuranceCards();
    bindChatEvents();
    return;
}
// }

function bindChatEvents() {
  bindModalEvents();

  document.querySelectorAll("[data-fill]").forEach((el) => {
    el.addEventListener("click", () => {
      chatState.suggestion = el.dataset.fill;
      const input = document.getElementById("chatInput");
      if (input) input.value = chatState.suggestion;

      document.querySelectorAll(".chip, .prompt-pill").forEach((x) => x.classList.remove("active"));
      if (el.classList.contains("chip")) el.classList.add("active");
    });
  });

  $(".send-btn").click(function(){
    const input = document.getElementById("chatInput");
    const text = input ? input.value.trim() : "";
    if (text) chatState.suggestion = text;
    chatState.screen = "chat-suggest";
    renderInsuranceChat();
  });
}

function openProfile(){
  // 기존 사용자 정보 불러오는 로직 추가
  let html = "";
  html = modalWrapper(`
    <div class="modal-title">User Information</div>
    <div class="form-field">
      <label>Name</label><input class="form-input" value="Nick Name" />
    </div>
    <div class="form-field">
      <label>Email address</label><input class="form-input gray" value="user@example.com" disabled />
    </div>
    <div class="hr"></div>
    <div class="form-field">
      <label>Password</label><input class="form-input" type="password" />
    </div>
    <div class="form-field">
      <label>New Password</label><input class="form-input" type="password" />
    </div>
    <div class="form-field">
      <label>New Password Confirm</label><input class="form-input" type="password" />
    </div>
    <div style="text-align:center">
      <button class="primary-btn" id="saveProfile">Save</button>
    </div>
  `, "medium");
  openModal(html);
}
function openFeedback(){
  let html = "";
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
    <div style="text-align:center">
      <button class="primary-btn" id="feedbackSubmit">Submit</button>
    </div>
  `, "medium");
  openModal(html);
}

function setInsurance(){
    $(".dropdown-label").attr("src", insuranceAssets[chatState.insurance]);
}

function renderInsuranceChat() {
  setInsurance();

  const stage = document.getElementById("chat_stage");
  if (chatState.screen === "chat-suggest") {
    stage.innerHTML = conversationMarkup();
    bindChatEvents();
    return;
  }

  stage.innerHTML = `
    <div class="center-stage">
      <div class="chat-empty-title">What are you curious about?</div>
      <div class="search-bar">
        <textarea id="chatInput" class="search-textarea" placeholder="What would you like to know?"></textarea>
        <button class="send-btn">➤</button>
      </div>
      <div class="prompt-row">
        <button class="prompt-pill" data-fill="Pre authorization Requirement for Hospitalization">Pre authorization Requirement for Hospitalization</button>
        <button class="prompt-pill" data-fill="Cost-Sharing Structure">Cost-Sharing Structure</button>
        <button class="prompt-pill" data-fill="Mental Health Coverage">Mental Health Coverage</button>
        <button class="prompt-pill" data-fill="Annual Coverage Limit">Annual Coverage Limit</button>
      </div>
    </div>
  `;
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
              <span class="ask-avatar">🤖</span>
              <div class="message-bubble-left" style="margin-top:10px">
                Hello! let me help you with comparing. Which would you like to compare? Here are some examples.
              </div>
            </div>
          </div>
        </div>

        <div class="selection-guide">You can select multiple comparison topics.</div>

        <div class="topic-grid" id="topicGrid">
          <button class="topic-chip" data-topic="Annual Coverage Limit">Annual Coverage Limit</button>
          <button class="topic-chip" data-topic="Pre-authorization Requirement for Hospitalization">Pre-authorization Requirement for Hospitalization</button>
          <button class="topic-chip" data-topic="Cost-Sharing Structure">Cost-Sharing Structure</button>
          <button class="topic-chip" data-topic="Outpatient Coverage Availability">Outpatient Coverage Availability</button>
          <button class="topic-chip selected" data-topic="Maternity and Prenatal Coverage">Maternity and Prenatal Coverage</button>
          <button class="topic-chip selected" data-topic="Mental Health Coverage">Mental Health Coverage</button>
          <button class="topic-chip selected" data-topic="Dental and Vision Coverage">Dental and Vision Coverage</button>
          <button class="topic-chip selected" data-topic="Emergency Medical Evacuation">Emergency Medical Evacuation</button>
          <button class="topic-chip selected" data-topic="Coverage for Pre-existing Conditions">Coverage for Pre-existing Conditions</button>
          <button class="topic-chip selected" data-topic="Direct Billing Network Availability">Direct Billing Network Availability</button>
        </div>
      </section>
      ${renderBottomInput()}
    `;
    const chips = document.querySelectorAll('.topic-chip');

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
      });
    });
    const textarea = document.getElementById('chatInput');
    $(".send-btn").click(function(){
      const selectedTopics = [...document.querySelectorAll('.topic-chip.selected')].map((el) => el.dataset.topic);
      const message = textarea.value.trim();
      textarea.value = '';
      const compareArea = document.querySelector('.compare-area');
      compareArea.innerHTML += `<div class="message-row right">
        <div class="message-bubble-right">
          ${message} - Selected Topics: ${selectedTopics.join(', ')}
        </div>
      </div>`;
      console.log({ message, selectedTopics });
    });

}

function eventBind() {

  $(".dropdown-item").click(function(){
      window.location.href = "./chat?insurance=" + $(this).text().trim();
  });

  document.querySelectorAll("[data-insurance]").forEach((el) => {
    el.addEventListener("click", () => {
      chatState.insurance = el.dataset.insurance;
      renderInsuranceCards();
      bindChatEvents();
    });
  });

  $(".dropdown-trigger").click(function(){
    if ($(".dropdown-menu").hasClass("hidden")) {
      $(".dropdown-menu").removeClass("hidden");
    } else {
      $(".dropdown-menu").addClass("hidden");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (chatState.insurance) {
    $(".dropdown-trigger").removeClass("hidden");
    renderInsuranceChat();
  } else if(chatState.compare) {
    renderCompareScreen();
  } else {
    renderSelectCardScreen()
  }
  eventBind();
});