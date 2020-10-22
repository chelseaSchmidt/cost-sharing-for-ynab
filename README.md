# Cost Sharing for YNAB
Easily track expenses on shared credit card in your YNAB budget. Use the app here: https://costsharingforynab.com

## System requirements
  - Node (version 10.20.1 used in development)
  - npm package manager
  - Nodemon (version 2.0.4 used in development)

## Run the application in development
  - npm install
  - npm run build || npm run watch
  - npm start
    - Optional environment variable: PORT (defaults to 3000)
  - Navigate to http://localhost:3000

## Other
  - Command to run ESLint
    - npm run linter
  - Command to run HTTP server at port 3000
    - npm run start:HTTP
    - Requires configuring a redirect from port 80
  - Command to run HTTPS server at port 3001
    - KEY=`<key file path>` CERT=`<cert file path>` npm run start:HTTPS
    - Requires configuring redirects from port 80 --> 3000 and 443 --> 3001
    - HTTP server will redirect to HTTPS server