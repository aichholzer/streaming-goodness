# Streaming goodies

There are two services; `Gandalf` and `Gimli`.<br />
They both expose a streamable API and while `Gimli` produces data, `Gandalf` consumes it.


### Take them for a spin

```bash
$> git clone https://github.com/aichholzer/streaming-goodness.git ./streaming-goodness
$> cd streaming-goodness
$> docker compose up
```

And the services are ready for you:

```bash
gandalf  | Gandalf is awake now and listening on 7510
gimli    | Gimli is awake now and listening on 8510
```

`Gimli` exposes three endpoints:
* `/stream/strings`
* `/stream/objects`
* `/stream/file`

and each one of these will stream its response from locally produced data.<br />

> Visiting these endpoints in your browser will make is seem like the response is being returned in one chunk, not streamed. This is because browsers will buffer the response until it has all been received (to provide better user experience, they claim).<br />
> 
> However, you can hit them with a non-buffering tool such as curl: `curl http://localhost:8510/stream/strings -N`

`Gandalf` exposes three endpoints:
* `/fetch/strings`
* `/fetch/objects`
* `/fetch/file`

and each one of these will also stream its response, but the data will be streamed from requests to `Gimli`.<br />
Essentially inter-service streaming over HTTP.

<div align="center">
  <img src="https://github.com/aichholzer/streaming-goodness/blob/main/diagram.png" alt="" />
</div>

> If you look at the code (which you should), you will see `transformer` streams throughout and on both services.

### See it in action

As mentioned above, browsers will not give you a "good" stream experience, due to their built-in buffering mechanisms. In this case (and for pretty much any other case), the `terminal` is your best friend.

Let's ask `Gandalf` for the file (which it will request and stream back from `Gimli`):

```bash
$> curl http://localhost:7510/stream/file -N
```

This response still came down very fast and it seemed like one response chunk, right? - Since we are streaming stuff around here, we can actually slow the process down a little to see the stream in action.<br />
Go ahead and open this file in your favourite editor: `/services/Gimli/app/stream.mjs` and insert this:

```javascript
await delay(100);
```

between lines `57` and `58`. You now have a 100 ms delay between data chucks being written to the stream.<br />
Hit the above URL (`curl http://localhost:7510/stream/file -N`) again and enjoy!

> Note: You will need to rebuild the images after you change code.<br />
> Clean up as shown below.

> If you don't want to rebuild the containers each time, you can just start the services independently:
> ```bash
> $> cd services/Gandalf && npm run up
> $> cd services/Gimli && npm run up
> ```
> This will also watch for file changes and restart the service automatically. Hack away!

### Cleaning up

```bash
$> docker compose rm -f
$> docker image prune -af
```
