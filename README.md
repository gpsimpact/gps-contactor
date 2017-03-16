# INITIALIZE WITH JQUERY
```
<script type="text/javascript">
$(document).ready(function(){
var contact = new GPSForm({
  id: "dc3027d0-b6da-4ce8-b550-0ba68a1c1a2e", // Set in dynamo with uuid https://www.uuidgenerator.net/
  key: "yay", // <-- set in dynamo with title source_key
  api_endpoint: "https://d0dx95gfx5.execute-api.us-east-1.amazonaws.com/dev", // Keep endpoint as is for now. 
  // buttonTxt: "Contact Us", OPTIONAL defaults to "Contact Us"
  // thanksMessage: OPTIONAL defaults to "Your message has been sent."
  //nextPg: OPTIONAL url for landing page after form submission.  This overrides thank you msg.

})
contact.init();
});

</script>

<div class='formWrap'> </div>
```

## Have fun!