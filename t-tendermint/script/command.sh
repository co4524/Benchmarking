
# help information
help(){
    echo "-----Usage-----"
    echo "./command ACTION"
    echo "-----ACTION-----"
    echo "[active] [number of nodes configure you want to build] [number of nodes you want to active]"
    echo "[kill] [n : kill process from node0 to node{n} ]"
    echo "[test] [number of transactions you want to submit] [nonce value]"
    echo "[benchmark] [iteration]"
}

# run tendermint node on each machine
activeNode(){
    if [ -z "$1" -o -z "$2" ]; then
        help
    else
        if [ "$1" = "1" ]
        then
            # run node
	        gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint$i" --command="./Benchmarking/t-tendermint/nodeScript/start.sh"
        else
            # build configure file
	        cd /home/caideyi/Benchmarking/t-tendermint/configAutoGen
            ./configGen.sh $1
            # run node on each gcp machine
            for ((i=0 ; i < $1 ; i ++)){
                # reset node data
                gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint$i" --command="rm -r .tendermint"
                # transfer config file
                gcloud compute scp --recurse ~/mytestnet/node$i/tendermint tendermint$i:~/.tendermint --zone "asia-east1-b"
                # run node
                gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint$i" --command="./Benchmarking/t-tendermint/nodeScript/start.sh"
            }
        fi
    fi
}

oneRoundTest(){
    if [ -z "$1" -o -z "$2" ]; then
        help
    else
        # reset data
        gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint0" -- './home/caideyi/Benchmarking/t-tendermint/nodeScript/dataReset.sh'
        # testing one time
        ./oneRoundTesting.sh $1 1 $2
    fi
}

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

benchmark(){
    PATH2=$HOME/Benchmarking/t-tendermint/report
    PATH_REPORT=$PATH2/report
    PATH_TIME=$PATH2/time

    # number of transactions you want to test
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

    if [ -z "$1" ]; then
        help
    else
        echo "-------------------Start Testing-------------------" > $PATH_REPORT
        #reset data
        gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint0" -- './Benchmarking/t-tendermint/nodeScript/dataReset.sh'

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
    fi

}

# kill "tendermint node" process
killProcess(){
    if [ -z "$1" ]; then
        help
    else
        if [ "$1" = "1" ]
        then
            echo "kill node0" 
            gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint0" -- './resetOne.sh'
        else
            for ((i=0 ; i < $1 ; i ++)){
                gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "tendermint$i" -- './resetOne.sh'
            }
        fi
    fi
}

main(){
    action=$1
    case "$action" in
        active) activeNode $2 $3
            ;;
        kill) killProcess $2
            ;;
        benchmark) benchmark $2
            ;;
        test) oneRoundTest $2 $3
            ;;
        *) help
    esac
}

main $1 $2 $3
