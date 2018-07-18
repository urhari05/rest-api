//import { StringDecoder } from 'string_decoder';

const http = require('http');
const url = require('url');
const {StringDecoder} = require('string_decoder');

const server = http.createServer(function(req, res){
    const parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get the query string as an obect
    const queryStringObject = parsedUrl.query;

    //Get the htp mehod
    const method = req.method.toLowerCase();

    //Get The headers object
    const headers = req.headers;

    //Get the payload
    const decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });

    


    req.on('end', function(){
        buffer += decoder.end();

        //Choose the handler the request should go to, If not found should call notfound handler
        const chosenHandler = typeof(routers[trimmedPath]) !== 'undefined' ? routers[trimmedPath] : handlers.notfound;
        // construct data object to send to the handler
        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            'payload': buffer
        }

        //route the request to handler specified in the router
        chosenHandler(data,function(statuscode = 200, payload= {}){
            const payloadString = JSON.stringify(payload);
            //return the response
            res.writeHead(statuscode);
            res.end(payloadString);
            // log the request
            console.log('Returning this response', payloadString, statuscode);
        });
        
    });

});

server.listen(3001, function(){
    console.log('server is listening to port 3001 now');
});

//Define the handlers
const handlers = {};

//sample handler
handlers.sample = function(data, callback){
    //callback with http status code with payload object
    callback(406, { 'name' : 'sample handler' });
}

// default handler
handlers.notfound = function(data, callback) {
    callback(404);
}

//Define the routers
const routers = {
    'sample': handlers.sample
};