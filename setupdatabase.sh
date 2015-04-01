#/bin/sh

mysql -uroot << EOF
create database if not exists reddit;
use reddit;
create table buttonclicks (timestamp TIMESTAMP, clicks INT, secondsleft TINYINT);
GRANT SELECT,INSERT ON buttonclicks to 'reddit'@'localhost' IDENTIFIED BY 'redditbutton';
EOF

echo "Database setup";
