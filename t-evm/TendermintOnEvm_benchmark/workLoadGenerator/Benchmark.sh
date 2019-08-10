path2=$HOME/TendermintOnEvm_benchmark/report
path_report=$path2/report
path_avg_tps=$path2/tps
path_avg_latency=$path2/latency
path_avg_txRate=$path2/txRate
path_avg_fail=$path2/fail

path_var_tps=$path2/vTps
path_var_latency=$path2/vLatency
path_var_txRate=$path2/vTxRate
path_var_fail=$path2/vFail

################################
ip=localhost
threadNum=1  #concurent num
nodeNum=1    #workload Send txNum
txTime=5   #test time
batchNum=0

intervalTime=(
10
5
2.5
1.66
1.25
1
0.832
0.625
0.5
0.41
0.35
0.31
0.27
0.25
0.22
0.2
0.19
#0.17
#0.16
)

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
#22000
#24000
#26000
#28000
#30000
)

ResetReport(){
	rm $path_avg_tps
	rm $path_avg_latency
	rm $path_avg_txRate
	rm $path_report
	rm $path_var_tps
	rm $path_var_latency
	rm $path_var_txRate
	rm $path_avg_fail
	rm $path_var_fail
	touch $path_avg_tps
	touch $path_avg_latency
	touch $path_avg_txRate
	touch $path_report
	touch $path_var_tps
	touch $path_var_latency
	touch $path_var_txRate
	touch $path_avg_fail
	touch $path_var_fail
}

Benchmark() {

	index=0
	for i in "${intervalTime[@]}"
	do
		./Performance.sh $i ${txTotalSend[$index]} $1 $2 $3
		#[1]:interval time 
		#[2]:total send  
		#[3]:iter 
		#[4]:instance_name 
		let index=index+1
	done

}

nohup gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "$2" -- './TendermintOnEvm_benchmark/workLoadGenerator/reset.sh' > nohup.out 2>&1
ResetReport
Benchmark $1 $2 $3
#[1]:iter
#[2]:instance_name
