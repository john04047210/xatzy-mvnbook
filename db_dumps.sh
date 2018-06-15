#!/bin/bash

cd /usr/local/src/docker-mvnbook
bak_filename="mvnbook_`date "+%Y%m%d"`.sql"
if [ ! -d ./mysql_bak/ ];then
    mkdir ./mysql_bak
fi

docker exec dockermvnbook_db_1 sh -c 'exec mysqldump --databases "$MYSQL_DATABASE" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD"' > mysql_bak/${bak_filename}
