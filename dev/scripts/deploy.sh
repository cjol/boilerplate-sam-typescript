sam deploy \
	--template-file template.yaml \
	--s3-bucket $DEPLOYMENT_BUCKET_NAME-${STAGE:-dev} \
	--stack-name $STACK_NAME-${STAGE:-dev} \
	--capabilities CAPABILITY_IAM \
	--parameter-overrides Stage=${STAGE:-dev} ProjectName=$STACK_NAME \
	--no-fail-on-empty-changeset
