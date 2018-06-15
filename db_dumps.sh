#!/bin/bash

bak_filename="mvnbook_`date "+%Y%m%d"`¥.sql"
if [ ! -d ./mysql_bak/ ];then
    mkdir ./mysql_bak
fi

docker-compose exec db sh -c 'exec mysqldump --databases "$MYSQL_DATABASE" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD"' > mysql_bak/${bak_filename}
