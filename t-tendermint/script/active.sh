if [ "$1" = "1" ]
then
	gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint$i" --command="./Benchmarking/t-tendermint/nodeScript/start.sh"
else
	cd /home/caideyi/Benchmarking/t-tendermint/configAutoGen
    ./configGen.sh $1
    cd /home/caideyi/Benchmarking/t-tendermint/src/test
    ./preprocess.sh $2
    for ((i=0 ; i < $2 ; i ++)){
        gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint$i" --command="rm -r .tendermint"
        gcloud compute scp --recurse ~/mytestnet/node$i/tendermint tendermint$i:~/.tendermint --zone "asia-east1-b"
        gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint$i" --command="./Benchmarking/t-tendermint/nodeScript/start.sh"
    }
fi
