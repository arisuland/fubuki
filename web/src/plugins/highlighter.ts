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

import type { DirectiveBinding } from 'vue/types/options';
import highlight from 'highlight.js';
import Vue from 'vue';

const elBinding = ($el: HTMLElement, binding: DirectiveBinding) => {
  const targets = $el.querySelectorAll('code');
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    if (typeof binding.value === 'string') target.textContent = binding.value;

    highlight.highlightElement(target);
  }
};

Vue.directive('highlight', {
  bind: elBinding,
  componentUpdated: elBinding,
});
