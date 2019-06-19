/*
 * Creation Date: 31/05/2019
 * Summary: To describe application load balancer
 * Description: To describe application load balancer AWs using aws-ec2 connector
 */

log.trace("Started executing 'fb-cloud:aws-ec2:operation:workflow:describe_application_load_balancer.js'");

input_scope = JSON.parse(input);   //For checking if the input contains the necessary keys

//Connector Name  - mandatory
connector_name = "amazon-ec2";
connector_call = call.connector(connector_name);
log.info("Connector Name: "+connector_name);

//Action - mandatory
action = "describe-application-load-balancer";
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

    //Load Balancer Name
    if(input_scope.hasOwnProperty("load_balancer_name")){
        load_balancer_name = input.get("load_balancer_name");
        if(load_balancer_name!=null || load_balancer_name!=""){
            connector_call.set("name",load_balancer_name); 
            log.info("Load Balancer Name: "+load_balancer_name);
        }
        else{
            log.error("Load Balancer Name is null or empty string.")
        }
    }
    else{  //load_balancer_name key not present in input JSON 
        log.error("Input does not contain the key 'load_balancer_name'")
    }

    //Region -not mandatory
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

    //Response Parameters
    load_balancers_details = response.get("load-balancers-details"); //array containing a JSON Object
    load_balancers_details = load_balancers_details[0];

    if(response_exitcode==0){
        user_message = "Application Load Balancer Details are:<br>"
                        +"Name: "+load_balancers_details.get("name")+"<br>"
                        +"Load Balancer ARN: "+load_balancers_details.get("load-balancer-arn")+"<br>"
                        +"VPC ID: "+load_balancers_details.get("vpc-id")+"<br>";
        log.info(user_message);
        output.set("exit-code",0)
              .set("user_message",user_message)
              .set("message",response_message)
              .set("result",load_balancers_details);
        log.trace("Finished executing 'fb-cloud:aws-ec2:operation:workflow:describe_application_load_balancer.js' successfully.");
    }
    else{
        log.error("Failure in execution, message:"+response_message+" | exitcode:"+response_exitcode);
        output.set("error",response_message).set("exit-code",-1);
        log.trace("finished executing 'fb-cloud:aws-ec2:operation:workflow:describe_application_load_balancer.js' with errors")
    }
}
else{   //cloud_connection key not present in input JSON
    log.error("Cloud Connection not given. Can not authenticate without Secret-Key and Access-Key");
}