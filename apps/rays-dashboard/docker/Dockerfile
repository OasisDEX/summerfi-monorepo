FROM node:20-alpine
EXPOSE 3000
WORKDIR .
COPY .next/standalone .next/standalone
COPY package.json next.config.mjs .
COPY public .next/standalone/apps/rays-dashboard/public
COPY .next/static .next/standalone/apps/rays-dashboard/.next/static

ARG FUNCTIONS_API_URL
ENV FUNCTIONS_API_URL=$FUNCTIONS_API_URL

CMD [ "node", ".next/standalone/apps/rays-dashboard/server.js" ]
