FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build-prod
RUN npm run build-home-prod
ARG PORT
ENV MODE=prod
ENV PORT=$PORT
CMD ["npm", "start"]
EXPOSE $PORT
