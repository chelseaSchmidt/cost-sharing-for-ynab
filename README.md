# Cost Sharing for YNAB

Check out the live app here! https://costsharingforynab.com. Cost Sharing for YNAB is an open-source React web application built to work with YNAB (You Need a Budget), integrating with the YNAB API. Since YNAB, a popular budgeting software, doesn't natively support tracking of a shared credit card account (such as a communal expense credit card shared between partners), YNAB members can use this add-on app to incorporate a shared credit card into their personal budget without making their expenses look inflated. Members authenticate with their existing YNAB credentials via OAuth, allowing the app to connect securely to their account. I'm excited to contribute this add-on feature to the YNAB community!

## System requirements

- Node
- npm
- Prettier
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

## Prod deployment (if you're Chelsea)

<details>

<summary><strong>First-time setup</strong></summary>

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

</details>

<details open>
<summary><strong>Prepare image</strong></summary>

- Run the Docker daemon

- Build image: `docker build --build-arg PORT=80 -t cs4y .`

  - OR: `docker build --build-arg PORT=80 --platform linux/amd64 -t cs4y .`
    - (Apple Silicon or if Google Cloud Run doesn't like the image manifest)

- Tag image: `docker tag <image_id> <repository_host_name_from_earlier_step>/<project_id>/<repository_name>/cs4y`

- Push image:
  - `gcloud auth login`
  - `docker push <repository_host_name_from_step_1>/<project_id>/<repository_name>/cs4y`

</details>

<details open>
<summary><strong>Revision deployment:</strong></summary>

- Click the running service in Google Cloud Run

- Click "Edit & deploy a new revision"

- Select latest image in "Container image URL" field

- "Deploy"

</details>

<details>
<summary><strong>New deployment:</strong></summary>

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
- Domain mapping:

  - Go to Cloud Run Domain Mappings
  - "Add mapping"
  - Follow prompts (use the Google Search Console option to verify the domain)
  - When done, cert issuance will automatically begin

</details>

## Helpful commands

- `docker images` | List images
- `docker container ps` | Get running container names
- `docker exec -it <container_name> sh` | Explore container filesystem
- `docker container stop <container_name>` | Stop container
- `docker container prune` | Delete stopped containers
- `docker rmi <image_name_or_id>` | Delete an image
