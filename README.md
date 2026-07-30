# WiFiSense

Radar de presença com Wi-Fi CSI.

## Pergunta do MVP

> Consigo detectar e visualizar pessoas utilizando sinais Wi-Fi?

Enquanto a resposta estiver em validação: **sem login, sem banco, sem Supabase**. Tudo em memória.

## Arquitetura

```
ESP32 (CSI)
   → Servidor Python (filtragem + modelo → posição)
   → API REST + WebSocket
   → React (mapa / dashboard / console)
```

O React **não** recebe CSI bruto — apenas:

- posição (x, y)
- movimento (direção, velocidade)
- qualidade (confiança)
- timestamp

## Por que camadas?

```
Services
├── ApiService      → HTTP
├── RealtimeService → WebSocket (ou mock)
└── StorageService  → memória hoje / Supabase amanhã
```

A UI conversa só com interfaces. Trocar persistência não exige reestruturar o frontend.

## Estrutura

```
src/
  components/   # UI reutilizável
  pages/        # Dashboard, Planta, Console
  layouts/      # MainLayout
  hooks/        # realtime, floor plan, services
  services/     # api / websocket / storage
  models/       # planta demo
  types/        # contratos do domínio
  utils/
  constants/
  styles/
server/         # FastAPI + WebSocket (processamento)
```

## Como rodar

### Frontend (simulador embutido)

```bash
npm install
npm run dev
```

Por padrão `VITE_USE_MOCK=true`: o browser simula detecções sem precisar do Python.

### Backend (opcional nesta fase)

```bash
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Depois, no `.env`:

```
VITE_USE_MOCK=false
```

O Vite faz proxy de `/api` e `/ws` para `localhost:8000`.

## Telas

| Rota | Função |
|------|--------|
| `/` | Dashboard — status, FPS, latência, sensores, preview |
| `/planta` | Mapa Konva — paredes, sensores, pessoa, direção |
| `/console` | Logs e métricas de processamento |

## Evolução

1. **Fase 1 (agora)** — MVP em memória, WebSocket, uma residência  
2. **Fase 2** — histórico, replay, heatmap persistente  
3. **Fase 3** — Supabase (auth, multiuser, casas)  
4. **Fase 4** — múltiplas pessoas, respiração, quedas, mobile  
