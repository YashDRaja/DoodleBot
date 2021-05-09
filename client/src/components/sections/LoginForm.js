import {Link, useHistory} from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../helpers/AuthContext'
import { React, useState, useContext } from "react";
import { Field, Form, Formik } from "formik";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

export default function LoginForm({
  ...rest
}) {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const handleShowPass = () => setShowPass(!showPass);
  let history = useHistory();
  const { setAuthState } = useContext(AuthContext);

  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "space-around", xl: "space-between" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="no-wrap"
      minH="70vh"
      px={8}
      mb={16}
      {...rest}
    >

      <Box borderRadius="1rem" bg="white" w="100%" p={4} color="primary.300" minW='20vw'>
        <Stack align="center" spacing={4}>
          <Heading
            as="h1"
            size="2xl"
            fontWeight="bold"
            color="primary.400"
            textAlign={["center", "center", "left", "left"]}
          >
            Login
          </Heading>

          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            onSubmit={(values, actions) => {
              axios.post('http://localhost:3001/users/login', {username: values.username, password: values.password}, {withCredentials: true})
              .then((response) => {
                try {
                  if (response.data.error) {
                    setError(true);
                  } else {
                    setAuthState(true);
                    history.push("/");
                  }
                } catch (e) {
                  setError(true);
                }
              })
              actions.setSubmitting(false)
            }}
          >
            {(props) => (
              <Form>
                <Stack align="center" spacing={4} minW="20vw">
                  <Field name="username">
                    {({ field, form }) => (
                      <Input {...field} variant="filled" id="username" placeholder="Username" />
                    )}
                  </Field>
                  <Field name="password">
                    {({ field, form }) => (
                      <InputGroup size="md">
                        <Input
                          {...field}
                          variant="filled"
                          id="password"
                          placeholder="Password"
                          type={showPass ? "text" : "password"}
                        />
                        <InputRightElement>
                            {showPass ? <IconButton onClick={handleShowPass} size="sm" icon={<FaRegEye/>}/> :
                              <IconButton onClick={handleShowPass} size="sm" icon={<FaRegEyeSlash/>}/>}
                        </InputRightElement>
                      </InputGroup>
                    )}
                  </Field>
                  <Link to="/forgotPass"><Box><u>Forgot Password</u></Box></Link>
                  <Button
                    mt={4}
                    colorScheme="green"
                    isLoading={props.isSubmitting}
                    type="Login"
                  >
                    Submit
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
          {
            error ? (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>Error!</AlertTitle>
                <AlertDescription>Invalid username/password combination.</AlertDescription>
              </Alert>
            ) : ''
          }
        </Stack>
      </Box>
    </Flex>
  );
}