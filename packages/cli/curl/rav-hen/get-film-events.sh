#!/bin/zsh

TENANT_ID='10104'
CINEMA_ID='1058'
DATE='2024-06-08'

curl https://www.rav-hen.co.il/rh/data-api-service/v1/quickbook/$TENANT_ID/film-events/in-cinema/$CINEMA_ID/at-date/$DATE | jq '.body.films'
