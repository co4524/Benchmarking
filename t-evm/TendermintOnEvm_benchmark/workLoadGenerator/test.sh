gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "node0" -- './TendermintOnEvm_benchmark/workLoadGenerator/reset.sh'
./Performance.sh $1 $2 1 
