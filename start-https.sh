#!/bin/bash

while getopts k:c: flag
do
  case "${flag}" in
    k) KEY=${OPTARG};;
    c) CERT=${OPTARG};;
  esac
done

KEY=$KEY CERT=$CERT HTTPSPORT=443 HTTPPORT=80 npm run start:HTTPS