# Cost Sharing for YNAB
Check out the live app here! https://costsharingforynab.com. Cost Sharing for YNAB is an open-source React web application built to work with YNAB (You Need a Budget), integrating with the YNAB API. Since YNAB, a popular budgeting software, doesn't natively support tracking of a shared credit card account (such as a communal expense credit card shared between partners), YNAB members can use this add-on app to incorporate a shared credit card into their personal budget without making their expenses look inflated. Members authenticate with their existing YNAB credentials via OAuth, allowing the app to connect securely to their account. I'm excited to contribute this add-on feature to the YNAB community!

## System requirements
  - Node (version 10.20.1 used in development)
  - npm package manager
  - Nodemon (version 2.0.4 used in development)

## Run the application in development
  - `npm install` in project root
  - Terminal 1: `npm run watch-dev`
  - Terminal 2: `npm run watch-landing-page-dev`
  - Terminal 3: `npm start`
    - Optional environment variable: `PORT` (defaults to 3000)
  - Navigate to http://localhost:3000

## Other
  - Command to run ESLint
    - `npm run linter`
  - Command to run HTTP server at port 3000
    - `npm run start-http`
    - Requires configuring a redirect from port 80
  - Command to run HTTPS server at port 3001
    - `KEY=<key file path> CERT=<cert file path> npm run start-https`
    - Requires configuring redirects from port 80 --> 3000 and 443 --> 3001
    - HTTP server will redirect to HTTPS server