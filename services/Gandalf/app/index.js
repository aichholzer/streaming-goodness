import rayo from 'rayo'
import * as fetch from './fetch.mjs'

const { PORT: port = 7510 } = process.env;
rayo({ port })
    .get('/', (req, res) => res.end('Hello, I am Gandalf.'))
    .get('/fetch/strings', fetch.strings)
    .get('/fetch/objects', fetch.objects)
    .get('/fetch/file', fetch.file)
    .start(({ port }) => console.info(`Gandalf is awake now and listening on ${port}`));
