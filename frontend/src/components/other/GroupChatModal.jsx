import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
  } from "@chakra-ui/react";
  import { useContext, useState } from "react";
import { ChatContext } from "../../context/ContextProvider";
import UserListItem from "../userAvatar/userListItem";
import UserBadgeItem from "./UserBadgeItem";


const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { user, chats, setChats } = useContext(ChatContext)

  async  function handleSubmit()
    {
        if (!groupChatName || !selectedUsers) {
            toast({
              title: "Please fill all the feilds",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
          }
      
          try {
            
            const response = await fetch(
              `http://localhost:8000/api/chats/group`,{
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                     Authorization: `Bearer ${user.token}`
                },
                body:JSON.stringify({
                    name:groupChatName,
                    users:JSON.stringify(selectedUsers.map((u) => u._id))
                })
              });
              const data = await response.json()
            setChats([data, ...chats]);
            onClose();
            toast({
              title: "New Group Chat Created!",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          } catch (error) {
            toast({
              title: "Failed to Create the Chat!",
              description: error.response.data,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
    }
    function handleDelete(delUser)
    {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    }

    function handleGroup(userToAdd)
    {
        if (selectedUsers.includes(userToAdd)) {
            toast({
              title: "User already added",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
          }

          setSelectedUsers([...selectedUsers, userToAdd]);
    }

   async function handleSearch(query)
    {
        setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      
      const  response  = await fetch(`http://localhost:8000/api/user?search=${search}`,{
        method:"GET",
        headers:{
            Authorization: `Bearer ${user.token}`
        }
    });
     const data  = await response.json()
      console.log(data);
      setLoading(false);
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
    }

  return (
    <>
    <span onClick={onOpen}>{children}</span>

    <Modal onClose={onClose} isOpen={isOpen} >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
             <FormControl> 
               <Input 
                placeholder ="Add Users eg: John, Piyush, Jane"
                mb={1} 
             onChange={(e) => handleSearch(e.target.value)}
              />
             </FormControl>
             <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
             
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">   
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default GroupChatModal