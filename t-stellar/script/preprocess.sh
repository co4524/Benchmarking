#  [0]: localhost
#  [1~]: remote
URL_path=$HOME/Benchmarking/t-stellar/script/baseURL
rm $URL_path
nodeNum=$1
base="10.140.1"
ip="0"
remoteURL(){
    for ((i=0 ; i<$nodeNum ; i++)) {
        echo "http://$base.$ip:8000" >> $URL_path
        let ip=ip+1	
    }
}

if [ -z "$1" ]
then
    echo "http://localhost:8080" >> $URL_path
else
    remoteURL
fi