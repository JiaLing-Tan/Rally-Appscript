const properties = PropertiesService.getScriptProperties().getProperties();
const doc = DocumentApp.openById(properties['DOC_ID']);
const GEMINI_API_KEY = properties['GEMINI_API_KEY'];
const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const ss = SpreadsheetApp.openById(properties['SHEET_ID']);
const cache = CacheService.getScriptCache();


function onMessage(event) {

  if(event.message.slashCommand)
  {
    switch (event.message.slashCommand.commandId)
    {
    case 1:
      return slashCard(event);
    }
  }
  else
  {
    var replyBody = {};
    const geminiResponse = callGemini(event.message.text);
    if(geminiResponse['isStart'] == true)
    {
      replyBody['cardsV2'] = [startCard(event)];
    }
    else if (geminiResponse['isEnd'] == true)
    {
      replyBody['cardsV2'] = [feedbackCard()];
    }
    else if(geminiResponse['isApplication'] == true)
    {
      replyBody['cardsV2'] = [applicationCard()];
    } 
    else{
      replyBody['text'] = geminiResponse['response'];
      setReply(replyBody['text']);
    }

    return replyBody;
  }
}


function onAddToSpace(event) {
  var replyBody = {};
  replyBody["text"] = "Hi there! 👋  How can I help you today? 😊";
  replyBody["cardsV2"] = [startCard()];
  return replyBody;
}

function onRemoveFromSpace(event) {
  console.info("Bot removed from ",
      (event.space.name ? event.space.name : "this chat"));
}

function onCardClick(event) {
  switch (event.common.invokedFunction) {
    case 'receiveCard':
      return receiveCard(event);
    case 'checkApplicationStatus':
      return checkApplicationStatus(event);
    case 'sendFeedback':
      return sendFeedback(event);
    case 'general':
      return {"text": "Sure! How may I help you? 😊"};
  }
}

function checkApplicationStatus(event){
  var responseBody = {};
  // const email = event.user.email;
  // const email = "leegame12138@gmail.com"
  const email = "jialing030901@gmail.com"
  responseBody['text'] = email;
  var data = ss.getSheetByName("candidate").getDataRange().getValues();
  const row = checkEmail(email);
   
  data = data[row];
  const status = data[9];
  const id = data[0]; 
  const dateApply = Utilities.formatDate(data[10], "GMT+0", "MM/dd/yyyy");
  var dateInterview = Utilities.formatDate(data[14], "GMT+0", "MM/dd/yyyy HH:mm:ss");
  if(dateInterview == null){
    dateInterview = "Not available";
  }
  Logger.log(dateApply);
  Logger.log(dateInterview);
  responseBody['cardsV2'] = [statusCard(id, dateApply.toLocaleString(), status, dateInterview.toLocaleString())]
  return responseBody;

}

function sendFeedback(event){
  var responseBody = {};
  const feedback = event.common.formInputs.FEEDBACK[""].stringInputs.value[0];
  Logger.log(feedback);
  const timestamp = Utilities.formatDate(new Date(), "GMT+8", "MM/dd/yyyy HH:mm:ss");
  if(feedback != null){
    responseBody["text"] = "Thanks for your feedback!";
    ss.getSheetByName("chatbotFeedback").appendRow([timestamp, feedback]);
    return responseBody;
  } else {
    return null;
  }
}

function test(){
  const email = "jialing030901@gmail.com"
  var data = ss.getSheetByName("candidate").getDataRange().getValues();
  Logger.log(data);
  const row = checkEmail(email);
  Logger.log(row);
  data = data[row][9];
  Logger.log(data);
}



function receiveCard (event) {
  console.log(event)
}


