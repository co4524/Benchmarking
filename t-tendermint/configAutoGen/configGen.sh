path=$HOME/mytestnet/node
URL_path=$PWD/../src/test/baseURL
nodeNum=$1
base='10.140.4'
rm $URL_path

#default para
tendermintPath=$HOME/.tendermint
tendermintTestnetPath=$HOME/mytestnet
ethPath=$HOME/.evm-lite/eth
persistent_peers='persistent_peers = "'
dq='"'

ChangIp(){
	
	for ((i=0 ; i<$1 ; i++)) {
	let ip=nodeNum-1
	for ((j=$1-1 ; j>-1 ; j--)){
		sed -i "s/node$j/$base.$ip/g" $path$i/tendermint/config/config.toml
		let ip=ip-1	
	}
}
}

Reset(){
	rm -r $tendermintPath
	sudo rm -r $HOME/mytestnet
	tendermint testnet
	mv mytestnet $HOME
}
preprocess(){
	#create tendermint dir for node
	mkdir $tendermintTestnetPath/node$1/tendermint
	mv $tendermintTestnetPath/node$1/config $tendermintTestnetPath/node$1/tendermint
	mv $tendermintTestnetPath/node$1/data $tendermintTestnetPath/node$1/tendermint
}

addVa(){

	#new val
	tendermint init
	#make new val dir in mytestnet dir
	mkdir -p $tendermintTestnetPath/node$1
	cp -r $tendermintPath $tendermintTestnetPath/node$1/tendermint
	#update the genesis.json file, add a val in
	cp -f $tendermintTestnetPath/node0/tendermint/config/genesis.json $tendermintPath/config/.
	touch $tendermintPath/Val.txt
	sed -n '1,6p' $tendermintPath/config/priv_validator_key.json >> $tendermintPath/Val.txt
	cat ./tmp.txt >> $tendermintPath/Val.txt
	sed -i "s/noder/node$1/g" $tendermintPath/Val.txt
	sed -i '$d' $tendermintPath/config/genesis.json
	sed -i '$d' $tendermintPath/config/genesis.json
	sed -i '$d' $tendermintPath/config/genesis.json
	sed -i '$d' $tendermintPath/config/genesis.json
	echo "    }," >> $tendermintPath/config/genesis.json
	cat $tendermintPath/Val.txt >> $tendermintPath/config/genesis.json
	#brocast the genesis.json file
	for ((i=0;i<$1;i++))
		do
			cp -f $tendermintPath/config/genesis.json $tendermintTestnetPath/node$i/tendermint/config/.
		done
	rm -r $tendermintPath

}

Modconf(){

	persistent_peers $1
	echo $persistent_peers

	for ((i=0 ; i<$1 ; i++)){
		cp template.toml config.toml
		sed -i "s/persistent_peers/$persistent_peers/g" config.toml
		cp -f config.toml $tendermintTestnetPath/node$i/tendermint/config/.
		rm config.toml
	}

}


get_peer(){

	id=$(tendermint show_node_id --home "$tendermintTestnetPath/node$1/tendermint/")
	localhost="@node$1:26656,"
	echo $id$localhost

}

persistent_peers(){

	for ((i=0 ; i<$1 ; i++)){
		peer=$(get_peer $i)
		persistent_peers=$persistent_peers$peer
	}

	persistent_peers=${persistent_peers%?}$dq

}


Reset

for ((i=0 ; i<4 ; i++)){
	preprocess $i
}

for ((i=4 ; i<$nodeNum ; i++)){
	addVa $i
}

Modconf $nodeNum

ChangIp $nodeNum


let nn=nodeNum-1
cp -f $HOME/mytestnet/node0/tendermint/config/genesis.json $HOME/mytestnet/node$nn/tendermint/config/.
