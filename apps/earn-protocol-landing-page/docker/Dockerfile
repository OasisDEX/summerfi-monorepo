FROM node:20-alpine
EXPOSE 3000
WORKDIR .
COPY .next/standalone .next/standalone
COPY package.json next.config.mjs .
COPY public .next/standalone/apps/earn-protocol-landing-page/public
COPY .next/static .next/standalone/apps/earn-protocol-landing-page/.next/static

ARG CONFIG_URL \
    MIXPANEL_KEY \
    NEXT_PUBLIC_MIXPANEL_KEY


ENV CONFIG_URL=$CONFIG_URL \
    MIXPANEL_KEY=$MIXPANEL_KEY \
    NEXT_PUBLIC_MIXPANEL_KEY=$NEXT_PUBLIC_MIXPANEL_KEY

CMD [ "node", ".next/standalone/apps/earn-protocol-landing-page/server.js" ]
