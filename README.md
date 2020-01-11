## :boom: Barbei.ro API
A Node.js API to provide data storage to the Barbei.ro Front-end software. This API uses Postgre SQL with Sequelize for general requestas and MongoDB to generate notifications on the mobile app. 

---
## Project structure

```
├── src/                     - Folder with all the API configurations
|   ├── app/                 - Folder with the database construction
│       ├── controllers/     - All the controllers to retrieve data from url
│       ├── middlewares/     - Middlewares to all the requests provided
│       ├── models/          - Models to the tables created in the database
│       ├── schemas/         - MondoDB schemas to the notifications
|   ├── config               - Folder providing configurations to the autentication, database, mail send and multer
|   ├── database             - Postgre and Mongo configuration folder
|       ├── migrations/      - Migrations of PostgreSQL
|   ├── lib                  - Email sending configuration folder
```
---

## Packages included 
 - Sequelize
 - Node Mailer
 - Express
 - Mongoose
 - Multer
 - JSON Web Token
---
