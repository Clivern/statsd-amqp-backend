<p align="center">
    <img src="https://raw.githubusercontent.com/uptimedog/statsd-rabbitmq-backend/master/assets/img/chart.png" width="700" />
</p>
<p align="left">A Pluggable backend for <a href="https://github.com/statsd/statsd">StatsD</a> to publish metrics to RabbitMQ. So instead of polling our data store for changes in metrics, We will get notified when there is a change through RabbitMQ.</p>


## Installation

Clone `statsd` and our new backend

```
$ git clone https://github.com/statsd/statsd.git
$ git clone https://github.com/uptimedog/statsd-rabbitmq-backend.git statsd/backends/statsd-rabbitmq-backend

$ cd statsd/backends/statsd-rabbitmq-backend
$ npm install
$ cd ../..
```

Create a config file `config.js` like the following to use rabbitmq backend. More options will be supported later

```js
{
  amqp: {
      connection: "amqp://guest:guest@localhost:5672",
      queue: "metrics"
  },

  backends: [ "./backends/statsd-rabbitmq-backend" ]
}
```

Run `statsd` daemon with that config file

```
$ node stats.js config.js
```

Start sending metrics

```
$ echo "foo:1|c" | nc -u -w0 127.0.0.1 8125
```

To run a sample consumer for testing

```js
$ npm install amqplib
```

```javascript
var q = 'metrics';

var open = require('amqplib').connect("amqp://guest:guest@localhost:5672");

// Consumer
open.then(function(conn) {
    return conn.createChannel();
}).then(function(ch) {
    return ch.assertQueue(q).then(function(ok) {
        return ch.consume(q, function(msg) {
            if (msg !== null) {
                console.log(msg.content.toString());
                ch.ack(msg);
            }
        });
    });
}).catch(console.warn);
```

```
$ node consumer.js
```


## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, statsd-rabbitmq-backend is maintained under the [Semantic Versioning guidelines](https://semver.org/) and release process is predictable and business-friendly.

See the [Releases section of our GitHub project](https://github.com/uptimedog/statsd-rabbitmq-backend/releases) for changelogs for each release version of statsd-rabbitmq-backend. It contains summaries of the most noteworthy changes made in each release.


## Bug tracker

If you have any suggestions, bug reports, or annoyances please report them to our issue tracker at https://github.com/uptimedog/statsd-rabbitmq-backend/issues


## Security Issues

If you discover a security vulnerability within statsd-rabbitmq-backend, please send an email to [hello@clivern.com](mailto:hello@clivern.com)


## Contributing

We are an open source, community-driven project so please feel free to join us. see the [contributing guidelines](CONTRIBUTING.md) for more details.


## License

© 2020, Uptimedog. Released under [MIT License](https://opensource.org/licenses/mit-license.php).

**statsd-rabbitmq-backend** is authored and maintained by [@Uptimedog](http://github.com/uptimedog).
