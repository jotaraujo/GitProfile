# GitProfile

Aplicação web para busca, visualização organizada e salvamento de perfis públicos do GitHub. O GitProfile ajuda recrutadores técnicos e desenvolvedores a analisarem a presença online de um profissional de forma limpa, rápida e esteticamente agradável.

> [!NOTE]
> Este projeto foi desenvolvido com foco em demonstrar boas práticas de arquitetura front-end, caching de dados de servidores, roteamento dinâmico, validações schema-first e testes automatizados.

---

## 🚀 Funcionalidades (MVP)

* **Busca e Validação de Perfis:** Validação no cliente (Zod) garantindo que apenas formatos de usernames válidos do GitHub disparem requisições.
* **Dashboard do Perfil:** Visualização simplificada de avatar, biografia, contagem de seguidores e data de criação da conta traduzida.
* **Listagem de Repositórios com Scroll Infinito:** Renderização por demanda (30 itens por página) para evitar gargalos em perfis muito grandes.
* **Filtros Locais Dinâmicos:** Filtro instantâneo por nome do repositório ou por linguagem de programação direto na interface.
* **Gráfico de Stacks:** Cálculo utilitário que reúne a distribuição das linguagens de programação mais utilizadas pelo desenvolvedor.
* **Histórico de Buscas Híbrido:**
  * **Anônimo:** Salvo no `localStorage` do navegador (limite de 10 buscas).
  * **Autenticado:** Sincronizado e persistido na nuvem no banco de dados do Supabase.
* **Autenticação Segura:** Login e cadastro via e-mail e senha gerenciados pelo Supabase Auth.

---

## 🛠️ Stack Tecnológica

* **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
* **Roteamento:** [React Router v7](https://reactrouter.com/)
* **Gerenciamento de Estado:**
  * **Cliente:** [Zustand](https://docs.pmnd.rs/zustand)
  * **Servidor (Cache/Fetch):** [TanStack Query v5](https://tanstack.com/query)
* **Validação de Formulários:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
* **Estilização:** [TailwindCSS v4](https://tailwindcss.com/) + [DaisyUI v5](https://daisyui.com/)
* **Banco de Dados & Auth:** [Supabase](https://supabase.com/)
* **Testes:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) + [MSW (Mock Service Worker)](https://mswjs.io/)

---

## ⚙️ Instalação e Execução Local

### Pré-requisitos

Certifique-se de possuir o [Node.js](https://nodejs.org/) instalado em sua máquina.

### Passo 1: Clonar o Repositório e Instalar Dependências

```bash
# Instalar as dependências do projeto
npm install
```

### Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base) e preencha as suas chaves do Supabase:

```env
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anon-do-supabase
```

### Passo 3: Executar o Servidor de Desenvolvimento

```bash
npm run dev
```
O servidor iniciará no endereço local padrão indicado no terminal (normalmente `http://localhost:5173` ou `http://localhost:5174`).

---

## 🧪 Rodando os Testes

Este projeto utiliza **Vitest** para testes unitários e de integração, garantindo a qualidade do código antes de ir para produção.

```bash
# Executa todos os testes em modo único (ótimo para Git hooks / CI)
npm run test

# Executa os testes em modo Watch (escuta modificações nos arquivos)
npm run test:watch

# Abre a interface visual dos testes do Vitest no navegador
npm run test:ui
```

---

> [!TIP]
> O repositório vem configurado com **Husky** e **Commitlint** para garantir que todos os commits sigam o padrão de Commits Semânticos (Conventional Commits).
