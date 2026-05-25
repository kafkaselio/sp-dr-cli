<!-- MECHBUILD README -->

<div align="center">

```
  ███╗   ███╗███████╗ ██████╗██╗  ██╗██████╗ ██╗   ██╗██╗██╗     ██████╗
  ████╗ ████║██╔════╝██╔════╝██║  ██║██╔══██╗██║   ██║██║██║     ██╔══██╗
  ██╔████╔██║█████╗  ██║     ███████║██████╔╝██║   ██║██║██║     ██║  ██║
  ██║╚██╔╝██║██╔══╝  ██║     ██╔══██║██╔══██╗██║   ██║██║██║     ██║  ██║
  ██║ ╚═╝ ██║███████╗╚██████╗██║  ██║██████╔╝╚██████╔╝██║███████╗██████╔╝
  ╚═╝     ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝
```

**SP//DR Build System** · Mech-assembly project scaffolding

[![npm version](https://img.shields.io/npm/v/mechbuild?color=00f5ff&labelColor=0d0d0d)](https://www.npmjs.com/package/mechbuild)
[![License: MIT](https://img.shields.io/badge/License-MIT-7b2fff?labelColor=0d0d0d)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18%2B-00ff87?labelColor=0d0d0d)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?labelColor=0d0d0d)](https://www.typescriptlang.org)

*Assemble your next project like deploying a mech.*

</div>

---

## ✦ What is mechbuild?

**mechbuild** is a futuristic, interactive CLI scaffolding tool that generates production-ready project boilerplates. Every developer choice is framed as selecting a mech component — your framework is the chassis, your database is the memory core, auth is the security module.

Built with a cyberpunk aesthetic that doesn't sacrifice practicality.

---

## ⚡ Features

- 🤖 **Futuristic terminal UX** — styled prompts, gradients, ASCII art
- 🏗️ **Multi-framework support** — Next.js, Express, FastAPI, React, Vue, SvelteKit, Go Fiber
- 🗄️ **Database integrations** — PostgreSQL, MySQL, SQLite, MongoDB, Redis
- 🔐 **Auth scaffolding** — JWT, OAuth (GitHub/Google), Session/Cookie
- 📦 **Extras system** — Docker Compose, GitHub Actions CI, ESLint + Prettier, Husky, Conventional Commits
- 💾 **Preset system** — save and reload build configurations via `~/.mechrc`
- 🧪 **Dry-run mode** — preview generated output without writing any files
- 🎨 **Beautiful output** — boxen, gradient-string, chalk-powered success screens

---

## 📸 Screenshots

> *Terminal screenshots — coming soon*

```
  ███████╗██████╗     ██╗   ██╗██████╗ ██████╗
  ...
  ◆ Designate your mech frame (project name)  › my-saas-app
  ◆ Select frame class (project type)         › Full Stack
  ◆ Install chassis (framework)               › Next.js App Router
  ◆ Bind memory core (database)               › PostgreSQL
  ◆ Arm security module (authentication)      › JWT
  ◆ Mount subsystems (extras)                 › Docker, GitHub Actions, ESLint

  ╔══════════════════════════════╗
  ║      BUILD MANIFEST          ║
  ║  PILOT ID    MY-SAAS-APP     ║
  ║  CHASSIS     nextjs          ║
  ║  MEMORY      postgresql      ║
  ╚══════════════════════════════╝

  Deploy this build? › Yes

  ✔ Initializing frame structure
  ✔ Writing 14 components
  ✔ Calibrating configuration
  ✔ Sealing chassis

  ╭────────────────────────────────────────────╮
  │  BUILD COMPLETE                            │
  │  ⚡ SP//DR online — my-saas-app assembled  │
  │                                            │
  │  📁 Location: ./my-saas-app               │
  │  🔧 Next Steps:                            │
  │    $ cd my-saas-app                        │
  │    $ npm install                           │
  │    $ npm run dev                           │
  ╰────────────────────────────────────────────╯
```

---

## 🛠 Installation

### Global install (recommended)

```bash
npm install -g mechbuild
```

### npx (no install)

```bash
npx mechbuild
```

### From source

```bash
git clone https://github.com/YOUR_USERNAME/mechbuild-cli.git
cd mechbuild-cli
npm install
npm run build
npm link
```

---

## 🚀 Usage

### Interactive wizard

```bash
mechbuild
# or explicitly:
mechbuild build
```

### Dry run (preview only)

```bash
mechbuild --dry-run
```

### Load a preset

```bash
mechbuild --preset saas-stack
```

### Save current build as a preset

```bash
mechbuild --save-preset saas-stack
```

### List saved presets

```bash
mechbuild presets
```

### Delete a preset

```bash
mechbuild delete-preset saas-stack
```

---

## 🏁 CLI Flags

| Flag | Description |
|------|-------------|
| `--dry-run` | Preview generation without writing files |
| `--preset <name>` | Load a saved preset from `~/.mechrc` |
| `--save-preset <name>` | Save this config as a named preset |
| `-v, --version` | Show version number |
| `-h, --help` | Show help |

---

## 📋 Supported Configurations

### Project Types

| Type | Description |
|------|-------------|
| Web App | Frontend SPA/SSR applications |
| API Server | Backend REST/async APIs |
| Full Stack | Integrated frontend + backend |
| CLI Tool | Command-line interface programs |

### Frameworks

| Category | Options |
|----------|---------|
| Web App | React (Vite), Next.js App Router, Vue (Vite), Svelte |
| API | Express, FastAPI, Django REST, Go Fiber |
| Full Stack | Next.js App Router, Nuxt, SvelteKit |
| CLI Tool | Node CLI Starter, TypeScript CLI Starter |

### Databases

`PostgreSQL` · `MySQL` · `SQLite` · `MongoDB` · `Redis` · `None`

### Authentication

`JWT` · `OAuth GitHub` · `OAuth Google` · `Session + Cookie` · `None`

### Extras

`Docker Compose` · `GitHub Actions CI` · `ESLint + Prettier` · `Husky Hooks` · `Conventional Commits` · `README Template`

---

## 💾 Preset System

Presets are stored in `~/.mechrc` as JSON:

```json
{
  "saas-stack": {
    "projectName": "my-saas-app",
    "projectType": "fullstack",
    "framework": "nextjs",
    "database": "postgresql",
    "auth": "jwt",
    "extras": ["docker", "github-actions", "eslint"]
  }
}
```

---

## 🗺 Roadmap

- [ ] Vue (Vite) full template set
- [ ] SvelteKit full template set
- [ ] Go Fiber full template set
- [ ] Database migration scaffolding
- [ ] Deployment config (Vercel, Railway, Fly.io)
- [ ] Plugin system for custom templates
- [ ] Interactive template preview
- [ ] Config file support (`.mechbuildrc`)
- [ ] Web UI companion app

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. Fork the repository
2. Create a feature branch — `git checkout -b feat/my-feature`
3. Commit using conventional commits — `feat: add X`, `fix: resolve Y`
4. Push and open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting.

---

## 📄 License

[MIT](LICENSE) © mechbuild contributors

---

<div align="center">
  <sub>SP//DR Build System · Assemble the future.</sub>
</div>
