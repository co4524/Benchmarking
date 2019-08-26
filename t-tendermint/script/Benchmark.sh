path2=$HOME/Benchmarking/t-tendermint/report
PATH_REPORT=$path2/report
PATH_TIME=$path2/time
################################

txTotalSend=(
 100
 200
 400
 800
 1200
 2000
 3000
 4000
 5000
 6000
8000
10000
12000
14000
16000
18000
20000
)

# Record Time
logTime(){
	time=$(date)
	if [ "$2" = "1" ]
	then
		echo "total : $1  , time : $time" > $PATH_TIME
	else
		echo "total : $1  , time : $time" >> $PATH_TIME
	fi
}

Benchmark() {

	nonce=1
	iter=$1
	for i in "${txTotalSend[@]}"
	do
		echo "=======New Round Testing transaction number: $i=======" >> $PATH_REPORT
		# record time every round
		logTime $i $nonce
		# start new round testing  , [para1] : totalSend ,  [para2] : iter , [para3] : nonce
		./oneRoundTesting.sh $i $1 $nonce
		# update nonce value , if no update transaction will fail
		let nonce=nonce+iter
	done

}



echo "-------------------Start Testing-------------------" > $PATH_REPORT
gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint0" -- './Benchmarking/t-tendermint/nodeScript/dataReset.sh'
Benchmark 10
