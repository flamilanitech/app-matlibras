import "../../assets/styles/screen-libras.css";

class ScreenLibras extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section id="screen-libras" class="screen" aria-label="LIBRAS">
              <div class="top-search">
            <span id="searchIconLibras" class="icon" style="cursor: pointer;" aria-label="Filtrar"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg></span>
            <input id="searchInputLibras" type="text" placeholder="Filtrar sinais" autocomplete="off" />
            <button type="button" id="clearSearchLibras" class="clear-search-btn hidden" aria-label="Limpar busca">✕</button>
            <div id="searchResultsDropdown" class="search-dropdown hidden"></div>
        </div>  
      <h2 class="screen-title">Aulas básicas de Matemática</h2>
          <div id="lessonsList" class="lesson-list"></div>
          <div id="loadMoreContainer" style="text-align: center; margin: 20px 0; display: none;">
            <button type="button" id="btnLoadMoreLibras" class="load-more-btn">Carregar mais</button>
          </div>
      </section>
    `;

    this.visibleCount = 5;
    this.searchInput = this.querySelector("#searchInputLibras");
    this.clearBtn = this.querySelector("#clearSearchLibras");
    this.searchIcon = this.querySelector("#searchIconLibras");
    this.loadMoreBtn = this.querySelector("#btnLoadMoreLibras");
    this.setupListeners();
  }

  setupListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.handleSearch(e.target.value);
      });

      // Ocultar dropdown ao clicar fora da busca
      document.addEventListener("click", (e) => {
        const topSearch = this.querySelector(".top-search");
        if (topSearch && !topSearch.contains(e.target)) {
          const dropdown = this.querySelector("#searchResultsDropdown");
          if (dropdown) dropdown.classList.add("hidden");
        }
      });
    }

    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => {
        this.clearSearch();
      });
    }

    if (this.searchIcon) {
      this.searchIcon.addEventListener("click", () => {
        const query = this.searchInput ? this.searchInput.value : "";
        this.visibleCount = 5;
        this.renderLessons(query);
        const dropdown = this.querySelector("#searchResultsDropdown");
        if (dropdown) dropdown.classList.add("hidden");
      });
    }

    if (this.loadMoreBtn) {
      this.loadMoreBtn.addEventListener("click", () => {
        this.visibleCount += 5;
        const query = this.searchInput ? this.searchInput.value : "";
        this.renderLessons(query);
      });
    }
  }

  clearSearch() {
    this.visibleCount = 5;
    if (this.searchInput) {
      this.searchInput.value = "";
    }
    if (this.clearBtn) {
      this.clearBtn.classList.add("hidden");
    }
    const dropdown = this.querySelector("#searchResultsDropdown");
    if (dropdown) {
      dropdown.classList.add("hidden");
      dropdown.innerHTML = "";
    }
    this.renderLessons();
  }

  updateData() {
    this.visibleCount = 5;
    this.renderLessons();
  }

  handleSearch(text) {
    const dropdown = this.querySelector("#searchResultsDropdown");
    if (!dropdown || !state.data) return;

    const query = text.trim().toLowerCase();

    // Alternar visibilidade do botão de limpar
    if (this.clearBtn) {
      if (text.length > 0) {
        this.clearBtn.classList.remove("hidden");
      } else {
        this.clearBtn.classList.add("hidden");
      }
    }

    // Sempre que realizar uma nova busca, reinicia o contador de itens visíveis
    this.visibleCount = 5;

    // Se a busca estiver vazia, esconde o dropdown e restaura a lista completa de aulas na página
    if (query.length === 0) {
      dropdown.classList.add("hidden");
      dropdown.innerHTML = "";
      this.renderLessons();
      return;
    }

    // Filtrar as aulas para exibir no autocomplete do dropdown
    const results = state.data.lessons.filter((lesson) =>
      lesson.title.toLowerCase().includes(query)
    );

    dropdown.innerHTML = "";
    if (results.length === 0) {
      dropdown.innerHTML =
        '<div style="padding: 12px; text-align: center; color: var(--muted); font-size: 14px;">Nenhuma aula encontrada.</div>';
    } else {
      results.forEach((lesson) => {
        const item = document.createElement("div");
        item.className = "search-dropdown__item";
        item.innerHTML = `
          <div>
            <h4 style="margin: 0; font-size: 14px; color: var(--ink);">${escapeHtml(lesson.title)}</h4>
          </div>
        `;
        item.addEventListener("click", () => {
          dropdown.classList.add("hidden");
          this.searchInput.value = lesson.title; // Coloca o nome da aula selecionada no input
          if (this.clearBtn) {
            this.clearBtn.classList.remove("hidden");
          }
          this.visibleCount = 5;
          this.renderLessons(lesson.title); // Filtra o vídeo diretamente na própria página (mostra apenas a aula selecionada)
        });
        dropdown.appendChild(item);
      });
    }
    dropdown.classList.remove("hidden");
  }

  renderLessons(filterQuery = "") {
    const box = this.querySelector("#lessonsList");
    if (!box || !state.data) return;

    const loadMoreContainer = this.querySelector("#loadMoreContainer");

    const query = filterQuery.trim().toLowerCase();
    const filteredLessons = state.data.lessons.filter((lesson) =>
      lesson.title.toLowerCase().includes(query)
    );

    if (filteredLessons.length === 0) {
      box.innerHTML = `<div style="text-align: center; color: var(--muted); padding: 24px; font-size: 14px;">Nenhuma aula correspondente encontrada.</div>`;
      if (loadMoreContainer) {
        loadMoreContainer.style.display = "none";
      }
      return;
    }

    // Obter apenas os itens que devem ser exibidos de acordo com a paginação
    const itemsToShow = filteredLessons.slice(0, this.visibleCount);

    box.innerHTML = "";
    itemsToShow.forEach((lesson) => {
      const card = document.createElement("div");
      card.className = "lesson";
      card.innerHTML = `
        <p class="lesson__title">${escapeHtml(lesson.title)}</p>
        <video class="lesson__video" controls ${
          lesson.videoUrl ? "" : "poster=''"
        }>
          ${
            lesson.videoUrl
              ? `<source src="${lesson.videoUrl}" type="video/mp4" />`
              : ""
          }
          Seu navegador não suporta vídeo.
        </video>
      `;
      box.appendChild(card);
    });

    // Exibir ou ocultar o botão "Carregar mais"
    if (loadMoreContainer) {
      if (filteredLessons.length > this.visibleCount) {
        loadMoreContainer.style.display = "block";
      } else {
        loadMoreContainer.style.display = "none";
      }
    }
  }
}

customElements.define("screen-libras", ScreenLibras);
