# fs-Berichte

Install dependencies via `npm install` (node v18 or v20 recommended at time of development).

Using environment variables or the `config.js` file, set all parameters according to your configuration,
then you can use `npm run dbinit` to create the database schema and test user.

To just get a mariadb Database, run:

    docker run -p 3306:3306 --name mdb-berichte -e MYSQL_ROOT_PASSWORD=testpw -d mariadb:lts

Log in using the test user and configure everything else via the internal config page (Admin -> Site&User -> Konfiguration)
and create an admin user, then delete the test user.


For a full setup of a demo-version of this app, run:

    docker compose up -d