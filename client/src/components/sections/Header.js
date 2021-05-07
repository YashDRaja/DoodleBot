import { React, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Box, Flex, Text, Button, Menu, MenuButton, Avatar, Spinner, MenuList, MenuItem } from "@chakra-ui/react";
import { FaSignOutAlt, FaUserAlt } from "react-icons/fa"
import Logo from "../ui/Logo";
import axios from 'axios';
import { AuthContext } from '../../helpers/AuthContext'

const MenuLink = ({ children, isLast, to = "/", ...rest }) => {
  
  return (
    <Text
      mb={{ base: isLast ? 0 : 8, sm: 0 }}
      mr={{ base: 0, sm: isLast ? 0 : 8 }}
      display="block"
      {...rest}
    >
      <Link to={to}>{children}</Link>
    </Text>
  );
};

const CloseIcon = () => (
  <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <title>Close</title>
    <path
      fill="white"
      d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24px"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
  >
    <title>Menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
);

const Header = (props) => {
  const [show, setShow] = useState(false);
  const toggleMenu = () => setShow(!show);
  const { authState, setAuthState, authLoading } = useContext(AuthContext);
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      bg={["primary.100", "primary.100", "transparent", "transparent"]}
      color={["white", "white", "primary.500", "primary.500"]}
      {...props}
    >
      <Flex align="center">
        <Link to={"/"}>
          <Logo
            color={["white", "white", "primary.500", "primary.500"]}
          />
        </Link>
      </Flex>

      <Box display={{ base: "block", md: "none" }} onClick={toggleMenu}>
        {show ? <CloseIcon /> : <MenuIcon />}
      </Box>

      <Box
        display={{ base: show ? "block" : "none", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}
      >
        <Flex
          align="center"
          justify={["center", "space-between", "flex-end", "flex-end"]}
          direction={["column", "row", "row", "row"]}
          pt={[4, 4, 0, 0]}
        >
          <MenuLink to="/">Home</MenuLink>
          <MenuLink to="/vs-ai">Vs. AI</MenuLink>
          <MenuLink to="/multiplayer">Multiplayer</MenuLink>
          {!authLoading && (<>
            <Spinner size="lg" color="white"/>
          </>)}
          {!authState && authLoading && (
            <>
              <MenuLink to="/login">Login</MenuLink>
              <MenuLink to="/createAccount">
                <Button
                  size="sm"
                  rounded="md"
                  color={["white", "white", "white", "white"]}
                  bg={["primary.500", "primary.500", "primary.500", "primary.500"]}
                  _hover={{
                    bg: ["primary.800", "primary.800", "primary.800", "primary.800"]
                  }}
                >
                  Create Account
            </Button>
              </MenuLink>
            </>
          )}
          {authState && authLoading && (
            <>
              <Menu
                mb={{ base: 0, sm: 0 }}
                mr={{ base: 0, sm: 0 }}
                display="block">
                <MenuButton style={{ cursor: "pointer" }} src="https://bit.ly/dan-abramov" as={Avatar} />
                <MenuList>
                  <Link to="/account">
                  <MenuItem color="primary.400"><Icon as={FaUserAlt} />&nbsp;Account</MenuItem>
                  </Link>
                  <MenuItem color="primary.400" onClick={async () => {
                    axios.get('http://localhost:3001/users/logout', { withCredentials: true })
                      .then((response) => {
                        if (response.data.error) {
                          console.log(response.data.error);
                        } else {
                          console.log(response);
                          setAuthState(false);
                        }
                      }).catch((err) => {
                        console.log(err);
                      })
                  }}><Icon as={FaSignOutAlt} />&nbsp;Sign out</MenuItem>
                </MenuList>
              </Menu>
            </>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default Header;

