function getDb() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get("db");
  if (cached != null) {
    return cached;
  }
  var result = doc.getBody().getText(); 
  cache.put("db", result, 1500); // cache for 25 minutes
  return result;
}


function checkEmail(email){
  var range = ss.getSheetByName("candidate").getRange("C:C");
    var emailColumnValues = range.getValues();
    
    var rowCandidate = -1;
    for (var i = 0; i < emailColumnValues.length; i++) {
      var value = emailColumnValues[i][0].toString().trim();
      if (value.match(new RegExp("^" + email + "$", "i"))) {
        rowCandidate = i;
        break;
      }
    }
  return rowCandidate;
}

function setReply(reply){
  var result = reply; 
  cache.put("reply", result, 1500);
}

function getReply() {
  var cached = cache.get("reply");
  if (cached != null) {
    return cached;
  }
  else{
    return "nothing";
    }
}