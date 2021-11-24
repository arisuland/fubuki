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

import { Box, Container, Text, useColorModeValue, Stack, Link } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import KubeLogo from './icons/Kubernetes';

export default function Footer() {
  const docker = process.env.docker === 'true' ? <FontAwesomeIcon icon={['fab', 'docker']} /> : null;
  const kube = process.env.kube === 'true' ? <KubeLogo /> : null;

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} color={useColorModeValue('gray.700', 'gray.200')}>
      <Container
        as={Stack}
        maxW="6xl"
        py={4}
        direction={{ base: 'column', md: 'row' }}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>
          Powered by{' '}
          <Link fontWeight="800" href="https://github.com/auguwu/Arisu/tree/master/web" rel="noopener" target="_blank">
            Fubuki
          </Link>
          : v{process.env.version} (commit: {process.env.commit}; build date: {process.env.buildDate}){' '}
          {docker !== null || kube !== null ? ' | ' : null}
          {docker} {kube}
        </Text>
      </Container>
    </Box>
  );
}
