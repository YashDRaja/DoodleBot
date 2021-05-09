import axios from 'axios';
import { React, useState, useContext } from "react";
import { Field, Form, Formik } from "formik";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { AuthContext } from '../../helpers/AuthContext'
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
  FormControl,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useParams } from "react-router"

export default function ResetPassword({
  title,
  ctaText,
  ...rest
}) {
  const [showPass, setShowPass] = useState(false);
  const handleShowPass = () => setShowPass(!showPass);
  const [error, setError] = useState(false);
  let { id } = useParams();
  const { setAuthState } = useContext(AuthContext);
  let history = useHistory();

  const validatePassword = (value) => {
    let error;
    if (!value || value === '') {
      error = 'Password is required!';
    } else if (value.length < 8) {
      error = 'Password must be at least 8 characters!';
    } else if (value.length > 20) {
      error = 'Password must not be longer than 20 characters!';
    }
    return error;
  }

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
            Reset Password
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
              axios.post('http://localhost:3001/users/resetPass', {token: id, password: values.password}, {withCredentials: true})
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
                  <Field name="password" validate={validatePassword}>
                    {({ field, form }) => (
                      <FormControl isInvalid={form.errors.password && form.touched.password}>
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
                        <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
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
                <AlertDescription>This password reset link has expired.</AlertDescription>
              </Alert>
            ) : ''
          }
        </Stack>
      </Box>
    </Flex>
  );
}