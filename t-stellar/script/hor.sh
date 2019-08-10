source .env.tmp
curl "http://localhost:11626/upgrades?mode=set&upgradetime=1970-01-01T00:00:00Z&maxtxsize=20000"
./horizon db init
./horizon serve
