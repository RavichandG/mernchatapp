const jwt = require("jsonwebtoken")

function generateToken(userid)
{
    return jwt.sign({userid},"dsjfkjdajfjsjfdafdasfd",{
        expiresIn:"30d"
    })
}

module.exports = generateToken