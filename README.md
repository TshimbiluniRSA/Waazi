# Waazi — Health Risk Assessment

Waazi helps users assess their risk for diabetes and hypertension through a short questionnaire. Powered by Django, React, and Claude AI for personalised recommendations.

## Stack

- **Backend**: Django 5 + Django REST Framework + SimpleJWT
- **AI**: Anthropic Claude (`claude-sonnet-4-20250514`)
- **PDF Reports**: WeasyPrint
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Database**: PostgreSQL (Docker) / SQLite (local dev)

## Run locally with Docker

```bash
# Copy the example env and add your Anthropic API key
cp health-risk-mvp/backend/.env.example health-risk-mvp/backend/.env
# Edit .env and set ANTHROPIC_API_KEY=sk-...

# Start all services (db, backend, frontend)
docker compose up --build
```

| Service  | URL                         |
|----------|-----------------------------|
| Frontend | http://localhost:5173       |
| Backend  | http://localhost:8000       |
| API docs | http://localhost:8000/api/docs/ |

## Run locally without Docker

### Backend
```bash
cd health-risk-mvp/backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # set ANTHROPIC_API_KEY
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd health-risk-mvp/frontend
npm install
npm run dev
```

## Notes

- No backend integration yet.
- Risk scoring, recommendations, FAQ, and health facilities are mock/demo data in `src/mockData.js`.
