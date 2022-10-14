import { request } from 'http'
import { Transform } from 'stream'

const exec = (options, stream) => {
  const req = request({ ...options, host: 'gimli', 'port': 8510 }, (response) => response.pipe(stream));
  req.end();
};

export async function strings(req, res) {
  const stream = new Transform({
    objectMode: false,
    transform: async (chunk, encoding, callback) => {
      const response = chunk.toString().replace('My', 'His');
      return callback(null, response);
    }
  });

  stream.on('data', (chunk) => res.write(chunk));
  stream.on('end', () => res.end());
  exec({ path: '/stream/strings' }, stream);
}

export async function objects(req, res) {
  const stream = new Transform({
    objectMode: false,
    transform: async (chunk, encoding, callback) => {
      const response = { ...JSON.parse(chunk.toString()), alive: true };
      return callback(null, JSON.stringify(response));
    }
  });

  stream.on('data', (chunk) => res.write(chunk));
  stream.on('end', () => res.end());
  exec({ path: '/stream/objects' }, stream);
}

export async function file(req, res) {
  const stream = new Transform({
    objectMode: false,
    transform: async (chunk, encoding, callback) => {
      return callback(null, `> ${chunk}`);
    }
  });

  stream.on('data', (chunk) => res.write(chunk));
  stream.on('end', () => res.end());
  exec({ path: '/stream/file' }, stream);
}
