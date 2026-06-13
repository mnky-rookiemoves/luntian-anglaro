# 🌿 LUNTIAN ANGLARO — Ang Laro
### Guardians of the Environment — Web Companion

> *"Luntiang Puso, Luntiang Gawa"*

A web-based companion game for **LUNTIAN: Guardians of the Environment**, built with React + Django.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS |
| 3D Engine | Three.js |
| State | Zustand |
| Backend | Django + DRF |
| Database | SQLite (dev) / PostgreSQL (prod) |

## 🚀 Quick Start

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver