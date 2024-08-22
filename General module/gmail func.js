const sheetMail = ss.getSheetByName("mail");
const documentList = ["Personal Particulars Form", "Confidentiality Undertaking", "Information Security Policy", "PDPA Notice", "Offer Letter"]
const mailId = sheetMail.getRange("A:A");


function convertMail(){
  const email = GmailApp.getInboxThreads();
  const latest = email[0].getMessages()[0];
  if (latest.getFrom() != userEmail){
    var content = [];
    if(mailId
      .createTextFinder(latest.getId())
      .matchEntireCell(true)
      .findAll()[0] == null){
        content = [
            latest.getId(),
            Utilities.formatDate(new Date(latest.getDate()), "GMT+8", "MM/dd/yyyy HH:mm:ss"),
            latest.getSubject(),
            latest.getPlainBody(),
            ]
        sheetMail.appendRow(content);
        if(!checkAppointment(latest)){ 
          if(!checkRegistration(latest)){
            checkApplication(latest);
          }
        } 
      }   
  }
  
   
}

function test(){
  var roles = sheetPosition.getRange("B2:B" + sheetPosition.getLastRow().toString()).getValues();
  Logger.log(roles[0]);
}


function getDestination(path){
  var destination = DriveApp;
  for (var i = 0; i < path.length; i++){
    destination = destination.getFoldersByName(path[i]);
    while(destination.hasNext()){
      destination = destination.next();
      break;
    }
  }
  return destination;

  //  var destination = DriveApp.getFoldersByName("Rally");
  //  while (destination.hasNext()) {
  //   var destination = destination.next().getFoldersByName("CV");
  //   while (destination.hasNext()) {
  //     var destination = destination.next().getFoldersByName("temp");
  //     return destination.next();
  //   }
  //   }
  //   return "Location not found";


}

function checkAppointment(message) {
  var email;
  if (message.getSubject().search(/Appointment booked/i) == 0) {
    var content = message.getPlainBody().split("\n")
    Logger.log(content[4]);
    if (content[4].trim() == "Join with Google Meet")
    {
      email = content[17].trim();
    }
    else{
      var email = content[6].trim();
    }
    
    Logger.log("Booked by: " + email);
    
    var rowCandidate = checkEmail(email);
    
    if (rowCandidate > 0) {
      Logger.log("Matching row: " + rowCandidate);
      sheetCandidate.getRange("J" + rowCandidate.toString()).setValue("Interview Scheduled");
      invitationAccepted(rowCandidate);
      return true;
    } else {
      Logger.log("No matching row found, it is not a job interview appointment.");
      return false;
    }
  }
  return false;
}

function checkApplication(mail){
  var header = mail.getSubject();
  var subject = mail.getPlainBody();
  var roleMap = {}
  for (var i = 0; i < valuesPosition.length; i++){
    var row = valuesPosition[i];
    roleMap[row[0]] = row[1];
  }
  const prompt = "Identify if the mail is a job application mail, return the result in JSON format with four keys: application(boolean type), name(applicant name, a String), position(return the closest match role id in the map" + JSON.stringify(roleMap) +"), and originalPosition(string, the original position that canidate apply for), only return JSON resutl \n header: " + header + ", subject: " + subject;
  try{
    var output = callGemini(prompt);
    if(output['application'] == true){
    Logger.log(prompt + output);
        processApplication(mail, output);
        return true;
     }
  } catch(exc){
    return false;
  }
  
}

function processApplication(mail, output){
  var latestAttachment = mail.getAttachments();
  var attachmentBlob;
  var pdf;
  for (var i = 0; i < latestAttachment.length; i++){
    Logger.log(latestAttachment[i].getContentType());
    try{
      attachmentBlob = latestAttachment[i].getAs("application/pdf").copyBlob();
       pdf = getDestination(["Rally", "CV", "temp"]).createFile(attachmentBlob).setName(output['name']+i);
    } catch(exc) {
      Logger.log(exc);
      if(latestAttachment[i].getContentType() == "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
      {
        var temp = Drive.Files.create({ // Here, Drive API of Advanced Google services is used.
          "mimeType": "application/vnd.google-apps.document",
          "title": output['name']+i
        }, latestAttachment[i].copyBlob());
        var f = DriveApp.getFileById(temp.id).getBlob();
        attachmentBlob = f.getAs('application/pdf').copyBlob();
        pdf = getDestination(["Rally", "CV", "temp"]).createFile(attachmentBlob).setName(output['name']+i);
      }
      
    }
   
    var attachment = convertPDFToText(pdf.getId());
    var summary = summariseResume(attachment, output);
    const id = generateId("C", sheetCandidate)
    var resume = getDestination(["Rally", "CV"]).createFile(attachmentBlob).setName(id + " resume" );
    if(summary['name'] != false){
      
      sheetCandidate.appendRow([
      id,
      formatName(summary['name'],),
      summary['email'],
      output['position'],
      summary['skills'],
      summary['education'],
      summary['experience'],
      summary['rating'],
      summary['explanation'],
      "In Progress",
      Utilities.formatDate(new Date(), "GMT+8", "MM/dd/yyyy"),
      summary['contactNumber'],
      output['originalPosition'],
      resume.getId()
      
    ]);
    
    
    }
    DriveApp.getFileById(pdf.getId()).setTrashed(true);
    
  }

}

function summariseResume(attachment, input){
  const id = input['position'];
  const rowPosition = positionIds
    .createTextFinder(id)
    .matchEntireCell(true)
    .findAll()[0]
    .getRow();
  const position = sheetPosition.getRange("B" + rowPosition.toString()).getValue();
  const skills = sheetPosition.getRange("D" + rowPosition.toString()).getValue();

  const tempP = "Identify if the content is a resume, return true if it is, if it is a cover letter or other format of document return false, return in Json format with 'name' as a key. \n "+ attachment;
  const temp = callGemini(tempP,0);
  Logger.log(temp);
  if(temp['name'] == false){
    return temp;
  }
  else{
    const prompt = "You are a strict HR manager, based on the resume, identify an summarize the candidate's name, mail address, contact number, their skills, education, experience , and rate them based on their skill, experience on a scale from 1-100 as if they are applying for "+ position +" where they need to know "+ skills +", also justify your rating in 100 words. Return your response as a JSON object with the following keys: name, email, skills, education, experience, rating, explanation, contactNumber, concatenate the skills using “;” as a delimiter,do the same to education and experience;  \n" + attachment;
    const output = callGemini(prompt,0);
    Logger.log(output);
    return output;
  }
}

function checkRegistration(mail){
  const senderEmail = mail.getFrom().split("<")[1].split(">")[0];
  Logger.log(senderEmail)
  const rowCandidate = checkEmail(senderEmail);
  Logger.log(rowCandidate);
  
  try{
    const status = sheetCandidate.getRange("J" + rowCandidate.toString()).getValue();  
    const id = sheetCandidate.getRange("A" + rowCandidate.toString()).getValue();
    Logger.log(id);
    if (status == "Offered"){
    const attachments = mail.getAttachments();
    var documents = documentList; 
    for(var i = 0; i < attachments.length; i++){
      var attachment = attachments[i];
      var name = attachment.getName().split(".")[0];
      if(documents.includes(name)){
        Logger.log(name);
        documents.splice(documents.indexOf(name), 1);
      }
    }
    Logger.log("test here");
    if(documents.length > 0){
      Logger.log("Document missing");
      mail.reply("You missed out these: " + documents);
      return true;
    }
    else{
      for (var i = 0; i < attachments.length; i++){
        var attachment = attachments[i].copyBlob();
        getDestination(["Rally", "Legal Documents"]).createFile(attachment).setName(id +  attachment.getName());
      }
      
      
      mail.reply("Thanks! We'll be reviewing the documents and get back to yoou with the onboarding materials.");
      offerAccepted(id);
      return true;


    }
  }
  } catch(exc){
    Logger.log(exc);
    return false
  }
  
};







