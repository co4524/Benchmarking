remote_path=$HOME/Benchmarking/t-tendermint/data
data_path1=$HOME/Benchmarking/t-tendermint/data/blockCommitTime.txt
data_path2=$HOME/Benchmarking/t-tendermint/data/blockTxNum.txt
gcloud compute scp $data_path1 workloader:$remote_path --zone asia-east1-b
gcloud compute scp $data_path2 workloader:$remote_path --zone asia-east1-b

rm $data_path1
rm $data_path2
touch $data_path1
touch $data_path2