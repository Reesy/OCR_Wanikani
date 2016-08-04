var tesseract = require('node-tesseract');
var rp = require('request-promise');
var fs = require('fs-extra');
var _ = require('underscore');

var options = {
    uri: 'https://www.wanikani.com/api/user/{YOUR-API-KEY}/kanji/{YOUR-LEVELS}',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response 
};

var LanguageOptions = {
    l: 'jpn'
};

//initiates call using options
rp(options)
    .then(function (response) {
        var filtered_wanikani = _.filter(response.requested_information, function(kanji) {
            return kanji.user_specific !== null; 
        });
        var filteredkanji = _.pluck(filtered_wanikani, 'character');
        fs.writeJson('./filteredkanji.json', filteredkanji);
        return filteredkanji;
    })
    .then(function(filteredKanji){
         tesseract.process(__dirname + '/ashmore1.jpg', LanguageOptions, function(err, text) {
            fs.writeJson('./image_kanji.json', text);
            var known_kanji = _.intersection(filteredKanji, text);
            fs.writeJson('./known_kanji.json', known_kanji);
         });
    })
    .catch(function (err) {
        console.log("error");
        // API call failed... 
    });

 
