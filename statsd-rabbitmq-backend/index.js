/*
 * Flush stats to RabbitMQ
 *
 * To enable this backend, include 'statsd-rabbitmq-backend' in the backends
 * configuration array:
 *
 *   backends: ['./backends/statsd-rabbitmq-backend']
 *
 * This backend supports the following config options:
 *
 *   amqp.connection: RabbitMQ Connection eg. amqp://guest:guest@localhost:5672
 *   amqp.queue: RabbitMQ Exchange eg. metrics
 *   ampq.durable: Whether the queue will survive a broker restart
 *
 */


function RabbitmqBackend(startupTime, config, emitter) {
	var self = this;
	this.lastFlush = startupTime;
	this.lastException = startupTime;
	this.config = config;

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

	var send = false;

	var metric = {
		"counters": {}
	};

	for (var key in out.counters) {
		if (key.startsWith("statsd.") || out.counters[key] == 0) {
			continue;
		}
		send = true;

		metric.counters[key] = out.counters[key];
	}

	if (!send) {
		console.log('No new metrics to flush');
		return;
	}

	var queue = this.config.amqp.queue;
	var autoDelete = this.config.amqp.autoDelete;
	var exclusive = this.config.amqp.exclusive;
	var persistent = this.config.amqp.persistent;
	var deliveryMode = this.config.amqp.deliveryMode;
	var durable = this.config.amqp.durable;
	var msg = JSON.stringify(metric);

	console.log('Attempt to send metrics ', msg);

	// Publish
	require('amqplib').connect(this.config.amqp.connection).then(function(conn) {
		return conn.createChannel().then(function(ch) {
			var ok = ch.assertQueue(queue, {
				durable: durable,
				autoDelete: autoDelete,
				exclusive: exclusive
			});

			return ok.then(function(_qok) {
				ch.sendToQueue(queue, Buffer.from(msg), {
					persistent: persistent,
					deliveryMode: deliveryMode
				});
				console.log("Sent ", msg);
				return ch.close();
			});
		}).finally(function() { conn.close(); });
	}).catch(console.warn);
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