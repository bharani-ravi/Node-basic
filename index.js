const { log } = require("console");
const fs = require("fs"); //filesystem reading or writing data
const http = require("http");
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

////////////////////////////////////////////////////////////////

//Synchronous function Blocking Code Example
// const textInput = fs.readFileSync("./txt/input.txt", "utf-8");

// console.log(textInput);

// const textOut = `Hello Bharani ${textInput}`;

// const textOutput = fs.writeFileSync("./txt/output.txt", textOut);
// console.log(textOutput);

// Asynchronous function Non-Blocking Code Example

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       fs.writeFile(
//         "./txt/asyncOut.txt",
//         `${data2}\n${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("File written succeessfully");
//         }
//       );
//     });
//   });
// });

// console.log("Reading file...");

////////////////////////////////////////////////////////////////

// Creating a Web server & Routing

// const replaceTemplate = (temp, product) => {
//   let output = temp.replace(/{!PRODUCTNAME!}/g, product.productName);
//   output = output.replace(/{!IMAGES!}/g, product.image);
//   output = output.replace(/{!PRICE!}/g, product.price);
//   output = output.replace(/{!FROM!}/g, product.from);
//   output = output.replace(/{!NUTRIENTS!}/g, product.nutrients);
//   output = output.replace(/{!QUANTITY!}/g, product.quantity);
//   output = output.replace(/{!DESC!}/g, product.description);
//   output = output.replace(/{!ID!}/g, product.id);
//   if (!product.organic) {
//     output = output.replace(/{!NOT_ORGANIC!}/g, "not-organic");
//   }

//   return output;
// };

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
console.log(slugify("Bharani", { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join();
    const output = tempOverview.replace("{!PRODUCT_CARDS!", cardsHtml);
    res.end(output);
  }
  //product page
  else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //API
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);
  }
  //NOT FOUND
  else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end("<h1>page not found</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Server startd...");
});
