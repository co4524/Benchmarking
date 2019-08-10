
buildNode(){
    #gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "node$1" -- './resetOneNode.sh'

    #gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "node$1" -- 'sh reseteth.sh'
    #gcloud compute scp --recurse ~/mytestnet/node$1/tendermint node$1:~/.evm-lite/ --zone asia-east1-b
    gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "node$1" --command="nohup ./main tendermint > /dev/null 2> /dev/null < /dev/null &"
}
startNetwork(){
    for (( i=0 ; i<$1 ; i++)){
        echo "starting node$i"
        buildNode $i
    }
}

killProcess(){

	for (( i=0 ; i<$1 ; i++)){

		echo "kill process at node$i"
		gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "node$i" -- 'sh kill.sh'
	}
}

genesis(){
	for(( i=0 ; i<$1 ; i++)){
		echo "create genesis.json at node$i"
		rm ~/mytestnet/node$i/tendermint/config/genesis.json
		cp ~/genesis.json ~/mytestnet/node$i/tendermint/config
	}
}

keystore(){

	for(( i=0 ; i<$1 ; i++)){
	
		gcloud compute scp --recurse ~/keystore node$i:~/.evm-lite/eth --zone asia-east1-b
	}

}


text(){
    for (( i=1 ; i<$1+1 ; i++)){
        text="node$i "
        text2=$text2$text
    }
}
buildConfig(){
    cd configAutoGen/remoteConfig
    ./buildLocalEnv.sh $1
    ./changeIp.sh $1 $2 $3
}
ResetNetwork(){
    gcloud compute instances stop $text2
    gcloud compute instances start $text2
}

main() {
    # text $1
    # echo $text2
    # buildConfig $1 $2 $3
    # ResetNetwork 
    killProcess $1
    keystore $2
    genesis $2
    startNetwork $2
}

main $1 $2
# $3 is last node ip

#gcloud compute instances start $text2
