if [ "$1" = "1" ]
then
    echo "kill node0" 
    gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint0" -- './resetOne.sh'
else
    for ((i=0 ; i < $1 ; i ++)){
        gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint$i" -- './resetOne.sh'
    }
fi
