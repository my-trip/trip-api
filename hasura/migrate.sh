#!/bin/bash
set -e

export HASURA_GRAPHQL_DATABASE_URL="postgres://${HASURA_GRAPHQL_DATABASE_USERNAME}:${HASURA_GRAPHQL_DATABASE_PASSWORD}@${HASURA_GRAPHQL_DATABASE_HOST}:${HASURA_GRAPHQL_DATABASE_PORT}/${HASURA_GRAPHQL_DATABASE_DATABASE}"

exec docker-entrypoint.sh