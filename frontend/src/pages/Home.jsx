import React, { useEffect } from 'react'
import { Container, Box, Tab, TabList, TabPanels, Tabs, TabPanel } from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
import { useNavigate } from 'react-router-dom'


const Home = () => {

  const navigate = useNavigate()
  useEffect(()=>{
    const userData = JSON.parse(localStorage.getItem("userInfo"))
    if(userData)
    {
      navigate("/chats")

    }
  })
  return (
    <Container maxW="xl" centerContent className='mainBlock'>
        
        <div className='mainHeading'><h1>Chatting application</h1></div>
        <div className='mainContent'>
        <Tabs variant='soft-rounded' >
  <TabList>
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Signup</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login></Login>
    </TabPanel>
    <TabPanel>
      <Signup></Signup>
    </TabPanel>
  </TabPanels>
</Tabs>
        </div>
        
        
    </Container>
  )
}

export default Home