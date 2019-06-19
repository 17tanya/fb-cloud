/**
 * Creation Date: 7/06/2019
 * Summary: To Describe Image on AWS
 * Description: To Describe Image on AWS EC2 using aws-ec2 connector
 */

log.trace("Started executing the flintbit 'fb-cloud:aws-ec2:operation:workflow:describe_image.js'");


input_scope = JSON.parse(input);   //For checking if the input contains the necessary keys

//Connector Name  - mandatory
connector_name = "amazon-ec2";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Action - mandatory
action = "describe-image";
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

    //Image ID
    if(input_scope.hasOwnProperty("image_id")){
        image_id = input.get("image_id");
        if(image_id!=null || image_id!=""){
            connector_call.set("image-id",image_id); 
            log.info("Image ID: "+image_id);
        }
        else{
            log.error("Image ID is null or empty string.")
        }
    }
    else{  //image_id key not present in input JSON 
        log.error("Input does not contain the key 'image_id'")
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
    image_info = response.get("image-info");

    if(response_exitcode==0){
        user_message = "The Image Description is:<br>";
        user_message = user_message + "Architecture: "+image_info.get("architecture")+"<br>"+
                        " Description: "+image_info.get("description")+"<br>"+
                        " Image Name: "+image_info.get("image-name")+"<br>"+
                        " Image Location: "+image_info.get("image-location")+"<br>"+
                        " Kernel ID: "+image_info.get("kernel-id")+"<br>"+
                        " Hypervisor: "+image_info.get("hypervisor");
        log.info(user_message);
        output.set("user_message",user_message)
            .set("exit-code",response_exitcode)
            .set("message",response_message)
            .set("result",image_info);
        log.trace("Finished executing the flintbit 'fb-cloud:aws-ec2:operation:workflow:describe_image.js' successfully");
    }
    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'fb-cloud:aws-ec2:operation:workflow:describe_image.js' with errors")
    }
}
else{   //cloud_connection key not present in input JSON
    log.error("Cloud Connection not given. Can not authenticate without Secret-Key and Access-Key");
}