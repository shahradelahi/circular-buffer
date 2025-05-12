# @se-oss/circular-buffer

[![CI](https://github.com/shahradelahi/circular-buffer/actions/workflows/ci.yml/badge.svg)](https://github.com/shahradelahi/circular-buffer/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/@se-oss/circular-buffer.svg)](https://www.npmjs.com/package/@se-oss/circular-buffer)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](/LICENSE)
[![Install Size](https://packagephobia.com/badge?p=@se-oss/circular-buffer)](https://packagephobia.com/result?p=@se-oss/circular-buffer)

A lightweight TypeScript implementation of a fixed-capacity [circular buffer](https://en.wikipedia.org/wiki/Circular_buffer), perfect for rolling windows, and efficient FIFO queues with automatic overwrite on full capacity.

---

- [Installation](#-installation)
- [Usage](#-usage)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#license)

## 📦 Installation

```bash
npm i @se-oss/circular-buffer
```

## 📖 Usage

```typescript
import { CircularBuffer } from '@se-oss/circular-buffer';

// Create a buffer with capacity for 5 items
const buf = new CircularBuffer(5);

// Add some numbers
buf.put(10);
buf.put(20);
buf.put(30);

// Check status
console.log(buf.isEmpty()); // false
console.log(buf.isFull()); // false
console.log(buf.size()); // 3

// Random access
console.log(buf.at(0)); // 10
console.log(buf.at(-1)); // 30

// Iterate in FIFO order
for (const num of buf) {
  console.log(num);
}
// → 10, 20, 30

// Overwrite when full
buf.put(40);
buf.put(50);
buf.put(60); // now full, this overwrites the oldest entry (10)

console.log(buf.toArray());
// → [20, 30, 40, 50, 60]

// Clear it
buf.clear();
console.log(buf.isEmpty()); // true
```

## 📚 Documentation

For all configuration options, please see [the API docs](https://www.jsdocs.io/package/@se-oss/circular-buffer).

## 🔗 References

- [Wikipedia: Circular buffer](https://en.wikipedia.org/wiki/Circular_buffer)

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/circular-buffer).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/circular-buffer/graphs/contributors).
