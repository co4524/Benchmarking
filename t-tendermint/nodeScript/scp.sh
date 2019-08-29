remote_path=/home/caideyi/Benchmarking/t-tendermint/data
data_path1=/home/caideyi/Benchmarking/t-tendermint/data/blockCommitTime.txt
data_path2=/home/caideyi/Benchmarking/t-tendermint/data/blockTxNum.txt
gcloud compute scp $data_path1 tworkloader:$remote_path --zone asia-east1-b
gcloud compute scp $data_path2 tworkloader:$remote_path --zone asia-east1-b

sudo rm $data_path1
sudo rm $data_path2
touch $data_path1
touch $data_path2
