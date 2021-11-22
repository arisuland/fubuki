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
  Button,
  Link,
  Image,
  Text,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';

const NavLink: FC<{ href: string }> = ({ children, href }) => (
  <Link
    px={2}
    py={2}
    rounded="md"
    href={href}
    _hover={{
      textDecoration: 'none',
    }}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { toggleColorMode } = useColorMode();

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>
          <Flex direction="row">
            <Image src="https://cdn.arisu.land/lotus.png" w="45px" height="45px" borderRadius="50%" draggable="false" />
            <Text ml="4" mt="2px" fontWeight="800" fontSize="1.5rem">
              Arisu
            </Text>
          </Flex>
        </Box>

        <Flex alignItems="center">
          <Stack direction="row" spacing="7">
            <Button onClick={toggleColorMode}>
              <FontAwesomeIcon icon={['fas', 'cloud-moon-rain']} />
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
