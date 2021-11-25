/*
 * ☔ Arisu: Translation made with simplicity, yet robust.
 * Copyright (C) 2020-2021 Noelware
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
  Box,
  Flex,
  Container,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

import { Formik, Form, Field } from 'formik';
import type { LoginResult } from '@arisu/typings/typings/graphql';
import validator from 'validator';
import { useState } from 'react';

const initialValidators = (values: { username: string; password: string; email: string }) => {
  const errors: Record<string, any> = {};

  if (!values.username) errors.username = 'Missing username.';
  if (!values.password) errors.password = 'Missing password.';
  if (!values.email) errors.email = 'No email was provided.';

  if (values.email && !validator.isEmail(values.email)) errors.email = 'Invalid email supplied.';

  return errors;
};

interface CreateUserScreenProps {
  onDone(): void;

  url: string;
}

export default function BeingStageScreen({ onDone, url }: CreateUserScreenProps) {
  const [errors, setErrors] = useState<any>(null);

  const submit = (url: string) => async (values: { username: string; password: string; email: string }) => {
    console.log(`username: ${values.username} | password: ${values.password} | email: ${values.email}`);

    const res = await fetch(`${url}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        query: `
          mutation CreateUser($username: String!, $password: String!, $email: String!) {
            createUser(input: { username: $username, password: $password, email: $email }) {
              username
              id
            }
          }
        `,
        variables: values,
      }),
    });

    const data = await res.json();
    if (data.errors !== undefined) {
      setErrors(data.errors);
    } else {
      if (typeof window !== 'undefined') window.localStorage.removeItem('arisu.session');
      onDone();
    }
  };

  return (
    <Box>
      <Flex alignItems="center" justifyContent="center" height="100vh">
        <Container as={Stack}>
          <Text fontFamily="Cantarell" fontSize="1.2rem" fontWeight="800">
            Nice job!
          </Text>

          <Text fontFamily="Inter" fontSize="1rem">
            Let's create a user in the database so we can initialize Arisu.
          </Text>

          <Formik
            initialValues={{ username: '', password: '', email: '' }}
            onSubmit={submit(url)}
            validate={initialValidators}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field name="email">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.email} mt="0.6rem">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input {...field} id="email" placeholder="uwu@arisu.land" type="email" />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="username">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.username} mt="0.6rem">
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <Input {...field} id="name" placeholder="noel" />
                      <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="password">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.password} mt="0.6rem">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Input {...field} id="name" placeholder="blep!" type="password" />
                      <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {errors !== null ? (
                  <Box px={2} py={1} mt={6} bg={useColorModeValue('red.200', 'red.600')} rounded="6px">
                    {errors.map((s: any) => (
                      <Text fontFamily='"JetBrains Mono"'>{s.message}</Text>
                    ))}
                  </Box>
                ) : null}

                <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
                  Create!
                </Button>
              </Form>
            )}
          </Formik>
        </Container>
      </Flex>
    </Box>
  );
}
