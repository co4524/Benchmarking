#!/bin/bash

#reset horizon database
sudo -u postgres psql -c 'drop database sql_h'
sudo -u postgres psql -c 'create database sql_h owner caideyi'
sudo -u postgres psql -c 'grant all privileges on database sql_h to caideyi'

source .env.tmp
./horizon db init
sudo stellar-core new-db
sudo stellar-core force-scp
sudo stellar-core new-hist local
sudo stellar-core run & ./horizon serve

