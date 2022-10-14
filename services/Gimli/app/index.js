import rayo from 'rayo'
import * as stream from './stream.mjs'

const { PORT: port = 8510 } = process.env;
rayo({ port })
    .get('/', (req, res) => res.end('Hello, I am Gimli.'))
    .get('/stream/strings', stream.strings)
    .get('/stream/objects', stream.objects)
    .get('/stream/file', stream.file)
    .start(({ port }) => console.info(`Gimli is awake now and listening on ${port}`));
