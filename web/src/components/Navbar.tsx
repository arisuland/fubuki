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
  Menu,
  MenuList,
  MenuButton,
  Avatar,
  Center,
  MenuDivider,
  MenuItem,
  IconButton,
  HStack,
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
    <Box bg={useColorModeValue('gray.200', 'gray.900')} px={4} as="nav">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          aria-label="mobile dropdown"
          size="md"
          icon={isOpen ? <FontAwesomeIcon icon={['fas', 'times']} /> : <FontAwesomeIcon icon={['fas', 'bars']} />}
          onClick={isOpen ? onClose : onOpen}
          display={{ md: 'none' }}
        />

        <HStack spacing={6} alignItems="center" as="nav" display={{ base: 'none', md: 'flex' }}>
          <Box ml="0.5rem">
            <Flex direction="row">
              <Image
                src={process.env.NEXT_PUBLIC_SITE_ICON ?? 'https://cdn.arisu.land/lotus.png'}
                w="45px"
                height="45px"
                borderRadius="50%"
                draggable="false"
              />

              <Text ml="4" mt="2px" fontWeight="800" fontSize="1.5rem">
                {process.env.NEXT_PUBLIC_SITE_NAME ?? 'Arisu'}
              </Text>
            </Flex>
          </Box>

          <NavLink href="/">
            <Text fontWeight="700" fontSize="0.95rem">
              Home
            </Text>
          </NavLink>

          <NavLink href="https://docs.arisu.land">
            <Text fontWeight="700" fontSize="0.95rem">
              Docs
            </Text>
          </NavLink>
        </HStack>

        <Flex alignItems="center">
          <Stack direction="row" spacing="7">
            <Button onClick={toggleColorMode} mt="0.3rem">
              <FontAwesomeIcon icon={['fas', 'cloud-moon-rain']} />
            </Button>

            <Menu>
              <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
                <Avatar size="md" src={'https://cdn.floofy.dev/art/icons/icon_cinnamonserval.png'} />
              </MenuButton>
              <MenuList alignItems="center">
                <Center>
                  <Text fontWeight="800" fontSize="1.2rem">
                    Noel 🌺
                  </Text>
                </Center>
                <MenuDivider />
                <Link _hover={{ textDecoration: 'none' }} href="/@me">
                  <MenuItem>Account</MenuItem>
                </Link>
                <MenuItem>Project Dashboard</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={4}>
            <NavLink href="/">
              <Text fontWeight="700" fontSize="0.95rem">
                Home
              </Text>
            </NavLink>

            <NavLink href="https://docs.arisu.land">
              <Text fontWeight="700" fontSize="0.95rem">
                Docs
              </Text>
            </NavLink>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
