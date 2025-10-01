<div align="center">
  <h1>Cost Sharing for YNAB</h1> 
  <h3>Conveniently manage a shared credit card in YNAB.</h3>
  <br />
  <img width="147" height="58.5" alt="image" src="https://github.com/user-attachments/assets/aa7ec5ed-2b8f-40af-9d9c-810ca0644796" />
  <br />
  <br />
  <a href="https://costsharingforynab.com">costsharingforynab.com</a> • <a href="https://api.ynab.com/#works-with-ynab">Works with YNAB</a>
  <br />
  <br />
  <table>
    <tr>
      <td>TypeScript</td>
      <td>React</td>
      <td>React Hooks</td>
      <td>Styled Components</td>
      <td>Webpack</td>
      <td>Node</td>
      <td>Express</td>
    </tr>
  </table>
</div>

<br />

**Cost Sharing for YNAB** is a free and open-source web application that integrates with [YNAB](https://www.ynab.com) (You Need a Budget) via their [API](https://api.ynab.com). YNAB doesn't natively support tracking of shared payment accounts, such as credit cards or bank accounts shared between partners or family members. With this companion app, YNAB users can incorporate a shared account into their personal budget without making their expenses look inflated. Users authenticate with their existing YNAB credentials via OAuth.

Developer contributions at any experience level are very welcome!

## Develop

### Prerequisites

- Node
- npm
- Prettier
- Docker (if you're Chelsea)

### Run the app locally

- `npm install` in project root

- Bundle frontend and start server:

  - Terminal 1: `npm run watch-dev`
  - Terminal 2: `npm run watch-home-dev`
  - Terminal 3: `npm start`

- Or, run a local Docker container:

  - Run the Docker daemon
  - `npm run docker-dev`

- Navigate to http://localhost:3000

## Prod deployment (if you're Chelsea)

<details>

<summary><strong>First-time setup</strong></summary>

- Install Docker

- Create a Google Cloud project, then:

  - In Artifact Registry, create new Docker image repository
    - Take note of the repository's host name (such as `us-west1-docker.pkg.dev`)
  - Create a service account with the Artifact Registry Writer role and a private key. Save the private key
  - Run the Docker daemon
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
  - Build, tag, and push first image:
    - `npm run docker-build` or `npm run docker-build-apple-silicon`
    - `docker tag <image_id_or_name> <repository_host_name_from_earlier_step>/<project_id>/<repository_name>/cs4y`
    - `docker push <repository_host_name_from_step_1>/<project_id>/<repository_name>/cs4y`

</details>

<details>
<summary><strong>Prepare image</strong></summary>

- Run the Docker daemon

- `gcloud auth login`

- `npm run push-new-docker-image`

</details>

<details>
<summary><strong>Revision deployment</strong></summary>

- Click the running service in Google Cloud Run

- Click "Edit & deploy a new revision"

- Select latest image in "Container image URL" field

- "Deploy"

</details>

<details>
<summary><strong>New deployment</strong></summary>

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

<details>
<summary><strong>Helpful commands</strong></summary>

- `docker images` | List images

- `docker container ps` | Get running container names

- `docker exec -it <container_name> sh` | Explore container filesystem

- `docker container stop <container_name>` | Stop container

- `docker container prune` | Delete stopped containers

- `docker rmi <image_name_or_id>` | Delete an image

</details>
