FROM node:22-bookworm-slim

WORKDIR /workspace
COPY package.json ./package.json

WORKDIR /workspace/sistema-ruim
COPY sistema-ruim/package.json sistema-ruim/package-lock.json ./
RUN npm ci

WORKDIR /workspace
COPY sistema-ruim ./sistema-ruim
WORKDIR /workspace/sistema-ruim
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
CMD ["npm", "start"]
