# 🔍 GitProfile

### Plataforma Inteligente para Análise de Perfis GitHub

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase)

---

**GitProfile** é uma aplicação web fullstack construída para profissionais de recrutamento técnico que precisam avaliar rapidamente o perfil GitHub de candidatos. A plataforma combina busca inteligente, análise visual de stacks tecnológicas e um sistema completo de triagem de candidatos — tudo em uma interface moderna, rápida e responsiva.

> **🎯 Proposta de Valor:** Reduzir o tempo de análise de perfis GitHub de minutos para segundos, enquanto fornece insights acionáveis sobre as competências técnicas dos candidatos.

---

## ✨ Funcionalidades Principais

### 🔎 **Sistema de Busca Inteligente**

- Validação em tempo real de usernames GitHub via **Zod schema**
- Busca instantânea com feedback visual imediato
- Histórico de buscas híbrido (localStorage + Supabase cloud sync)

### 👤 **Dashboard de Perfil Completo**

- Visualização rica do perfil com avatar, bio, followers e data de criação
- **Scroll infinito** para listagem otimizada de repositórios
- Filtros dinâmicos por nome e linguagem de programação
- **Gráfico de distribuição de stacks** com porcentagens visuais

### 📁 **Explorador de Repositórios**

- Navegação intuitiva por estrutura de pastas
- **Visualizador de código** com syntax highlighting
- Detecção automática de arquivos binários/mídia
- Estatísticas detalhadas (stars, forks, issues)

### 🤝 **Sistema de Networking**

- Lista de followers/following com navegação entre perfis
- Funcionalidade de follow/unfollow integrada
- **Comparação de stacks** entre dois desenvolvedores

### 📋 **Dashboard de Triagem de Candidatos** _(Recruiters)_

- Sistema Kanban para gestão de candidatos (Pendente → Triagem → Aprovado → Recusado)
- **Formulário de avaliação** com notas e status
- Gestão de vagas com requisitos personalizáveis
- **Perfis e repositórios salvos** para consulta rápida

### 🔐 **Autenticação & Segurança**

- Login/cadastro via e-mail + senha (Supabase Auth)
- Login social rápido via **OAuth (Google e GitHub)**
- Sessões persistentes com refresh automático
- Dados protegidos por **Row Level Security (RLS)**

> [!IMPORTANT]
> **Aviso de Teste no Ambiente de Demonstração (Supabase Free Tier):**
> Devido às cotas do plano gratuito do Supabase, o disparo de e-mails transacionais de confirmação está limitado a **2 cadastros por hora**. Para testar a aplicação sem bloqueios ou tempo de espera, **recomendamos utilizar o Login Social via OAuth (Google ou GitHub)**.

### ⚡ **Experiência do Usuário**

- **Dark mode** nativo com design system consistente
- Animações suaves e micro-interações
- **Keyboard shortcuts** para navegação rápida
- Notificações toast para feedback imediato
- Design 100% responsivo (mobile-first)

---

## 🏗️ Arquitetura & Stack Técnica

### **Frontend Core**

| Tecnologia | Versão | Finalidade                             |
| ---------- | ------ | -------------------------------------- |
| React      | 19.x   | UI Library com Server Components ready |
| TypeScript | 6.x    | Type safety e developer experience     |
| Vite       | 8.x    | Build tool ultrarrápido                |

### **State Management**

| Tecnologia     | Camada | Uso                                            |
| -------------- | ------ | ---------------------------------------------- |
| Zustand        | Client | UI state, auth, follow system                  |
| TanStack Query | Server | API cache, optimistic updates, infinite scroll |

### **Styling & Design System**

| Tecnologia  | Versão | Finalidade        |
| ----------- | ------ | ----------------- |
| TailwindCSS | 4.x    | Utility-first CSS |
| DaisyUI     | 5.x    | Component library |

### **Backend & Data**

| Tecnologia | Finalidade                              |
| ---------- | --------------------------------------- |
| Supabase   | Database (PostgreSQL) + Auth + Realtime |
| GitHub API | Dados de perfis e repositórios          |

### **Validação & Forms**

| Tecnologia      | Finalidade        |
| --------------- | ----------------- |
| Zod             | Schema validation |
| React Hook Form | Form management   |

### **Testes & Qualidade**

| Tecnologia            | Finalidade                   |
| --------------------- | ---------------------------- |
| Vitest                | Unit & integration testing   |
| React Testing Library | Component testing            |
| MSW                   | API mocking                  |
| Husky + Commitlint    | Git hooks & commit standards |

---

## 📂 Estrutura do Projeto

```
src/
├── components/
│   ├── layout/           # Header, RootLayout, NotificationPopover
│   ├── modals/           # StackComparison, FollowersList, AccountSettings
│   ├── profile/          # ProfileCard, EngagementSummary, CandidateTriage
│   │   └── repository/   # RepositoryCard, FileExplorer, CodeViewer
│   └── ui/               # Button, IconButton, Modal (Design System)
├── hooks/                # Custom hooks (useGithubUser, useGithubRepos, etc.)
├── lib/                  # Supabase client, color utilities
├── pages/                # Home, Profile, Login, CandidatesDashboard, etc.
├── services/             # GitHub API service layer
├── store/                # Zustand stores (auth, follow, candidates, etc.)
├── types/                # TypeScript interfaces
└── utils/                # Stack comparison, date formatting, etc.
```

---

## 🚀 Quick Start

### Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18.x
- npm ou yarn
- Conta no [Supabase](https://supabase.com/)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/gitprofile.git
cd gitprofile

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

Acesse: `http://localhost:5173`

---

## 🧪 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build

# Testes
npm run test         # Executa todos os testes
npm run test:watch   # Modo watch para development
npm run test:ui      # Interface visual do Vitest

# Qualidade de Código
npm run lint         # ESLint check
```

---

## 📊 Métricas de Qualidade

- ✅ **100% TypeScript** - Zero JavaScript no bundle final
- ✅ **Test Coverage** - Hooks e componentes críticos testados
- ✅ **Lighthouse Score** - Performance, Accessibility, Best Practices
- ✅ **Bundle Size** - Otimizado com code splitting automático
- ✅ **Core Web Vitals** - LCP, FID, CLS otimizados

---

## 🎯 Destaques Técnicos

### **Performance**

- **Infinite Scroll** com Virtualização para listas grandes
- **React Query Cache** com stale-while-revalidate strategy
- **Lazy Loading** de rotas e componentes pesados

### **Developer Experience**

- **Hot Module Replacement (HMR)** instantâneo
- **Type Safety** em todas as camadas da aplicação
- **Custom Hooks** reutilizáveis e testáveis

### **Boas Práticas**

- **Component Composition** com patterns avançados
- **Custom Hooks** para lógica reativa complexa
- **Error Boundaries** para fallback gracioso
- **Accessibility (a11y)** - ARIA labels, keyboard navigation

---

## 🤝 Contribuição

Este projeto segue padrões rigorosos de qualidade:

1. **Conventional Commits** - Mensagens de commit padronizadas
2. **Code Review** - PRs com revisão obrigatória
3. **Lint & Format** - ESLint + Prettier automatizados
4. **Test Coverage** - Testes antes de merge

```bash
# Workflow de desenvolvimento
git checkout -b feature/nova-funcionalidade
npm run dev
# ... desenvolvimento ...
npm run test
git commit -m "feat: descrição da funcionalidade"
git push origin feature/nova-funcionalidade
# Abrir Pull Request
```

---

## 👨‍💻 Autor

**João Paulo Araújo**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/joaofonsecaraujo/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github)](https://github.com/jotaraujo)
