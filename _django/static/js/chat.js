const state = {
  insurance: "Cigna",
  suggestion: "",
  attachedFile: "",
  rating: ""
};

const insuranceAssets = {
  "UnitedHealth": "/static/images/united_main.png",
  "Cigna": "/static/images/cigna_main.png",
  "TRICARE": "/static/images/tricare_main.png",
  "MSH China": "/static/images/msh_main.png"
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

function renderSidebar() {
  return `
    <aside class="sidebar">
      <div class="sidebar-top">
        <img class="mini-logo" src="/static/images/dacare_logo.png" alt="Dacare">
      </div>
      <button class="new-chat" data-nav="chat-empty">+New Chat</button>

      <div class="history">
        <h4>Chat History</h4>
        <div class="history-item">2026.04.18 16:30 - Cigna</div>
        <div class="history-item">2026.04.17 10:15 - UnitedHealth</div>
        <div class="history-item">2026.04.14 09:00 - TRICARE</div>
        <div class="history-item">2026.04.10 14:20 - Cigna</div>
      </div>

      <div class="side-footer">
        <button data-open="profile"><img src="/static/images/cogwheel.png" alt=""> User Name</button>
        <button data-open="feedback">Feedback</button>
      </div>
    </aside>
  `;
}

function renderNoticeBar() {
  return `
    <div class="notice-bar">
      ※ The responses provided by this chatbot are for reference purposes only. Actual coverage details and costs may vary depending on your insurance policy terms and conditions.
      For accurate information regarding coverage and claim amounts, please consult your insurance provider or an official support channel.
    </div>
  `;
}

function renderSelect() {
  const cards = Object.entries(insuranceAssets).map(([name, src]) => `
    <button class="insurance-card ${state.insurance === name ? "active" : ""}" data-insurance="${name}">
      <img src="${src}" alt="${name}">
    </button>
  `).join("");

  const app = document.getElementById("app");
  app.innerHTML = `
    <section class="app-shell">
      ${renderSidebar()}
      <main class="main-panel">
        ${renderNoticeBar()}
        <div class="center-stage">
          <div class="insurance-title">Please select your insurance.</div>
          <div class="insurance-grid">${cards}</div>
          <div class="insurance-actions">
            <button class="primary-btn" data-nav="chat-empty">Continue</button>
          </div>
        </div>
      </main>
    </section>
  `;
}

function renderChatShell(content) {
  return `
    <section class="app-shell">
      ${renderSidebar()}
      <main class="main-panel">
        ${renderNoticeBar()}
        ${content}
      </main>
    </section>
  `;
}

function renderBottomInput() {
  return `
    <div class="bottom-input-wrap">
      <div class="bottom-input">
        <label class="upload-label icon-btn" title="attach">
          📎
          <input id="fileInput" type="file" hidden>
        </label>
        <span class="upload-name">${state.attachedFile || ""}</span>
        <input class="chat-input" id="chatInput" placeholder="What would you like to know?" value="${state.suggestion || ""}">
        <button class="send-btn" id="sendBtn">➤</button>
      </div>
    </div>
  `;
}

function renderChatEmpty() {
  return renderChatShell(`
    <div class="center-stage">
      <div class="chat-empty-title">What are you curious about?</div>
      <div class="search-bar"></div>
      <div class="prompt-row">
        <button class="prompt-pill" data-fill="추천 기능 1">추천 기능 1</button>
        <button class="prompt-pill" data-fill="추천 기능 2">추천 기능 2</button>
        <button class="prompt-pill" data-fill="추천 기능 3">추천 기능 3</button>
        <button class="prompt-pill" data-fill="추천 기능 4">추천 기능 4</button>
      </div>
    </div>
    ${renderBottomInput()}
  `);
}

function conversationMarkup(extra = "") {
  return `
    <div class="chat-view">
      <div class="message-row right">
        <div class="message-bubble-right">
          Will the beneficiary be covered if they receive treatment in their country of nationality?
          If there are limitations, what are they?
        </div>
      </div>

      <div class="center-caption">Gold Plan, $100 deductible, $20 co-payment.</div>

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

function renderChatConversation() {
  return renderChatShell(conversationMarkup());
}

function renderChatAttachment() {
  return renderChatShell(conversationMarkup(`
    <div class="attach-file">
      <span>📎</span><span>${state.attachedFile || "Claim.pdf"}</span>
    </div>
  `));
}

function renderChatSuggestions() {
  const chips = suggestions.map(text => `
    <button class="chip ${state.suggestion === text ? "active" : ""}" data-fill="${text}">${text}</button>
  `).join("");

  return renderChatShell(conversationMarkup(`
    <div class="tags-row">${chips}</div>
  `));
}

function modalWrapper(inner, size = "medium") {
  return `
    <div class="backdrop" data-close></div>
    <section class="modal ${size}">
      <button class="close-btn" data-close><img src="/static/images/close.png" alt="close"></button>
      ${inner}
    </section>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
    renderSelect();
});