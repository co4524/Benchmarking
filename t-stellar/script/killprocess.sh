nodeNum=$1
for ((i=0 ; i< $nodeNum ; i++)){
    echo "Killing node$i"
    gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "node$i" --command="./kill.sh"
}