To create rays db locally run `sst:dev` from root of monorepo

1. Once rays-db docker is running, go into docker terminal and run

- `apt-get update`
- `apt install -y postgresql-16-cron`

2. Go to docker files and search for `/var/lib/postgresql/data/postgresql.conf` config. In the
   bottom add:

```
    cron.database_name = postgres
    cron.database_name = rays
    shared_preload_libraries = 'pg_cron'
```

3. Open rays dba via client and run following query to add cron extension
   `CREATE EXTENSION pg_cron;`

4. You should be able to run `pnpm migrate:latest` without any issues.
