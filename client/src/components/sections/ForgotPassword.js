import axios from 'axios';
import { React, useState } from "react";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

export default function ForgotPassword({
  ...rest
}) {

  const [checkEmail, setCheckEmail] = useState(false);
  const [error, setError] = useState(false);

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
            Forgot Password
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
              axios.post('http://localhost:3001/users/forgotPass', {username: values.username}, {withCredentials: true})
              .then((response) => {
                try {
                  if (response.data.error) { 
                    setCheckEmail(false);
                    setError(true);
                  } else {
                    setError(false);
                    setCheckEmail(true);
                  }
                } catch (e) {
                  console.log(e);
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
            checkEmail ? (
              <Alert status="info">
                <AlertIcon />
                <AlertTitle mr={2}>Email Sent!</AlertTitle>
                <AlertDescription>Please check your email to reset your password.</AlertDescription>
              </Alert>
            ) : ''
          }
          {
            error ? (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>Error!</AlertTitle>
                <AlertDescription>Username does not exist.</AlertDescription>
              </Alert>
            ) : ''
          }
        </Stack>
      </Box>
    </Flex>
  );
}