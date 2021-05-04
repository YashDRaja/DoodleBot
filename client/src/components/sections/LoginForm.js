import React from "react";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Input,
} from "@chakra-ui/react";

export default function LoginForm({
  title,
  ctaText,
  ...rest
}) {
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
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                actions.setSubmitting(false)
              }, 1000)
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
                      <Input {...field} variant="filled" id="password" placeholder="Password" />
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