<div align='center'>
  <h2>☔ Arisu</h2>
  <blockquote>Translation made with simplicity, yet robust. Made with 💖 using <a href='https://typescriptlang.org'><strong>TypeScript</strong></a>, Vue with Nuxt.js.</blockquote>
</div>

## Features

- :octocat: **Open Source and Free** — Arisu is 100% free and open source, so you can host your own instance if you please!
- ✨ **Monorepos** — Create multiple subprojects into a single repository without having to maintain multiple repositories.
- ⚡ **Robust** — Arisu makes your workflow way easier and manageable without any high latency.

...and much more!

## Hey... this is a different repository?

Yea, I decided to create a new repository for Arisu. The old [repository](https://github.com/arisuland/Arisu) is... weird as of the commits and the turn for the project, so I decided to create a new one.

## Modules

Arisu is split into different packages, each of which is a seperate folder in this repository.

- [**app**](./app) — The main backend of Arisu.
- [**github-bot**](./github-bot) — A GitHub bot that automatically syncs your translations with GitHub.
- [**typings**](./typings) — A package that provides typings for Arisu's JavaScript SDKs.
- [**web**](./web) — Web application that runs [arisu.land](https://arisu.land)

There are other projects within the Arisu ecosystem, but they are split into different repositories under the **arisuland** organization.

If the projects return a **`404`** status code, it means that the project is not yet ready for public use.

| Name                                         | Description                                                                                           | Status |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------ |
| ⛴ [cli](https://github.com/arisuland/cli)    | A command-line interface to automate the process of handling translations, merging translations, etc. |
| 🐳 [docs](https://github.com/arisuland/docs) | Documentation site for Arisu, showcasing the REST API and other stuff                                 |

## Self-hosting

Before we get started, I recommend learn how to run Node.js projects before you install Arisu. The Arisu Team **will** not help you if you don't understand how to run a Node.js project. :)

> :warning: **Arisu is not ready for production yet! So be cautious before running (un)stable releases.**

### Prerequisites

Before we can get started, you need to have the following things installed:

- [**PostgresSQL** v11+](https://postgresql.org) **~** Main database thats Arisu utilizes.
- [**Node.js** v14+](https://nodejs.org/en/) **~** Runtime engine to run the project.
- [**Redis** v6.2+](https://redis.io) **~** In-memory data store for Arisu.
- [**Git** v2.31+](https://git-scm.com) **~** A version control system to get updates of Arisu easily.

#### Optional Tools

There are tools you can use to enhance the experience, but the following is not recommended in most cases:

- [**Docker**](https://docker.com) **~** A containerization tool to run Arisu.
- [**Sentry**](https://sentry.io) **~** A error-reporting tool to track down bugs or errors in Arisu.

### Installation

This is a work in progress, so don't run this yet. :c

## Configuration

The configuration file is located at `./config.yml`. It is a YAML file that contains all the configurations for Arisu.

Be warned that the configuration file is **not** checked for errors. If you have any issues with the configuration file, please open an [issue](https://github.com/arisuland/Arisu/issues).

## Contributing

> Refer to the [Contributing](.github/CONTRIBUTING.md) section for more details.

## License

**Arisu** is released under the **GPL-3.0** License. <3
