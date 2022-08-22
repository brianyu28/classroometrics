# Troubleshooting Classroometrics Development

## "Access denied" error when running tests

You may see the following error when trying to run tests:

```
Got an error creating the test database: (1044, "Access denied for user '<MYSQL_USER>'@'%' to database 'test_<MYSQL_DATABASE>'")
```

In that case, you need the grant database privileges to your database user by running:
- `docker exec -it <MARIADB_CONTAINER_ID> -u root -p`
- `grant create, alter, drop, select, insert, update, delete, index on *.* to '<MYSQL_USER>'@'%';`
