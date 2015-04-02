#/bin/sh

mysql -uroot << EOF
create database if not exists reddit;
use reddit;
create table buttonclicks (timestamp TIMESTAMP, clicks INT, secondsleft TINYINT, INDEX timestamp_index (timestamp));
GRANT SELECT,INSERT ON buttonclicks to 'reddit'@'localhost' IDENTIFIED BY 'redditbutton';
EOF

echo "Database setup";
