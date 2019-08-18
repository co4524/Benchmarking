export TZ=UTC-8

path=$HOME/Benchmarking/t-tendermint/data
path_blockTxNum=$path/blockTxNum.txt
path_blockCommitTime=$path/blockCommitTime.txt
path_txRequestTime=$path/txRequestTime
####################################################
path2=$HOME/Benchmarking/t-tendermint/report
path_report=$path2/report
path_tps=$path2/tps.txt
path_txRate=$path2/txRate.txt
path_latency=$path2/latency.txt
path_fail=$path2/fail.txt
path_time=$path2/time
####################################################
path_avg_tps=$path2/tps
path_avg_latency=$path2/latency
path_avg_txRate=$path2/txRate
path_avg_fail=$path2/fail

path3=$HOME/Benchmarking/t-tendermint/src/test
path_cal=$path3/cal.py
path_workload=$path3/workload.js
path_genRaw=$path3/genRaw.js

SCP_NODE_NAME="tendermint"

ResetLogFile(){

	rm $path_txRequestTime
	touch $path_txRequestTime

}

Reset(){
	rm $path_tps
	rm $path_txRate
	rm $path_latency
	rm $path_fail
	touch $path_tps
	touch $path_txRate
	touch $path_latency
	touch $path_fail
}

WorkLoad(){
	node $path_workload $1 $2 $3
}

SCP_instance(){

	gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "$1" -- "./Benchmarking/t-tendermint/nodeScript/scp.sh"
	echo "Transfer done!!"

}
CheckSum(){
	gcloud compute --project caideyi ssh --zone asia-east1-b tendermint -- "python Benchmarking/t-tendermint/data/checkSum.py $1"
}

main(){

	echo "-------------------Start Testing-------------------"
	nonce=$3
	for ((j=0 ; j<$2 ; j++)){
		echo "---------------------------------------------------"
		echo "Testing totalTxNum : $1"
		ResetLogFile
		node $path_genRaw $1 $nonce
		let nonce=nonce+1
		sleep 1
		echo "Sending transaction ......"
		WorkLoad $1
		echo "Checking Sum ......"
		CheckSum $1
	    echo "Transfer data....."	
		SCP_instance $SCP_NODE_NAME
		echo "CalPerformance....."
		python $path_cal $1
		sleep 2

	}
}

Reset
a=$(date)
echo $path_time
echo "total : $1  , time : $a" >> $path_time
main $1 $2 $3  ##[1] tx_num  [2] iter  [3]: nonce_value 
echo "Evaluate Variance&Mean..."
python variance.py
