let sessionTimer = null;

function startSessionTimer() {
  clearTimeout(sessionTimer);

  // 로그인 후 25분 뒤 세션 연장 안내
  sessionTimer = setTimeout(() => {
    openAlertSelect(
      "Your session will expire soon. Would you like to extend it?",
      "extendSession"
    );
  }, 25 * 60 * 1000);
}

async function extendSession() {
  try {
    await apiRequest("/session/extend/", "POST");

    closeAlert();
    showAlert("Session extended.");

    // 다시 25분 카운트 시작
    startSessionTimer();
  } catch (e) {
    console.error(e);
    closeAlert();
    showAlert("Session expired. Please log in again.");

    setTimeout(() => {
      window.location.href = "/dacare/";
    }, 1000);
  }
}

function modalWrapper(inner, size = "medium", close=true) {
  return `
    <div class="backdrop" data-close></div>
    <section class="modal ${size}">
      ${close ? '<button class="close-btn" data-close><img src="/static/images/close.png" alt="close"></button>' : ''}
      ${inner}
    </section>
  `;
}

function alertWrapper(inner, size = "small") {
  return `
    <div class="backdrop backdrop-alert" data-close-alert></div>
    <section class="modal modal-alert ${size}">
      <button class="close-btn" data-close-alert><img src="/static/images/close.png" alt="close"></button>
      ${inner}
    </section>
  `;
}

function closeModal() {
  const root = document.getElementById("modal-root");
  root.innerHTML = "";
}

function closeAlert() {
  const root = document.getElementById("alert-root");
  root.innerHTML = "";
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
    el.addEventListener("click", closeModal);
  });

  document.querySelectorAll("[data-close-alert]").forEach((el) => {
    el.addEventListener("click", closeAlert);
  });

  document.querySelectorAll("[data-open]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(el.dataset.open);
    });
  });

  const saveProfile = document.getElementById("saveProfile");
  if (saveProfile) {
    saveProfile.addEventListener("click", () => {
      closeModal();
      showAlert("User information saved.");
    });
  }

  document.querySelectorAll("[data-rate]").forEach((el) => {
    el.addEventListener("click", () => {
      document.querySelectorAll("[data-rate]").forEach((x) => x.classList.remove("active"));
      el.classList.add("active");
      window.__feedbackRating = el.dataset.rate;
    });
  });

  const feedbackSubmit = document.getElementById("feedbackSubmit");
  if (feedbackSubmit) {
    feedbackSubmit.addEventListener("click", () => {
      if (!window.__feedbackRating) return showAlert("Please select a satisfaction level.");
      closeModal();
      showAlert("Feedback submitted.");
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  bindModalEvents();
});

function logout() {
  openAlertSelect("Do you want to log out?", "confirmLogout");
}

function confirmLogout() {
  closeAlert(); // 세션 만료 function 추가
  window.location.href = "./";
}

async function apiRequest(url, method = "GET", body = null) {
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
  }
}

// 로그아웃
function logout() {
  openAlertSelect("Do you want to log out?", "confirmLogout");
}

function confirmLogout() {
  apiRequest("/auth/logout/", "POST")
    .then(() => {
      window.location.href = "./";
    });
}