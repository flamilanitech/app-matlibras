import "../../assets/styles/screen-account.css";

class ScreenAccount extends HTMLElement {
  constructor() {
    super();
    this.mode = "signIn"; // controle interno de qual tela mostrar
  }

  connectedCallback() {
    this.innerHTML = `
      <section id="screen-account" class="screen" aria-label="Conta">
          <div class="account-container">

              <!-- Clerk container para Sign-In ou Profile -->
              <div id="clerk-container" style="display: flex; justify-content: center; align-items: center; width: 100%; margin: 10px auto;"></div>
              
              <!-- Container de alternância criado por nós -->
              <div id="toggle-container" style="text-align: center;"></div>

          </div>

          <!-- Bottom Sheet de Ajuda -->
          <div id="accountBottomSheetOverlay" class="bottom-sheet-overlay"></div>
          <div id="accountBottomSheet" class="bottom-sheet">
              <div class="bottom-sheet__header">
                  <h3 class="section-title" style="margin-bottom:0; font-size: 20px; color: var(--text);">Como utilizar</h3>
                  <button type="button" id="closeAccountBottomSheet" class="bottom-sheet__close">✕</button>
              </div>
              <div class="bottom-sheet__content" style="text-align: left; line-height: 1.5; color: var(--text, #333);">
                  <h4 style="margin-top:0;">Bem-vindo ao MatLibras!</h4>
                  <p>Aqui estão algumas dicas de como usar o aplicativo:</p>
                  <ul style="padding-left: 20px; margin-bottom: 20px;">
                      <li style="margin-bottom: 8px;"><b>Buscar (Lupa):</b> Busque rapidamente qualquer sinal matemático pelo nome, de forma rápida e prática.</li>
                      <li style="margin-bottom: 8px;"><b>Dicionário (Livro):</b> Navegue pelas categorias (Álgebra, Geometria, etc) para ver as listas de sinais.</li>
                      <li style="margin-bottom: 8px;"><b>Libras (Mãos):</b> Acesse jogos, atividades interativas e ferramentas para praticar.</li>
                      <li style="margin-bottom: 8px;"><b>Perfil:</b> Gerencie sua conta. Lembre-se que muitas funções exigem login.</li>
                  </ul>
                  <p>Basta clicar em um sinal para abrir o vídeo em Libra correspondente àquele termo!</p>
              </div>
          </div>
      </section>
    `;
    this.setupListeners();
    this.loadAuth();

    // Adiciona listener para quando o Clerk carregar
    window.addEventListener("clerk-loaded", () => {
      this.loadAuth();
    });
  }

  setupListeners() {
    const closeBtn = this.querySelector("#closeAccountBottomSheet");
    const overlay = this.querySelector("#accountBottomSheetOverlay");

    if (closeBtn)
      closeBtn.addEventListener("click", () => this.closeBottomSheet());
    if (overlay)
      overlay.addEventListener("click", () => this.closeBottomSheet());
  }

  openBottomSheet() {
    const sheet = this.querySelector("#accountBottomSheet");
    const overlay = this.querySelector("#accountBottomSheetOverlay");
    if (sheet) sheet.classList.add("active");
    if (overlay) overlay.classList.add("active");
  }

  closeBottomSheet() {
    const sheet = this.querySelector("#accountBottomSheet");
    const overlay = this.querySelector("#accountBottomSheetOverlay");
    if (sheet) sheet.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
  }

  loadAuth() {
    let clerkContainer = this.querySelector("#clerk-container");
    const toggleContainer = this.querySelector("#toggle-container");
    if (!clerkContainer) return;

    if (window.Clerk && window.isClerkLoaded) {
      if (window.Clerk.user) {
        clerkContainer.innerHTML = `<div style="text-align: center; width: 100%;">
            <h2>Olá, ${window.Clerk.user.firstName}!</h2>
            <p style="margin-bottom: 24px;">Você está logado e pode acessar todas as ferramentas.</p>
<!--
            <button type="button" id="openHelpBtn" class="help-card" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; background: var(--card, #fff); border: 1px solid var(--line, #e2e8f0); border-radius: 18px; padding: 16px; box-shadow: var(--shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.1)); cursor: pointer;">
                <span style="font-size: 24px; background: var(--primary-weak, #eaf2eb); width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">❓</span>
                <div style="text-align: left;">
                  <strong style="display: block; font-size: 16px; color: var(--text, #333);">Ajuda</strong>
                  <span style="font-size: 13px; color: var(--muted, #64748b);">Como usar o aplicativo</span>
                </div>
                <span style="margin-left: auto; color: var(--primary, #2e6b45);">▶︎</span>
            </button> -->

            <!-- Redes Sociais -->
            <div style="margin-top: 32px;">
                <p style="margin-bottom: 12px; font-weight: 600; font-size: 14px; color: var(--muted, #64748b);">Acompanhe nossas Redes Sociais</p>
                <div style="display: flex; justify-content: center; gap: 20px;">
                    <!-- Instagram -->
                    <a href="https://www.instagram.com/matilibras?igsh=MW1lMjV6dmc3aThjdQ==" target="_blank" rel="noopener noreferrer" style="color: #E1306C; text-decoration: none; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.036 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                        </svg>
                    </a>
                    <!-- YouTube -->
                    <a href="https://youtube.com/@matilibras?si=1M1ZtlfpzL89VOsk" target="_blank" rel="noopener noreferrer" style="color: #FF0000; text-decoration: none; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16">
                          <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.052-.072 1.964l-.008.106-.022.26-.01.104c-.048.519-.119 1.023-.22 1.402a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c1.16-.312 5.569-.334 6.18-.335h.014zM6.5 10.518 10.5 8 6.5 5.482z"/>
                        </svg>
                    </a>      
                </div>
            </div>
        </div>`;
        if (toggleContainer) toggleContainer.innerHTML = "";

        const openHelpBtn = this.querySelector("#openHelpBtn");
        if (openHelpBtn) {
          openHelpBtn.addEventListener("click", () => this.openBottomSheet());
        }
      } else {
        // Para evitar erros do React de unmount ("Failed to execute 'removeChild'"), removemos as montagens velhas
        try {
          window.Clerk.unmountSignIn(clerkContainer);
          window.Clerk.unmountSignUp(clerkContainer);
        } catch (e) {}

        // Recria o nó do DOM inteiramente como garantia
        const newContainer = document.createElement("div");
        newContainer.id = "clerk-container";
        newContainer.style.display = "flex";
        newContainer.style.justifyContent = "center";
        newContainer.style.alignItems = "center";
        newContainer.style.width = "100%";
        newContainer.style.margin = "10px auto";
        clerkContainer.parentNode.replaceChild(newContainer, clerkContainer);
        clerkContainer = newContainer;

        // Esconde ação de rodapé do clerk para não redirecionar e sumir do app
        const appearanceOpts = {
          elements: {
            footerAction: { display: "none" },
          },
        };

        if (this.mode === "signIn") {
          window.Clerk.mountSignIn(clerkContainer, {
            routing: "virtual",
            appearance: appearanceOpts,
          });

          if (toggleContainer) {
            toggleContainer.innerHTML = `
              <p style="font-size: 14px; margin-top: 10px; color: #555;">
                Não tem uma conta? 
                <button type="button" style="background:none; border:none; color:var(--primary, #2e6b45); font-weight:bold; cursor:pointer;" onclick="document.querySelector('screen-account').toggleMode()">
                  Cadastre-se
                </button>
              </p>
            `;
          }
        } else {
          window.Clerk.mountSignUp(clerkContainer, {
            routing: "virtual",
            appearance: appearanceOpts,
          });

          if (toggleContainer) {
            toggleContainer.innerHTML = `
              <p style="font-size: 14px; margin-top: 10px; color: #555;">
                Já tem uma conta? 
                <button type="button" style="background:none; border:none; color:var(--primary, #2e6b45); font-weight:bold; cursor:pointer;" onclick="document.querySelector('screen-account').toggleMode()">
                  Faça Login
                </button>
              </p>
            `;
          }
        }
      }
    } else {
      clerkContainer.innerHTML =
        '<p style="text-align: center;">Carregando autenticação...</p>';
    }
  }

  toggleMode() {
    this.mode = this.mode === "signIn" ? "signUp" : "signIn";
    this.loadAuth();
  }

  updateData() {}
}

customElements.define("screen-account", ScreenAccount);
