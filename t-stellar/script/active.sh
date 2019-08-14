nodeNum=$1

./preprocess.sh $nodeNum
cd /home/caideyi/Benchmarking/t-stellar/autoConfig

./buildConf.sh $nodeNum

for ((i=0 ; i< $nodeNum ; i++)){
    echo "Transfer file to node$i"
    gcloud compute scp testnet/node$i/stellar-core.cfg node$i:~ --zone asia-east1-b 
}

for ((i=0 ; i< $nodeNum ; i++)){
    echo "Starting node$i"
    gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "node$i" --command="nohup ./start.sh > /dev/null 2> /dev/null < /dev/null &"
}

sleep 5

curl "http://10.140.1.0:11626/upgrades?mode=set&upgradetime=1970-01-01T00:00:00Z&maxtxsize=20000"

cd /home/caideyi/Benchmarking/t-stellar/stellar
node createAccount.js

curl "http://10.140.1.0:11626/info"
