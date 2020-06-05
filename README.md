<p align="center">
    <img src="https://raw.githubusercontent.com/clivern/statsd-rabbitmq-backend/master/assets/img/chart.png" width="700" />
</p>
<p align="left">A Pluggable backend for <a href="https://github.com/statsd/statsd">StatsD</a> to publish metrics to <a href="https://github.com/rabbitmq/rabbitmq-server">RabbitMQ</a>. So instead of polling for changes on metrics, We will get notified when there is a change through <a href="https://github.com/rabbitmq/rabbitmq-server">RabbitMQ</a>.</p>

## Installation

Create config file `config.js` like the following

```js
{
  graphitePort: 2003
, graphiteHost: "graphite.example.com"
, port: 8125
, backends: [ "./backends/graphite" ]
}
```

Run `statsd` daemon with that config file

```
$ git clone https://github.com/statsd/statsd.git
$ node stats.js /path/to/config.js
```

Start sending metrics

```
$ echo "foo:1|c" | nc -u -w0 127.0.0.1 8125
```


## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, statsd-rabbitmq-backend is maintained under the [Semantic Versioning guidelines](https://semver.org/) and release process is predictable and business-friendly.

See the [Releases section of our GitHub project](https://github.com/clivern/statsd-rabbitmq-backend/releases) for changelogs for each release version of statsd-rabbitmq-backend. It contains summaries of the most noteworthy changes made in each release.


## Bug tracker

If you have any suggestions, bug reports, or annoyances please report them to our issue tracker at https://github.com/clivern/statsd-rabbitmq-backend/issues


## Security Issues

If you discover a security vulnerability within statsd-rabbitmq-backend, please send an email to [hello@clivern.com](mailto:hello@clivern.com)


## Contributing

We are an open source, community-driven project so please feel free to join us. see the [contributing guidelines](CONTRIBUTING.md) for more details.


## License

© 2020, clivern. Released under [MIT License](https://opensource.org/licenses/mit-license.php).

**statsd-rabbitmq-backend** is authored and maintained by [@clivern](http://github.com/clivern).
