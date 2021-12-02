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

import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

import BeginScreen from './stages/BeginStageScreen';
import CreateUser from './stages/CreateUserScreen';

type InitStage = 'begin' | 'create_user';

interface InitScreenProps {
  url: string;
}

export default function InitScreen({ url }: InitScreenProps) {
  const [stage, setStage] = useState<InitStage>('begin');
  const router = useRouter();
  let element: ReactNode | null = <BeginScreen onDone={() => setStage('create_user')} url={url} />;

  if (stage === 'create_user') element = <CreateUser url={url} onDone={() => router.push('/login')} />;

  return element as JSX.Element;
}
