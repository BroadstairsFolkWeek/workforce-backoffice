#!/bin/sh

cat azure.parameters.json  | sed 's/${{/${/;s/}}/}/' | envsubst > azure.parameters.substituted.json