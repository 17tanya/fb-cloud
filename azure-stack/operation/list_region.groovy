// # begin
log.trace("Started executing 'fb-cloud:azure-stack:operation:list_region.groovy' flintbit...")
try{
// # Flintbit Input Parameters
    // # Mandatory
    connector_name = input.get('connector_name')
    action = 'as-list-region'

    // # Optional
    request_timeout = 360000
    key = input.get('key')
    tenant_id = input.get('tenant-id')
    subscription_id = input.get('subscription-id')
    client_id = input.get('client-id')
    arm_endpoint = input.get('arm-endpoint')

    log.info("Flintbit input parameters are, action : ${action} | tenant id : ${tenant_id} | subscription id : ${subscription_id}")

    connector_call = call.connector(connector_name)
                          .set('action', action)
                          .set('tenant-id', tenant_id)
                          .set('subscription-id', subscription_id)
                          .set('key', key)
                          .set('client-id', client_id)
                          .set('arm-endpoint',arm_endpoint)

    if (connector_name == null || connector_name == ""){
        raise 'Please provide "MS Azure connector name (connector_name)" to get region list'
    }

    if (request_timeout == null){
        log.trace("Calling ${connector_name} with default timeout...")
        response = connector_call.sync()
    }else{
        log.trace("Calling ${connector_name} with given timeout ${request_timeout}...")
        response = connector_call.timeout(request_timeout).sync()
    }

    // $ Amazon EC2 Connector Response Meta Parameters
    response_exitcode = response.exitcode()	//# Exit status code
    response_message = response.message()	//# Execution status messages

    if (response_exitcode == 0){
        log.info("SUCCESS in executing ${connector_name} where, exitcode : ${response_exitcode} | message : ${response_message}")
        output.set('exit-code', 0).set('message', response_message).set('regions',response.get('regions'))
  
    }else{
        log.error("ERROR in executing ${connector_name} where, exitcode : ${response_exitcode} | message : ${response_message}")
        output.set('exit-code', 1).set('message', response_message)
    }
        
} catch(Exception e){
    log.error(e.message)
    output.set('exit-code', 1).set('message', e.message)
}

log.trace("Finished executing 'fb-cloud:azure-stack:operation:list_region.groovy' flintbit")
// $ end