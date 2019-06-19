/*
*Creation Date: 7/06/2019
*Summary: To List Virtual Private Cloud Subnets on AWS EC2
*Description: To List Virtual Private Cloud Subnets on AWS EC2 using aws-ec2 Connector
 */

log.trace("Started executing the flintbit 'fb-cloud:aws-ec2:operation:workflow:list_virtual_private_cloud_subnets.js'");


input_scope = JSON.parse(input);   //For checking if the input contains the necessary keys

//Connector Name  - mandatory
connector_name = "amazon-ec2";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Action - mandatory
action = "list-vpc-subnet";
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

    //VPC ID - mandatory
    if(input_scope.hasOwnProperty("vpc_id")){
        vpc_id = input.get("vpc_id");
        if(vpc_id!=null || vpc_id!=""){
            connector_call.set("vpc-id",vpc_id); 
            log.info("VPC ID: "+vpc_id);
        }
        else{
            log.error("vpc_id is null or empty string.");
        }
    }
    else{  //vpc_id key not present in input JSON 
        log.error("Input does not contain the key 'vpc_id'");
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
    subnet_list = response.get('subnet-list');

    if(response_exitcode==0){
        if(subnet_list.length>0){
            user_message = "The Subnet Details are:<br>";
            for(i=0;i<subnet_list.length;i++){
                user_message = user_message + "Subnet"+(i+1)+"<br>"+
                                "Availability Zone: "+subnet_list[i].get("availability-zone")+"<br>"+
                                "CIDR Block: "+subnet_list[i].get("cidr-block")+"<br>"+
                                "VPC ID: "+subnet_list[i].get("vpc-id")+"<br>"+
                                "Subnet ID: "+subnet_list[i].get("subnet-id")+"<br>";
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
            .set("result",subnet_list);
        log.trace("Finished executing the flintbit 'fb-cloud:aws-ec2:operation:workflow:list_virtual_private_cloud_subnets.js' successfully");
    }
    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'fb-cloud:aws-ec2:operation:workflow:list_virtual_private_cloud_subnets.js' with errors")
    }
}
else{   //cloud_connection key not present in input JSON
    log.error("Cloud Connection not given. Can not authenticate without Secret-Key and Access-Key");
}