FROM node:20-alpine
EXPOSE 3000
WORKDIR .
COPY .next/standalone .next/standalone
COPY package.json next.config.mjs .
COPY public .next/standalone/apps/earn-protocol-landing-page/public
COPY .next/static .next/standalone/apps/earn-protocol-landing-page/.next/static

ARG CONFIG_URL \
    CONFIG_URL_EARN \
    SUBGRAPH_BASE \
    MIXPANEL_KEY \
    NEXT_PUBLIC_MIXPANEL_KEY \
    SDK_API_URL \
    NEXT_TELEMETRY_DISABLED


ENV CONFIG_URL=$CONFIG_URL \
    CONFIG_URL_EARN=$CONFIG_URL_EARN \
    SUBGRAPH_BASE=$SUBGRAPH_BASE \
    MIXPANEL_KEY=$MIXPANEL_KEY \
    NEXT_PUBLIC_MIXPANEL_KEY=$NEXT_PUBLIC_MIXPANEL_KEY \
    SDK_API_URL=$SDK_API_URL \
    NEXT_TELEMETRY_DISABLED=$NEXT_TELEMETRY_DISABLED

CMD [ "node", ".next/standalone/apps/earn-protocol-landing-page/server.js" ]
