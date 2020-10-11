const wiki = require('wikijs').default;
var request = require('request');

function retrieve_wiki_data(topic){
    var url = `https://en.wikipedia.org/w/api.php?action=query&prop=extract&list=search&srsearch=${topic}&format=json`;
    //console.log(url);
    request(url, function (err, response, body) {
        if(err){
            var error = "cannot connect to the server";
            //console.log(error);

            return {}
       } else {
            const data = JSON.parse(body)

            var page = data.query.search[0]

            var page_url = `https://en.wikipedia.org/wiki/${page.title}`;
            var article = {
                "title" : page.title,
                "snippet" : page.snippet,
                "url " : page_url
            }

            //console.log('PAGE:', article)

            return page.title
        }
       });


}
var query = "Los Angeles Basketball"
var ret = retrieve_wiki_data(query)
console.log("RET:",ret)