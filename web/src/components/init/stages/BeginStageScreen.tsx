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
} from '@chakra-ui/react';

import { Formik, Form, Field } from 'formik';
import type { LoginResult } from '@arisu/typings/typings/graphql';
import validator from 'validator';

const initialValidators = (values: { username: string; password: string }) => {
  const errors: Record<string, any> = {};

  if (!values.username) errors.username = 'Missing username.';
  if (!values.password) errors.password = 'Missing password.';

  return errors;
};

interface BeginStageScreenProps {
  onDone(): void;

  url: string;
}

export default function BeingStageScreen({ onDone, url }: BeginStageScreenProps) {
  const submit = (url: string) => async (values: { username: string; password: string }) => {
    console.log(`username: ${values.username} | password: ${values.password}`);

    const res = await fetch(`${url}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        query: `
          mutation LoginAsAdmin($username: String!, $password: String!) {
            login(password: $password, emailOrUser: $username) {
              success
              token
              errors {
                message
                name
              }
            }
          }
        `,
        variables: values,
      }),
    });

    const data = await res.json();
    if (data.errors !== undefined) {
      console.log(data.errors);
    } else {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('arisu.session', (data.data as LoginResult).token);
      }

      onDone();
    }
  };

  return (
    <Box>
      <Flex alignItems="center" justifyContent="center" height="100vh">
        <Container as={Stack}>
          <Text fontFamily="Cantarell" fontSize="1.2rem" fontWeight="800">
            👋 Welcome to Arisu, fellow developer.
          </Text>

          <Text fontFamily="Inter" fontSize="1rem">
            Before we get started, sign up using the admin user.
          </Text>

          <Formik initialValues={{ username: '', password: '' }} onSubmit={submit(url)} validate={initialValidators}>
            {({ isSubmitting }) => (
              <Form>
                <Field name="username">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.username}>
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <Input {...field} id="name" placeholder="admin" />
                      <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="password">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.password} mt="0.6rem">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Input {...field} id="name" placeholder="admin" type="password" />
                      <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
                  Login!
                </Button>
              </Form>
            )}
          </Formik>
        </Container>
      </Flex>
    </Box>
  );
}
