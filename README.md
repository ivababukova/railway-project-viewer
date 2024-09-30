
# Railway Project Viewer

Railway Project Viewer is a React web application that allows users to view projects and manage their services using Railway's API. Users can authenticate with their Railway API token, view their project list, and interact with services like deploying or deleting them.

## Features
- **User Authentication:** Log in using a Railway API token.
- **Project Overview:** Display a list of projects associated with the authenticated Railway account.
- **Service Management:** View services under each project, create new services, and manage existing ones (deploy, delete).
- **Real-time Updates:** Polling mechanism for checking service status updates every few seconds.
  
## Running locally
Before you begin, ensure you have met the following requirements:
- You have Node.js (>= 14.x.x) and npm (>= 6.x.x) installed.
- A valid [Railway API token](https://docs.railway.app/guides/public-api) (available from your Railway account settings).
  
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/railway-project-viewer.git
   cd railway-project-viewer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the client:**
   ```bash
   npm run dev
   ```

4. **Run the server:**
   In development mode, the app interacts with the local server (`http://localhost:4000/graphql`). You need to run the corresponding GraphQL server or update the URL in `ApolloClient.js`. The code of the server is hosted here: https://github.com/ivababukova/project-viewer-server

5. **Log in with Railway API token:**
   - After launching, you’ll be prompted to provide a Railway API token.
   - You can get a token from your [Railway account](https://railway.app/account/tokens).

6. **Running Tests**
To run tests, use the following command:
```bash
npm test
```

## Building for Production
To create a production build, run:
```bash
npm run build
```

The build output will be in the `build/` directory. You can serve it using a static file server or deploy it to a cloud service.

## License
This project is licensed under the MIT License.
