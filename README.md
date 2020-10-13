# Cost Sharing for YNAB

## System requirements
  - Node (version 10.20.1 used in development)
  - npm package manager
  - Nodemon (version 2.0.4 used in development)

## Run the application in development
  - npm install
  - npm run build || npm run watch
  - npm start
    - Optional environment variable: PORT (defaults to 3003)
  - Navigate to http://localhost:3003

## Other
  - Command to run ESLint
    - npm run linter
  - Command to run HTTP server at port 80
    - npm run start:HTTP
  - Command to run HTTPS server at port 443
    - KEY=`<key file path>` CERT=`<cert file path>` npm run start:HTTPS