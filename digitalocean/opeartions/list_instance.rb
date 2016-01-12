#begin
@log.trace("Started executing 'flint-cloud:digitalocean:operation:list_instance.rb' flintbit...")
#Flintbit Input Parameters
#Mandatory 
@connector_name= @input.get("connector_name")               #Name of the DigitalOcean Connector
@action = @input.get("action")                              #Action (stop)
#optional
@token = @input.get("token")                         	    #token(credential of account) 
@request_timeout= @input.get("timeout")                     #timeout

@log.info("Flintbit input parameters are, connector name :: #{@connector_name} |
	                                       action ::        #{@action}|
                                           token ::      #{@token}|
                                           timeout ::       #{@request_timeout}")

connector_call = @call.connector(@connector_name)
                  .set("action",@action)
                  .set("token",@token)
                  
                  

if @request_timeout.nil? || @request_timeout.is_a?(String)
   @log.trace("Calling #{@connector_name} with default timeout...")
	 response = connector_call.sync
else
   @log.trace("Calling #{@connector_name} with given timeout #{request_timeout.to_s}...")
	 response = connector_call.timeout(@request_timeout).sync
end

#DigitalOcean Connector Response Meta Parameters
response_exitcode=response.exitcode           #Exit status code
response_message=response.message             #Execution status message

#DigitalOcean Connector Response Parameters
list = response.get("dropletlist")            #list of machine

if response.exitcode == 0  
	@log.info("SUCCESS in executing #{@connector_name} where, exitcode :: #{response_exitcode} | 
    	                                                   message ::  #{response_message}")
	@log.info("#{@connector_name} list of machine :: #{list.to_s}")
	@output.set("list",list.to_s)
 
else
	@log.error("ERROR in executing #{@connector_name} where, exitcode :: #{response_exitcode} | 
		                                                  message ::  #{response_message}")
    @output.exit(1,response_message)
end
@log.trace("Finished executing 'flint-cloud:digitalocean:operation:list_instance.rb' flintbit...")
#end