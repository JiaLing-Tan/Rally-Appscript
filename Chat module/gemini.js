


function callGemini(prompt, temperature=0) {
  Logger.log("timed before call db");
  var db = getDb()
 Logger.log("timed after call db");
  var prompt = `Your name is Rallie, you are a kind assistant hr manager, you only know that Our company name is Rally, ${db} . 
  Remember you only entertain question related to the company and return the response in json format 
  {isEnd : true or false whether the user is trying to end the conversation with thanks or bye, 
  isStart: true or false whether the user is trying to greet you without asking a question, 
  isApplication: true or false whether the user is trying to ask for the application method or 
  they want to talk to a real human not a chatbot, response: your reply}, 
  don't return in markdown. One candidate ask you this: "${prompt}", and you previously replied with this: "${getReply()}"`;
  const payload = {
    "contents": [
      {"parts": {
      "text": prompt,
    }, }
    ],
    "generationConfig":  {
      "temperature": temperature,
    },
  };

  const options = { 
    'method' : 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };
  Logger.log("timed before call gemini");
  const response = UrlFetchApp.fetch(geminiEndpoint, options);
  Logger.log("timed after call gemini");
  const data = JSON.parse(response);
  Logger.log(data);
  var content = data["candidates"][0]["content"]["parts"][0]["text"];
  content = JSON.parse(content.replace(/```(?:json|)/g, ""))
  Logger.log("Last log");
  return content;
}

