# SurfTimer-Discord-Bot

A Discord bot for the Surftimer plugin.

## Running with Docker

1. Install Docker.
2. Create a directory called `SurfTimer-Bot`.
3. In this directory, create a file named `Dockerfile`.
4. In this file, paste the contents of [this file](https://raw.githubusercontent.com/Sarrus1/SurfTimer-Discord-Bot/main/Dockerfile).
5. In the same directory, create a file named `.env`.
6. In this file, paste the contents of [this file](https://raw.githubusercontent.com/Sarrus1/SurfTimer-Discord-Bot/main/env_sample.txt).
7. Get back out of the `SurfTimer-Bot` and run the following command to build the Docker image: `docker build SurfTimer-Bot/ -t surftimer-bot`
8. Now run the container with the following command: `docker run -d --env-file=SufTimer-Bot/.env surftimer-bot`
