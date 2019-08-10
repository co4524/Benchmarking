path=/home/caideyi/evm-lite-js/test
path2=/home/caideyi/TendermintOnEvm_benchmark/workLoadGenerator
cd $path
./preprocess.sh $1 10.140.1 0
cd $path2
./Benchmark.sh 10 node0 1

