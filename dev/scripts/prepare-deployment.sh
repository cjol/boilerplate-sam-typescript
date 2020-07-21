aws s3api create-bucket \
	--bucket $DEPLOYMENT_BUCKET_NAME-${STAGE:-dev} \
	--create-bucket-configuration \
	LocationConstraint=$(aws configure get region)
