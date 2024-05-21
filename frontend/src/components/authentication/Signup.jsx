import React, { useContext } from 'react'
import  { useState } from 'react'
import { PinInputDescendantsProvider, VStack } from '@chakra-ui/react'
import { FormControl } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { FormLabel } from '@chakra-ui/react'
import { InputGroup } from '@chakra-ui/react'
import { InputRightElement,Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom"
import { OtpContext } from '../../context/OtpContext'

const Signup = () => {
    const {nameFromUser,  setNameFromUser, emailFromUser, setEmailFromUser, passwordFromUser, setPasswordFromUser} = useContext(OtpContext)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setpassword] = useState()
    const [confirmpassword, setConfirmpassword] = useState()
    let regex = new RegExp('[a-zA-Z0-9]+@[a-z]+\.[a-z]{2,3}');
    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    function ShowPassword()
    {
        if(show===false)
        {
            setShow(true)
        }else{
            setShow(false)
        }
            
    }

    function ShowPassword2()
    {
        if(show2===false)
        {
            setShow2(true)
        }else{
            setShow2(false)
        }
    }
   async  function submitSignup()
    {
        setLoading(true)
        if(!nameFromUser || !emailFromUser || !passwordFromUser || !confirmpassword)
        {
            toast({
                title:"Enter All Fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            setLoading(false)
            return
        }

        if(passwordFromUser!==confirmpassword)
        {
            toast({
                title:"Password is different in Confirm password",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            return
        }

        try{
             if(regex.test(emailFromUser))
                {
                  const response = await  fetch("http://localhost:8000/api/otp/sendotp",{
                        method:"POST",
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body:JSON.stringify({
                            email:emailFromUser
                        })
                    })
                    if(response.status ==200)
                        {
                            setLoading(false)
                            const data = await response.json();
                            console.log(data)
                            navigate("/verification")
                        }
                            
                            
                        
                }else{
                    toast({
                        title:"Error Occured !",
                        description:"Enter Valid Email",
                        duration:5000,
                        status:"error",
                        position:"bottom",
                        isClosable:true
                       })
                       setLoading(false)
                }
              
        }catch(e)
        {
            toast({
             title:"Error Occured !",
             description:e.message,
             duration:5000,
             status:"warning",
             position:"bottom",
             isClosable:true
            })
            setLoading(false)
        }
    }
    
  /*   function postDetails(pic)
    {
         setLoading(true)
         if(!pic)
         {
            toast({
                title: 'Please Select Valid Image',
            
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom"
              })
              return
         }

    } */

  return (
    <VStack spacing="5px">
        <FormControl id="name" isRequired className='formElement'>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter your name' border="2px solid black" onChange={(e)=>setNameFromUser(e.target.value)} fontWeight="500" color="black" fontSize='1.5rem'></Input>
        </FormControl>

        <FormControl id="email" isRequired className='formElement'>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Email' border="2px solid black" onChange={(e)=>setEmailFromUser(e.target.value)} fontWeight="500" color="black" fontSize='1.5rem'></Input>
        </FormControl>

        <FormControl id="password" isRequired className='formElement'>
        <FormLabel>Password</FormLabel>
            <InputGroup>
          
            <Input placeholder='Enter your name' border="2px solid black" onChange={(e)=>setPasswordFromUser(e.target.value)} fontWeight="500" color="black" fontSize='1.5rem' type={show?'text':'password'} width="80%"></Input>
             <InputRightElement width="20%">
                <Button padding="10px" backgroundColor="black" paddingBlock={"10px"} width="100%" color="white" _hover={{backgroundColor:"black"}} onClick={ShowPassword}>
                    {show?"Hide":"Show"}
                </Button>
             </InputRightElement>
            </InputGroup>
            </FormControl>

        <FormControl id="confrimpassword" isRequired className='formElement'>
            <FormLabel>Confirm Password</FormLabel>

            <InputGroup>
            <Input placeholder='Enter your name' border="2px solid black" onChange={(e)=>setConfirmpassword(e.target.value)} fontWeight="500" color="black" fontSize='1.5rem' type={show2?'text':'password'}></Input>
            <InputRightElement width="20%">
                <Button padding="10px" backgroundColor="black" paddingBlock={"10px"} width="100%" color="white" _hover={{backgroundColor:"black"}} onClick={ShowPassword2}>
                    {show2?"Hide":"Show"}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
            

      {/*   <FormControl id="setpic" isRequired className='formElement'>
            <FormLabel>Set Profile Picture</FormLabel>
            <Input type='file' p={1.5} accept='image/*' onChange={(e)=>postDetails(e.target.files[0])}></Input>
        </FormControl> */}

       <Button width='90%' marginTop="20px" onClick={submitSignup} backgroundColor="black" color="white">Signup</Button>
    </VStack>
  )
  
}

export default Signup