# db


### local development setup

- setup `cli` app (you can skip telegram related steps)
- inside `cli` app run `yarn prod db create-user --username sofash` to create project user
- inside `cli` app run `yarn prod db create --username sofash` to create project db
- run `touch ormconfig.ts`to create a config for typeorm cli
- paste there the code from below, don't forget to update credentials to your needs

```typescript
import { DataSource } from 'typeorm';
import { DB_NAME, DB_TYPE } from './src/index.js';

export const dataSource = new DataSource({
  type: DB_TYPE,
  host: 'localhost',
  port: 5432,
  username: 'xxx',
  password: 'xxx',
  database: DB_NAME,
  logging: true,
  entities: ['./src/entities/**/*.ts'],
  migrations: ['./src/migrations/**/*.ts'],
});

```

- come back here and run `yarn typeorm migration:run -d ormconfig.ts`
