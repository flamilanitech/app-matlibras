import { ptBR } from "@clerk/localizations";
import dataJson from "./data/data.json";
import "../assets/styles.css";

// ====== Init ======
async function init() {
  try {
    state.data = dataJson;

    // Atualiza os componentes que dependem de dados do state.data
    const screenSearch = document.querySelector("screen-search");
    if (screenSearch && screenSearch.updateData) screenSearch.updateData();

    const screenDict = document.querySelector("screen-dict");
    if (screenDict && screenDict.updateData) screenDict.updateData();

    const screenLibras = document.querySelector("screen-libras");
    if (screenLibras && screenLibras.updateData) screenLibras.updateData();

    // Define tela inicial padrão como search (busca local)
    const initializeRoute = () => {
      showScreen("search");
    };

    // TODO - Colocar a lógica para verificar se o usuário está logado e redirecionar para a tela de perfil ao invés de search
/*     const initializeRoute = () => {
      if (window.Clerk.user) {
        showScreen("account");
      } else {
        showScreen("search");
      }
    };
 */
    if (window.isClerkLoaded) {
      initializeRoute();
    } else {
      window.addEventListener("clerk-loaded", initializeRoute, { once: true });
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao iniciar o app. Veja o console.");
  }
}

// Inicializa assim que o DOM principal (e os Web Components simples) estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

window.addEventListener("load", async function () {
  // 1. Inicializa o Clerk
  await window.Clerk.load({
    localization: ptBR,
    appearance: {
      variables: {
        colorPrimary: "hsl(157, 98%, 16%)",
      },
    },
  });
  window.isClerkLoaded = true;

  const appContent = document.getElementById("app-content");
  const userButtonDiv = document.getElementById("user-button");

  // Remove the old app-content skeleton loading text since the screens handle the UI
  if (appContent) {
    appContent.style.display = "none";
  }

  // 2. Verifica se existe um usuário logado
  if (window.Clerk.user) {
    // Renderiza o botão de perfil/logout no header
    window.Clerk.mountUserButton(userButtonDiv, {
      afterSignOutUrl: window.location.href,
    });
  } else {
    // TODO - Não redireciona mais usuários deslogados
 // Se não está logado e estava em alguma rota protegida, manda para 'account'
  /*   const protectedRoutes = ["search", "dict", "libras"];
    if (
      typeof state !== "undefined" &&
      protectedRoutes.includes(state.activeRoute)
    ) {
      showScreen("account");
    } */
  }

  // Emite evento para os componentes que dependem do Clerk atualizarem
  window.dispatchEvent(new Event("clerk-loaded"));
});
