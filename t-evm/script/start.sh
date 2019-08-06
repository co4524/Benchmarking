
buildNode(){
    let num=$1-1
    gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "node$1" -- './resetOneNode.sh'
    gcloud compute scp --recurse mytestnet/node$num/tendermint node$1:~/.evm-lite/ --zone asia-east1-b
    #gcloud compute --project "caideyi" ssh --zone "asia-east1-b" "node$1" --command="nohup ./main tendermint > /dev/null 2> /dev/null < /dev/null &"
}
startNetwork(){
    for (( i=1 ; i<$1+1 ; i++)){
        echo "starting node$i"
        buildNode $i
    }
}
text(){
    for (( i=0 ; i<$1 ; i++)){
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
    #gcloud compute instances stop $text2
    gcloud compute instances start $text2
    #gcloud compute instances start workloader
}

main() {
    text $1
    echo $text2
    # buildConfig $1 $2 $3
    ResetNetwork 
    # startNetwork $1
}

main $1
# $3 is last node ip

#gcloud compute instances start $text2
