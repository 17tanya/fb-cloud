@log.trace("Started executing 'fb-cloud:aws-s3:operation:delete_bucket.rb' flintbit...")
begin
    # Flintbit Input Parameters
    # Mandatory Input Parameters
    @connector_name = @input.get("connector_name") # Name of the Amazon s3 connector
    action = 'delete-bucket'                    #@input.get("action")
    @bucket_name = @input.get("bucket-name")  #name of the bucket which you want to delete

   
    # Optional input parameters
    request_timeout = @input.get('timeout')	# Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)
    access_key = @input.get("access-key") #aws account access key
    security_key = @input.get("security-key") #aws account security key

    @log.info("Connector Name :#{@connector_name} 
               | Action :#{action}
	       | Bucket Name: #{@bucket_name} ")

    #initializing the connector with the parameter                         
    connector_call = @call.connector(@connector_name)
                        .set('action', action)
                        .set('bucket-name', @bucket_name)
			.set("access-key",access_key)
                        .set("security-key",security_key)

    # checking that connector name is provided or not
    if @connector_name.nil? || @connector_name.empty?
    raise 'Please provide "aws-s3 connector name (connector_name)" to delete bucket on aws-s3'
    end
	
    # checking taht bucket name is provided or not
    if @bucket_name.nil? || @bucket_name.empty?
    raise 'Please provide "name of bucket (bucket-name)" to delete bucket on aws-s3'
    end

    # checking that request timeout is provided or not
    if request_timeout.nil? || request_timeout.is_a?(String)
    @log.trace("Calling #{@connector_name} with default timeout...")
    # calling aws-s3 connector
    response = connector_call.sync
    else
    @log.trace("Calling #{@connector_name} with given timeout #{request_timeout}...")
    # calling aws-s3 connector
    response = connector_call.timeout(request_timeout).sync
    end

    response_exitcode = response.exitcode              		# Exit status code
    response_message = response.message                		# Execution status messages

    @log.info("response:: #{response}")

    if response_exitcode == 0
        @log.info("SUCCESS in executing #{@connector_name} where, exitcode : #{response_exitcode} | message : #{response_message}")
        @output.set('message', response_message).set('exit-code', 0)
    else
        @log.error("ERROR in executing #{@connector_name} where, exitcode : #{response_exitcode} | message : #{response_message}")
        @output.set('message', response_message).set('exit-code', -1)
    end

rescue => e
    @log.error(e.message)
    @output.set('message', e.message).set('exit-code', -1)
    @log.info('output in exception')
end

@log.trace("Finished executing 'fb-cloud:aws-s3:operation:delete_bucket.rb' flintbit")
