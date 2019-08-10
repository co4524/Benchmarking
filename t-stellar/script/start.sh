
cd /home/caideyi/stellar/stellar-core
sudo stellar-core new-db --conf node.cfg
sudo stellar-core force-scp --conf node.cfg
sudo stellar-core new-hist local --conf node.cfg
sudo stellar-core run --conf node.cfg

