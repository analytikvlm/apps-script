//Nastavení----------------------------------------------------------------------------------------------
//*******************************************************************************************************
var spreadsheet = 'https://docs.google.com/spreadsheets/d/1h9cOmZ2Czh2Ko7aXT7JLyPEMu8n0J08_OxMb3zJyUj8/edit#gid=964388051';
var sheet = 'kampane-kondice-facebook';
//Token
var config_spreadsheet = 'https://docs.google.com/spreadsheets/d/1IKjdJIx3EBaBADRn_Ze06kjBhbLI6-fct7mrLYsxDcI/edit#gid=464166389';
var row_with_token = 4;
var account_id = '427132464613769';


function main() {
    //Nadefinování spreadsheetu
    var ss = SpreadsheetApp.openByUrl(spreadsheet).getSheetByName(sheet);

    //Pole pro export do spreadsheetu
    var sheet_export = [];
    var sheet_row = [];

    //Token
    var token = SpreadsheetApp.openByUrl(config_spreadsheet).getSheetByName('tokens').getRange('A' + row_with_token).getValue();

    //Datum--------------------------------------------------------------------------------------------------
    //Minulý měsíc
    var start_date = new Date();
    start_date.setUTCMonth(start_date.getUTCMonth() - 1);
    start_date.setUTCDate(1);
    start_date = Utilities.formatDate(start_date, 'GTM - 1', 'yyyy-MM-dd');

    var end_date = new Date();
    end_date.setUTCDate(0);
    end_date = Utilities.formatDate(end_date, 'GTM - 1', 'yyyy-MM-dd');

    //facebook.api-------------------------------------------------------------------------------------------
    var facebook_api_url = 'https://developers.facebook.com/docs/graph-api/changelog';

    try {
        var facebook_api_version = UrlFetchApp.fetch(facebook_api_url).getContentText();
    } catch (err) {
        Utilities.sleep(1000);
        try {
            var facebook_api_version = UrlFetchApp.fetch(facebook_api_url).getContentText();
        } catch (err) {
            Utilities.sleep(1000);
            var facebook_api_version = UrlFetchApp.fetch(facebook_api_url).getContentText();
        }
    }

    facebook_api_version = facebook_api_version.substring(facebook_api_version.indexOf('<code>') + 6, facebook_api_version.indexOf('</code>'));

    var url = '/' + facebook_api_version + '/act_' + account_id + '/insights?' +
        'level=campaign' +
        '&fields=account_name,campaign_name,impressions,clicks,spend,ctr,cpc' +
        '&time_range=' + encodeURIComponent("{'since':'" + start_date + "','until':'" + end_date + "'}") +
        '&sort=date_start_ascending' +
        '&time_increment=all_days' +
        '&filtering=' + encodeURIComponent("[]") +
        '&limit=1000000' +
        '&access_token=' + token;

    var response = fb_api(url);

    for (var i = 0; i < response.data.length; i++) {
        sheet_row = [response.data[i].account_name, response.data[i].campaign_name, response.data[i].impressions, response.data[i].clicks, response.data[i].spend, response.data[i].ctr, response.data[i].cpc]
        sheet_export.push(sheet_row);
    }

    //Hlavička tabulky
    ss.getRange(1, 1, 1, 7).setValues([
        ['Název účtu', 'Název kampaně', 'Zobrazení', 'Prokliky', 'Cena', 'CTR', 'CPC']
    ]);
    //Smazání předchozích dat
    ss.getRange(2, 1, ss.getLastRow(), 7).clearContent();
    //Export do spreadsheetu
    if (sheet_export.length > 0 && sheet_row.length > 0) {
        ss.getRange(2, 1, sheet_export.length, sheet_row.length).setValues(sheet_export);
    }

    //Obnovení spreadsheetu
    SpreadsheetApp.flush();

}

//-------------------------------------------------------------------------------------------------------
//Funkce pro komunikaci
function fb_api(settings_url) {
    var url = 'https://graph.facebook.com' + settings_url;
    var options = { 'method': 'get', 'contentType': 'application/json', 'muteHttpExceptions': true };

    try {
        return (JSON.parse(UrlFetchApp.fetch(url, options)));
    } catch (err) {
        Utilities.sleep(1000);
        try {
            return (JSON.parse(UrlFetchApp.fetch(url, options)));
        } catch (err) {
            Utilities.sleep(1000);
            return (JSON.parse(UrlFetchApp.fetch(url, options)));
        }
    }
}