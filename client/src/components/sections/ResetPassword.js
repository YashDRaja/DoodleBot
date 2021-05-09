import axios from 'axios';
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
  IconButton
} from "@chakra-ui/react";
import { useParams } from "react-router"

export default function ResetPassword({
  title,
  ctaText,
  ...rest
}) {
  const [showPass, setShowPass] = useState(false);
  const handleShowPass = () => setShowPass(!showPass);
  let { id } = useParams();
  console.log(id);
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
                    console.log(response.data.error);
                  } else {
                    console.log(response);
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
        </Stack>
      </Box>
    </Flex>
  );
}