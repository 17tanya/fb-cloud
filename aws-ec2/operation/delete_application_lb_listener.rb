# begin
@log.trace("Started executing 'fb-cloud:aws-ec2:operation:delete_application_lb_listener.rb' flintbit...")
begin
    # Flintbit Input Parameters
    # Mandatory
    connector_name = @input.get('connector_name') # Name of the Amazon EC2 Connector
    loadbalancer_type = @input.get('loadbalancer-type')
    action = "delete-#{loadbalancer_type}-load-balancer-listener" # Specifies the name of the operation:delete-subnet
    listeners = @input.get('listeners')
    # Optional
    region = @input.get('region') # Amazon EC2 region (default region is "us-east-1")
    request_timeout = @input.get('timeout')	# Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)
    @access_key = @input.get('access-key')	# access key of aws-ec2 account
    @secret_key = @input.get('security-key')	# secret key aws-ec2 account

    @log.info("Flintbit input parameters are, connector_name:#{connector_name}  | action : #{action} | name: | listener ports: #{listeners}")
    connector_call = @call.connector(connector_name)
                          .set('action', action)
                          .set('arn-list',listeners).sync
    
    response_exitcode = connector_call.exitcode   # Exit status code
    response_message = connector_call.message # Execution status messages
        @log.info("exitcode : #{response_exitcode} | message : #{response_message}")

# if exception occured during execution then it will catch by rescue and it will show exception message to user
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished executing 'fb-cloud:aws-ec2:operation:delete_application_lb_listener.rb' flintbit")
# end