function getPamRoles(filter) {    
    return $.ajax({
        url: BuildPamRestApiUrl('pamroles', filter),
        type: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        }
    })
}

function getPamRequests(filter) {
    return $.ajax({
        url: BuildPamRestApiUrl('pamrequests', filter),
        type: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        }
    })
}

function createPamRequest(reqJustification, reqRoleId, reqTTL, reqTime) {
    var requestJson = { Justification: reqJustification, RoleId: reqRoleId, RequestedTTL: reqTTL, RequestedTime : reqTime };
    
    return $.ajax({
        url: BuildPamRestApiUrl('pamrequests'),
        type: 'POST',
        data: requestJson,
        xhrFields: {
            withCredentials: true
        }
    })
}

function SetPamRequestToApprove(approvalobjectid, Isapproved) {
    var actionString = Isapproved ? "Approve" : "Reject";
    var guidString = "(guid'" + approvalobjectid + "')/" + actionString;
    return $.ajax({
        url: BuildPamRestApiUrl('pamrequeststoapprove', guidString),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        }
    })
}

function getPamRequestsToApprove(filter) {
    return $.ajax({
        url: BuildPamRestApiUrl('pamrequeststoapprove', filter),
        type: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        }
    })
}

function ClosePamRequest(closeobjectid) {
    var guidString = "(guid'" + closeobjectid + "')/Close";
    return $.ajax({
        url: BuildPamRestApiUrl('pamrequests', guidString),
        type: 'POST',
        xhrFields: {
            withCredentials: true
        }
    })
}

function getPamRolesExtendInfo(doneCallback, failCallback) {
    var pamRolesPromise = getPamRoles();
    var activeRequestsFilter = "?$filter=ExpirationTime gt datetime'" + new Date().toISOString() + "'";
    var pamActiveRequestsPromise = getPamRequests(activeRequestsFilter);
    
    $.when(pamRolesPromise, pamActiveRequestsPromise)
        .done(function(pamRoles, pamActiveRequests) {
            var roles = pamRoles[0].value;
            var activeRequests = pamActiveRequests[0].value;
			
            var activeRequestHash = {};
            for(i=0; i<activeRequests.length; i++) {
                activeRequestHash[activeRequests[i].RoleId] = activeRequests[i].ExpirationTime;
            }
        
            for(j=0; j<roles.length; j++) {
                roles[j]["ExpirationTime"] = 
                    (activeRequestHash[roles[j].RoleId] == undefined) ? "" : activeRequestHash[roles[j].RoleId];  
            }

            if (typeof(doneCallback) == "function") {
                doneCallback(roles);
            }        
        })
        .fail(function(pamRolesResult, pamActiveRequestsResult) {
            if (typeof(failCallback) == "function") {
                failCallback(pamRolesResult, pamActiveRequestsResult);
            }
        })
    ;     
}

function getPamRequestsExtendInfo(doneCallback, failCallback, fromDate, toDate) {
    var pamRolesPromise = getPamRoles();
    var dateRequestsFilter = "";
    
    if (fromDate != undefined && toDate != undefined) {
        dateRequestsFilter =  "?$filter=CreationTime gt datetime'" + new Date(fromDate).toISOString() + "'" +
                                " and " + "CreationTime lt datetime'" + new Date(toDate).toISOString() + "'";
    } else if (fromDate != undefined) {
        dateRequestsFilter =  "?$filter=CreationTime gt datetime'" + new Date(fromDate).toISOString() + "'";
    } else if (toDate != undefined) {
        dateRequestsFilter =  "?$filter=CreationTime lt datetime'" + new Date(toDate).toISOString() + "'";        
    }
    
    var pamRequestsPromise = getPamRequests(dateRequestsFilter);
    
    $.when(pamRolesPromise, pamRequestsPromise)
        .done(function(pamRoles, pamRequests) {        
            var roles = pamRoles[0].value;
            var requests = pamRequests[0].value;
            
            var rolesHash = {};
        
            for(i=0; i<roles.length; i++) {
                rolesHash[roles[i].RoleId] = roles[i].DisplayName;
            }

            for(j=0; j<requests.length; j++) {
                requests[j]["RoleDisplayName"] = 
                    (rolesHash[requests[j].RoleId] == undefined) ? "" : rolesHash[requests[j].RoleId];
            }
			
            if (typeof(doneCallback) == "function") {
                doneCallback(requests);
            }        
        })
        .fail(function(pamRolesResult, pamRequestsResult) {
            if (typeof(failCallback) == "function") {
                failCallback(pamRolesResult, pamRequestsResult);
            }
        })
    ;        
}

function getPamRequestToApproveExtendInfo(doneCallback, failCallback) {
    var pamRequestsToApprovePromise = getPamRequestsToApprove();
    
    $.when(pamRequestsToApprovePromise)
        .done(function(RequestsToApprove) {
            var requestsToApproveValue = RequestsToApprove.value;
            
            if (typeof(doneCallback) == "function") {
                doneCallback(requestsToApproveValue);
            }        
        })
        .fail(function(RequestsToApproveResult) {
            if (typeof(failCallback) == "function") {
                failCallback(RequestsToApproveResult);
            }
        })
    ;     
}

function getSessionInfo() {
    return $.ajax({
        url: BuildPamRestApiUrl('sessioninfo'),
        type: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        }
    })
}

function TraceArray(data) {
    for(i=0; i<data.length; i++) {
        console.log(data[i]);
    }
}