FROM node:18.19.1-alpine
EXPOSE 3000
COPY .next/standalone /app/.next/standalone
COPY package.json next.config.mjs /app
COPY public /app/.next/standalone/public
COPY .next/static /app/.next/standalone/.next/static

CMD [ "pnpm", "start" ]
