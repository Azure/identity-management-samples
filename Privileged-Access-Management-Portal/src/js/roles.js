var modalTimer;

$(function() {
    bindModalEvents();
    getPamRolesExtendInfo(onRolesSuccessCallback);
    
    $("form#createRequestForm").submit(function(e){
        var roleId = $("#roleIdInput").attr("value"); 
        var justification = $("#justificationInput").val();
        var reqTTL = (($("#requestedTTLInput").val() == 0) ? $("#requestedTTLInput").attr('max') : $("#requestedTTLInput").val()) * 3600; 
		var reqTime = $("#requestedTimeInput").val();
        $('#modalCloseButton').attr("disabled", true);
        $('#modalSubmitButton').attr("disabled", true);
        $("#loadingAjax").show();
        $.when(createPamRequest(justification,roleId,reqTTL,reqTime))
        .done(function(pamRequest) {
            $(".errorDialog").hide();
            $("#loadingAjax").hide();
            $('#modalCloseButton').attr("disabled", false);
            $( "#modalSuccessAlert" ).fadeIn();
            getPamRolesExtendInfo(onRolesSuccessCallback);
            modalTimer = setTimeout(function() {
                $( "#requestModal" ).modal('hide');
            }, 3000);
        })
        .fail(function(failError) {
			$("#loadingAjax").hide();
			$('#modalCloseButton').attr("disabled", false);
			$("#modalErrorAlert").html("Error occurred. please contact your administrator.<br>Status code: " + failError.status + ".<br>Error: " + failError.statusText + ".<br>Message: " + failError.responseJSON["odata.error"]["message"]["value"] + ".");
			$("#modalErrorAlert").fadeIn();
        })

        if (e.stopPropagation) {
            e.stopPropagation();
        }
        e.preventDefault();
    });
    
    $("form#relinquishRequestForm").submit(function(e){
        var roleId = $("#relinquishRoleIdInput").attr("value"); 
        var justification = $("#relinquishInputJustification").val();
        var reqTTL = 0;
		var reqTime = $("#requestedTimeInput").val();
        $('#relinquishModalCloseButton').attr("disabled", true);
        $('#relinquishModalSubmitButton').attr("disabled", true);
        $("#loadingAjax").show();
        $.when(createPamRequest(justification,roleId,reqTTL,reqTime))
        .done(function(pamRequest) {
            $(".errorDialog").hide();
            $("#loadingAjax").hide();
            $('#relinquishModalCloseButton').attr("disabled", false);
            $( "#relinquishModalSuccessAlert" ).fadeIn();
            modalTimer = setTimeout(function() {
                $( "#relinquishModal" ).modal('hide');
                getPamRolesExtendInfo(onRolesSuccessCallback);
            }, 3000);
        })
        .fail(function(failError) {
            $("#loadingAjax").hide();
            $('#relinquishModalCloseButton').attr("disabled", false);
            $("#relinquishModalErrorAlert").html("Error occurred. please contact your administrator.<br>Status code: " + failError.status + ".<br>Error: " + failError.statusText + ".");
            $("#relinquishModalErrorAlert").fadeIn();
        })

        if (e.stopPropagation) {
            e.stopPropagation();
        }
        e.preventDefault();
    });    
} );

function renderTableRoles(rolesData){
    $('#RolesTable').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>' );
 
    $('#example').dataTable( {
        "data": rolesData,
        "columns": [
            { "title": "Role Name", "data" : "DisplayName"  },
            { "title": "Description", "data" : "Description"  },
            { "title": "Actions", "className": "StatusHeader", 'mRender': function (data, type, full) {return actionButtons(data, type, full); }},
            { "title": "Expiration Time", "mRender": function (data, type, full) { return getFormattedTime(full.ExpirationTime, true, false);}},
			{ "title": "Availability Window", "mRender": function (data, type, full) { return getFormattedTimeWindow(full.AvailableFrom, full.AvailableTo);}},
			{ "title": "Availability Window Enabled ", "data": "AvailabilityWindowEnabled"},
            { "title": "MFA Enabled ", "data": "MFAEnabled"},
            { "title": "Approval Enabled ", "data": "ApprovalEnabled"}
        ],
         "order": [[ 2, "asc" ], [ 3, "asc" ]]
    } ); 
}

function onRolesSuccessCallback(rolesData){
    $(".loadingTableIcon").hide();
    renderTableRoles(rolesData);
}

function onRolesFailCallback(pamRolesResult, pamActiveRequestsResult){
}

$(document).on("click", ".createRequestModal", function () {
    $(".errorDialog").hide();
    clearCreateModalFields();
    var roleDisplayname = $(this).data('displayname');
    var roleId= $(this).data('roleid');
    var mfaEnabled = $(this).data('mfaenabled');
    var roleTtlHours = Math.round($(this).data('ttl') / 36) / 100;
    $(".modal-dialog #roleDisplayname").text(roleDisplayname);
    $("#roleIdInput").attr("value", roleId);
    $("#ttlMaxHours").text(roleTtlHours);
    
    if ($(this).data('isroleactive') != '') {
        $("#requestModalLabel").text("Extend Activation");
    }
    else {
        $("#requestModalLabel").text("Request Activation");
    }
    
    if (roleTtlHours <= 1){
        $("#HourLabel").text(" hour ");
        $("#requestedTTLInput").attr("placeholder", "[Optional, Default " + roleTtlHours + " hour] Type here the expiration timeout in hours.")
     }
     else{
         $("#HourLabel").text(" hours ");     
         $("#requestedTTLInput").attr("placeholder", "[Optional, Default " + roleTtlHours + " hours] Type here the expiration timeout in hours.")
     }
	
     if (mfaEnabled)
     {
	    $('#MFAEnabledDescription').show();
     }
     $("#requestedTTLInput").attr("max", roleTtlHours);
});

$(document).on("click", ".relinquishRequestModal", function () {
    clearRelinquishModalFields();
    var relinquishRoleDisplayname = $(this).data('displayname');
    var relinquishRoleId= $(this).data('roleid');
    $(".modal-dialog #relinquishRoleDisplayname").text(relinquishRoleDisplayname);
    $("#relinquishRoleIdInput").attr("value", relinquishRoleId);
    $("#relinquishModalLabel").text("Deactivate");
});

function actionButtons(data, type, full) {
    return (elevateButton(data, type, full) + relinquishButton(data, type, full));
}

function elevateButton(data, type, full) {
    var isRoleActive =  full.ExpirationTime.trim();
	return "<button type=\"button\" class=\"btn " + (isRoleActive ? ("btn-info") : ("btn-success")) + " createRequestModal statusButton \" data-toggle=\"modal\" data-target=\"#requestModal\" data-roleid=\"" + full.RoleId + "\" data-displayname=\"" + full.DisplayName + "\" data-mfaenabled=\"" + full.MFAEnabled + "\" data-isroleactive=\"" + isRoleActive + "\" data-ttl=\"" + full.TTL + "\">" + (isRoleActive ? ("Extend Activation") : ("Activate")) + "</button>";
};

function relinquishButton(data, type, full) {
    var isRoleActive =  full.ExpirationTime.trim();
    retValue = "";
    
    if (isRoleActive)
    {
        retValue =  "<button type=\"button\" class=\"btn " + "btn-warning" + " relinquishRequestModal statusButton \" data-toggle=\"modal\" data-target=\"#relinquishModal\" data-roleid=\"" + full.RoleId +"\" data-displayname=\"" + full.DisplayName +"\" + data-isroleactive=\"" + isRoleActive +"\" data-ttl=\"" + full.TTL +"\">" + "Deactivate" +"</button>";
    }
    return retValue;
};

function clearCreateModalFields(){
    $('#MFAEnabledDescription').hide();
    $('#displayInput').val('');
    $('#justificationInput').val('');
    $('#requestedTTLInput').val('');
	$('#requestedTimeInput').val('');
    $('#roleIdInput').attr("value","");
    $(".modalAlert").hide();
    $('#modalCloseButton').attr("disabled", false);
    $('#modalSubmitButton').attr("disabled", false);
}

function clearRelinquishModalFields(){
    $('#relinquishInputJustification').val('');
    $('#relinquishRoleIdInput').attr("value","");
    $(".modalAlert").hide();
    $('#relinquishModalCloseButton').attr("disabled", false);
    $('#relinquishModalSubmitButton').attr("disabled", false);
}

function bindModalEvents() {
    $('#requestModal').on('show.bs.modal', function (e) {
        clearTimeout(modalTimer);
    });
	$('#datetimepickerholder').datetimepicker({ sideBySide: true, format: "YYYY/MM/DD HH:mm"});
}