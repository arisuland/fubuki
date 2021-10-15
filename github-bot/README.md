# Arisu — GitHub Bot

> ☔ :octocat: **GitHub automation bot to automate syncing translations from Arisu <- -> GitHub**.

## Will GitLab / Gitea be supported?

Probably, I don't know yet.

## Installation

### Requirements

- Node.js
- PostgreSQL
- Kafka

### Git Repository

```sh
# 1. Clone the repository
$ git clone https://github.com/auguwu/Arisu

# 2. Go to the `Arisu` directory and install dependencies
$ cd Arisu && yarn install

# 3. Run the bot!
$ cd github-bot && yarn start
```

### Docker

```sh
# 1. Pull from the repository
$ docker pull arisuland/github:latest # or a specific version/commit

# 2. Run the container
$ docker run -dp 8890:8890 --name arisu-github -v /path/to/.env:/app/Arisu/github/.env arisuland/github:latest
```

## Configuration

**github-bot** uses Environment Variables using a handy **.env** file. You can also specify them as system environment
variables using `-e` in Docker (as an example).

```env
# Database URL to connect to PostgreSQL
DATABASE_URL="postgresql://username:password@host:port/dbName?schema=schemaName"

# The environment the application is running in
NODE_ENV=development

# The client ID you can get from the GitHub Apps dashboard
GITHUB_APP_ID=

# The client secret you can get from the GitHub Apps dashboard
GITHUB_APP_SECRET=

# The private key you can get from the GitHub Apps dashboard
GITHUB_APP_PEM_LOCATION=

# # The installation ID you can get from the GitHub Apps dashboard
GITHUB_APP_INSTALLATION_ID=

# Brokers for connecting to Kafka
# You specify them in an array like:
# localhost:9092,localhost2:9092
KAFKA_CONSUMER_BROKERS=...

# The topic to use to send PubSub around the backend and
# the app. The topic must be the same you specified in
# the backend's `config.yml` file
KAFKA_CONSUMER_TOPIC=arisu.tsubaki.github

# Webhook secret (since yes, we do use this)
WEBHOOK_SECRET=
```
