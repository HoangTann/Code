    import http from 'http';
    import getURL from './getURL';
    import date from './date';
http .createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'})
    res.write( date() + "<br>")
    res.write(getURL.getPath(req) + "<br>")
    res.write(getURL.getParamsURL(req) + "<br>")
    res.write('Hello KTPM0121, Chuc cac ban thanh cong !!')
    res.end()
}).listen(8080)