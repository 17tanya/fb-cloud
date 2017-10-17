# begin
@log.trace("Started execution 'fb-cloud:vmware-vcd:operation:reboot_virtual_machine.rb' flintbit...") # execution Started
begin

    # Flintbit Input Parameters
    # Mandatory
    @connector_name = @input.get('connector_name') # vmware-vcd connector name
    @action ='reboot-vm' # name of action:reboot-vm
    @hostname = @input.get('host_name') # hostname of the vCloud server
    @organization_name = @input.get('organization_name') # name of the organization
    @organization_admin_username = @input.get('organization_admin_username') # organization admin username
    @organization_admin_password = @input.get('organization_admin_password') # organization admin password
    @protocol = @input.get('protocol') #protocol for the server i.e http/https
    @vm_name = @input.get('vm_name') #vm-name to reboot

    # Optional
    request_timeout = @input.get('timeout')	# Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)

     # checking connector name is nil or empty
    if @connector_name.nil? || @connector_name.empty?
        raise 'Please provide "VMWare connector name (connector_name)"  to reboot of virtual machine'
    end
  
    # checking host name is nil or empty
    if @hostname.nil? || @hostname.empty?
        raise 'Please provide "vCloud director server hostname(host-name)" to reboot of virtual machine'
    end
	
     # checking organization name is nil or empty
    if @organization_name.nil? || @organization_name.empty?
        raise 'Please provide "organization name (organization-name)" to reboot of virtual machine'
    end
  
    # checking organization admin username is nil or empty
    if @organization_admin_username.nil? || @organization_admin_username.empty?
        raise 'Please provide "Organzation admin username (Organzation-admin-username)"  to reboot of virtual machine'
    end
   
    # checking organization admin password is nil or empty
    if @organization_admin_password.nil? || @organization_admin_password.empty?
        raise 'Please provide "Organzation admin password (Organzation-admin-password)"  to reboot of virtual machine'
    end

    # checking protocol is nil or empty
    if @protocol.nil? || @protocol.empty?
        raise 'Please provide "protocol (protocol)"  to reboot of virtual machine'
    end

    # checking vm-name is nil or empty
    if @vm_name.nil? || @vm_name.empty?
        raise 'Please provide "virtual machine name (vm-name)"to reboot of virtual machine'
    end

    connector_call = @call.connector(@connector_name)
                          .set('action', @action)
                          .set('host-name', @hostname)
                          .set('organization-name', @organization_name)
                          .set('organization-admin-username', @organization_admin_username)
			  .set('organization-admin-password', @organization_admin_password)
			  .set('protocol',@protocol)
			  .set('vm-name',@vm_name)

    if request_timeout.nil? || request_timeout.is_a?(String)
        @log.trace("Calling #{@connector_name} with default timeout...")
        # calling vmware-vcd connector
        response = connector_call.sync
    else
        @log.trace("Calling #{@connector_name} with given timeout #{request_timeout}...")
        # calling vmware-vcd connector
        response = connector_call.timeout(request_timeout).sync
    end

    # vmware-vcd Connector Response Meta Parameters
    response_exitcode = response.exitcode # Exit status code
    response_message =  response.message # Execution status message

    if response_exitcode == 0
        @log.info("Success in executing #{@connector_name} Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('exit-code', 0).set('message',response_message)

    else
        @log.error("ERROR in executing #{@connector_name} where, exitcode :: #{response_exitcode} | message :: #{response_message}")
        @output.set('message', response_message.to_s).set('exit-code', -1)

    end
rescue Exception => e
    @log.error(e.message)
    @output.set('exit-code', -1).set('message', e.message)
end

@log.trace("Finished execution 'fb-cloud:vmware-vcd:operation:reboot_virtual_machine.rb' flintbit...")
# end
