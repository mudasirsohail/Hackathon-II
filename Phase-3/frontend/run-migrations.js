require('dotenv').config({ path: './.env.local' });

const { runMigrations } = require('./lib/migrate.ts');

runMigrations()
  .then(() => {
    console.log('Migrations completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });