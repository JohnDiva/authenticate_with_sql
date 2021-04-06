/*
utilities file
(i didn't want to clutter the main app.js)
*/
const {User} = require('./fake_models.js')

async function matchCredentials(requestBody) { 
    try{
        const user = await User.findAll({
        where: {
            username: requestBody.username,
            password: requestBody.password
        }
        
    })
    if (requestBody.username === user.username                   //undefined 
        && requestBody.password === user.password) {
            return true 
        } else { 
            return false 
        } 
     } catch(err){
         alert(err)

     }                                        
    }

    module.exports = matchCredentials