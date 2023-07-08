require('dotenv').config()
const express = require("express")
const cors = require("cors")
const bodyParser =  require("body-parser") 
const morgan  = require("morgan")
const exphbs = require('express-handlebars');
const path = require('path');
const rfs = require('rotating-file-stream')
const email = require("./configs/email");
const slack = require("./configs/slack");
const logger = require('./configs/logtofile');
const { logRequest, LOG_FAILED_REQUEST } = require('./configs/logrequest.js')
const { leaguesRouter } = require('./apis/routers/leagues')
const mongoose = require('mongoose');
const authRoute = require('./apis/routers/auth')
const { handleGetLeagues, getLeagueLinks } = require('./apis/handlers/leagues')


const { PORT, MONGOOSE_DB_URL, EMAIL_FOR_LOGS, NODE_ENV } = process.env


let accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: path.join(__dirname, 'log')
}, { flags: 'a' })


const app = express();
app.get("*",(req, res, next)=>{
    if(
        "https" !== req.headers["x-forwarded-proto"] &&
        "production" === NODE_ENV
    ){
        res.redirect("https://"+ req.hostname + req.url);
    }else{
        next();
    }
})
app.use(morgan('combined', { stream: accessLogStream }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logRequest);

app.use((req, res, next) => {
    req.SEND_EMAIL = email.SEND_EMAIL;
    req.SEND_MESSAGE_TO_SLACK = slack.SEND_MESSAGE_TO_SLACK;
    req.LOGGER = logger;
    req.LOG_FAILED_REQUEST = LOG_FAILED_REQUEST
    return next();
})
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


app.use(express.static(path.join(__dirname, 'public')));
app.use(getLeagueLinks);
app.use('/api/auth', authRoute);
app.use('/leagues', leaguesRouter);

app.get("/", (req, res)=>{
    res.render("pages/index.handlebars", { layout: "index.handlebars", links: req.myLinks});
})

app.get("/login", (req, res) => {
    res.render("pages/login.handlebars", { layout: "sign-in.handlebars", links: req.myLinks });
})
app.get("/signup", (req, res) => {
    res.render("pages/signup.handlebars", { layout: "sign-up.handlebars", links: req.myLinks });
})

app.get("/password_reset", (req, res) => {
    res.render("pages/password_reset.handlebars", { layout: "password_reset.handlebars", links: req.myLinks });
})
app.get("/recover/:token", (req, res) => {
    let token = req.params.token;
    res.render("pages/reset_password_with_token.handlebars", { layout: "reset_password_with_token.handlebars", token, links: req.myLinks });
})

app.get("/dashboard", (req, res) => {
    res.render("pages/dashboard.handlebars", { layout: "dashboard.handlebars", links: req.myLinks });
})

app.get("/dashboard/account-members", (req, res) => {
    res.render("pages/account-members.handlebars", {layout: "dashboard.handlebars", links: req.myLinks });
})
app.get("/dashboard/link/leagues", async (req, res) => {
    let response_data = await handleGetLeagues();
    res.render("pages/league_link.handlebars",  {
        layout: "dashboard.handlebars",
        data: {},
        title: 'Hello',
        response_data: JSON.stringify(response_data), 
        links: req.myLinks
    });
})

app.get("/leagues", async (req, res) => {
    let response_data = []
    try {
        response_data = await handleGetLeagues()
        console.log(response_data);
    } catch (err) {
        req.LOG_FAILED_REQUEST(req, err);
    }
    return res.render("pages/leagues.handlebars", {
        layout: "leagues.handlebars",
        data: {},
        title: 'Hello',
        response_data: JSON.stringify(response_data),
        links: req.myLinks
    }
    )}
);


// ADDING ROUTE TO APP

// Handle unhandled error
app.use((err, req, res, next) => {
    let message2 = LOG_FAILED_REQUEST(req, err);
    let message = email.SEND_EMAIL("DB CONNECTION FAILED", JSON.stringify(err), EMAIL_FOR_LOGS)
    next()
});

try{
    mongoose.connect(MONGOOSE_DB_URL);
    // mongoose.on('error', err => {
    //     let test = email.SEND_EMAIL("DB CONNECTION FAILED", JSON.stringify(err), EMAIL_FOR_LOGS)
    //     let test2 = slack.SEND_MESSAGE_TO_SLACK("codevge_project", `DB CONNECTION FAILED \n ${JSON.stringify(err)}`)
    // });
    // mongoose.on('disconnected', err => {
    //     let test = email.SEND_EMAIL("DB CONNECTION FAILED", JSON.stringify(err), EMAIL_FOR_LOGS)
    //     let test2 = slack.SEND_MESSAGE_TO_SLACK("codevge_project", `DB CONNECTION FAILED \n ${JSON.stringify(err)}`)
    // });
    app.use((err, req, res, next) => {
        console.log("here");
        let message2 = LOG_FAILED_REQUEST(req, err);
        let message = email.SEND_EMAIL("DB CONNECTION FAILED", JSON.stringify(err), EMAIL_FOR_LOGS)
        next()
    });
    app.listen(PORT, () => {
        console.log(`\n================================\n Server started on port: ${PORT}\n================================\n DB Connected\n================================`);
    });
}catch(err){
    console.log(err);
    let test = email.SEND_EMAIL("DB CONNECTION FAILED", JSON.stringify(err), EMAIL_FOR_LOGS)
    let test2 = slack.SEND_MESSAGE_TO_SLACK("codevge_project", `DB CONNECTION FAILED \n ${JSON.stringify(err)}`)
}



// app.listen(PORT, () => {
//     console.log(`\n================================\n Server started on port: ${PORT}\n================================\n DB Connected\n================================`);
// });