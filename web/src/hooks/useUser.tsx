/**
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

import { createContext, useContext } from 'react';
import type { User } from '@arisu/typings';

//                               set initial data to null
const UserContext = createContext<User | null>(null);

/**
 * Returns a re-usuable React hook to get the user signed in, if any. This is
 * just a simplier way of using {@link useContext}({@link UserContext}) hook.
 */
export const useUser = useContext(UserContext);

/**
 * Represents a functional React component to be able to use the {@link useUser} React
 * hook. This will apply the data and is applied in `web/src/_app.tsx`
 */
export const UserProvider: React.FC = () => {
  // I think it's safe to use this... right?
  let item = localStorage.getItem('arisu.session');
  if (item !== null) item = JSON.parse(item);

  return <UserContext.Provider value={item as User | null}></UserContext.Provider>;
};
