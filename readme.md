#TaskFlow - simple task managing app. 
###To run client and server applications follow the below commands. 

##For development : 

```
cd client
npm install 
npm run dev
```

##For backend

```
cd server 
npm install
npm install -g nodemon
npx nodemon backendserver.js
```

##For Production : 
make sure to change the .env files in both client and server. 


##TechStack and Tools Used:
*React
*Typescript
*MUI
*MYSQL
*NodeJs
*Clerk

##Features:
*Authentication in client and server using clerk
*Create, Edit and Delete
*Tasks information persisted across sessions per using as they are stored in MYSQL DB
*Displayed in Kanban board
*Ability to Drag and Drop task to change status

