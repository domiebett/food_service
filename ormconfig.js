module.exports = {
   "type": "mysql",
   "host": process.env.DATABASE_HOST,
   "port": process.env.DATABASE_PORT,
   "username": process.env.DATABASE_USER,
   "password": process.env.DATABASE_PASSWORD,
   "database": process.env.DATABASE_NAME,
   "synchronize": true,
   "logging": false,
   "entities": [
      "build/data-layer/entity/**/*.js"
   ],
   "migrations": [
      "build/data-layer/migration/**/*.js"
   ],
   "subscribers": [
      "build/data-layer/subscriber/**/*.js"
   ],
   "cli": {
      "entitiesDir": "src/data-layer/entity",
      "migrationsDir": "src/data-layer/migration",
      "subscribersDir": "src/data-layer/subscriber"
   }
};
