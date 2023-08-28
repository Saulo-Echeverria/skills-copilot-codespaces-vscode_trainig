// ceate a web server
// 1. create a web server
// 2. handle requests
// 3. return response

// 1. create a web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

// read the data from the file
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// read the template
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempComment = fs.readFileSync(
  `${__dirname}/templates/template-comment.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

// 2. handle requests
const server = http.createServer((req, res) => {
  // console.log(req.url);
  // console.log(url.parse(req.url, true));
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    // replace template
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempComment, el))
      .join('');
    const output = tempOverview.replace('{%COMMENT_CARDS%}', cardsHtml);

    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    res.end(output);
  }

  // Product page
  else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    res.end(output);
  }

  // API
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  }

  // Not found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

// 3. return response
server.listen(8000, '

