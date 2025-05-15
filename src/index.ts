export class CircularBuffer<T = number> {
  private readonly buffer: T[];
  private readonly capacity: number;
  private filled = false;
  private writeIndex = 0;

  /**
   * CircularBuffer stores up to `capacity` elements in a FIFO manner.
   * Internally uses an array of length `capacity`, overwriting oldest values when full.
   * @template T Type of items stored (defaults to `number`).
   * @param capacity Total slots in the buffer (must be >= 2).
   * @throws {Error} If capacity is less than 2.
   *
   * @example
   * ```ts
   * // Create a buffer for 5 numbers
   * const buf = new CircularBuffer<number>(5);
   * buf.put(10);
   * buf.put(20);
   * console.log(buf.size()); // 2
   * ```
   */
  constructor(capacity: number) {
    if (capacity < 2) {
      throw new Error('Capacity must be at least 2');
    }
    this.capacity = capacity;
    this.buffer = new Array<T>(capacity);
  }

  /**
   * Check whether the buffer has no elements.
   * @returns `true` if empty, `false` otherwise.
   *
   * @example
   * ```ts
   * const buf = new CircularBuffer<string>(3);
   * console.log(buf.isEmpty()); // true
   * buf.put('a');
   * console.log(buf.isEmpty()); // false
   * ```
   */
  public isEmpty(): boolean {
    return !this.filled && this.writeIndex === 0;
  }

  /**
   * Check whether the buffer has wrapped around and is full.
   * @returns `true` if full, `false` otherwise.
   *
   * @example
   * ```ts
   * const buf = new CircularBuffer<number>(3);
   * buf.put(1).put(2).put(3);
   * console.log(buf.isFull()); // true
   * ```
   */
  public isFull(): boolean {
    return this.filled;
  }

  /**
   * Insert a value at the next write position. Overwrites oldest if buffer was full.
   * @param val Item to store.
   * @returns The buffer instance (chainable).
   *
   * @example
   * ```ts
   * const buf = new CircularBuffer<number>(3);
   * buf.put(1).put(2).put(3);
   * console.log(buf.toArray()); // [1, 2, 3]
   * buf.put(4);
   * console.log(buf.toArray()); // [2, 3, 4] // 1 overwritten
   * ```
   */
  public put(val: T): this {
    this.buffer[this.writeIndex] = val;
    this.writeIndex++;
    if (this.writeIndex >= this.capacity) {
      this.writeIndex = 0;
      this.filled = true;
    }
    return this;
  }

  /**
   * Insert a value at an arbitrary index relative to the start of stored data.
   * @param val Item to store.
   * @param index Index within current data (supports negative indexing).
   * @returns The buffer instance (chainable).
   * @throws {Error} If index is out of bounds.
   *
   * @example
   * ```ts
   * const buf = new CircularBuffer<string>(4);
   * buf.put('a').put('b').put('c');
   * buf.putAt('x', 1);
   * console.log(buf.toArray()); // ['a', 'x', 'c']
   * ```
   */
  public putAt(val: T, index: number): this {
    this.buffer[this.relativeIndex(index)] = val;
    return this;
  }

  /**
   * Remove all contents, resetting to empty state.
   * @returns The buffer instance (chainable).
   *
   * @example
   * ```ts
   * const buf = new CircularBuffer<number>(3);
   * buf.put(1).put(2);
   * buf.clear();
   * console.log(buf.isEmpty()); // true
   * ```
   */
  public clear(): this {
    this.writeIndex = 0;
    this.filled = false;
    return this;
  }

  /**
   * Number of elements currently stored in FIFO order.
   * @returns Count between `0` and `capacity`.
   *
   * @example
   * ```ts
   * const buf = new CircularBuffer(3);
   * buf.put(1);
   * console.log(buf.size()); // 1
   * ```
   */
  public size(): number {
    if (this.isFull()) {
      return this.capacity;
    }
    return this.writeIndex;
  }

  /**
   * Access stored item by index (supports negative indexing).
   * @param index Index within current data.
   * @returns Item at that position.
   * @throws {Error} If index is out of bounds.
   *
   * @example
   * ```ts
   * const buf = new CircularBuffer<string>(3);
   * buf.put('one').put('two');
   * console.log(buf.at(0));  // 'one'
   * console.log(buf.at(-1)); // 'two'
   * ```
   */
  public at(index: number): T {
    return this.buffer.at(this.relativeIndex(index))!;
  }

  [Symbol.iterator]() {
    return this.iterator();
  }

  private *iterator(): IterableIterator<T> {
    if (!this.isFull()) {
      for (let i = 0; i < this.writeIndex; i++) {
        yield this.buffer[i]!;
      }
      return;
    }

    let index = this.writeIndex;
    for (let i = 0; i < this.capacity; i++) {
      yield this.buffer[index]!;
      index = (index + 1) % this.capacity;
    }
  }

  /**
   * Execute a callback for each element in FIFO order.
   * @param callback Called with (value, index) for each stored item.
   *
   * @example
   * ```ts
   * const buf = new CircularBuffer<number>(3);
   * buf.put(10).put(20);
   * buf.forEach((v, i) => console.log(i, v));
   * // Logs: 0 10 \n 1 20
   * ```
   */
  public forEach(callback: (data: T, index: number) => void): void {
    let idx = 0;
    for (const item of this) {
      callback(item, idx++);
    }
  }

  /**
   * Convert buffer contents to a linear array in FIFO order.
   * @returns New array of stored items.
   *
   * @example
   * ```ts
   * const buf = new CircularBuffer<number>(3);
   * buf.put(5).put(6).put(7);
   * console.log(buf.toArray()); // [5, 6, 7]
   * ```
   */
  public toArray(): T[] {
    return Array.from(this);
  }

  private relativeIndex(index: number): number {
    if (Math.abs(index) > this.capacity) {
      throw new Error(
        `Index out of bounds: ${index} not in valid range ` +
          `[${this.capacity > 0 ? 0 : 0}..${this.capacity > 0 ? this.capacity - 1 : 0}] or ` +
          `[-${this.capacity}..-1]`
      );
    }

    if (index < 0) {
      index = this.size() + index;
    }

    if (!this.isFull()) {
      return index;
    }

    return (index + this.writeIndex) % this.capacity;
  }
}
