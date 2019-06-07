/*
*Creation Date: 7/06/2019
*Summary: To List Virtual Private Clouds on AWS EC2
*Description: To List Virtual Private Clouds on AWS EC2 using aws-ec2 Connector
 */

log.trace("Started executing the flintbit 'fb-cloud:aws-ec2:operation:workflow:list_virtual_private_clouds.js'");


input_scope = JSON.parse(input);   //For checking if the input contains the necessary keys

//Connector Name  - mandatory
connector_name = "amazon-ec2";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Action - mandatory
action = "list-vpcs";
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

    //Connector Call
    response = connector_call.sync();

    //Response Metaparameters
    response_exitcode = response.exitcode();
    response_message = response.message();

    //Response Parameters
    vpcs_set = response.get('vpc-list');

    if(response_exitcode==0){
        if(vpcs_set.length>0){
            user_message = "The VPC List is:<br>";
            for(i=0;i<vpcs_set.length;i++){
                user_message = user_message + "VPC"+(i+1)+"<br>"+
                                "VPC ID: "+vpcs_set[i].get("vpc-id")+"<br>"+
                                "CIDR Block: "+vpcs_set[i].get("cidr-block")+"<br>"+
                                "DHCP Option ID: "+vpcs_set[i].get("dhcp-option-id")+"<br>"+
                                "Instance Tenancy: "+vpcs_set[i].get("instance-tenancy")+"<br>";
            }
            output.set("user_message",user_message);
            log.info(user_message);
        }
        else{
            user_message = "No Subnets in the given Region";
            output.set("user_message",user_message);
            log.info(user_message);
        }
        output.set("exit-code",response_exitcode)
            .set("message",response_message)
            .set("result",vpcs_set);
        log.trace("Finished executing the flintbit 'fb-cloud:aws-ec2:operation:workflow:list_virtual_private_clouds.js' successfully");
    }

    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'fb-cloud:aws-ec2:operation:workflow:list_virtual_private_clouds.js' with errors")
    }

}
else{   //cloud_connection key not present in input JSON
    log.error("Cloud Connection not given. Can not authenticate without Secret-Key and Access-Key");
}