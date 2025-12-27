# Life Coach App - Research & Design

## Popis projektu

Jednoduchá aplikace pro osobni rozvoj. Uzivatel popise, jak se citi a jak mu jde zivot. Backend (s LLM) identifikuje 3 hlavni problemy, uzivatel je potvrdi a dostane doporuceni.

## User Flow

```
1. Uzivatel otevre aplikaci
2. Zobrazi se formular s otazkami:
   - "Jak se dnes citis?"
   - "Co te v posledni dobe trapi?"
   - "Co bys chtel zmenit?"
3. Uzivatel odesle odpovedi -> POST /api/analyze
4. Backend (LLM) analyzuje a vrati 3 hlavni problemy
5. Uzivatel vidi problemy a muze je potvrdit nebo upravit
6. Po potvrzeni -> POST /api/recommend
7. Backend vrati doporuceni pro kazdy problem
8. Uzivatel vidi doporuceni
```

## Architektura

```
┌─────────────────┐     HTTP/JSON     ┌─────────────────┐
│    Frontend     │ <───────────────> │    Backend      │
│   (Next.js)     │                   │   (FastAPI)     │
│   Port 3000     │                   │   Port 8000     │
└─────────────────┘                   └────────┬────────┘
                                               │
                                               v
                                      ┌─────────────────┐
                                      │  Anthropic API  │
                                      │  (Claude)       │
                                      └─────────────────┘
```

## Tech Stack

### Backend (Python)
- **FastAPI** - jednoduchy, rychly, automaticka OpenAPI dokumentace
- **anthropic** - oficialni SDK pro Claude API
- **uvicorn** - ASGI server
- **python-dotenv** - pro .env soubory

### Frontend (TypeScript)
- **Next.js 14** - App Router, jednoduchý setup
- **Tailwind CSS** - rychle stylovani bez psani CSS
- **fetch** - nativni, zadne extra knihovny

## API Endpoints

### POST /api/analyze
Request:
```json
{
  "feeling": "string",
  "troubles": "string",
  "changes": "string"
}
```

Response:
```json
{
  "problems": [
    {"id": 1, "title": "...", "description": "..."},
    {"id": 2, "title": "...", "description": "..."},
    {"id": 3, "title": "...", "description": "..."}
  ]
}
```

### POST /api/recommend
Request:
```json
{
  "problems": [
    {"id": 1, "title": "...", "description": "..."},
    ...
  ]
}
```

Response:
```json
{
  "recommendations": [
    {"problem_id": 1, "advice": "..."},
    {"problem_id": 2, "advice": "..."},
    {"problem_id": 3, "advice": "..."}
  ]
}
```

## Struktura projektu

```
viktor-crashcourse/
├── backend/
│   ├── main.py           # FastAPI app + endpointy
│   ├── llm.py            # Volani Anthropic API
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── page.tsx      # Hlavni stranka s formularem
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── QuestionForm.tsx
│   │   ├── ProblemsList.tsx
│   │   └── Recommendations.tsx
│   ├── package.json
│   └── .env.local.example
└── docs/
    └── research.md
```

## Konkurencni analyza

### Hlavni hraci na trhu (2024-2025)

| Aplikace | Zamereni | Cena | Hodnoceni | Klicove funkce |
|----------|----------|------|-----------|----------------|
| **Wysa** | Uzkost, stres | $13.99/mesic | 4.8 | CBT techniky, mindfulness, sleep tools, volitelny lidsky kouc |
| **Woebot** | Deprese, CBT | Zdarma (in-app) | 4.7 | CBT konverzace, mood tracking, direktivni pristup |
| **Replika** | Companionship | $19.99/mesic | 4.5 | Personalizovany AI companion, denni konverzace, emocionalni podpora |
| **Terra** | Komplexni terapie | $19.99/mesic | - | 24/7 pristup, krizova podpora, pokrocila personalizace |

### Klinicka ucinnost (dle studii)
- **Woebot**: Nejlepsi pro depresi (prumerne snizeni 11.00 bodu)
- **Replika**: Nejlepsi pro uzkost (8.01 bodu)
- **Wysa**: Stredni vysledky (deprese 7.00, uzkost 5.00)

### Co delaji dobre
- **Anonymita** - zadna registrace, okamzity pristup
- **24/7 dostupnost** - na rozdil od lidskeho terapeuta
- **CBT techniky** - overene metody kognitivne-behavioralni terapie
- **Mood tracking** - dlouhodobe sledovani nalady
- **Personalizace** - uceni se z predchozich konverzaci

### Nase diferenciace
Nasa aplikace je **jednodussi a zamerena na akcni kroky**:
- Zadny "companion" pristup - ciste prakticke
- 3 konkretni problemy misto obecneho chatu
- Jasna doporuceni k akci
- Bez subscripce - jednorazove pouziti

---

## Proc Anthropic (Claude) a ne OpenAI?

1. **Lepsi pro coaching/empaticke odpovedi** - Claude je znamy pro empatictejsi a promyslenejsi odpovedi
2. **Jednodussi SDK** - `anthropic` knihovna je jednodusi nez `openai`
3. **Levnejsi** - Claude Haiku 4.5 je velmi levny ($1/1M input, $5/1M output tokens)

Doporuceny model: **claude-haiku-4-5-20251001** (nejnovejsi Haiku, nejrychlejsi, "near-frontier intelligence")

## Spusteni

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Vlozit ANTHROPIC_API_KEY do .env
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Nastavit NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

## TODO - Implementace

- [ ] Vytvorit backend strukturu
- [ ] Implementovat /api/analyze endpoint
- [ ] Implementovat /api/recommend endpoint
- [ ] Vytvorit Next.js frontend
- [ ] Spojit frontend s backendem
- [ ] Otestovat cely flow

## Poznamky

- Zadna databaze - vse v pameti, jednoduche
- Zadna autentizace - jen lokalni vyvoj
- CORS povolen pro localhost:3000
