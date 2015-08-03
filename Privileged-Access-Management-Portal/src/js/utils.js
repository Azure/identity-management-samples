
var GlobalConfig = {
    pamRespApiUrl : "http://pamsrv.priv.contoso.local:8086/api/pamresources/"
}

function GetGlobalConfig() {
    return GlobalConfig;
}


function BuildPamRestApiUrl(objectPath, filter) {
    var requestFilter = (filter == undefined) ? "" : filter;
    return GlobalConfig.pamRespApiUrl + objectPath + requestFilter;
}

function getFormattedTime(time, isEarlyFirst, isUniformTimeFormat) {
    var retValue = "";
    var timePrefix = "";
    var datePrefix = "";
    if (isEarlyFirst){
        timePrefix = " ";
    }else{
        datePrefix = " ";
    }
    if (time.trim()){
        var localTime = moment(time);
        var iscurrentDate = localTime.isSame(new Date(), "day");

        if(iscurrentDate && !isUniformTimeFormat)
        {
            retValue = timePrefix + localTime.format("HH:mm:ss"); 
        }
        else{
            retValue = datePrefix + localTime.format("YYYY/MM/DD , HH:mm:ss");
        }
    }
    return retValue;
}

function getFormattedTimeWindow(fromTime, toTime) {
	var localTimeFrom = moment(fromTime.trim()).format("HH:mm");
	var localTimeTo = moment(toTime.trim()).format("HH:mm");
	
	if (localTimeFrom != localTimeTo)
	{
		return localTimeFrom + " - " + localTimeTo;
	}
	else
	{
		return "";
	}
}

$.when(getSessionInfo()
    .done(function(userName) {
        $("#userNameLabel").text(userName.value[0].Username);
    })
    .fail(function(failError) {

    })
);

$( document ).ajaxError(function(event, jqxhr, settings, thrownError) {
	$(".errorDialog").html("Oops! Something went wrong. The ajax calls failed, please contact your administrator.<br>Status code: " + jqxhr.status + ".<br>Error: " + jqxhr.statusText + 	".");
	$(".loadingTableIcon").hide();
	$(".errorDialog").show();
});

$( document ).ready(function () {
  $(".onlyDigits").keypress(function (e) {
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && e.which != 46) {
        $(".digitsOnlyMsg").html("Digits Only").show().fadeOut("slow");
               return false;
    }
   });
});