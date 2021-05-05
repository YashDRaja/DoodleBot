import { React, useState, useContext } from "react";
import {useHistory} from 'react-router-dom';
import { Field, Form, Formik } from "formik";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Input,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import axios from 'axios';
import { AuthContext } from '../../helpers/AuthContext'

export default function CreateAccountForm({
  title,
  ctaText,
  ...rest
}) {

  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  let history = useHistory();
  const { setAuthState }= useContext(AuthContext);

  const handleShowPass = () => setShowPass(!showPass);

  const validateFirstName = (value) => {
    let error;
    if (!value) {
      error = 'First Name is required!';
    } else if (value.length < 2) {
      error = 'Too Short!';
    } else if (value.length > 50) {
      error = 'Too Long!';
    }
    return error;
  }

  const validateLastName = (value) => {
    let error;
    if (!value) {
      error = 'First Name is required!';
    } else if (value.length < 2) {
      error = 'Too Short!';
    } else if (value.length > 50) {
      error = 'Too Long!';
    }
    return error; 
  }

  const validateEmail = (value) => {
    let error;
    if (!value) {
      error = 'Email is required!';
    } else if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value))) {
      error = 'Invalid email address!';
    }
    return error;
  }

  const validateUsername = (value) => {
    let error;
    if (!value) {
      error = 'Username is required!';
    }
    return error;
  }

  const validatePassword = (value) => {
    let error;
    if (!password || password === '') {
      error = 'Password is required!';
    } else if (password.length < 8) {
      error = 'Password must be at least 8 characters!';
    } else if (password.length > 20) {
      error = 'Password must not be longer than 20 characters!';
    }
    return error;
  }
  
  const validateConfirmPassword = (value) => {
    let error;
    if (!value || value === '') {
      error = 'You must confirm your password!';
    } else if (value !== password) {
      error = 'Passwords must match!';
    }
    return error;
  }

  const handleChange = (event) => setPassword(event.target.value);

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

        <Box borderRadius="1rem" bg="white" w="100%" p={4} color="primary.300" minW='40vw'>
          <Stack align="center" spacing={4}>
            <Heading
              as="h1"
              size="2xl"
              fontWeight="bold"
              color="primary.400"
              textAlign={["center", "center", "left", "left"]}
            >
              Create Account
            </Heading>

            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              onSubmit={(values, actions) => {
                values.password = values.confirmPassword;
                axios.post('http://localhost:3001/users/register', {username: values.username, password: values.password, email: values.email}, {withCredentials: true})
                .then((response) => {
                  if (response.data.error) console.log(response.data.error);
                  console.log(response);
                  setAuthState(true);
                  history.push("/");
                }).catch((err) => {
                  console.log(err);
                })
                actions.setSubmitting(false)

              }}
            >
              {(props) => (
                <Form>
                  <Stack align="center" spacing={4} minW="40vw">
                    <Field name="firstName" validate={validateFirstName}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.firstName && form.touched.firstName}>
                          <Input {...field} variant="filled" id="firstName" placeholder="First Name" />
                          <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="lastName" validate={validateLastName}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.lastName && form.touched.lastName}>
                          <Input {...field} variant="filled" id="lastName" placeholder="Last Name" />
                          <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="email" validate={validateEmail}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.email && form.touched.email}>
                          <Input {...field} variant="filled" id="email" placeholder="Email" />
                          <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="username" validate={validateUsername}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.username && form.touched.username}>
                          <Input {...field} variant="filled" id="username" placeholder="Username" />
                          <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="password" validate={validatePassword}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.password && form.touched.password}>
                          <InputGroup size="md">
                            <Input
                              {...field}
                              variant="filled"
                              value={password}
                              onChange={handleChange}
                              id="password"
                              placeholder="Password"
                              type={showPass ? "text" : "password"}
                            />
                            <InputRightElement>
                                {showPass ? <IconButton onClick={handleShowPass} size="sm" icon={<FaRegEye/>}/> :
                                 <IconButton onClick={handleShowPass} size="sm" icon={<FaRegEyeSlash/>}/>}
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="confirmPassword" validate={validateConfirmPassword}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.confirmPassword && form.touched.confirmPassword}>
                        <InputGroup size="md">
                            <Input
                              {...field}
                              variant="filled"
                              id="confirmPassword"
                              placeholder="Confirm Password"
                              type={showPass ? "text" : "password"}
                            />
                            <InputRightElement>
                                {showPass ? <IconButton onClick={handleShowPass} size="sm" icon={<FaRegEye/>}/> :
                                 <IconButton onClick={handleShowPass} size="sm" icon={<FaRegEyeSlash/>}/>}
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{form.errors.confirmPassword}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Button
                      mt={4}
                      colorScheme="green"
                      isLoading={props.isSubmitting}
                      type="Sign Up"
                    >
                      Submit
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Stack>
        </Box>
    </Flex>
  );
}