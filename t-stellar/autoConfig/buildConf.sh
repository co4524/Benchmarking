#!/bin/bash

#Setting
nodeNum=$1
base=10.140.1
ip=0
port=11625

#char
Double_quotes='"'
Dollar='$'
node="node"

#reset config
rm -r testnet
cp template.cfg stellar-core.cfg
mkdir testnet

#create seed&publicKey config file
for ((i=0 ; i< $nodeNum ; i++)){
    mkdir -p testnet/node$i
    cp stellar-core.cfg testnet/node$i/.
    stellar-core gen-seed > testnet/node$i/key
}
rm stellar-core.cfg

#   generate Quorm set & NodeName & Peers
#
#   NodeName ["GBE4RYUINT4AGGBNWIM4BJCHVUGKJNIM3Z7LTVN7LRH4DUY6CYNPAMHL node0"  , "GCXARYZXDCOKOMSTWXGOBO7RTM4TN4SPVBX3Q7VINZKWIHTIPRGFYCPU node1"  , "GBV3RZH3JSH7IBNIW3K7P3LYGARKWHNZ55IXKA6EU32G3U3IYRS2EANY node2"  ,
#           "GA6NSMJRISGWXLWYC4GNENQFRVCIHLQ3RI2EBWUHC7SXC435FVH7JGY3 node3" ]
#
#   Quorm    ["$node0"  , "$node1"  , "$node2"  , "$node3" ]
#
#   Peers    ["10.140.1.0:11625"  , "10.140.1.1:11625"  , "10.140.1.2:11625"  , "10.140.1.3:11625" ]

for ((i = 0 ; i < $nodeNum ; i ++ )){
    pub=$(cat testnet/node$i/key | grep -o "G[0-9,A-Z]\{55,\}")
    tmp="$Double_quotes$base.$ip:$port$Double_quotes " 
    tmp2="$Double_quotes$Dollar$node$i$Double_quotes "
    tmp3="$Double_quotes$pub node$i$Double_quotes "
    if [ "$i" = "0" ]
    then
        Peers=$tmp
        Quorm=$tmp2
        NodeName=$tmp3
    else
        Peers="$Peers , $tmp"
        Quorm="$Quorm , $tmp2"
        NodeName="$NodeName , $tmp3"
    fi
    let ip=ip+1	
}

echo "[$NodeName]"
echo "[$Peers]"
echo "[$Quorm]"

for ((i = 0 ; i < $nodeNum ; i ++ )){
    seed=$(cat testnet/node$i/key | grep -o "S[0-9,A-Z]\{55,\}")
    sed -i "s/QUORUM_REPLACE/$Quorm/g" testnet/node$i/stellar-core.cfg
    sed -i "s/PREFERRED_PEERS_REPLACE/$Peers/g" testnet/node$i/stellar-core.cfg
    sed -i "s/KNOWN_PEERS_REPLACE/$Peers/g" testnet/node$i/stellar-core.cfg
    sed -i "s/NODE_NAMES_REPLACE/$NodeName/g" testnet/node$i/stellar-core.cfg
    sed -i "s/SEED_REPLACE/$seed/g" testnet/node$i/stellar-core.cfg
}