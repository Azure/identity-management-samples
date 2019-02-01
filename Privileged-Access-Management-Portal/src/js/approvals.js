$(function() {
    refreshTableRequests();
} );

$(function() {
    $(document).on("click", ".approveButton, .rejectButton", function() {
        var approved = $(this).hasClass("approveButton") ? true : false;
        var PamRequesttoapprove = SetPamRequestToApprove($(this).data("approvalobjectid"), approved);
        PamRequesttoapprove.done(function() {
            refreshTableRequests();
        });
    });
});


function refreshTableRequests(){
        getPamRequestToApproveExtendInfo(onRequestsDoneCallback, onRequestsFailCallback);
}

function renderTableRequests(requestsData){
    $('#RequestsTable').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>' );
 
    $('#example').dataTable( {
        "data": requestsData,
		"columnDefs":  [
			{ targets: [0, 1, 2], render: $.fn.dataTable.render.text() },
		],
        "columns": [        
            { "title": "Role Name", "data" : "RoleName"  },
            { "title": "Requestor Name", "data" : "Requestor"  },
            { "title": "Justification", "data": "Justification" },
            { "title": "Timeout(Hours)", "mRender": function (data, type, full) { var ttlHours = Math.round( full.RequestedTTL / 36) / 100; return ttlHours} },
			{ "title": "Requested Time ", "mRender": function (data, type, full) { return getFormattedTime(full.RequestedTime, false, true); } },
            { "title": "Creation Time ", "mRender": function (data, type, full) { return getFormattedTime(full.CreationTime, false, true); } },
            { "title": "Actions", "className": "StatusHeader", 'mRender': function (data, type, full) {return actionButtons(data, type, full); }}
        ],
        "order": [[ 1, "desc" ]],
    } ); 
}

function onRequestsDoneCallback(requestsData){
    $(".loadingTableIcon").hide();
    $("#filterInputs").show();
    renderTableRequests(requestsData);
}


function actionButtons(data, type, full) {
    return (approveButton(data, type, full) + rejectButton(data, type, full));
}

function approveButton(data, type, full) {
    return "<button type=\"button\" class=\"btn btn-primary statusButton approveButton\" data-RequestorID=\"" + full.RequestorID.Value + "\" data-FIMRequestID=\"" + full.FIMRequestID.Value + "\" data-ApprovalObjectID=\"" + full.ApprovalObjectID.Value + "\">Approve</button>";
};

function rejectButton(data, type, full) {
        return "<button type=\"button\" class=\"btn btn-danger statusButton rejectButton\" data-RequestorID=\"" + full.RequestorID.Value + "\" data-FIMRequestID=\"" + full.FIMRequestID.Value + "\" data-ApprovalObjectID=\"" + full.ApprovalObjectID.Value + "\">Reject</button>";
};


function onRequestsFailCallback(pamRolesResult, pamRequestsResult){
}