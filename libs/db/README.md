# db


### local development setup

- run `touch ormconfig.ts`to create a config for typeorm cli
- paste there the code from below, don't forget to update credentials to your needs

```typescript
import { DataSource } from 'typeorm';

export const DATA_SOURCE = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'xxx',
  password: 'xxx',
  database: 'sofash',
  logging: true,
  entities: ['./src/entities/**/*.ts'],
  migrations: ['./src/migrations/**/*.ts'],
});
```

- build `cli` app and run there `yarn run prod db create` to create project db
- come back here and run `yarn run typeorm migration:run -d ormconfig.ts`
