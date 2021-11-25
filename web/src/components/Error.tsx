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

import { Box, Flex, Container, Text, Stack, Center, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface ErrorProps {
  name: string;
  message: string;
  stack?: string;
}

export default function ErrorScreen({ name, message, stack }: ErrorProps) {
  const router = useRouter();

  if (message.includes('connect ECONNREFUSED')) {
    return (
      <Box>
        <Flex alignItems="center" justifyContent="center" mt="3rem">
          <Center>
            <Container as={Stack}>
              <Text fontWeight="800" fontFamily="Cantarell" fontSize="2rem">
                Cannot run route {router.asPath} due to Tsubaki not being connected.
              </Text>

              <Text fontFamily="Inter" fontSize="1.5rem">
                This is usually when Fubuki can not point to Tsubaki. If you're using Docker or Kubernetes, read our{' '}
                <Link href="https://docs.arisu.land/selfhosting/troubleshooting" rel="noopener" target="_blank">
                  Troubleshoot Guide
                </Link>{' '}
                before reporting it to the devs. If you're running Fubuki locally, please make sure Tsubaki is running.
                Error will display below:
              </Text>

              <Text fontFamily='"JetBrains Mono"' fontSize="1.5rem" mt="1.6rem">
                {name}: {message}
              </Text>
            </Container>
          </Center>
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <Flex alignItems="center" justifyContent="center" mt="3rem">
        <Center>
          <Container as={Stack}>
            <Text fontWeight="800" fontFamily="Cantarell" fontSize="2rem">
              An unknown exception has occured while loading route {router.asPath}:
            </Text>

            <Text fontFamily="Inter" fontSize="1.5rem">
              You can check the logs where Fubuki is running in. If this a re-occurring issue, please report it to the
              developers. Error will display below:
            </Text>

            <Text fontFamily='"JetBrains Mono"' fontSize="1.5rem" mt="1.6rem">
              {name}: {message}
            </Text>
          </Container>
        </Center>
      </Flex>
    </Box>
  );
}
