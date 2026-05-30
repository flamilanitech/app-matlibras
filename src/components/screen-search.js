import "../../assets/styles/screen-search.css";

class ScreenSearch extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section id="screen-search" class="screen is-active" aria-label="Pesquisa">
        <div class="search-fullscreen">

            <!-- Header with Logo -->
            <header class="search-header">
              <div class="search-header__brand">
                <div class="search-header__logo">
                  <img src="./assets/imgs/logo-matlibras.jpeg" alt="MatLibras" />
                </div>
                <div class="search-header__content">
                  <span class="search-header__name">MatLibras</span>
                  <p class="search-header__description">Dicionário de Matemática em Libras</p>
                </div>
              </div>
            </header>
            <video class="bg-video" autoplay loop muted playsinline poster="capa.jpg">
                <source src="./assets/videos/operacoes.mp4" type="video/mp4">
                <source src="./assets/videos/operacoes.webm" type="video/webm">
                Seu navegador não suporta a tag de vídeo.
            </video>

            <!-- Loading Overlay -->
            <div id="loadingOverlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #000; z-index: 999999; display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <div class="spinner" style="border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid #fff; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite;"></div>
              <p style="color: white; margin-top: 15px; font-weight: bold; font-family: sans-serif;">Carregando...</p>
              <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              </style>
            </div>

            <!-- Video Top Controls Overlay -->
            <div id="videoTitleOverlay" style="display: none; position: absolute; top: 20px; left: 20px; right: 20px; z-index: 10; justify-content: space-between; align-items: flex-start; pointer-events: none;">
                <div style="text-align: left; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">
                    <h2 id="videoTitleText" style="margin: 0; font-size: 30px; font-weight: 900;"></h2>
                    <p id="videoCategoryText" style="margin: 4px 0 0; font-size: 16px; opacity: 0.9;"></p>
                </div>
                <button id="btnPlayPause" style="pointer-events: auto; display: none; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; width: 44px; height: 44px; align-items: center; justify-content: center; color: white; cursor: pointer; backdrop-filter: blur(4px);" title="Pausar/Tocar" type="button">
                  <svg id="iconPause" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                  </svg>
                  <svg id="iconPlay" style="display:none;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                  </svg>
                </button>
            </div>
            <div class="floating-grid">
            <div class="floating-search">
                <span class="icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                  </svg>
                </span>
                <input id="searchInputHome" type="text" placeholder="Busque palavras" autocomplete="off" />

                <button id="btnMic" class="mic-btn" title="Microfone" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16">
                    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                    <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
                  </svg>
                </button>
            </div>
            </div>
            <!-- Overlay for search results -->
            <div class="results-overlay" id="resultsOverlay" style="display:none;">
               <div class="results__head" style="margin-bottom: 14px; display:flex; justify-content:space-between; align-items:center;">
                   <span class="results__title" style="font-weight: 800; font-size: 18px;">Resultados</span>
                   <span id="resultsCount" class="results__count" style="font-size: 12px; background: #e2e8f0; padding: 4px 10px; border-radius: 999px;">0</span>
               </div>
               <div id="resultsList" class="results__list" style="display:flex; flex-direction:column; gap:10px;"></div>
            </div>
        </div>
      </section>
    `;

    this.searchInput = this.querySelector("#searchInputHome");
    this.btnMic = this.querySelector("#btnMic");
    this.btnPlayPause = this.querySelector("#btnPlayPause");
    this.iconPlay = this.querySelector("#iconPlay");
    this.iconPause = this.querySelector("#iconPause");
    this.resultsOverlay = this.querySelector("#resultsOverlay");

    this.setupListeners();
    // initially hide results
    this.renderHomeResults([]);

    // Loading Logic
    const bgVideo = this.querySelector(".bg-video");
    const loadingOverlay = this.querySelector("#loadingOverlay");

    if (bgVideo && loadingOverlay) {
      const hideLoader = () => {
        setTimeout(() => {
          if (loadingOverlay.style.display !== "none") {
            loadingOverlay.style.transition = "opacity 0.4s ease";
            loadingOverlay.style.opacity = "0";
            setTimeout(() => {
              loadingOverlay.style.display = "none";
            }, 400);
          }
        }, 500); // Garante que o usuário não veja o "piscar" da view rendendo.
      };

      if (bgVideo.readyState >= 3) {
        hideLoader();
      } else {
        bgVideo.addEventListener("canplay", hideLoader);
        bgVideo.addEventListener("error", hideLoader);
        // Fallback to remove loader after 4 seconds to ensure experience isn't blocked
        setTimeout(hideLoader, 4000);
      }
    }
  }

  setupListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        const query = (e.target.value || "").trim();
        const searchHeader = this.querySelector(".search-header");

        // Esconde o título e o controle de música do topo ao iniciar uma busca
        const titleOverlay = this.querySelector("#videoTitleOverlay");
        if (titleOverlay) {
          titleOverlay.style.display = "none";
        }

        if (query.length > 0) {
          if (searchHeader) searchHeader.style.display = "none";
          this.resultsOverlay.style.display = "block";
          const items = this.searchSignals(query);
          this.renderHomeResults(items);
        } else {
          if (searchHeader) searchHeader.style.display = "flex";
          this.resultsOverlay.style.display = "none";
        }
      });
    }

    if (this.btnMic) {
      this.btnMic.addEventListener("click", () => {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          alert("Reconhecimento de voz não suportado pelo seu navegador.");
          return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "pt-BR";
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        let micAlert = this.querySelector("#micAlert");
        if (!micAlert) {
          micAlert = document.createElement("div");
          micAlert.id = "micAlert";
          micAlert.style.position = "absolute";
          micAlert.style.top =
            "-45px"; /* Fica imediatamente acima da barra flutuante */
          micAlert.style.left = "50%";
          micAlert.style.transform = "translateX(-50%)";
          micAlert.style.background = "#e53e3e";
          micAlert.style.color = "white";
          micAlert.style.padding = "6px 14px";
          micAlert.style.borderRadius = "20px";
          micAlert.style.fontWeight = "bold";
          micAlert.style.fontSize = "14px";
          micAlert.style.zIndex = "100";
          micAlert.style.pointerEvents = "none";
          micAlert.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
          micAlert.style.display = "none";

          const floatingSearch = this.querySelector(".floating-search");
          if (floatingSearch) {
            /* Ensure relative positioning so absolute works correctly */
            floatingSearch.style.position = "relative";
            floatingSearch.appendChild(micAlert);
          }
        }

        const resetListeningState = () => {
          this.btnMic.style.color = "";
          micAlert.style.display = "none";
          if (
            this.searchInput &&
            this.searchInput.dataset.originalPlaceholder
          ) {
            this.searchInput.placeholder =
              this.searchInput.dataset.originalPlaceholder;
          }
        };

        recognition.onstart = () => {
          this.btnMic.style.color = "red";
          micAlert.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg class="mic-anim" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
              </svg>
              <span>Escutando...</span>
            </div>
          `;
          micAlert.style.display = "block";

          if (this.searchInput) {
            if (!this.searchInput.dataset.originalPlaceholder) {
              this.searchInput.dataset.originalPlaceholder =
                this.searchInput.placeholder;
            }
            this.searchInput.placeholder = "Fale agora...";
            this.searchInput.value = "";
          }
        };

        recognition.onresult = (event) => {
          let speechResult = "";
          for (let i = 0; i < event.results.length; i++) {
            speechResult += event.results[i][0].transcript;
          }
          if (this.searchInput) {
            this.searchInput.value = speechResult;
            const inputEvent = new Event("input", { bubbles: true });
            this.searchInput.dispatchEvent(inputEvent);
          }
        };

        recognition.onspeechend = () => {
          recognition.stop();
        };

        recognition.onend = () => {
          resetListeningState();
        };

        recognition.onerror = (event) => {
          resetListeningState();
          micAlert.textContent = "Erro: " + event.error;
          micAlert.style.display = "block";
          setTimeout(() => {
            micAlert.style.display = "none";
          }, 3000);
          console.error("Erro no reconhecimento de voz:", event.error);
        };

        recognition.start();
      });
    }

    if (this.btnPlayPause) {
      this.btnPlayPause.addEventListener("click", () => {
        const bgVideo = this.querySelector(".bg-video");
        if (!bgVideo) return;

        if (bgVideo.paused) {
          bgVideo.play();
          if (this.iconPlay) this.iconPlay.style.display = "none";
          if (this.iconPause) this.iconPause.style.display = "block";
        } else {
          bgVideo.pause();
          if (this.iconPlay) this.iconPlay.style.display = "block";
          if (this.iconPause) this.iconPause.style.display = "none";
        }
      });
    }
  }

  searchSignals(query) {
    const q = normalizeString(query);
    if (!q || !state.data) return [];
    return state.data.signals.filter((s) => normalizeString(s.term).includes(q));
  }

  renderHomeResults(items) {
    const list = this.querySelector("#resultsList");
    const count = this.querySelector("#resultsCount");

    if (!list || !count) return;

    list.innerHTML = "";
    count.textContent = String(items.length);

    if (items.length === 0) {
      list.innerHTML = `<div class="result-item">
        <span class="badge">Info</span>
        <div>
          <p class="result-item__title">Nenhum resultado</p>
          <p class="result-item__meta">Digite para buscar sinais no dicionário.</p>
        </div>
      </div>`;
      return;
    }

    items.slice(0, 20).forEach((item) => {
      const catName = categoryName(item.category);
      const el = document.createElement("div");
      el.className = "result-item";
      el.style.cursor = "pointer";
      el.innerHTML = `
        <span class="badge">${catName}</span>
        <div>
          <p class="result-item__title">${escapeHtml(item.term)}</p>
          <p class="result-item__meta">Tópico: ${escapeHtml(item.topic)}</p>
        </div>
      `;
      el.addEventListener("click", () => {
        if (item.video) {
          const bgVideo = this.querySelector(".bg-video");
          if (bgVideo) {
            bgVideo.src = item.video;
            bgVideo
              .play()
              .then(() => {
                // Atualiza o botão para "pause" ao começar tocar
                if (this.iconPlay && this.iconPause) {
                  this.iconPlay.style.display = "none";
                  this.iconPause.style.display = "block";
                }
              })
              .catch((e) => console.log("Failed to play background video:", e));

            // Mostra o título flutuante
            const titleOverlay = this.querySelector("#videoTitleOverlay");
            const titleText = this.querySelector("#videoTitleText");
            const categoryText = this.querySelector("#videoCategoryText");
            if (titleOverlay && titleText) {
              titleText.textContent = item.term;
              categoryText.textContent = categoryName(item.category);
              titleOverlay.style.display = "flex";
            }

            // Exibe o controle de play/pause
            if (this.btnPlayPause) {
              this.btnPlayPause.style.display = "flex";
            }

            // Oculta os resultados e limpa o input para exibir o vídeo no fundo com destaque
            this.resultsOverlay.style.display = "none";
            this.searchInput.value = "";
          }
        } else {
          alert(`Vídeo em breve para: ${item.term}`);
        }
      });
      list.appendChild(el);
    });
  }

  updateData() {
    this.renderHomeResults([]);
  }
}

customElements.define("screen-search", ScreenSearch);
