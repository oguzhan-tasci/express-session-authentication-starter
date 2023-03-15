const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo')(session);
/*
'session' ve 'cookie' arasındaki fark nedir?
    Temel fark verilerin depolandığı yerdir.
    Cookie verileri tarayıcıda saklar ve her http isteğine key-value değerini bağlar.
    Session is sunucu tarafında(server-side) yani express'te verilerini tutar.
    Server-side oldukça avantajlıdı çünkü ulaşması zordur bu yüzden gizli bilgileri tutabiliriz ama cookie için aynısı söylenemez.
*/

// Create the Express application
var app = express();
// <user>:<password>@
const dbString = 'mongodb://localhost:27017/tutorial_db';
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const connection = mongoose.createConnection(dbString, dbOptions,() => {
    console.log("Database have connected!");
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const sessionStore = new MongoStore({ 
    mongooseConnection: connection, 
    collection: 'sessions' 
});

app.use(session({
    secret: 'some secret',
    resave: false, // resave ve saveUninitialized parametreleri, farklı tetiklemelerde nasıl tepki vereceğini belirttiğimiz yerdir.
    saveUninitialized: true,  // örneğin bir değişiklik olmadı veya oldu.
    store: sessionStore,
    // Geçen derste gördüğümüz gibi cookie'nin expire,signed,httpOnly,path,secure,sameSite gibi özellikleri vardır.
    // Bunlar içinde biz en ilgilenlerden biri 'expire'dır.
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));

// Ana sayfaya istek attığımız zaman cookie bölümünde "connect.sid" ve onun value değerini görüyoruz.(connect.sid default değerdir).
app.get("/", (req,res,next) => {
    console.log(req.session);
    res.send("<h1>Hello World! Take a look to the cookies!</h1>");
})

// Session'a bizlerde parametreler ekleyip neler olup bittiğinden haberdar olabiliriz.
// About sayfasına kaç kere girildiğini hesaplamak için aşağıdaki işlemi yapıyoruz.
// Bilgileri takip etmek için oldukça önemli olduğunu görüyoruz...
app.get('/about', (req, res, next) => {
    
    if (req.session.oguzhanCount) {
        req.session.oguzhanCount = req.session.oguzhanCount + 1;
    } else {
        req.session.oguzhanCount = 1;
    }

    res.send(`<h1>You have visited this page ${req.session.oguzhanCount} times.</h1>`)
});



app.listen(3000);