import { createInterface } from 'readline'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { Transform } from 'stream'
import { createReadStream } from 'fs'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function strings(req, res) {
  const stream = new Transform({
    objectMode: false,
    transform: async (chunk, encoding, callback) => {
      const response = `My name is ${chunk}\n`;
      return callback(null, response);
    }
  });

  stream.on('end', () => res.end());
  stream.pipe(res);

  ['Gandalf', 'Gimli', 'Aragorn', 'Legolas', 'Frodo', 'Sam'].forEach((n) => stream.write(n));
  stream.end();
}

export async function objects(req, res) {
  const stream = new Transform({
    objectMode: true,
    transform: async (chunk, encoding, callback) => {
      const response = { ...chunk, planet: 'earth' };
      return callback(null, JSON.stringify(response));
    }
  });

  stream.on('end', () => res.end());
  stream.pipe(res);

  [
    { name: 'Gandalf', age: 45, type: 'wizard' },
    { name: 'Gimli', age: 52, type: 'dwarf' },
    { name: 'Aragorn', age: 482, type: 'human' },
    { name: 'Legolas', age: 762, type: 'elf' },
    { name: 'Frodo', age: 292, type: 'hobbit' },
    { name: 'Sam', age: 79, type: 'hobbit' }
  ].forEach((n) => stream.write(n));
  stream.end();
}

export async function file(req, res) {
  let index = 0;
  const stream = new Transform({
    objectMode: false,
    transform: async (chunk, encoding, callback) => {
      if (!!!index++) {
        return callback(null, null);
      }

      const response = `${chunk}\n`;
      return callback(null, response);
    }
  });

  const readFile = createInterface({
    input: createReadStream(`${dirname(fileURLToPath(import.meta.url))}/people.csv`)
  });

  stream.pipe(res);
  stream.on('end', () => res.end());
  readFile
      .on('line', (line) => stream.write(line))
      .on('close', () => stream.end());
}
