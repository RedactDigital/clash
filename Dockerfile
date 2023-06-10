# ---------------------------------------------- Development ----------------------------------------------
FROM node:20.0-bullseye-slim as development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV USER node

RUN echo "NODE_ENV=${NODE_ENV}"

# Install the required packages
RUN apt update && apt upgrade -y && apt install -y --no-install-recommends \
    vim \
    && npm install -g npm@9.7.1

# Install Cleanup
RUN echo "alias ll='ls -alF'" >> /home/node/.bashrc \
    && apt-get -y autoremove \
    && apt-get -y clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/* \
    && rm -rf /var/tmp/*

# Switch to the user we are going to run the app as
# which is node. All node images have this user by default
USER ${USER}
WORKDIR /usr/src/app

# Copy the app files to the container and install the dependencies
COPY --chown=${USER}:${USER} . .
RUN npm install --no-audit --no-fund

# Build the app for production
RUN npm run build

CMD ["npm", "run", "start:dev"]

# ---------------------------------------------- Production ----------------------------------------------
FROM node:20.0-bullseye-slim as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV USER node

# Install the required packages
RUN apt update && apt upgrade -y && apt install -y --no-install-recommends \
    vim \
    && npm install -g npm@9.7.1

# Install Cleanup
RUN echo "alias ll='ls -alF'" >> /home/node/.bashrc \
    && apt-get -y autoremove \
    && apt-get -y clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/* \
    && rm -rf /var/tmp/*

# Switch to the user we are going to run the app as
# which is node. All node images have this user by default
USER ${USER}
WORKDIR /usr/src/app

# Copy the build files from the development image
COPY --chown=${USER}:${USER} --from=development /usr/src/app/package*.json ./
COPY --chown=${USER}:${USER} --from=development /usr/src/app/dist ./

# Install only the production dependencies
RUN npm install --only=production --no-audit --no-fund

COPY --chown=${USER}:${USER} entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

CMD ["npm", "run", "start:prod"]
