import "../../assets/styles/screen-dict.css";

class ScreenDict extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section id="screen-dict" class="screen" aria-label="Dicionário">
        <div class="top-search">
            <span class="icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg></span>
            <input id="searchInputDict" type="text" placeholder="Buscar sinais" autocomplete="off" />
            <div id="searchResultsDropdown" class="search-dropdown hidden"></div>
        </div>

        <div class="hero">
            <h2 class="hero__title">Matemática</h2>
        </div>

        <div id="categoryGrid" class="grid"></div>

        <div id="bottomSheetOverlay" class="bottom-sheet-overlay"></div>
        <div id="bottomSheet" class="bottom-sheet">
            <div class="bottom-sheet__header">
                <h3 id="bottomSheetTitle" class="section-title">Sinais</h3>
                <button type="button" id="closeBottomSheet" class="bottom-sheet__close">✕</button>
            </div>
            <div class="bottom-sheet__content">
                <div id="dictSignalsList" class="list"></div>
            </div>
        </div>
      </section>
    `;

    this.searchInput = this.querySelector("#searchInputDict");
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

    const closeBtn = this.querySelector("#closeBottomSheet");
    const overlay = this.querySelector("#bottomSheetOverlay");

    if (closeBtn)
      closeBtn.addEventListener("click", () => this.closeBottomSheet());
    if (overlay)
      overlay.addEventListener("click", () => this.closeBottomSheet());
  }

  openBottomSheet() {
    const sheet = this.querySelector("#bottomSheet");
    const overlay = this.querySelector("#bottomSheetOverlay");
    if (sheet) sheet.classList.add("active");
    if (overlay) overlay.classList.add("active");
  }

  closeBottomSheet() {
    const sheet = this.querySelector("#bottomSheet");
    const overlay = this.querySelector("#bottomSheetOverlay");
    if (sheet) sheet.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    state.selectedCategory = null;
  }

  updateData() {
    this.renderCategoryGrid();
    this.renderDictSignals();
  }

  handleSearch(text) {
    const dropdown = this.querySelector("#searchResultsDropdown");
    if (!dropdown || !state.data) return;

    const query = normalizeString(text);
    if (query.length === 0) {
      dropdown.classList.add("hidden");
      dropdown.innerHTML = "";
      return;
    }

    const results = state.data.signals.filter((s) =>
      normalizeString(s.term).includes(query),
    );

    dropdown.innerHTML = "";
    if (results.length === 0) {
      dropdown.innerHTML =
        '<div style="padding: 12px; text-align: center; color: var(--muted); font-size: 14px;">Nenhum sinal encontrado.</div>';
    } else {
      results.forEach((s) => {
        const item = document.createElement("div");
        item.className = "search-dropdown__item";
        item.innerHTML = `
          <div>
            <h4>${escapeHtml(s.term)}</h4>
            <p>${escapeHtml(categoryName(s.category))} • ${escapeHtml(
              s.topic,
            )}</p>
          </div>
          <span style="color: var(--primary); font-size: 18px;">▶︎</span>
        `;
        item.addEventListener("click", () => {
          dropdown.classList.add("hidden");
          this.searchInput.value = ""; // Limpa a busca
          if (s.video) {
            if (window.openVideoModal) window.openVideoModal(s.video, s.term);
          } else {
            alert("Vídeo em breve para: " + s.term);
          }
        });
        dropdown.appendChild(item);
      });
    }
    dropdown.classList.remove("hidden");
  }

  renderCategoryGrid() {
    const grid = this.querySelector("#categoryGrid");
    if (!grid || !state.data) return;
    grid.innerHTML = "";

    state.data.categories.forEach((cat) => {
      const iconsMap = {
        numero: "🔢",
        operacoes: "➗",
        algebra: "🧮",
        calculo: "📈",
        logica: "🧠",
        estatistica: "📊",
        aritmetica: "➕",
        geometria: "📐",
        geometria_analitica: "⛶",
        trigonometria: "📐",
        probabilidade: "🎲",
        matematica_financeira: "💰",
      };
      const catIcon = iconsMap[cat.id] || "📘";

      const card = document.createElement("button");
      card.type = "button";
      card.className = "grid-card";
      card.innerHTML = `
        <div class="grid-card__icon">${catIcon}</div>
        <p class="grid-card__title">${escapeHtml(cat.title)}</p>
        <p class="grid-card__subtitle">${escapeHtml(cat.subtitle)}</p>
      `;
      card.addEventListener("click", () => {
        state.selectedCategory = cat.id;
        this.renderDictSignals();
        this.openBottomSheet();
      });
      grid.appendChild(card);
    });
  }

  renderDictSignals() {
    const list = this.querySelector("#dictSignalsList");
    if (!list || !state.data) return;
    list.innerHTML = "";

    const selected = state.selectedCategory;
    if (!selected) return;

    const sheetTitle = this.querySelector("#bottomSheetTitle");
    if (sheetTitle) {
      sheetTitle.textContent = categoryName(selected);
    }

    let items = state.data.signals.filter((s) => s.category === selected);

    if (items.length === 0) {
      list.innerHTML = `<div class="list-item">
        <div class="list-item__left">
          <h4>Nenhum sinal encontrado</h4>
          <p>Tente outra palavra ou categoria.</p>
        </div>
        <span class="play">—</span>
      </div>`;
      return;
    }

    items.forEach((s, index) => {
      const catName = categoryName(s.category);
      const row = document.createElement("div");
      row.className = "list-item";
      row.innerHTML = `
        <div class="list-item__left">
          <h4>${index + 1}. ${escapeHtml(s.term)}</h4>
          <p>${escapeHtml(catName)} • ${escapeHtml(s.topic)}</p>
        </div>
        <button class="play" type="button">▶︎</button>
      `;
      // Torna a linha inteira clicável
      row.style.cursor = "pointer";
      row.addEventListener("click", () => {
        if (s.video) {
          if (window.openVideoModal) {
            window.openVideoModal(s.video, s.term);
          }
        } else {
          alert(`Vídeo em breve para: ${s.term}`);
        }
      });
      list.appendChild(row);
    });
  }
}

customElements.define("screen-dict", ScreenDict);
