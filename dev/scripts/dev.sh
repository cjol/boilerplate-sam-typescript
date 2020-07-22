# Pre-download the images that we'll be using
docker-compose pull

# Start a local instance of dynamodb
ts-node $(dirname "$0")/../setupLocalDB.ts
envsubst < $(dirname "$0")/envVars.template.json > $(dirname "$0")/envVars.json

sam-proxy start $npm_package_name \
	--port ${PORT:-3000} \
	--env-vars $(dirname "$0")/envVars.json \
	--docker-network local-ddb
