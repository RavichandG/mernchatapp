
import { useDisclosure } from '@chakra-ui/hooks'
import { Modal,ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { Text } from '@chakra-ui/react'
import { useContext } from 'react'

const ProfileDiv = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

   
 
  return (
    <>{children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="100px"
              src={user.pic}
             
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme='blue' mr={3}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      </>
  )
}

export default ProfileDiv