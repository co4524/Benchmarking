PATH_CONFIGURE=$HOME/Benchmarking/t-tendermint/configure.json
PATH_TENDERMINT=$HOME/.tendermint
PATH_TENDERMINT_TESTNET=$HOME/mytestnet
PATH_URL=$PWD/../src/test/baseURL

NODE_NUMBER=$1
BASE=$(cat $PATH_CONFIGURE | jq -r '.base_ip')

# Change persistent_peers option of config.toml file 
# example :
# persistent_peers = "5a38f1961201e60353c93f2a8b67537f61d274f7@node0:26656,eb7f649e6e523785ea41faf3e2c248c59ca8cda0@node1:26656"
# 								|
# 								V
# persistent_peers = "5a38f1961201e60353c93f2a8b67537f61d274f7@10.140.4.0:26656,eb7f649e6e523785ea41faf3e2c248c59ca8cda0@10.140.4.1:26656"

ChangIp(){
	
	for ((i=0 ; i<$NODE_NUMBER ; i++)) {
	let ip=NODE_NUMBER-1
	for ((j=$NODE_NUMBER-1 ; j>-1 ; j--)){
		sed -i "s/node$j/$BASE.$ip/g" $PATH_TENDERMINT_TESTNET/node$i/tendermint/config/config.toml
		let ip=ip-1	
	}
}
}

# Reset mytestnet directory
Reset(){
	rm -r $PATH_TENDERMINT
	sudo rm -r $PATH_TENDERMINT_TESTNET
	tendermint testnet
	mv mytestnet $HOME
}

# create tendermint dir for node
preprocess(){
	mkdir $PATH_TENDERMINT_TESTNET/node$1/tendermint
	mv $PATH_TENDERMINT_TESTNET/node$1/config $PATH_TENDERMINT_TESTNET/node$1/tendermint
	mv $PATH_TENDERMINT_TESTNET/node$1/data $PATH_TENDERMINT_TESTNET/node$1/tendermint
}

# adding a validator in genesis.json file
addVa(){

	#new val
	tendermint init
	#make new val dir in mytestnet dir
	mkdir -p $PATH_TENDERMINT_TESTNET/node$1
	cp -r $PATH_TENDERMINT $PATH_TENDERMINT_TESTNET/node$1/tendermint
	#update the genesis.json file, add a val in
	cp -f $PATH_TENDERMINT_TESTNET/node0/tendermint/config/genesis.json $PATH_TENDERMINT/config/.
	touch $PATH_TENDERMINT/Val.txt
	sed -n '1,6p' $PATH_TENDERMINT/config/priv_validator_key.json >> $PATH_TENDERMINT/Val.txt
	cat ./tmp >> $PATH_TENDERMINT/Val.txt
	sed -i "s/noder/node$1/g" $PATH_TENDERMINT/Val.txt
	sed -i '$d' $PATH_TENDERMINT/config/genesis.json
	sed -i '$d' $PATH_TENDERMINT/config/genesis.json
	sed -i '$d' $PATH_TENDERMINT/config/genesis.json
	sed -i '$d' $PATH_TENDERMINT/config/genesis.json
	echo "    }," >> $PATH_TENDERMINT/config/genesis.json
	cat $PATH_TENDERMINT/Val.txt >> $PATH_TENDERMINT/config/genesis.json
	#brocast the genesis.json file
	for ((i=0;i<$1;i++))
		do
			cp -f $PATH_TENDERMINT/config/genesis.json $PATH_TENDERMINT_TESTNET/node$i/tendermint/config/.
		done
	rm -r $PATH_TENDERMINT

}

# Change persistent_peers option of config.toml file 
# example :
# persistent_peers 
# 								|
# 								V
# persistent_peers = "5a38f1961201e60353c93f2a8b67537f61d274f7@node0:26656,eb7f649e6e523785ea41faf3e2c248c59ca8cda0@node1:26656"
Modconf(){

	persistent_peers=$(persistent_peers $1)
	echo $persistent_peers

	for ((i=0 ; i<$NODE_NUMBER ; i++)){
		cp template.toml config.toml
		sed -i "s/persistent_peers/$persistent_peers/g" config.toml
		cp -f config.toml $PATH_TENDERMINT_TESTNET/node$i/tendermint/config/.
		rm config.toml
	}

}

# get peer id
get_peer(){

	id=$(tendermint show_node_id --home "$PATH_TENDERMINT_TESTNET/node$1/tendermint/")
	localhost="@node$1:26656,"
	echo $id$localhost

}

# Change persistent_peers option of config.toml file 
persistent_peers(){

	persistent_peers='persistent_peers = "'
	double_quotes='"'

	for ((i=0 ; i<$NODE_NUMBER ; i++)){
		peer=$(get_peer $i)
		persistent_peers=$persistent_peers$peer
	}

	persistent_peers=${persistent_peers%?}$double_quotes
	echo $persistent_peers
}

# output all validator ip address
remoteURL(){
	ip="0"
    for ((i=0 ; i<$NODE_NUMBER ; i++)) {
        echo "http://$BASE.$ip:26657" >> $PATH_URL
        let ip=ip+1	
    }
}



Reset

for ((i=0 ; i<4 ; i++)){
	preprocess $i
}

for ((i=4 ; i<$NODE_NUMBER ; i++)){
	addVa $i
}

Modconf 

ChangIp 

let nn=NODE_NUMBER-1
cp -f $HOME/mytestnet/node0/tendermint/config/genesis.json $HOME/mytestnet/node$nn/tendermint/config/.


rm $PATH_URL
if [ -z "$1" ]
then
    echo "http://localhost:26657" >> $PATH_URL
else
    remoteURL
fi