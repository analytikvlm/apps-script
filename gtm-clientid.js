//
//  - aktualizováno a testováno = 6.8.2020 8:00
//  - Radek Kupr 
//  
//  - kód pro GTM se vkládá jako vlastní javascript proměná
//  - při načtení získá Clien ID pokud není k dispozici zapíše undefined
//   

function() {
    try {
        var tracker = ga.getAll()[0];
        return tracker.get('clientId');
    } catch (e) {
        //  return false;
        return 'undefined';
    }
}