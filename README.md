# Cost Sharing for YNAB
Check out the live app here! https://costsharingforynab.com. Cost Sharing for YNAB is an open-source React web application built to work with YNAB (You Need a Budget), integrating with the YNAB API. Since YNAB, a popular budgeting software, doesn't natively support tracking of a shared credit card account (such as a communal expense credit card shared between partners), YNAB members can use this add-on app to incorporate a shared credit card into their personal budget without making their expenses look inflated. Members authenticate with their existing YNAB credentials via OAuth, allowing the app to connect securely to their account. I'm excited to contribute this add-on feature to the YNAB community!

## System requirements
  - Node
  - npm
  - Docker (if you're Chelsea)

## Run the app in development
  - `npm install` in project root
  - Run `nodemon` and `webpack` in watch mode:
    - Terminal 1: `npm run watch-dev`
    - Terminal 2: `npm run watch-landing-page-dev`
    - Terminal 3: `npm start`
  - Or, run a local Docker container:
    - Run the Docker daemon
    - Build image: `docker build --build-arg PORT=80 -t cs4y .`
    - Run container at port 3000: `docker run -d -p 3000:80 cs4y:latest`
  - Navigate to http://localhost:3000

## Other
  - Run ESLint
    - `npm run linter`
  - Run HTTP server at port 3000
    - `npm run start-http`
    - Requires configuring a redirect from port 80
  - Run HTTPS server at port 3001
    - `KEY=<key file path> CERT=<cert file path> npm run start-https`
    - Requires configuring redirects from port 80 --> 3000 and 443 --> 3001
    - HTTP server will redirect to HTTPS server

## Prod deployment (iif you're Chelsea)
  - First-time setup
    - Install Docker
    - Create a Google Cloud project, then:
      - In Artifact Registry, create new Docker image repository
        - Take note of the repository's host name (such as `us-west1-docker.pkg.dev`)
      - Create a service account with the Artifact Registry Writer role and a private key. Save the private key
      - Authenticate to the repository
        - Install [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
        - `source ~/.zshrc`
        - `gcloud init` (choose this app's Google project)
        - `gcloud auth login`
        - `gcloud auth activate-service-account --key-file=<path_to_key_file>`
          - Use the Artifact Registry Writer service account's private key
          - `gcloud iam service-accounts list` can be used to get the exact service account name
        - `gcloud auth configure-docker <repository_host_name_from_earlier_step>`
        - `cat <path_to_key_file> | docker login -u _json_key --password-stdin https://<repository_host_name_from_earlier_step>`
  - Manual deployment
    - Run the Docker daemon
    - Build image
      - `docker build --build-arg PORT=80 -t cs4y .`
      - OR: `docker build --build-arg PORT=80 --platform linux/amd64 -t cs4y .`
        - (If Google Cloud Run doesn't like the image manifest)
    - Tag image
      - `docker tag <image_id> <repository_host_name_from_earlier_step>/<project_id>/<repository_name>/cs4y`
    - Push image
      - `docker push <repository_host_name_from_step_1>/<project_id>/<repository_name>/cs4y`
    - Deploy with Google Cloud Run
      - Click "Deploy container" in Google Cloud Run
      - "Deploy one revision from an existing container image"
      - Select the `latest` image
      - Enter a service name
      - Select a region
      - "Allow unauthenticated invocations" (required for a public website)
      - CPU allocation preference
      - Enter preferred minimum instances
      - Select "All" under Ingress Control
      - Container settings
        - Enter `80` as the container port
      - "Create"
    - Navigate to the generated URL
    - First time domain mapping:
      - Go to Cloud Run Domain Mappings
        - "Add mapping"
        - Follow prompts (use the Google Search Console option to verify the domain)
        - When done, cert issuance will automatically begin

## Helpful commands
  - `docker images` | List images
  - `docker container ps` | Get running container names
  - `docker exec -it <container_name> sh` | Explore container filesystem
  - `docker container stop <container_name>` | Stop container
  - `docker container prune` | Delete stopped containers
  - `docker rmi <image_name_or_id>` | Delete an image
