/**
 * Creation Date: 3/06/2019
 * Summary: To delete security group by Group-ID on AWS
 * Description: To delete security group by Group-ID on AWS using aws-ec2 connector
 */

log.trace("Started executing the flintbit 'fb-cloud:aws-ec2:operation:workflow:delete_security_group_by_id.js'");

input_scope = JSON.parse(input);   //For checking if the input contains the necessary keys

//Connector Name  - mandatory
connector_name = "amazon-ec2";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Action - mandatory
action = "delete-security-group";
log.info("Action: "+action);

//Timeout
request_timeout = 60000;
log.info("Timeout: "+request_timeout);

connector_call.set("action",action).set("timeout",request_timeout);

if(input_scope.hasOwnProperty("cloud_connection")){

    //Access Key - mandatory
    access_key = input_scope.cloud_connection.encryptedCredentials["access_key"];
    if(access_key!=null || access_key!=""){
       connector_call.set("access-key",access_key); 
       log.info("Access Key is given");
    }
    else{
        log.error("Access-Key is null or empty string.");
    }

    //Security Key - mandatory
    secret_key = input_scope.cloud_connection.encryptedCredentials["secret_key"];
    if(secret_key!=null || secret_key!=""){
       connector_call.set("security-key",secret_key); 
       log.info("Security Key is given");
    }
    else{
        log.error("Security-Key is null or empty string.");
    }

    //Group ID - mandatory
    if(input_scope.hasOwnProperty("group_id")){
        group_id = input.get("group_id");
        if(group_id!=null || group_id!=""){
            connector_call.set("group-id",group_id); 
            log.info("Group ID: "+group_id);
        }
        else{
            log.error("Group ID is null or empty string.")
        }
    }
    else{  //group_id key not present in input JSON 
        log.error("Input does not contain the key 'group_id'")
    }

    //Region - not mandatory
    if(input_scope.hasOwnProperty("region")){
        region = input.get("region");
        if(region!=null || region!=""){
            connector_call.set("region",region); 
            log.info("Region: "+region);
        }
        else{
            log.info("Region is null or empty string.");
        }
    }
    else{  //region key not present in input JSON 
        log.info("Input does not contain the key 'region'");
    }

    //Connector call
    response = connector_call.sync();

    //Response meta-parameters
    response_exitcode = response.exitcode();
    response_message = response.message();

    if(response_exitcode==0){
        log.info("Successfully deleted the Security Group");
        user_message = "Successfully deleted the Security Group";
        output.set("message",response_message)
            .set("exit-code",response_exitcode)
            .set("user_message",user_message);
        log.trace("Finished executing 'fb-cloud:aws-ec2:operation:workflow:delete_security_group_by_id.js' successfully");
    }
    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'fb-cloud:aws-ec2:operation:workflow:delete_security_group_by_id.js' with errors")
    }
}
else{   //cloud_connection key not present in input JSON
    log.error("Cloud Connection not given. Can not authenticate without Secret-Key and Access-Key");
}