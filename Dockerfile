FROM node:20-alpine
WORKDIR /costSharingForYnab
COPY . .
RUN npm install
RUN npm run build-prod
RUN npm run build-landing-page-prod
ARG PORT
ENV MODE=prod
ENV PORT=$PORT
CMD ["npm", "run", "start-container"]
EXPOSE $PORT
