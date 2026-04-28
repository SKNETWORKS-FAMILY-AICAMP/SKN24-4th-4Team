let sessionTimer = null;
let sessionCountdownTimer = null;
let sessionExpireTimer = null;
let sessionExpireAt = null;

let SESSION_TOTAL_SECONDS = null;
const SESSION_NOTICE_BEFORE_SECONDS = 5 * 60;

let apiLoadingCount = 0;

function ensureLoadingSpinner() {
  let spinner = document.getElementById("global-loading-spinner");
  if (spinner) return spinner;

  spinner = document.createElement("div");
  spinner.id = "global-loading-spinner";
  spinner.className = "global-loading hidden";
  spinner.innerHTML = `
    <div class="loading-card">
      <div class="loading-spinner" aria-label="Loading"></div>
      <div class="loading-text">Loading...</div>
    </div>
  `;
  document.body.appendChild(spinner);
  return spinner;
}

function showGlobalLoading() {
  apiLoadingCount += 1;
  ensureLoadingSpinner().classList.remove("hidden");
}

function hideGlobalLoading() {
  apiLoadingCount = Math.max(0, apiLoadingCount - 1);
  if (apiLoadingCount === 0) {
    const spinner = document.getElementById("global-loading-spinner");
    if (spinner) spinner.classList.add("hidden");
  }
}

async function initSessionFromServer() {
  if (document.getElementById("user-info")){
    try {
      const res = await apiRequest("/session/info/", "GET");
      SESSION_TOTAL_SECONDS = res.session_expire_seconds;
      startSessionTimer(SESSION_TOTAL_SECONDS);
    } catch (e) {
      forceSessionExpiredOverlay();
    }
  }
}

function initSessionTimer(expireSeconds) {
}

function formatRemainTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const min = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const sec = String(safeSeconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function clearSessionTimers() {
  clearTimeout(sessionTimer);
  clearInterval(sessionCountdownTimer);
  clearTimeout(sessionExpireTimer);
  sessionTimer = null;
  sessionCountdownTimer = null;
  sessionExpireTimer = null;
}

function startSessionTimer(totalSeconds) {
  clearSessionTimers();

  const seconds = Number(totalSeconds);

  if (!Number.isFinite(seconds) || seconds <= 0) {
    forceSessionExpiredOverlay();
    return;
  }

  sessionExpireAt = Date.now() + seconds * 1000;

  const noticeBeforeSeconds = 5 * 60;

  if (seconds <= noticeBeforeSeconds) {
    openSessionExtendAlert();
  } else {
    sessionTimer = setTimeout(
      openSessionExtendAlert,
      (seconds - noticeBeforeSeconds) * 1000
    );
  }

  sessionExpireTimer = setTimeout(forceSessionExpiredOverlay, seconds * 1000);
}

function openSessionExtendAlert() {
  const root = document.getElementById("alert-root");
  if (!root) return;

  root.innerHTML = `
    <div class="backdrop backdrop-alert"></div>
    <section class="modal modal-alert small session-alert">
      <div class="alert-text">
        Your session will expire soon.<br>
        Remaining time: <strong id="sessionRemainText">--:--</strong><br>
        Would you like to extend it?
      </div>
      <div class="alert-btns">
        <button class="primary-btn" onclick="extendSession()">Extend</button>
        <button class="secondary-btn" onclick="confirmLogout()">Logout</button>
      </div>
    </section>
  `;

  updateSessionRemainText();
  clearInterval(sessionCountdownTimer);
  sessionCountdownTimer = setInterval(updateSessionRemainText, 1000);
}

function updateSessionRemainText() {
  const remainText = document.getElementById("sessionRemainText");
  if (!remainText || !sessionExpireAt) return;

  const remainSeconds = Math.ceil((sessionExpireAt - Date.now()) / 1000);
  remainText.textContent = formatRemainTime(remainSeconds);

  if (remainSeconds <= 0) forceSessionExpiredOverlay();
}

function forceSessionExpiredOverlay() {
  clearSessionTimers();

  const app = document.getElementById("app");
  if (app) app.innerHTML = "";

  const modalRoot = document.getElementById("modal-root");
  if (modalRoot) modalRoot.innerHTML = "";

  const root = document.getElementById("alert-root");
  if (!root) return;

  root.innerHTML = `
    <div class="backdrop backdrop-alert"></div>
    <section class="modal modal-alert small session-alert">
      <div class="alert-text">
        Your session has expired.<br>
        Please sign in again.
      </div>
      <button class="primary-btn" onclick="window.location.href='/dacare/'">Go to Sign in</button>
    </section>
  `;
}

async function extendSession() {
  try {
    const res = await apiRequest("/session/extend/", "POST");
    startSessionTimer(res.session_expire_seconds);
    closeAlert();
    showAlert("Session extended.");
  } catch (e) {
    console.error(e);
    forceSessionExpiredOverlay();
  }
}

function modalWrapper(inner, size = "medium", close = true) {
  return `
    <div class="backdrop" ${close ? "data-close" : ""}></div>
    <section class="modal ${size}">
      ${close ? '<button class="close-btn" data-close><img src="/static/images/close.png" alt="close"></button>' : ""}
      ${inner}
    </section>
  `;
}

function alertWrapper(inner, size = "small", close = true) {
  return `
    <div class="backdrop backdrop-alert" ${close ? "data-close-alert" : ""}></div>
    <section class="modal modal-alert ${size}">
      ${close ? '<button class="close-btn" data-close-alert><img src="/static/images/close.png" alt="close"></button>' : ""}
      ${inner}
    </section>
  `;
}

function closeModal() {
  const root = document.getElementById("modal-root");

  const modal = root?.querySelector(".modal");
  const isSignupModal = !!modal?.querySelector("#signupSubmit");

  if (isSignupModal) {
    resetSignupState();
  }

  if (root) root.innerHTML = "";
}

function closeAlert() {
  const root = document.getElementById("alert-root");
  if (root) root.innerHTML = "";
}

function openAlert(message = "") {
  const root = document.getElementById("alert-root");
  if (!root) return;

  root.innerHTML = alertWrapper(`
    <div class="alert-text" id="alertText">${message}</div>
    <button class="primary-btn" data-close-alert>Confirm</button>
  `, "small");

  bindModalEvents();
}

function openAlertSelect(message = "", function_name = "") {
  const root = document.getElementById("alert-root");
  if (!root) return;

  root.innerHTML = alertWrapper(`
    <div class="alert-text" id="alertText">${message}</div>
    <div class="alert-btns">
      <button class="primary-btn" onclick="${function_name}()">Confirm</button>
      <button class="secondary-btn" data-close-alert>Cancel</button>
    </div>
  `, "small");

  bindModalEvents();
}

function showAlert(message) {
  openAlert(message);
}

function openModal(html = "") {
  const root = document.getElementById("modal-root");
  if (!root) return;
  root.innerHTML = html;
  bindModalEvents();
}

function bindModalEvents() {
  document.querySelectorAll("[data-close]").forEach((el) => {
    el.removeEventListener("click", closeModal);
    el.addEventListener("click", closeModal);
  });

  document.querySelectorAll("[data-close-alert]").forEach((el) => {
    el.removeEventListener("click", closeAlert);
    el.addEventListener("click", closeAlert);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSessionFromServer();
  bindModalEvents();
});

function logout() {
  openAlertSelect("Do you want to log out?", "confirmLogout");
}

function confirmLogout() {
  apiRequest("/auth/logout/", "POST")
    .catch(() => {})
    .finally(() => {
      window.location.href = "/dacare/";
    });
}

async function apiRequest(url, method = "GET", body = null) {
  showGlobalLoading();

  try {
    const res = await fetch(`/dacare${url}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null
    });

    const data = await res.json();

    if (!data.success) {
      showAlert(data.message);
      throw data;
    }

    return data.data;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    hideGlobalLoading();
  }
}
