FROM public.ecr.aws/lambda/nodejs:20

# Copy function code
COPY dist ${LAMBDA_TASK_ROOT}/
COPY node_modules ${LAMBDA_TASK_ROOT}/node_modules/

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]
