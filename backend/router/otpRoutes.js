const nm = require("nodemailer")
const express = require("express")
const router = express.Router()

let savedOtps = {

}

const Router = express.Router()

const transporter = nm.createTransport(
    {
        host: "smtp.gmail.com",
        post : 587,
        secure:false,
        auth:{
           user:"sunnypart95@gmail.com",
           pass:"hwrb swpg wmgz rgkf"
        }
    }
)


router.post("/sendotp",async(req, res)=>{
      let email = req.body.email;
      console.log(email)
      // generate otp 
      let digits = '0123456789';
      let limit = 4;
      let otp = ''
      for (i = 0; i < limit; i++) {
          otp += digits[Math.floor(Math.random() * 10)];
  
      }

      let options = {
        from:"sunnypart95@gmail.com",
        to:`${email}`,
        subject:"OTP verification",
        html: `<p>Enter the otp: ${otp} to verify your email address</p>`
      }

      transporter.sendMail(
        options, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({message:"otp not sent"})
            }
            else {

                savedOtps[email] = otp;
                console.log(savedOtps)
                setTimeout(
                    () => {
                        delete savedOtps.email
                    }, 120000
                )
                res.status(200).json({message:"otp is sent"})
            }

        }
    )
})

router.post("/verify",(req, res)=>{
    const otpReceived = req.body.otp;
    const email = req.body.email;

     console.log("in backend")
     console.log(otpReceived)

    if(otpReceived == savedOtps[email])
        {
            console.log("otp is correct")
            res.status(200).json({message:"otp is correct"})
        }else{
            res.status(500).json({message:"otp is invalid"})
        }
})


module.exports = router