# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.195.0/containers/javascript-node/.devcontainer/base.Dockerfile
# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 16, 14, 12, 16-bullseye, 14-bullseye, 12-bullseye, 16-buster, 14-buster, 12-buster
ARG VARIANT=18-bullseye
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}


# Install ligo-client
RUN wget -O ligo https://gitlab.com/ligolang/ligo/-/jobs/6056572676/artifacts/raw/ligo
RUN chmod +x ./ligo
RUN mv ./ligo /usr/local/bin