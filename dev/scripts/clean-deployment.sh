aws cloudformation delete-stack --stack-name $STACK_NAME-${STAGE:-dev}

echo Tearing down stack...

aws cloudformation wait stack-delete-complete --stack-name $STACK_NAME-${STAGE:-dev} 

aws s3 rm s3://$DEPLOYMENT_BUCKET_NAME-${STAGE:-dev} --recursive

aws s3api delete-bucket --bucket $DEPLOYMENT_BUCKET_NAME-${STAGE:-dev}
