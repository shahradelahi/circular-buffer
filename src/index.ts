export class CircularBuffer<T = number> {
  private readonly buffer: T[];
  private readonly capacity: number;
  private filled = false;
  private writeIndex = 0;

  /**
   * Create a circular buffer of capacity N.
   * Internally, only (N - 1) elements can be stored to disambiguate full vs. empty.
   * @param capacity Total size of the underlying array (must be >= 2)
   */
  constructor(capacity: number) {
    if (capacity < 2) {
      throw new Error('Capacity must be at least 2');
    }
    this.capacity = capacity;
    this.buffer = new Array<T>(capacity);
  }

  /**
   * Returns true if the buffer is empty
   */
  public isEmpty(): boolean {
    return !this.filled && this.writeIndex === 0;
  }

  /**
   * Returns true if the buffer is full
   */
  public isFull(): boolean {
    return this.filled;
  }

  /**
   * Attempts to write an item into the buffer.
   * @param val value to store
   */
  public put(val: T) {
    this.buffer[this.writeIndex] = val;
    this.writeIndex++;
    if (this.writeIndex >= this.capacity) {
      this.writeIndex = 0;
      this.filled = true;
    }
  }

  /**
   * Clears the buffer (resets to empty)
   */
  public clear(): void {
    this.writeIndex = 0;
    this.filled = false;
  }

  /**
   * Returns the number of elements currently stored
   */
  public size(): number {
    if (this.isFull()) {
      return this.capacity;
    }
    return this.writeIndex;
  }

  /**
   * Returns the element at the given index
   * @param index
   */
  public at(index: number): T {
    if (Math.abs(index) > this.size()) {
      throw new Error('Index out of bounds');
    }

    // Negative index is relative to the end of the buffer
    if (index < 0) {
      index = this.size() + index;
    }

    return this.buffer.at(index % this.capacity)!;
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

    for (let i = 0; i < this.size(); i++) {
      yield this.buffer[index]!;
      index = (index + 1) % this.capacity;
    }
  }

  public forEach(callback: (data: T, index: number) => void) {
    let index = 0;
    for (const item of this) {
      callback(item, index++);
    }
  }

  public toArray(): T[] {
    return Array.from(this);
  }
}
