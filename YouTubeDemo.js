function submitLeaveFormEvent() {
    $("#LeaveForm").submit(function(event) {
        event.preventDefault();
        var dateFrom = document.getElementById("dateFrom").value;
        var dateTo = document.getElementById("dateTo").value;
        var reason = $("textarea[name='reason']").val(); 
        var selectedRadioButton = document.querySelector('input[name="medical"]:checked');
        var medical = selectedRadioButton.value === 'yes' ? true : false;
        var record = {};
        record.cr1e8_reason = reason;
        record.cr1e8_datefrom = dateFrom;
        record.cr1e8_dateto = dateTo;
        record.cr1e8_medical = medical;

        webapi.safeAjax({
          type: "POST",
          contentType: "application/json",
          url: "/_api/cr1e8_cds_leaveforms",
          data: JSON.stringify(record),
          success: function (data, textStatus, xhr) {
            alert("Leave Form Submitted Successfully!");
          },
          error: function (error) {
            alert("Leave Form failed to submit");
            console.log(error);
          }

    })
 })
}


function startUpProcedure() {
    submitLeaveFormEvent();
}


// *** Document Ready - Load Power Pages WEBAPI support
$( document ).ready(function() {

    (function(webapi, $){
      function safeAjax(ajaxOptions) {
          var deferredAjax = $.Deferred();
          shell.getTokenDeferred().done(function (token) {
            // add headers for AJAX
            if (!ajaxOptions.headers) {
              $.extend(ajaxOptions, {
                headers: {
                  "__RequestVerificationToken": token
                }
              });
            } else {
              ajaxOptions.headers["__RequestVerificationToken"] = token;
            }
            $.ajax(ajaxOptions)
              .done(function(data, textStatus, jqXHR) {
                validateLoginSession(data, textStatus, jqXHR, deferredAjax.resolve);
              }).fail(deferredAjax.reject); //AJAX
          }).fail(function () {
            deferredAjax.rejectWith(this, arguments); // on token failure pass the token AJAX and args
          });
          return deferredAjax.promise();
        }
        webapi.safeAjax = safeAjax;
      })(window.webapi = window.webapi || {}, jQuery); 
      
    startUpProcedure();
});
  // *******************************************************
