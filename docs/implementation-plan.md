# Implementation Plan: Life Coach App

## Přehled fází

| Fáze | Název | Paralelizace | Počet agentů |
|------|-------|--------------|--------------|
| 1 | Inicializace projektu | Sekvenční | 1 |
| 2 | Základní setup | Paralelní | 2 |
| 3 | Backend implementace | Paralelní | 2 |
| 4 | Frontend komponenty | Paralelní | 3 |
| 5 | Hlavní stránka a integrace | Sekvenční | 1 |
| 6 | Testování | Paralelní | 2 |

---

## Fáze 1: Inicializace projektu

**Typ:** Sekvenční (musí být první)

- [ ] **1.1** Vytvořit složkovou strukturu: `backend/`, `frontend/`, `docs/`
- [ ] **1.2** Inicializovat Git repozitář (pokud není)

---

## Fáze 2: Základní setup

**Typ:** Paralelní (2 agenti)

### Agent A: Backend setup

- [ ] **2.1** Vytvořit `backend/requirements.txt`
  - Obsah: `fastapi`, `uvicorn[standard]`, `anthropic`, `python-dotenv`, `pydantic`
- [ ] **2.2** Vytvořit `backend/.env.example`
  - Obsah: `ANTHROPIC_API_KEY=your-key-here`
- [ ] **2.3** Vytvořit `backend/main.py`
  - FastAPI app instance
  - CORS middleware pro `localhost:3000`
  - Základní struktura pro endpointy

### Agent B: Frontend setup

- [ ] **2.4** Inicializovat Next.js projekt
  - Příkaz: `npx create-next-app@14 frontend --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"`
- [ ] **2.5** Vytvořit `frontend/.env.local.example`
  - Obsah: `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [ ] **2.6** Upravit `frontend/app/globals.css`
  - Ponechat jen Tailwind direktivy (`@tailwind base/components/utilities`)

---

## Fáze 3: Backend implementace

**Typ:** Paralelní (2 agenti)

### Agent A: LLM modul (`backend/llm.py`)

- [ ] **3.1** Vytvořit funkci `analyze_problems()`
  ```python
  async def analyze_problems(feeling: str, troubles: str, changes: str) -> list[dict]:
      """
      Volá Claude Haiku 4.5, vrací 3 problémy.
      Každý problém má: id, title, description
      """
  ```
- [ ] **3.2** Vytvořit funkci `get_recommendations()`
  ```python
  async def get_recommendations(problems: list[dict]) -> list[dict]:
      """
      Volá Claude, vrací doporučení.
      Každé doporučení má: problem_id, advice
      """
  ```
- [ ] **3.3** Implementovat strukturovaný výstup z LLM
  - Použít Pydantic modely nebo JSON schema v system promptu
  - Zajistit, že LLM vždy vrátí přesně 3 problémy

### Agent B: API endpointy (`backend/main.py`)

- [ ] **3.4** Definovat Pydantic modely
  ```python
  class AnalyzeRequest(BaseModel):
      feeling: str
      troubles: str
      changes: str

  class Problem(BaseModel):
      id: int
      title: str
      description: str

  class AnalyzeResponse(BaseModel):
      problems: list[Problem]

  class RecommendRequest(BaseModel):
      problems: list[Problem]

  class Recommendation(BaseModel):
      problem_id: int
      advice: str

  class RecommendResponse(BaseModel):
      recommendations: list[Recommendation]
  ```
- [ ] **3.5** Implementovat `POST /api/analyze`
  - Přijme: `feeling`, `troubles`, `changes`
  - Vrátí: `problems` (3 položky)
- [ ] **3.6** Implementovat `POST /api/recommend`
  - Přijme: `problems`
  - Vrátí: `recommendations`
- [ ] **3.7** Přidat `GET /health`
  - Vrátí: `{"status": "ok"}`

---

## Fáze 4: Frontend komponenty

**Typ:** Paralelní (3 agenti)

### Agent A: QuestionForm (`frontend/components/QuestionForm.tsx`)

- [ ] **4.1** Vytvořit formulář se 3 textarea inputy
  - "Jak se dnes cítíš?"
  - "Co tě v poslední době trápí?"
  - "Co bys chtěl změnit?"
- [ ] **4.2** Definovat props interface
  ```typescript
  interface QuestionFormProps {
    onSubmit: (data: {
      feeling: string;
      troubles: string;
      changes: string;
    }) => void;
    isLoading: boolean;
  }
  ```
- [ ] **4.3** Stylovat s Tailwind
  - Karty s rounded corners a shadow
  - Responzivní design (mobile-first)
  - Disabled stav při loading

### Agent B: ProblemsList (`frontend/components/ProblemsList.tsx`)

- [ ] **4.4** Vytvořit komponentu zobrazující 3 karty s problémy
  - Každá karta: title (h3) + description (p)
  - Číslováníproblemů (1, 2, 3)
- [ ] **4.5** Definovat props interface
  ```typescript
  interface Problem {
    id: number;
    title: string;
    description: string;
  }

  interface ProblemsListProps {
    problems: Problem[];
    onConfirm: () => void;
    onEdit?: (id: number, problem: Problem) => void;
    isLoading: boolean;
  }
  ```
- [ ] **4.6** Přidat interaktivní prvky
  - Tlačítko "Potvrdit problémy"
  - Možnost inline editace (optional)
  - Loading spinner na tlačítku

### Agent C: Recommendations (`frontend/components/Recommendations.tsx`)

- [ ] **4.7** Vytvořit komponentu zobrazující doporučení
  - Pro každý problém zobrazit jeho title + advice
  - Vizuálně odlišit jednotlivá doporučení
- [ ] **4.8** Definovat props interface
  ```typescript
  interface Recommendation {
    problem_id: number;
    advice: string;
  }

  interface RecommendationsProps {
    recommendations: Recommendation[];
    problems: Problem[]; // pro zobrazení titulků
  }
  ```
- [ ] **4.9** Přidat tlačítko "Začít znovu"
  - Reset flow na začátek
  - Callback `onReset?: () => void`

---

## Fáze 5: Hlavní stránka a integrace

**Typ:** Sekvenční

- [ ] **5.1** Implementovat state machine v `frontend/app/page.tsx`
  ```typescript
  type Step = 'form' | 'problems' | 'recommendations';
  const [step, setStep] = useState<Step>('form');
  ```
- [ ] **5.2** Implementovat API calls
  ```typescript
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async function analyzeProblems(data) {
    const res = await fetch(`${apiUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  ```
- [ ] **5.3** Propojit komponenty
  - QuestionForm → (submit) → loading → ProblemsList
  - ProblemsList → (confirm) → loading → Recommendations
  - Recommendations → (reset) → QuestionForm
- [ ] **5.4** Přidat error handling
  - Try/catch kolem API calls
  - Zobrazit error message uživateli
  - Možnost retry
- [ ] **5.5** Upravit `frontend/app/layout.tsx`
  - Title: "Life Coach App"
  - Meta description
  - Základní layout wrapper

---

## Fáze 6: Testování

**Typ:** Paralelní (2 agenti)

### Agent A: Backend testy

- [ ] **6.1** Přidat test dependencies do `requirements.txt`
  - `pytest`
  - `pytest-asyncio`
  - `httpx`
- [ ] **6.2** Vytvořit `backend/tests/test_api.py`
  - Test health endpoint
  - Test /api/analyze s mock LLM response
  - Test /api/recommend s mock LLM response
  - Test validation errors (chybějící pole)
- [ ] **6.3** Vytvořit `backend/tests/test_llm.py`
  - Mock Anthropic client
  - Test analyze_problems vrací 3 problémy
  - Test get_recommendations vrací správný počet doporučení

### Agent B: E2E test

- [ ] **6.4** Manuální test celého flow
  1. Spustit backend: `cd backend && uvicorn main:app --reload`
  2. Spustit frontend: `cd frontend && npm run dev`
  3. Otevřít http://localhost:3000
  4. Vyplnit formulář a odeslat
  5. Potvrdit problémy
  6. Zkontrolovat doporučení
  7. Kliknout "Začít znovu"
- [ ] **6.5** Ověřit edge cases
  - CORS funguje správně
  - Error handling při výpadku backendu
  - Loading stavy se zobrazují
  - Responzivní design na mobilu

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
```

---

## Spuštění projektu

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Upravit .env a vložit ANTHROPIC_API_KEY
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
