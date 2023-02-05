# Hua Elke Frontend built with React.js and Tailwindcss

## Installing and Running the Application

- Clone the React project repository to your computer or download the project as a ZIP file and extract it to your local machine.

- Open a terminal or command prompt window and navigate to the root directory of the project.

### Setting up the environment variables


Create a `.env` file, copy the contents of the `.env.example` and change the `REACT_APP_BACKEND`    variable to point to the DRF server


### Local Installation with npm and Node.js

- Install Node.js and npm on your computer if they are not already installed. You can download the latest version of Node.js and npm from the official website: https://nodejs.org/en/download/

- Install the project dependencies by running `npm install`

- Start a development server by running `npm run start`

Open a web browser and go to http://localhost:3000/ to view the application


### Installation on a Docker Container

#### When downloading the elkerest-server repository you can deploy both the server, the postgresql and the react app at once by running `docker-compose up --build` in the server's root directory (you can see the instuctions in the elkerest-server README)

- Install Docker on your computer if it is not already installed. You can download the latest version of Docker from the official website: https://www.docker.com/products/docker-desktop

- Checkout to the `docker-deploy-v1` branch

- Deploy the app seperately in a docker container by running `docker build .`

- Deploy the app from the server's root directory by running `docker-compose up --build` (more instructions in the elkerest-server readme.md)
