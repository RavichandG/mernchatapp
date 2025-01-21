import React, { useEffect,useState, useRef } from 'react'
import './otp.css'
import { useContext } from 'react'
import { OtpContext } from '../../context/OtpContext'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const OtpPage = () => {
    const {nameFromUser,  setNameFromUser, emailFromUser, setEmailFromUser, passwordFromUser, setPasswordFromUser} = useContext(OtpContext)
    const navigate = useNavigate()
    const number1Ref = useRef()
    const number2Ref = useRef()
    const number3Ref = useRef()
    const number4Ref = useRef()
    const toast = useToast()
    

    async function verifyOtp()
     {
        if(number1Ref.current.value && number2Ref.current.value  && number3Ref.current.value  && number4Ref.current.value )
            {
                const OtpNumberFromUser = Number(`${number1Ref.current.value}${number2Ref.current.value}${number3Ref.current.value}${number4Ref.current.value}`)
                 console.log(OtpNumberFromUser)
                const response = await fetch("http://localhost:8000/api/otp/verify",{
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                         email:emailFromUser,
                         otp:OtpNumberFromUser
                    })
                 })
                 const data = await response.json()
                 if(response.status==200)
                    { 
                          console.log("all done with otp")
                          register()
                    }else{
                        toast({
                            title:"Error Occured !",
                            description:"OTP is wrong",
                            duration:5000,
                            status:"error",
                            position:"bottom",
                            isClosable:true
                           })
                    }
            
              }
            }
               
     


     

   function nextFocusToNum2()
   {
    number2Ref.current.focus()
   }
   function nextFocusToNum3()
   {
    number3Ref.current.focus()
   }
   function nextFocusToNum4()
   {
    number4Ref.current.focus()
   }

   function focusToNum1()
   {
    number1Ref.current.focus()
   }
   


    useEffect(()=>{
      console.log(emailFromUser)
      console.log(passwordFromUser)
      console.log(nameFromUser)
    },[])
  return (
    <div>
      
      <div className="container m-4">
        <h3 className="text-primary center">OTP Verification</h3>
        
        <div className="success text-success">
            OTP verified Success fully
        </div>

        <div className="verification">
            <div className="title center">
                <p>An OTP has been sent to <span className="emailpartial">{emailFromUser}</span></p>
            </div>
            <div className="otp-input-fields">
                <input type="number" className="otp_num otp_num_1"  ref={number1Ref} onChange={verifyOtp} onKeyUp={(e)=>nextFocusToNum2()}/>
                <input type="number" className="otp_num otp_num_2"  ref={number2Ref} onChange={verifyOtp} onKeyUp={(e)=>e.key==="Backspace"?focusToNum1():nextFocusToNum3()}/>
                <input type="number" className="otp_num otp_num_3"  ref={number3Ref} onChange={verifyOtp} onKeyUp={(e)=>e.key==="Backspace"?nextFocusToNum2():nextFocusToNum4()}/>
                <input type="number" className="otp_num otp_num_4"  ref={number4Ref} onChange={verifyOtp} onKeyUp={(e)=>e.key==="Backspace"&&nextFocusToNum3()}/>
            </div>
        </div>
        <div className="error text-danger">
            Invalid otp
        </div>
    </div>

    </div>
 


  )
}

export default OtpPage