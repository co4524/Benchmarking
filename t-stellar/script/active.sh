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