var formDescription = [
  {
    'name': 'firstname',
    'type': 'text',
    'label': 'First Name*',
    'placeholder': 'First Name*',
    'additional_attrs': [
      {'k': 'data-validation',  'v': 'required'},
      {'k': 'data-validation-error-msg', 'v':"First Name is required"}
    ]
  },
  {
    'name': 'from_email',
    'type': 'email',
    'label': 'Email*',
    'placeholder': 'Email*',
    'additional_attrs': [
      {'k': 'data-validation',  'v': 'email'},
      {'k': 'data-validation-error-msg', 'v':"Email is required"}
    ]
  },
  {
    'name': 'subject',
    'type': 'text',
    'label': 'Subject*',
    'placeholder': 'Subject',
    'additional_attrs': [
      {'k': 'data-validation',  'v': 'required'},
      {'k': 'data-validation-error-msg', 'v':"Subject is required"}
    ]
  },

  {
    'name': 'message',
    'type': 'textarea',
    'label': 'Message*',
    'placeholder': '',
    'additional_attrs': [
      {'k': 'data-validation',  'v': 'required'},
      {'k': 'data-validation-error-msg', 'v':"Message is required"}
    ]
  }
]



var GPSForm = function(config) {
    this.submitting = false;
    this.form = document.createElement('form')
    this.form.setAttribute('method', 'POST')
    this.form.setAttribute('id', 'gps-contact')
    this.thankswrap = document.createElement('div')
    this.thankswrap.setAttribute('id', 'thanks')
    this.thankswrap.setAttribute('class', 'well text-center')
    this.spinner = document.createElement('i')
    this.spinner.setAttribute('class', 'fa fa-spinner fa-pulse text-center')
    this.spinner.setAttribute('id', 'spinner')
    this.spinner.setAttribute('style', 'display: none; margin-left: auto; margin-right: auto; margin-top: 10px;')
    this.settings = {
      formDescription: formDescription,
      api_endpoint: config.api_endpoint,
      buttonTxt: config.buttonTxt || 'Contact Us',
      nextPg: config.nextPg || null,
      thanksMessage: config.thanksMessage || "Your message has been sent.",
      key: config.key,
      id: config.id,

    }
    this.init = function() {
      var gpsForm = this;
      gpsForm.thankswrap.innerHTML = "<h2> " + gpsForm.settings.thanksMessage + " </h2>"
      for (var i = 0; i < gpsForm.settings.formDescription.length; i++){
        var inp = gpsForm.settings.formDescription[i];
        var inpWrap = document.createElement('div')
            inpWrap.setAttribute('class','form-group')

        var inpLabel = document.createElement('label')
            inpLabel.setAttribute('for', inp.name)

        if(inp.type === 'textarea') {
          var inpMain = document.createElement('textarea')

        } else {
          var inpMain = document.createElement('input');

        }
        inpLabel.innerHTML = inp.label;
        inpMain.setAttribute('class','form-control');
        inpMain.setAttribute('name',inp.name);
        inpMain.setAttribute('placeholder', inp.placeholder);
        if (inp.additional_attrs){
          for (var j = 0; j<inp.additional_attrs.length; j++) {
            inpMain.setAttribute(inp.additional_attrs[j].k, inp.additional_attrs[j].v)
          }
        }

        inpWrap.appendChild(inpLabel)
        inpWrap.appendChild(inpMain)

        gpsForm.form.appendChild(inpWrap)

      }// for

      var inpSub = document.createElement('input')
          inpSub.setAttribute('id', 'signup-submit');
          inpSub.setAttribute('type', 'submit');
          inpSub.setAttribute('value', gpsForm.settings.buttonTxt);
          inpSub.setAttribute('class', 'btn btn-primary')

      gpsForm.form.appendChild(inpSub);
      document.querySelector('.formWrap').appendChild(gpsForm.form)
      gpsForm.form.appendChild(gpsForm.spinner)

    var valid = false;
    $.validate({
      form : "#gps-contact",
      onSuccess: function($form){
        valid = true;
      }
    });

    $(gpsForm.form).submit(function(e){
      e.preventDefault();
      if(valid){
        gpsForm.submitForm();

      }
    })
    }
    this.submitForm = function(){
      var getFormElements = function(form_id) {
        var elements = document.getElementById(form_id).elements;
        data = {}

        for (i=0; i<elements.length; i++) {
          if(elements[i].value && elements[i].value !== "") {
            data[elements[i].name] = elements[i].value
          }
        }
        return data

      }
      var gpsForm = this;
      var form = $('#gps-contact');
      if(gpsForm.submitting) return;
        gpsForm.submitting = true;
        $('#spinner').css({'display': 'block'})
        var data = getFormElements('gps-contact');
        data.source_key = gpsForm.settings.key
        $.ajax({
         type: "POST",
         url: gpsForm.settings.api_endpoint + '/f/' + gpsForm.settings.id,
         contentType: 'application/json',
         data: JSON.stringify(data),

         success: function(data){
           if(data.errorMessage) {
             gpsForm.submitting = false;
             return;
           }
           $("#gps-contact").hide();
           $("#spinner").hide();
           gpsForm.submitting = false;

           if(gpsForm.settings.nextPg ){
             window.location.assign(gpsForm.settings.nextPg);
           } else {
             document.querySelector('.formWrap').appendChild(gpsForm.thankswrap)
           }
         },
         error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
             gpsForm.submitting = false;
             $("#spinner").hide();
         }
   });


    }

}
