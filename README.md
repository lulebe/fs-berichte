# fs-Berichte

To just get a mariadb Database, run:

    docker run -p 3306:3306 --name mdb-berichte -e MYSQL_ROOT_PASSWORD=testpw -d mariadb:lts


For a full setup of a demo-version of this app, run:

    docker compose up -d


In production, set the env vars used in `config.js`