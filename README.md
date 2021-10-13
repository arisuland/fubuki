<div align='center'>
  <h2>☔ Arisu</h2>
  <div align='center'>
    <a href="https://arisu.land"><strong>Website</strong></a>&nbsp;&nbsp;•&nbsp;&nbsp;<a href="https://arisu.land/discord"><strong>Discord</strong></a>&nbsp;&nbsp;•&nbsp;&nbsp;<a href="https://github.com/auguwu/Arisu/discussions"><strong>Discussions</strong></a>&nbsp;&nbsp;•&nbsp;&nbsp;<a href="https://youtrack.floofy.dev/projects/4381512b-a4dc-4fc1-ae7c-82d178a99aa1"><strong>Issue Tracker</strong></a>    
  </div>
  <br />
  <blockquote>Translation made with simplicity, yet robust. Made with 💖 using <a href='https://typescriptlang.org'><strong>TypeScript</strong></a>, <a href='https://vuejs.org'><strong>Vue</strong></a> with <a href='https://nuxtjs.org'><strong>Nuxt.js</strong></a>.</blockquote>
</div>

## Features

- :octocat: **Open Source and Free** — Arisu is 100% free and open source, so you can host your own instance if you please!
- ✨ **Monorepos** — Create multiple subprojects into a single repository without having to maintain multiple repositories.
- ⚡ **Robust** — Arisu makes your workflow way easier and manageable without any high latency.

...and much more!

## Hey... this is a different repository?

Yea, I decided to create a new repository for Arisu. The old [repository](https://github.com/arisuland/Arisu) is... weird as of the commit history and the turn for the project, so I decided to create a new one.

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
- [**Kafka**](https://kafka.apache.org) **~** Open-source distributed event streaming platform used by Arisu to provide top-notch Publish/Subscribe methods towards our microservices.

## Installation

You can always install Arisu from our [Helm Chart](https://github.com/arisuland/helm) to deploy it on your Kubernetes cluster, or use the [docker-compose.yml](./docker-compose.yml) file to launch all services it needs to succeed. (`docker-compose up -d`)

We provide official Docker images to aid running Arisu in Docker, or you can use the Git repository to contribute or to self-host.

### Docker

Before we get started, Docker is required on your system to be running fully before continuing. Here is a list of images we provide:

| Name                | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `arisuland/arisu`   | [Frontend UI](./web) of Arisu, made with Vue and Nuxt.js |
| `arisuland/tsubaki` | [Backend](./app) of Arisu, made with GraphQL             |

You are also allowed to pull from `staging`, SemVer version (`arisuland/tsubaki:1.0.0`), or a specific commit.

```sh
# 1. Pull our image from Docker Hub
$ docker pull arisuland/arisu:latest && docker pull arisuland/tsubaki:latest

# 2. Run our images
$ docker run -d -p 9999:28093 --restart always --name arisu-backend \
  -v /path/to/config.yml:/app/Arisu/backend/config.yml \
  -v /path/to/.env:/app/Arisu/backend/.env arisuland/tsubaki:latest

$ docker run -d -p 3333:17093 --restart always --name arisu-frontend \
  -e PUBLIC_BACKEND_URL='https://arisu-backend:28093' \
  -v /path/to/.env:/app/Arisu/frontend/.env arisuland/arisu:latest
```

> **You can now open a session with `localhost:17093` to setup your Arisu instance!**

### Git repository

**Git** is required on your system, this is usually for people who know how to setup PostgreSQL, Redis, and (optionally) Kafka or
contributors who want to contribute.

```sh
# 1. Clone our repository
$ git clone https://github.com/auguwu/Arisu

# 2. Install dependencies
$ yarn

# 3. (OPTIONAL) Run the `arisu-server` binary to start the server
$ ./bin/arisu-server start

# 4. (OPTIONAL) Run `docker-compose` to start everything
$ docker-compose up -d
```

## Configuration

The configuration file is located at `./config.yml`. It is a YAML file that contains all the configurations for Arisu.

Be warned that the configuration file is **not** checked for errors. If you have any issues with the configuration file, please open an [issue](https://github.com/arisuland/Arisu/issues).

## Contributing

> Refer to the [Contributing](.github/CONTRIBUTING.md) section for more details.

## License

**Arisu** is released under the **GPL-3.0** License. <3
