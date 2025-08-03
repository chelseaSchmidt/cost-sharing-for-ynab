FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build-prod
RUN npm run build-landing-page-prod
ARG PORT
ENV MODE=prod
ENV PORT=$PORT
CMD ["npm", "start"]
EXPOSE $PORT
