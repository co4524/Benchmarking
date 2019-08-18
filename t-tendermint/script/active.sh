if [ "$1" = "1" ]
then
    #gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint" --command="nohup ./Benchmarking/t-tendermint/nodeScript/start.sh > /dev/null 2> /dev/null < /dev/null &"
	#gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint" --command="nohup ./Benchmarking/t-tendermint/nodeScript/abciServer.sh > /dev/null 2> /dev/null < /dev/null &"
	gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint" --command="./Benchmarking/t-tendermint/nodeScript/start.sh"
else
    for ((i=0 ; i < $1 ; i ++)){
        gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "node$i" --command="rm -r .tendermint"
        gcloud compute scp -recurse ~/mytestnet/node$i/tendermint node$i:~/.tendermint
        gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "node$i" --command="./Benchmarking/t-tendermint/nodeScript/start.sh"
    }
fi
