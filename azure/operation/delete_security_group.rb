# begin
require 'json'
@log.trace("Started executing 'fb-cloud:azure:operation:delete_security_group.rb' flintbit...")
begin
    # Flintbit Input Parameters
   # Mandatory
   @connector_name = @input.get('connector_name') #name of Azure connector
   @action = 'delete-security-group' #Specifies the name of the operation:delete-security-group
   @resource_group_name = @input.get('resource-group-name') #name of the resource group in which your security group is present
   @security_group_name = @input.get('security-group-name')     #name security_group_name which you want to delete
   #optional
   @key = @input.get('key') #Azure account key
   @tenant_id = @input.get('tenant-id') #Azure account tenant-id
   @subscription_id = @input.get('subscription-id') #Azure account subscription-id
   @client_id = @input.get('client-id') #Azure client-id


   #Checking that the connector name is provided or not,if not then raise the exception with error message
   if @connector_name.nil? || @connector_name.empty?
       raise 'Please provide "MS Azure connector name (connector_name)" to delete security group'
   end

   #Checking that the connector name is provided or not,if not then raise the exception with error message
   if @resource_group_name.nil? ||  @resource_group_name.empty?
       raise 'Please provide "MS Azure group-name (@resource_group_name)" to delete security group'
   end


   #Checking that the connector name is provided or not,if not then raise the exception with error message
   if @security_group_name.nil? || @security_group_name.empty?
       raise 'Please provide "MS Azure security-group-name (@security_group_name)" to delete security group'
   end


   connector_call = @call.connector(@connector_name)
                          .set('action', @action)
                          .set('resource-group-name',@resource_group_name)
                          .set('security-group-name',@security_group_name)
                          .timeout(2800000)

    if @request_timeout.nil? || @request_timeout.is_a?(String)
        @log.trace("Calling #{@connector_name} with default timeout...")
        response = connector_call.sync
    else
        @log.trace("Calling #{@connector_name} with given timeout #{@request_timeout}...")
        response = connector_call.timeout(@request_timeout).sync
    end

    # MS-azure Connector Response Meta Parameters
    response_exitcode = response.exitcode	# Exit status code
    response_message = response.message	# Execution status messages

    if response_exitcode == 0
        @log.info("SUCCESS in executing #{@connector_name} where, exitcode : #{response_exitcode} | message : #{response_message}")
        @output.set('exit-code', 0).set('message', response_message)
    else
        @log.error("ERROR in executing #{@connector_name} where, exitcode : #{response_exitcode} | message : #{response_message}")
        @output.set('exit-code', 1).set('message', response_message)
    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', 1).set('message', e.message)
end
@log.trace("Finished executing 'fb-cloud:azure:operation:delete_security_group.rb' flintbit")
# end
