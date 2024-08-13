This is a full-stack social media application made using Node.js, Express, MYSQL and React. Users can create accounts, post content, like/unlike posts, edit their posts, and manage their profiles. Below is a video demonstrating all the features:




https://github.com/user-attachments/assets/227335ec-05d3-4da8-94a6-343f5eb8872d


If you would like to run this app locally, follow the below steps:   
Clone the repository:   
  git clone https://github.com/rishabh2824/PostUp-App.git   
  cd "PostUp-App"

Install backend dependencies:  
  cd backend   
  npm install

Create a database:   
Create a new database and edit the config.json file in the backend folder with your username and password. Using MY SQL workbench is highly recommended.  https://www.mysql.com/products/workbench/

After creating a database, go back to the backend folder and run the migrations to set up the database:   
  npx sequelize db:migrate

Start the backend:   
  npm start

Start the frontend:   
  cd ../frontend   
  npm install   
  npm start
