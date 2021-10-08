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

/**
 * Type alias for representing a resolvable bit of a {@link Bitfield} set.
 */
export type BitResolvable<T extends {}> = string | number | keyof T | Bitfield<T> | BitResolvable<T>[];

/**
 * Represents a {@link Bitfield} class to handle bitwise operations.
 */
export default class Bitfield<T extends {}> {
  static FLAGS: {} = {};
  bits: number = 0;

  /**
   * @param bits The number of bits to use
   */
  constructor(bits: BitResolvable<T> = 0) {
    this.bits = (this.constructor as typeof Bitfield).resolve<T>(bits);
  }

  private static resolve<T extends object>(bits: BitResolvable<T>): number {
    if (bits instanceof Bitfield) return bits.bits;
    if (Array.isArray(bits)) return bits.map((p) => this.resolve(p)).reduce((acc, curr) => acc + curr, 0);

    if (typeof bits === 'string') {
      if (Object.keys(this.FLAGS).find((s) => s === bits)) return this.FLAGS[bits as string];
      if (!Number.isNaN(bits)) return Number(bits);
    }

    if (!isNaN(Number(bits))) return Number(bits);
    throw new RangeError(`Cannot resolve bit "${bits}".`);
  }

  add(...bits: BitResolvable<T>[]) {
    let total = this.bits;
    for (const bit of bits) total |= (this.constructor as typeof Bitfield).resolve(bit);

    if (Object.isFrozen(this)) return new (this.constructor as typeof Bitfield)(this.bits | total);
    this.bits |= total;

    return this;
  }

  remove(...bits: BitResolvable<T>[]) {
    let total = this.bits;
    for (const bit of bits) total |= (this.constructor as typeof Bitfield).resolve(bit);

    if (Object.isFrozen(this)) return new (this.constructor as typeof Bitfield)(this.bits & ~total);
    this.bits &= ~total;

    return this;
  }

  has(bit: BitResolvable<T>) {
    const b = (this.constructor as typeof Bitfield).resolve<T>(bit);
    return (this.bits & b) === b;
  }
}
