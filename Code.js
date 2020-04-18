//var student_info_sheet_url = "https://docs.google.com/spreadsheets/d/1Xf3HsVXoxCE9MDgDdbIj1U8De2NpSEMVTQpN2hlTMGk/edit#gid=0";

var student_info_sheet_url = "https://docs.google.com/spreadsheets/d/1vSpjuhHL4BpCgV7-mdMYtCIVd4VfQpKHw16218awcV8/edit#gid=0";
var faculty_data_sheet_url = "https://docs.google.com/spreadsheets/d/1UWcbToPpGux2qT_u7YHJROfdH_jlSp4-apZGEs52w08/edit#gid=0";


function doGet(e){
//  Logger.log(e);
//  Logger.log(ScriptApp.getService().getUrl());
//  if (!e.parameter.page){
//    return HtmlService.createTemplateFromFile("login").evaluate();
//  }
//  else{
//    Logger.log(e.parameter['page']);
//    return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate(); 
//  }
  
  return HtmlService.createTemplateFromFile('student_info').evaluate(); 
}


function getProfileInformation() {
  
  var userInfo = {};
  
  userInfo.email = Session.getActiveUser().getEmail();
//  userInfo.firstname = "";
//  userInfo.lastname = "";
//  userInfo.UIN = "";
//  userInfo.startsem = "Fall";
//  userInfo.qualstatus = "Pass";
//  userInfo.numattempts = "0";
//  userInfo.advisor = "Not Selected";
//  userInfo.coadvisor = "No Co-Advisor";
//  userInfo.degreeplanstauts = "Yes";
  
  
//  var url = "https://docs.google.com/spreadsheets/d/1C5YZ2Lt903A-YGguYQH02JtL9vxs66sMydcD7BeZFJ4/edit#gid=0";
  var ss = SpreadsheetApp.openByUrl(student_info_sheet_url);
  var ws = ss.getSheetByName("data");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  
  for (var i = 0; i < values.length; i++) {
    if (values[i][3] == userInfo.email) {
      
      userInfo.firstname = values[i][0];
      userInfo.lastname = values[i][1];
      userInfo.UIN = values[i][2];
      userInfo.startsem = values[i][4];
      userInfo.qualstatus = values[i][5];
      userInfo.numattempts = values[i][6];
      userInfo.advisor = values[i][7];
      userInfo.coadvisor = values[i][8];
      userInfo.degreeplanstatus = values[i][9];
      
      if(values[i][10]!=""){
        userInfo.prelime_date = values[i][10].toISOString().slice(0,10);
      }
      
      if(values[i][11]!=""){
        userInfo.proposal_date = values[i][11].toISOString().slice(0,10);
      }
      
      if(values[i][12]!=""){
      userInfo.defense_date = values[i][12].toISOString().slice(0,10);
      }
      break;
    }
  }
  return userInfo;
}

//////////////////////////////////////////////////////////////////////// Updating Student Informaiton //////////////////////////////////////////////////////

function submitProfile(userInfo){
  var ss = SpreadsheetApp.openByUrl(student_info_sheet_url);
  var ws = ss.getSheetByName("data");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  var userExists = false;
  
  for (var i = 0; i < values.length; i++) {
    if (values[i][3] == userInfo.email) {
      userExists = true;
      if(userInfo.firstname!=values[i][0]){
        ws.getRange(i+1,0+1).setValue(userInfo.firstname);
      }
      if(userInfo.lastname!=values[i][1]){
        ws.getRange(i+1,1+1).setValue(userInfo.lastname);
      }
      if(userInfo.UIN!=values[i][2]){
        ws.getRange(i+1,1+1).setValue(userInfo.UIN);
      }
      if(userInfo.startsem!=values[i][4]){
        ws.getRange(i+1,4+1).setValue(userInfo.startsem);
      }
      if(userInfo.qualstatus!=values[i][5]){
        ws.getRange(i+1,5+1).setValue(userInfo.qualstatus);
      }
      if(userInfo.numattempts!=values[i][6]){
        ws.getRange(i+1,6+1).setValue(userInfo.numattempts);
      }
      
      if(userInfo.advisor!=values[i][7]){
        ws.getRange(i+1,7+1).setValue(userInfo.advisor);
      }
      if(userInfo.coadvisor!=values[i][8]){
        ws.getRange(i+1,8+1).setValue(userInfo.coadvisor);
      }
      
      if(userInfo.degreeplanstauts!=values[i][9]){
        ws.getRange(i+1,9+1).setValue(userInfo.degreeplanstauts);
      }
      
      if(userInfo.prelime_date!=values[i][10]){
        ws.getRange(i+1,10+1).setValue(userInfo.prelime_date);
      }
      if(userInfo.proposal_date!=values[i][11]){
        ws.getRange(i+1,11+1).setValue(userInfo.proposal_date);
      }
      if(userInfo.defense_date!=values[i][12]){
        ws.getRange(i+1,12+1).setValue(userInfo.defense_date);
      }      
      break;  
    } 
  }
  
  if (!userExists){ 
    ws.appendRow([userInfo.firstname,userInfo.lastname,userInfo.UIN,userInfo.email,
                  userInfo.startsem,userInfo.qualstatus,userInfo.numattempts,userInfo.advisor,
                  userInfo.coadvisor,userInfo.degreeplanstauts,userInfo.prelime_date,userInfo.proposal_date,
                  userInfo.defense_date
                 ]);
  }
  
}


/////////////////////////////////////////////////////////////////////// File Upload Code///////////////////////////////////////////////////////////////////

function folderExistsIn(parent_folder,folder_name){
  var folders = parent_folder.getFolders();     
  while (folders.hasNext()) {
    var folder = folders.next();
    if(folder_name == folder.getName()) {         
      return folder;
    }
  }
  return false;
}

function uploadFileToDrive(content, filename, email,file_type){
  try {
//    var email = userInfo.email;
    var dropbox = "phd_review_dev";
    var folder, folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }
    
    if (!folderExistsIn(folder,email)){
      folder.createFolder(email);
    }
    
    var s_folder, s_folders = DriveApp.getFoldersByName(email);
    
    if (s_folders.hasNext()) {
      
      s_folder = s_folders.next();
      var c  = s_folder.getFiles();
      if (c.hasNext()){
        while (c.hasNext()){
          file = c.next();
          file_name = file.getName();
          if (file_name.indexOf(file_type[0])==0){
            file_id = file.getId();
            s_folder.removeFile(file);
          }
        }
        Logger.log("Previous similar type file deleted");
      } 
      
      var new_file_name = file_type+"_"+filename;
      var contentType = content.substring(5,content.indexOf(';')),
          bytes = Utilities.base64Decode(content.substr(content.indexOf('base64,')+7)),
          blob = Utilities.newBlob(bytes, contentType, new_file_name);
      
      s_folder.createFile(blob);
      var file_url;
      var files = s_folder.getFilesByName(new_file_name);
      while (files.hasNext()) { 
        var file = files.next();
        if(file.getName()==new_file_name){
            file_url = file.getUrl();
        }
      }
    }
    
    update_file_url(email,file_url);
    Logger.log("Uploading is done");
    
  } catch (f) {
    return f.toString();
  }
  
}

function update_file_url(email,file_url){
//  var url = "https://docs.google.com/spreadsheets/d/1C5YZ2Lt903A-YGguYQH02JtL9vxs66sMydcD7BeZFJ4/edit#gid=0";
  var ss = SpreadsheetApp.openByUrl(student_info_sheet_url);
  var ws = ss.getSheetByName("data");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  
  for (var i = 0; i < values.length; i++) {
    if (values[i][3] == email) {
      ws.getRange(i+1,13+1).setValue(file_url);
    }
  }
  
  Logger.log("file url Updated")
}

//////////////////////////////////////

function get_advisor_list(){
  
  var ss = SpreadsheetApp.openByUrl(faculty_data_sheet_url);
  var ws = ss.getSheetByName("Faculty")
  var list = ws.getRange(1,1, ws.getRange("A1").getDataRegion().getLastRow(),1).getValues();
  
  var advisorlist = list.map(function(r){return '<option value="'+r[0]+'">'+r[0]+'</option>';}).join('');
  Logger.log(advisorlist)
  
  return advisorlist;
}




////////////////////////////////////////////////////////// Other Stuff ///////////////////////////////////////////////////////////////////////////////

function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


function getScriptUrl(){
  eval(UrlFetchApp.fetch('https://cdn.rawgit.com/medialize/URI.js/gh-pages/src/URI.js').getContentText());
  var uri = URI(ScriptApp.getService().getUrl());
  var script_url =  uri.directory('/a/tamu.edu'+uri.directory());
  return script_url;
}