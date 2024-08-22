
function doPost(e){
  convertMail();
  return 200;
}



function watch(){
  var payload ={topicName: "projects/summer-artwork-430308-s9/topics/GmailNotification",
  labelIds: ["INBOX"],
  labelFilterBehavior: "INCLUDE"};

  var option = {
    method : "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    headers: {Authorization: "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpException: true
  }

  var response = UrlFetchApp.fetch('https://www.googleapis.com/gmail/v1/users/me/watch', option);
  Logger.log(response.getContentText());
}

function stop(){
  var payload ={topicName: "projects/summer-artwork-430308-s9/topics/GmailNotification",
  labelIds: ["INBOX"],
  labelFilterBehavior: "INCLUDE"};

  var option = {
    method : "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    headers: {Authorization: "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpException: true
  }

  var response = UrlFetchApp.fetch('https://www.googleapis.com/gmail/v1/users/me/stop', option);
  Logger.log(response.getContentText());
}
