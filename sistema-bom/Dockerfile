FROM node:22-bookworm-slim

WORKDIR /workspace
COPY package.json ./package.json

WORKDIR /workspace/sistema-bom
COPY sistema-bom/package.json sistema-bom/package-lock.json ./
RUN npm ci

WORKDIR /workspace
COPY sistema-bom ./sistema-bom
WORKDIR /workspace/sistema-bom
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3002
EXPOSE 3002
CMD ["npm", "start"]
