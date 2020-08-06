//
//  -   Otestováno a kontrola 6.8.2020 13:20
//  -
//  -   Import dalsích nákladů do GA
//  -   accountId = Hlavní účet 
//  -   webPropertyId = UA-XXXXXXXX-X
//  -   ss = záložka ve spreadsheetu
//  -   skript se spoustí vždy od 8 dne v měsíci
//  -  
//  -   Radek Kupr
//  - 

function uploadDataAffilHPoznatsvet() {
    var q = new Date();
    var d = q.getDate();
    //var d = 6;
    if(d >= 8 || d == 1)
    {
  
    var accountId = "147295357";
    var webPropertyId = "UA-147295357-1";
    var customDataSourceId = "7OreGsBlRX6abWRONlQnpw";
    var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Import-HPoznatsvet-affil")
  
    
    //var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var maxRows = ss.getLastRow();
    var maxColumns = ss.getLastColumn();
    var data = [];
    
    for (var i = 1; i <= maxRows;i++) {
      data.push(ss.getRange([i], 1,1, maxColumns).getValues());
    }
    var newData = data.join("\n");
    var blobData = Utilities.newBlob(newData, "application/octet-stream", "GA import data");
    Logger.log(blobData.getDataAsString())
    try {
      var upload = Analytics.Management.Uploads.uploadData(accountId, webPropertyId, customDataSourceId, blobData);
       
      // SpreadsheetApp.getUi().alert("Uploading: OK");
      // infoalert = infoalert + "Import nákladů na Poznatsvet.cz proběhl = OK\n\r";
    }
    catch(err) {
      SpreadsheetApp.getUi().alert(err);
    }
  
    }  
    
    else{
    }    
  }