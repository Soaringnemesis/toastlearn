const wiki = require('wikijs').default;
var request = require('request');

function retrieve_wiki_data(topic){
    //URL to search for list of pages
    var url = `https://en.wikipedia.org/w/api.php?action=query&prop=extract&list=search&srsearch=${topic}&format=json`;
    //console.log(url);
    request(url, function (err, response, body) {
        if(err){
            var error = "cannot connect to the server";
            //console.log(error);

            return {}
       } else {
            const data = JSON.parse(body)

            // get the first page as it is the most relevant
            var page = data.query.search[0]

            var page_url = `https://en.wikipedia.org/wiki/${page.title}`;

            //console.log('PAGE:', article)
            console.log(page.title)

            // this is the url to request information about the page to be used
            var curr_page_url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${page.title}&exchars=500&explaintext=1`;
            request(curr_page_url, function(err, response,body2) {
                if(err){
                    var error = "cannot connect to the server";
                    console.log(error);
        
               } else {
                    const data = JSON.parse(body2)

                    // theres only one item in this for loop so snippet will have the description
                    var snippet = ''
                    for (id in data.query.pages){
                        snippet = data.query.pages[id].extract
                    }

                    //console.log(snippet)
                    //console.log(page.title)
                    //console.log(page_url)

                    // Uncomment below and Add to database here
                    // var article = {
                    //"title" : page.title,
                    //"snippet" : snippet,
                    //"url " : page_url
                    //"type" : "wiki"
                    //}

               }
            })

        }
       })


}
var query = "Cleveland football"
var ret = retrieve_wiki_data(query)
console.log("RET:",ret)