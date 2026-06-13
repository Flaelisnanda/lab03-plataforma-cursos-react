# LAB03 — Plataforma de Cursos Online (React)

Plataforma acadêmica para gestão de cursos, matrículas, progresso, certificados e assinaturas.

## Tecnologias

- **React 19** + Vite
- **Bootstrap 5** — layout responsivo e componentes UI
- **React Router** — roteamento entre páginas
- **JSON Server** — API REST simulada
- **Classes JS** — modelagem das entidades em `src/models/`

## Critérios de Avaliação Atendidos

| Critério | Implementação |
|---|---|
| Design e Usabilidade | Bootstrap 5, sidebar, cards, tabelas, formulários validados |
| Estrutura do Projeto | `components/`, `pages/`, `models/`, `services/`, `routes/`, `context/`, `hooks/` |
| Roteamento | React Router DOM com rotas por módulo |
| Consumo da API | JSON Server via `fetch` em `services/platformService.js` |
| GitHub | Repositório pronto para push |

## Estrutura

```
src/
├── components/
│   ├── layout/       # Navbar, Sidebar, MainLayout
│   └── ui/           # StatCard, FormCard, DataCard, Toast...
├── pages/            # Uma página por módulo (Dashboard, Cursos...)
├── models/           # Classes das entidades (Usuario, Curso...)
├── services/         # api.js + platformService.js (REST)
├── routes/           # AppRoutes.jsx
├── context/          # AppContext (estado global + API)
├── hooks/            # useData.js
└── utils/            # validators.js
db.json               # Banco simulado do JSON Server
```

## Como Executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar API + Frontend (recomendado)

```bash
npm start
```

Isso executa:
- **JSON Server** em `http://localhost:3001`
- **React (Vite)** em `http://localhost:5173`

### Ou separadamente

```bash
# Terminal 1 — API
npm run server

# Terminal 2 — Frontend
npm run dev
```

## Rotas

| Rota | Página |
|---|---|
| `/` | Dashboard |
| `/categorias` | Categorias |
| `/cursos` | Cursos |
| `/trilhas` | Trilhas |
| `/modulos` | Módulos & Aulas |
| `/usuarios` | Cadastro de Usuários |
| `/matriculas` | Matrículas |
| `/progresso` | Progresso |
| `/certificados` | Certificados |
| `/planos` | Planos |
| `/checkout` | Checkout & Pagamentos |

## Publicar no GitHub

```bash
git init
git add .
git commit -m "feat: plataforma de cursos online com React, Bootstrap e JSON Server"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/lab03-plataforma-cursos.git
git push -u origin main
```

## Autores

Projeto acadêmico — LAB03
