const express = require('express');



// Create the Express application
var app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// function middleware1(req,res,next) { 
//     console.log("Hii! I am a middleware!");
//     // next() kullanmazsak, bu middleware'den sonra kullanılacak fonksiyonu çalıştırmaz.
//     next();
// }
// const standardExpressCallback = (req,res,next) => {
//     console.log("I am the standard express callback!");
//     res.send("<h2>Hello Worldd!</h2>");
// }

// Eğer 'middleware1'de 'next()' fonksiyonu yoksa sayfa isteği bir loop'a girer ve sürekli döner.
// Fakat eğer middleware'de 'next' varsa 'standardExpressCallback' fonksiyonuna geçer ve onu da çalıştırır.
// app.get("/",middleware1,standardExpressCallback);


// ----------------------

// Section 2
// Fakat sürekli fonksiyon yazarak programı çok fazla yormamız gerekmez.
// Bu yüzden global bir değer oluştursak ve bu değer her istek attığımızda çalışsa nasıl olur ?
// Bunun için 'app.use()' fonksiyonunu kullanacağız.


app.use(middleware1);

function middleware1(req, res, next) {
    console.log("Hii! I am a middleware!");
    next();
}

function standardExpressCallback(req, res, next) {
    console.log("I am the standard express callback!");
    res.send("<h2>Hello Worldd, I am Express!</h2>");
}

const aboutPage = (req,res,next) => {
    console.log("About Page workinngg");
    res.send("<h3>About Page workings</h3>");
} 

app.get("/", standardExpressCallback);

app.get("/about",aboutPage);


// Server listens on http://localhost:3000
app.listen(3000);