if [ "$1" = "1" ]
then
    echo "kill node0" 
    gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint" -- './resetOne.sh'
else
    echo "var is 456"
fi
