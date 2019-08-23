module.exports = {
   "type": "mysql",
   "host": process.env.DATABASE_HOST || 'food_service_db',
   "port": process.env.DATABASE_PORT || 3306,
   "username": process.env.DATABASE_USER || 'root',
   "password": process.env.DATABASE_PASSWORD || 'food_service_password',
   "database": process.env.DATABASE_NAME || 'food_service',
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
}
