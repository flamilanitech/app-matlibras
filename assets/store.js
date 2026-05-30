// ====== Estado Compartilhado ======
const state = {
  data: null,
  activeRoute: "search",
  selectedCategory: null,
};

// ====== Helpers ======
function $(sel) {
  return document.querySelector(sel);
}
function $all(sel) {
  return Array.from(document.querySelectorAll(sel));
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeString(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function categoryName(categoryId) {
  if (!state.data) return categoryId;
  const c = state.data.categories.find((x) => x.id === categoryId);
  return c ? c.title : categoryId;
}

// ====== Custom Alert Dialog ======
function appAlert(message) {
  let dialog = document.getElementById("app-alert-dialog");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "app-alert-dialog";
    dialog.innerHTML = `
      <div style="padding: 24px; text-align: center; font-family: sans-serif;">
        <svg style="margin-bottom: 15px; color: var(--primary);" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
        </svg>
        <p id="app-alert-text" style="margin: 0 0 20px; font-size: 16px; font-weight: 600; color: var(--ink);"></p>
        <button id="app-alert-close" style="width: 100%; background: var(--primary); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer;">Entendi</button>
      </div>
    `;
    document.body.appendChild(dialog);

    dialog.style.border = "none";
    dialog.style.borderRadius = "16px";
    dialog.style.padding = "0";
    dialog.style.boxShadow = "var(--shadow)";
    dialog.style.maxWidth = "320px";
    dialog.style.width = "90%";

    dialog
      .querySelector("#app-alert-close")
      .addEventListener("click", () => dialog.close());

    const style = document.createElement("style");
    style.innerHTML = `
      #app-alert-dialog::backdrop {
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
      }
    `;
    document.head.appendChild(style);
  }

  dialog.querySelector("#app-alert-text").textContent = message;
  dialog.showModal();
}

// Global functions that trigger app-level re-rendering
function setHeader(title) {
  const headerTitle = $("#headerTitle");
  if (headerTitle) headerTitle.textContent = title;
}

function showScreen(route) {
  // TODO Protege as rotas de busca, dicionário e Libras - DESATIVADO
  // const protectedRoutes = ["search", "dict", "libras"];
  const protectedRoutes = [];

  // Bloqueio de acesso se a rota é protegida e o Clerk já carregou sem usuário logado
  if (protectedRoutes.includes(route)) {
    if (!window.isClerkLoaded) {
      route = "account";
    } else if (!window.Clerk.user) {
      appAlert(
        "Você precisa estar logado para acessar o dicionário de Matemática em Libras.",
      );
      route = "account";
    }
  }

  state.activeRoute = route;

  // header
  const titles = {
    search: "",
    dict: "Dicionário",
    libras: "Libras",
    account: "Conta",
  };
  setHeader(titles[route] ?? "App");

  // screens
  $all(".screen").forEach((s) => s.classList.remove("is-active"));
  const activeScreen = $(`#screen-${route}`);
  if (activeScreen) activeScreen.classList.add("is-active");

  // bottom nav highlight
  $all(".nav-item").forEach((b) => b.classList.remove("is-active"));
  $all(`.nav-item[data-route="${route}"]`).forEach((b) =>
    b.classList.add("is-active"),
  );
}

// ====== Export to window for module compatibility ======
window.state = state;
window.$ = $;
window.$all = $all;
window.escapeHtml = escapeHtml;
window.categoryName = categoryName;
window.appAlert = appAlert;
window.setHeader = setHeader;
window.showScreen = showScreen;
window.normalizeString = normalizeString;
