/*
 * Flush stats to RabbitMQ
 *
 * To enable this backend, include 'statsd-rabbitmq-backend' in the backends
 * configuration array:
 *
 *   backends: ['statsd-rabbitmq-backend']
 *
 * This backend supports the following config options:
 *
 *   amqp.host: Hostname of RabbitMQ server.
 *   amqp.port: Port to contact RabbitMQ server at.
 *   amqp.login: Login for the RabbitMQ server.
 *   amqp.password: Password for the RabbitMQ server.
 *   .......
 *
 * @TODO update this file with RabbitMQ implementation
 */
var util = require('util');

function RabbitmqBackend(startupTime, config, emitter) {
	var self = this;
	this.lastFlush = startupTime;
	this.lastException = startupTime;
	this.config = config.console || {};

	// attach
	emitter.on('flush', function(timestamp, metrics) {
		self.flush(timestamp, metrics);
	});
	emitter.on('status', function(callback) {
		self.status(callback);
	});
}

RabbitmqBackend.prototype.flush = function(timestamp, metrics) {
	console.log('Flushing stats at ', new Date(timestamp * 1000).toString());

	var out = {
		counters: metrics.counters,
		timers: metrics.timers,
		gauges: metrics.gauges,
		timer_data: metrics.timer_data,
		counter_rates: metrics.counter_rates,
		sets: function(vals) {
			var ret = {};
			for (var val in vals) {
				ret[val] = vals[val].values();
			}
			return ret;
		}(metrics.sets),
		pctThreshold: metrics.pctThreshold
	};

	if (this.config.prettyprint) {
		console.log(util.inspect(out, {
			depth: 5,
			colors: true
		}));
	} else {
		console.log(out);
	}

};

RabbitmqBackend.prototype.status = function(write) {
	['lastFlush', 'lastException'].forEach(function(key) {
		write(null, 'console', key, this[key]);
	}, this);
};

exports.init = function(startupTime, config, events) {
	var instance = new RabbitmqBackend(startupTime, config, events);
	return true;
};