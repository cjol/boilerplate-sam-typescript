sam logs \
	--stack-name $STACK_NAME-${STAGE:-dev} \
	-n "$@"