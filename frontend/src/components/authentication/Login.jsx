import React from 'react'
import  { useState } from 'react'
import { VStack } from '@chakra-ui/react'
import { FormControl } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { FormLabel } from '@chakra-ui/react'
import { InputGroup } from '@chakra-ui/react'
import { InputRightElement,Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setpassword] = useState()
    const [loading, setLoading] = useState(false)
     const toast = useToast()
    const [show, setShow] = useState(false)
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

   async function submitLogin()
    {
        setLoading(true);
        try{ 
           const response = await fetch("http://localhost:8000/api/user/login",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
           })
           const data = await response.json();

           if(response.ok)
           {
            localStorage.setItem("userInfo",JSON.stringify(data))
            toast({
                title:"Login Completed",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            navigate('/chats')
           }

           setLoading(false)
        }catch(e)
        {
            toast({
                title:"Error Occured!",
                status:"warning",
                description:e.message,
                position:"bottom",
                duration:5000,
                isClosable:true
            })
            setLoading(false)
        }
    }

   

  return (
    <VStack spacing="5px">
       {/* <FormControl id="first-name" isRequired className='formElement'>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter your name' onChange={(e)=>setName(e.target.value)} fontWeight="500" color="black" fontSize='1.5rem'></Input>
        </FormControl>*/}

        <FormControl id="emailforlogin" isRequired className='formElement'>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Email' onChange={(e)=>setEmail(e.target.value)} fontWeight="500" color="black" fontSize='1.5rem' border="2px solid black"></Input>
        </FormControl>

        <FormControl id="passwordforlogin" isRequired className='formElement'>
        <FormLabel>Password</FormLabel>
            <InputGroup>
          
            <Input placeholder='Enter your name'  border="2px solid black" onChange={(e)=>setpassword(e.target.value)} fontWeight="500" color="black" fontSize='1.5rem' type={show?'text':'password'} width="80%"></Input>
             <InputRightElement width="20%">
                <Button padding="10px" backgroundColor="black" paddingBlock={"10px"} width="100%" color="white" _hover={{backgroundColor:"black"}} onClick={ShowPassword}>
                    {show?"Hide":"Show"}
                </Button>
             </InputRightElement>
            </InputGroup>
            </FormControl>

       
            


       <Button width='90%' marginTop="20px" onClick={submitLogin} isLoading={loading} backgroundColor="black" color="white">Login</Button>
    </VStack>
  )
  
}

export default Login