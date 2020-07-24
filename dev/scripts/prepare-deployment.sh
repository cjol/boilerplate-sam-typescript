aws s3api create-bucket \
	--bucket $DEPLOYMENT_BUCKET_NAME \
	--create-bucket-configuration \
	LocationConstraint=$(aws configure get region)
