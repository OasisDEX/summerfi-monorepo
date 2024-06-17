FROM node:20-slim
EXPOSE 3000
WORKDIR /app
COPY .next/standalone /app/.next/standalone
COPY package.json next.config.mjs /app
COPY public /app/.next/standalone/public
COPY .next/static /app/.next/standalone/.next/static

CMD [ "node", "/app/.next/standalone/apps/rays-dashboard/server.js" ]
