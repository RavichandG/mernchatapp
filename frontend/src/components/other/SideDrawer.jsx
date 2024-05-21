import React, { useContext, useState } from 'react'
import { Tooltip } from '@chakra-ui/react'
import { Button, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import { FaSearch } from "react-icons/fa";
import ProfileDiv from './ProfileDiv';
import { ChatContext } from '../../context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import { Drawer,useDisclosure,DrawerOverlay,DrawerContent,DrawerHeader,DrawerBody,Box,Input } from '@chakra-ui/react';
import ChatLoading from './ChatLoading';
import { Spinner } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
import UserListItem from '../userAvatar/userListItem';

const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()

  const {user,chats, setChats,selectedChats, setSelectedChats} = useContext(ChatContext)
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  function removeuser()
  {
    localStorage.removeItem("userInfo")
    navigate("/")
  }
  const handleSearch = async () => {
   const token = user.token
   console.log(token)
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);


      const  response  = await fetch(`http://localhost:8000/api/user?search=${search}`,{
        method:"GET",
        headers:{
          Authorization: `Bearer ${user.token}`,
        }
      });
       const  data = await response.json()
      setLoading(false)
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

 async function accessChat(userId)
  {
    try{
      setLoadingChat(true)
      
      console.log("inside access fetch")
      const response = await fetch("http://localhost:8000/api/chats",{
        method:"POST",
        headers:{
          'Content-Type':"application/json",
          Authorization: `Bearer ${user.token}`
        },
        body:JSON.stringify({userId:userId})
      })
      const data = await response.json()

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChats(data);
      setLoadingChat(false)
      onClose()
    }catch(e)
    {
      toast({
        title: "Error Occured!",
        description: e.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  
  return (
    <div className='SideDrawer'>
      <Tooltip label="search users" hasArrow placement='bottom-end'>
        <Button variant="ghost" onClick={onOpen}><FaSearch />
        <Text d={{ base: "none", md: "flex" }} px={4}>
          Search user
        </Text></Button>
        
      </Tooltip>

      
        <div>
          <Menu>
               <MenuButton p={1}>
                <BellIcon fontSize="2xl" m={1}></BellIcon>
               </MenuButton>
          </Menu>

          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
              />
            </MenuButton>
             <MenuList>
              <ProfileDiv user={user}>
              <MenuItem>My Profile</MenuItem>
              </ProfileDiv>
                    
                     <MenuDivider></MenuDivider>
                     <MenuItem onClick={removeuser}>Logout</MenuItem>
             </MenuList>
           </Menu> 
        </div>
        
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}> 
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
         
          <DrawerBody>
            <Box d="flex" >
              <Input
                placeholder="Search by name"
                margin={1}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              width="70%" />
              <Button  onClick={handleSearch} margin={1}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
          </DrawerContent>
      </Drawer>
    </div>

    
  )
}

export default SideDrawer