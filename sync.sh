#!/bin/bash
gcloud config set account sam@sammauld.in
gsutil -h "Cache-Control:no-cache" -m rsync -x "\.DS_Store" -rd ./public gs://utd.mauldin.me/menu
