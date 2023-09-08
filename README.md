# GAA Stats Application

## Description

The GAA Stats Application is a web-based tool designed to help manage (GAA/LGFA) game setups and player statistics. The application allows users to record game setups, manage squads, and view player statistics for different games.

## Features

- Record and manage game setups with team names and descriptions.
- Assign players to different positions in a squad for each game setup.
- View and manage player statistics for each game setup.
- User authentication and authorization to ensure secure access.
- Dashboard displaying key links to different sections of the application.

## Technologies Used

- Node.js
- Express.js
- MongoDB (Database)
- Pug (Templating Engine)
- Passport (Authentication Middleware)
- JWT (JSON Web Tokens)

## Node installation

1. Open the GAA Stats folder in Visuual Studio Code
2. Install dependencies: `npm install`in the terminal
3. Update environment variables in config.env (database configuration explained below)
4. Start the server: `npm start`
5. Open a web browser and navigate to `http://localhost:3000` to access the application.

## Database Installation

MongoDB:

1. Navigate to https://www.mongodb.com/
2. Click on 'products' and 'community server'
3. Download the correct version of MongoDB (mac/windows) Mac was used for this project.
4. Open the file, open the bin and copy all files inside.
5. Open terminal and type 'sudo cp' and paste the files in and enter /usr/local/bin and hit enter.
6. Next create a folder for database to store data, in terminal type, sudo mkdir /data/db and hit enter.
7. To add permissions, in the terminal enter: sudo chown -R `id -un` /data/db and hit enter.
8. Enter: mongod
9. Run the mongo shell: mongo

## Connect to a hosted database on atlas

1. Navigate to https://www.mongodb.com/atlas
2. Sign up to Atlas or Log in
3. Click "Create" to create a new project (Projects name: Stats-Project)
4. Build a cluster (create a free cluster with default settings). Click "Create Cluster".
5. Click "Connect" on the cluster
6. Add current IP address so you can connect to the cluster
7. Enter a username and password (copy the password for the config.env file).
8. Save the password in the config.env file (screenshot example below).
9. Click "Connect" on your cluster and click "Connect to your appliaction".
10. Copy the connection string and add into the config.env file.(DATABASE: 'conntecionstring') - see screenshot below
11. You should update the config.env file with your connection string and password.
12. When connection you can create a database in the cluster by nativagting to "Collections" and click "Create Database". (Project database name: 'game-stats').

## Importing the database collections:

13. Download Mongo Compass GUI 14. Click "New connection"
14. In your Atlas cluster, click "Connect" and click "Compass" and copy the connection string.
15. Paste the connection string into the Compass connection and click "Connect". (You may h have to authenticated username and password).
16. Here you can see your newly created database/or create one called 'game-stats'
17. Create 4 collections:
    gamesetups
    users
    squads
    players

18. In each collection click 'Add data" and "Import CSV file" .
19. import the csv files contained within the database folder provided.

## Usage

1. Register an account or log in to access the dashboard.
   - login details used in video demo with pre added data:
     email: laurag16@live.com
     password: test1234
2. Use the dashboard to navigate to different sections of the application.
3. Create new game setups, add players to squads, and record game statistics.
4. View and manage player statistics for different game setups.

## Screenshots

![ What to click to get connection string](image-1.png)
![Connection string copy and ensure Driver is Node.js](image-2.png)
![what congif.env file should look like](image-3.png)
![Enter Compass connection string from atlas](image-4.png)
![What database setup should look like](image-5.png)
![In each Collection import the provded datavase csv files](image-6.png)

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or create a pull request.
