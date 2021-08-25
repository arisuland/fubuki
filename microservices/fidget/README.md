# fidget
> Version Control System for Arisu made in Elixir using **Plug.Cowboy** + [PostgreSQL](https://postgresql.org) with **ecto**.

## Why?
Because, Arisu is meant to be a VCS-like translation site and I wanted to learn how to use Elixir + fast, efficient way to manage repositories.

## Installation
You can use the official Docker image:

```sh
$ docker run arisuland/fidget:latest -d -p 22345:22345 --name fidget --restart always --volume "<fidget config>":/app/fidget/config/prod.exs
```

## How do I use it?
It's simple! It's built into the **arisu** binary by default with commands like `push`, `fetch`, etc!

The backend is proxied since **figlet** is not meant to be globally accessible.
