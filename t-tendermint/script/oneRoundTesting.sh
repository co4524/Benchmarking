#change time zone --> asia
export TZ=UTC-8

#The location of worklaod , generate transaction , calculate performance
PATH3=$HOME/Benchmarking/t-tendermint/src/test
PATH_CALCULATE=$PATH3/cal.py
PATH_WORKLOAD=$PATH3/workload.js
PATH_GENERATE_RAW_TX=$PATH3/genRaw.js
PATH_CONFIGURE=$HOME/Benchmarking/t-tendermint/configure.json
#GCP instance name
SCP_NODE_NAME=$(cat $PATH_CONFIGURE | jq -r '.scp_instance_name')

workLoad(){
	node $PATH_WORKLOAD $1 
}

scpInstance(){
	gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "$1" -- "./Benchmarking/t-tendermint/nodeScript/scp.sh"
	echo "Transfer done!!"
}

checkSum(){
	gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "$2" -- "python Benchmarking/t-tendermint/data/checkSum.py $1"
}


main(){

	echo "-------------------Start Testing-------------------"
	_nonce=$3

	# excute [$2] times in this round
	for ((i=0 ; i<$2 ; i++)){

		echo "---------------------------------------------------"
		echo "Testing totalTxNum : $1"

		# Generate [$1] transactions with nonce value [_nonce]
		node $PATH_GENERATE_RAW_TX $1 $_nonce
		let _nonce=_nonce+1

		# submit [$1] transactions
		echo "Sending transaction ......"
		workLoad $1

		# command google cloud instance([$SCP_NODE_NAME]) check [$PATH_BLOCK_TX_NUM] , waiting for [$1] == [$PATH_BLOCK_TX_NUM]
		echo "Checking Sum ......"
		checkSum $1 $SCP_NODE_NAME

		# command google cloud instance([$SCP_NODE_NAME]) transfer [$PATH_BLOCK_COMMIT_TIME] & [$PATH_BLOCK_TX_NUM] to this instance
	    echo "Transfer data....."	
		scpInstance $SCP_NODE_NAME

		# calculate performance metric ( tps , latency , fail , tx_rate ) , [$1]= submit transactions num , [$i]= 0 ? overwrite file : append file
		echo "CalPerformance....."
		cd $PATH3
		python3 $PATH_CALCULATE $1 $i
		sleep 2
	}

	# calculate mean & variance(tps , latency , fail_rate , tx_rate ) in this round
	echo "Evaluate Variance&Mean..."
	cd ../../script
	python3 variance.py $3

}

main $1 $2 $3  ##[1] tx_num  [2] iter  [3]: nonce_value 
