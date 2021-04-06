const express = require('express')
const cookieParser = require("cookie-parser")
const { v4: uuidv4 } = require('uuid');
const matchCredentials = require('./utils.js')
const app = express()

const {User}  = require('./fake_models.js')

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))


app.get('/', function(req, res){
    res.render('pages/home')
})

//create a user account

app.post('/create', async function(req,res){
  let errors = []
  if (req.body.username.length === 0) {
    let msg = "u need a username"
    errors.push(msg)
 }
    
  if (req.body.password.length === 0) {
    let msg = "u need a password"
    errors.push(msg)
 }
    
  if (errors.length === 0) {
    let body =req.body
    const user = await User.create({
        username: body.username,
        password: body.password,
        session_id: null,
        timeoflogin:null
 })
 console.log(user.session_id)

    res.redirect('/')
}
 else {
     res.redirect('/error')
 }

})

//login
app.post('/login', async function(req,res){
    if(matchCredentials(req.body)) {
        
       let id = uuidv4()
       let _timeOfLogin = Date.now();

      
       
       const user = await User.create({session_id: null})
        user.session_id= id
        await user.save();
        console.log(user.session_id)
    


        // create cookie that holds the UUID (the Session ID) 
        res.cookie('SID', id, { 
            expires: new Date(Date.now() + 900000),
            httpOnly: true 
        })

        res.cookie('LogT', _timeOfLogin, { 
            expires: new Date(Date.now() + 900000),
            httpOnly: true 
        })

        res.render('pages/members')
    } else { 
        res.redirect('/error') }

})

//this is the protected route
app.get('/supercoolmembersonlypage',async function(req, res){ 
    let id = req.cookies.SID;


    
    const user= await User.findOne({
        where:{
            session_id: id
        }
    })
          console.log(user.session_id)

    if (user.session_id !== undefined || user.session_id !== null || user.session_id === id){
        res.render('pages/members') 
    }
    else {
        res.render('pages/error') 
    }


    
})



// if something went wrong, you get sent here
 app.get('/error', function(req, res){ 
     res.render('pages/error') 
    })



app.get('/logout', function(req,res){
   
    let id = req.cookies.SID;

    (async () =>{
    await User.destroy({
        where: {
            session_id :id          
        }
    })
    })()

    res.cookie('SID','', { 
        expires: new Date(Date.now()),
        httpOnly: true 
    })

    res.redirect('/')

    
})


//  404 handling 
app.all('*', function(req, res){ 
    res.render('pages/error') 
})





app.listen(1612)

console.log("listening to port 1612")

 