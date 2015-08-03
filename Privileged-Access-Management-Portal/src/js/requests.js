var fromFilter;
var toFilter;

$(function() {
    var oneMonthDuration = moment.duration(1, 'months');
    var oneMonthBefore = moment().subtract(oneMonthDuration);
    fromFilter = oneMonthBefore;
    toFilter = moment();
    var oneDayDuration = moment.duration(1, 'days');
    toFilter.add(oneDayDuration);
	
	$('#dateFrom').datetimepicker({
		format: "DD/MM/YYYY",
		defaultDate: fromFilter
	});
	$('#dateTo').datetimepicker({
		format: "DD/MM/YYYY",
		defaultDate: toFilter
	});
	$("#dateFrom").on("dp.change", function (e) {
		$('#dateTo').data("DateTimePicker").minDate(e.date);
		fromFilter = moment(e.date);
		refreshTableRequests();
	});
	$("#dateTo").on("dp.change", function (e) {
		$('#dateFrom').data("DateTimePicker").maxDate(e.date);
		var localToFilter = moment(e.date);
		var oneDayDuration = moment.duration(1, 'days');
		localToFilter.add(oneDayDuration);
		toFilter = localToFilter;
		refreshTableRequests();
	});
    
    refreshTableRequests();
} );

function refreshTableRequests(){
        getPamRequestsExtendInfo(onRequestsDoneCallback, onRequestsFailCallback, fromFilter, toFilter);
}

function renderTableRequests(requestsData){

    $('#RequestsTable').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>' );
 
    $('#example').dataTable( {
        "data": requestsData,
        "columns": [        
            { "title": "Role Name", "data" : "RoleDisplayName"  },
            { "title": "Creation Time ", "mRender": function (data, type, full) { return getFormattedTime(full.CreationTime, false, true); } },
            { "title": "Timeout(Hours)", "mRender": function (data, type, full) { var ttlHours = Math.round( full.RequestedTTL / 36) / 100; return (full.RequestedTTL == 0) ? "Deactivate" : ttlHours;} },
			{ "title": "Requested Time ", "mRender": function (data, type, full) { return getFormattedTime(full.RequestedTime, false, true); } },
            { "title": "Expiration Time ", "mRender": function (data, type, full) { return getFormattedTime(full.ExpirationTime, false, true); } },
            { "title": "Justification", "data": "Justification" },
			{ "title": "Status", "data" : "RequestStatus"  },
			{ "title": "Actions", "className": "StatusHeader", 'mRender': function (data, type, full) {return closeButton(data, type, full); }}
        ],
        "order": [[ 1, "desc" ]],
    } ); 
}

function onRequestsDoneCallback(requestsData){
    $(".loadingTableIcon").hide();
    $("#filterInputs").show();
    renderTableRequests(requestsData);
}

function onRequestsFailCallback(pamRolesResult, pamRequestsResult){
}

function closeButton(data, type, full) {
	var retValue = "";
	
	if (full.RequestStatus == "Active") {
		retValue = "<button type=\"button\" class=\"btn " + "btn-info" + " buttonCloseRequest statusButton \" data-toggle=\"modal\" data-target=\"#requestModal\" data-requestid=\"" + full.RequestId + "\">" + "Deactivate" + "</button>";
	}
	
	if (full.RequestStatus == "Scheduled" || full.RequestStatus == "PendingApproval" || full.RequestStatus == "PendingMFA") {
		retValue = "<button type=\"button\" class=\"btn " + "btn-info" + " buttonCloseRequest statusButton \" data-toggle=\"modal\" data-target=\"#requestModal\" data-requestid=\"" + full.RequestId + "\">" + "Close" + "</button>";
	}

    return retValue;
};

$(document).on("click", ".buttonCloseRequest", function () {
    var requestId = $(this).data('requestid');
	var pamRequestClosePromise = ClosePamRequest(requestId);
	
    pamRequestClosePromise.done(function() {
		setTimeout(function () { window.location.reload(); }, 3000);
    });
});
