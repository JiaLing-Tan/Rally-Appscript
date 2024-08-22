function getOpenPosition(){
  var output = [];
  for(var i = 1; i < valuesPosition.length; i++){
    var row = {};
    row['id'] = valuesPosition[i][0];
    row['role'] = valuesPosition[i][1];
    row['department'] = valuesPosition[i][2];
    row['skill'] = valuesPosition[i][3];
    row['experience'] = valuesPosition[i][4];
    row['interviewerId'] = valuesPosition[i][5];
    row['minBudget'] = valuesPosition[i][6];
    row['maxBudget'] = valuesPosition[i][7];
    row['status'] = valuesPosition[i][8];
    output.push(row);
  }
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}

function objectPosition(id){
  var rowPosition = positionIds
    .createTextFinder(id)
    .matchEntireCell(true)
    .findAll()[0]
    .getRow();
  var position = sheetPosition
    .getRange("A" + rowPosition.toString() + ":I" + rowPosition.toString())
    .getValues()[0];
  position = {
    "id" : position[0],
    "role" : position[1],
    "department" : position[2],
    "skill" : position[3],
    "experience(years)" : position[4],
    "interviewerId" : position[5],
    "minBudget" : position[6],
    "maxBudget" : position[7],
    "status" : position[8],
  }
  
  return position;
}
