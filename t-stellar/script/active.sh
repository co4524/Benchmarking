nodeNum=$1
activenodeNum=$2

./preprocess.sh $activenodeNum
cd /home/caideyi/Benchmarking/t-stellar/autoConfig

./buildConf.sh $nodeNum

for ((i=0 ; i< $nodeNum ; i++)){
    echo "Transfer file to node$i"
    gcloud compute scp testnet/node$i/stellar-core.cfg stellar$i:~ --zone asia-east1-b 
}

for ((i=0 ; i< $activenodeNum ; i++)){
    echo "Starting node$i"
    gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "stellar$i" --command="nohup ./start.sh > /dev/null 2> /dev/null < /dev/null &"
}

sleep 5
for ((i=0 ; i< $activenodeNum ; i++)){

	curl "http://10.140.3.$i:11626/upgrades?mode=set&upgradetime=1970-01-01T00:00:00Z&maxtxsize=20000"

}
cd /home/caideyi/Benchmarking/t-stellar/stellar
node createAccount.js

curl "http://10.140.3.0:11626/info"
