# Implementation Plan: Life Coach App

## Stav projektu

| Fáze | Název | Status |
|------|-------|--------|
| 1 | Inicializace projektu | HOTOVO |
| 2 | Základní setup | HOTOVO |
| 3 | Backend implementace | HOTOVO |
| 4 | Frontend komponenty | HOTOVO |
| 5 | Hlavní stránka a integrace | HOTOVO |
| 6 | Testování | HOTOVO |
| 7 | UI/UX vylepšení a lokalizace | HOTOVO |

---

## Fáze 1: Inicializace projektu

**Typ:** Sekvenční (musí být první)
**Status:** HOTOVO

- [x] **1.1** Vytvořit složkovou strukturu: `backend/`, `frontend/`, `docs/`
- [x] **1.2** Inicializovat Git repozitář

---

## Fáze 2: Základní setup

**Typ:** Paralelní (2 agenti)
**Status:** HOTOVO

### Agent A: Backend setup

- [x] **2.1** Vytvořit `backend/requirements.txt`
  - Obsah: `fastapi`, `uvicorn[standard]`, `anthropic`, `python-dotenv`, `pydantic`
  - Navíc přidáno: `pytest`, `pytest-asyncio`, `httpx` (test dependencies)
- [ ] **2.2** Vytvořit `backend/.env.example` - CHYBÍ!
  - Poznámka: Existuje pouze `.env` (necommitován), chybí example soubor
- [x] **2.3** Vytvořit `backend/main.py`
  - FastAPI app instance
  - CORS middleware pro `localhost:3000`
  - Základní struktura pro endpointy

### Agent B: Frontend setup

- [x] **2.4** Inicializovat Next.js projekt
  - Next.js 14 s TypeScript, Tailwind, ESLint, App Router
- [x] **2.5** Vytvořit `frontend/.env.local.example`
  - Obsah: `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [x] **2.6** Upravit `frontend/app/globals.css`
  - Ponechány jen Tailwind direktivy

---

## Fáze 3: Backend implementace

**Typ:** Paralelní (2 agenti)
**Status:** HOTOVO

### Agent A: LLM modul (`backend/llm.py`)

- [x] **3.1** Vytvořit funkci `analyze_problems()`
  ```python
  async def analyze_problems(feeling: str, troubles: str, changes: str) -> list[dict]:
      """
      Volá Claude Sonnet 4.5 (nikoliv Haiku), vrací 3 problémy.
      Každý problém má: id, title, description
      """
  ```
- [x] **3.2** Vytvořit funkci `get_recommendations()`
  ```python
  async def get_recommendations(problems: list[dict]) -> list[dict]:
      """
      Volá Claude Sonnet 4.5, vrací doporučení.
      Každé doporučení má: problem_id, advice
      """
  ```
- [x] **3.3** Implementovat strukturovaný výstup z LLM
  - Použito: Anthropic Beta API s `structured-outputs-2025-11-13`
  - JSON Schema definice v `output_format` parametru
  - Validace přesně 3 problémů

### Agent B: API endpointy (`backend/main.py`)

- [x] **3.4** Definovat Pydantic modely
  - `AnalyzeRequest`, `Problem`, `AnalyzeResponse`
  - `RecommendRequest`, `Recommendation`, `RecommendResponse`
- [x] **3.5** Implementovat `POST /api/analyze`
  - Přijme: `feeling`, `troubles`, `changes`
  - Vrátí: `problems` (3 položky)
  - Error handling s HTTPException
- [x] **3.6** Implementovat `POST /api/recommend`
  - Přijme: `problems`
  - Vrátí: `recommendations`
  - Error handling s HTTPException
- [x] **3.7** Přidat `GET /health`
  - Vrátí: `{"status": "ok"}`

---

## Fáze 4: Frontend komponenty

**Typ:** Paralelní (3 agenti)
**Status:** HOTOVO

### Agent A: QuestionForm (`frontend/src/components/QuestionForm.tsx`)

- [x] **4.1** Vytvořit formulář se 3 textarea inputy
  - "Jak se dnes cítíš?"
  - "Co tě v poslední době trápí?"
  - "Co bys chtěl/a změnit?"
- [x] **4.2** Definovat props interface
- [x] **4.3** Stylovat s Tailwind
  - Karty s rounded corners a shadow
  - Responzivní design (mobile-first)
  - Disabled stav při loading

### Agent B: ProblemsList (`frontend/src/components/ProblemsList.tsx`)

- [x] **4.4** Vytvořit komponentu zobrazující 3 karty s problémy
  - Každá karta: title (h3) + description (p)
  - Číslování problémů (1, 2, 3)
- [x] **4.5** Definovat props interface
- [x] **4.6** Přidat interaktivní prvky
  - Tlačítko "Potvrdit a získat doporučení"
  - Loading spinner na tlačítku

### Agent C: Recommendations (`frontend/src/components/Recommendations.tsx`)

- [x] **4.7** Vytvořit komponentu zobrazující doporučení
  - Pro každý problém zobrazit jeho title + advice
  - Vizuálně odlišit jednotlivá doporučení (barevný gradient)
- [x] **4.8** Definovat props interface
- [x] **4.9** Přidat tlačítko "Začít znovu"
  - Reset flow na začátek

---

## Fáze 5: Hlavní stránka a integrace

**Typ:** Sekvenční
**Status:** HOTOVO

- [x] **5.1** Implementovat state machine v `frontend/src/app/page.tsx`
  ```typescript
  type Step = 'form' | 'problems' | 'recommendations';
  const [step, setStep] = useState<Step>('form');
  ```
- [x] **5.2** Implementovat API calls
- [x] **5.3** Propojit komponenty
  - QuestionForm → (submit) → loading → ProblemsList
  - ProblemsList → (confirm) → loading → Recommendations
  - Recommendations → (reset) → QuestionForm
- [x] **5.4** Přidat error handling
  - Try/catch kolem API calls
  - Zobrazit error message uživateli
- [x] **5.5** Upravit `frontend/src/app/layout.tsx`
  - Title: "Life Coach App | Tvůj osobní kouč"
  - Meta description v češtině
  - Základní layout wrapper

---

## Fáze 6: Testování

**Typ:** Paralelní (2 agenti)
**Status:** HOTOVO

### Agent A: Backend testy

- [x] **6.1** Přidat test dependencies do `requirements.txt`
  - `pytest`, `pytest-asyncio`, `httpx`
- [x] **6.2** Vytvořit `backend/tests/test_api.py`
  - Test health endpoint
  - Test /api/analyze s mock LLM response
  - Test /api/recommend s mock LLM response
  - Test validation errors
- [x] **6.3** Vytvořit `backend/tests/test_llm.py`
  - Mock Anthropic client
  - Test analyze_problems vrací 3 problémy
  - Test get_recommendations vrací správný počet doporučení

### Agent B: E2E test

- [x] **6.4** Manuální test celého flow
  1. Spustit backend: `cd backend && uvicorn main:app --reload`
  2. Spustit frontend: `cd frontend && npm run dev`
  3. Otevřít http://localhost:3000
  4. Vyplnit formulář a odeslat
  5. Potvrdit problémy
  6. Zkontrolovat doporučení
  7. Kliknout "Začít znovu"
- [x] **6.5** Ověřit edge cases
  - CORS funguje správně
  - Error handling při výpadku backendu
  - Loading stavy se zobrazují
  - Responzivní design na mobilu

---

## Fáze 7: UI/UX vylepšení a lokalizace

**Typ:** Sekvenční
**Status:** HOTOVO (přidáno dodatečně)

### Commit: ae8efba - Czech language support

- [x] **7.1** Přidat českou lokalizaci pro LLM prompty
  - System prompty v češtině
  - Instrukce pro LLM odpovídat česky

### Commit: 73cf459 - UI polish

- [x] **7.2** Přidat step indikátory
  - Progress tracker (Krok 1/3, 2/3, 3/3)
  - Vizuální feedback dokončených kroků
- [x] **7.3** Modernizovat design
  - Gradient pozadí a tlačítka
  - Rounded-2xl corners
  - Shadow efekty
  - Backdrop blur na header
- [x] **7.4** Vylepšit header a layout
  - Logo s gradientem
  - Subtitle "Tvůj osobní průvodce"
  - Sticky header
  - Footer s "Powered by Claude AI"
- [x] **7.5** Přidat `'use client'` direktivy
  - QuestionForm.tsx
  - ProblemsList.tsx
  - Recommendations.tsx
- [x] **7.6** Přidat kontextové prvky
  - Info boxy s nápovědou
  - Success message v Recommendations
  - Emoji ikony pro vizuální vodítka
- [x] **7.7** Aktualizovat .gitignore
  - Přidáno `.playwright-mcp/`

---

## Zbývající práce

### Drobné úpravy

- [ ] **X.1** Vytvořit `backend/.env.example` (chybí, bezpečnostní riziko)
  - Obsah: `ANTHROPIC_API_KEY=your-key-here`

---

## Git historie

```
73cf459 feat: Polish UI with Czech localization and modern design
ae8efba feat: Add Czech language support for LLM responses
2ae7968 Initial commit: Life Coach App
```

---

## Vizualizace paralelizace

```
Fáze 1 (sekvenční)
    │
    v
Fáze 2 ─┬─ Agent A: Backend setup
        └─ Agent B: Frontend setup
              │
              v
Fáze 3 ─┬─ Agent A: LLM modul
        └─ Agent B: API endpointy
              │
              v
Fáze 4 ─┬─ Agent A: QuestionForm
        ├─ Agent B: ProblemsList
        └─ Agent C: Recommendations
              │
              v
Fáze 5 (sekvenční) - integrace
              │
              v
Fáze 6 ─┬─ Agent A: Backend testy
        └─ Agent B: E2E test
              │
              v
Fáze 7 (sekvenční) - UI/UX polish
```

---

## Technické detaily

### Backend
- **Model:** Claude Sonnet 4.5 (`claude-sonnet-4-5`)
- **Structured Outputs:** Beta API `structured-outputs-2025-11-13`
- **Framework:** FastAPI s async podporou

### Frontend
- **Framework:** Next.js 14 s App Router
- **Styling:** Tailwind CSS s custom gradients
- **Jazyk:** TypeScript

---

## Spuštění projektu

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# Vytvořit .env s ANTHROPIC_API_KEY
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Ověřit NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

### Testy
```bash
cd backend
pytest -v
```
