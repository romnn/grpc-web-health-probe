// package: grpc.health.v1
// file: proto/health.proto

var proto_health_pb = require("../proto/health_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Health = (function () {
  function Health() {}
  Health.serviceName = "grpc.health.v1.Health";
  return Health;
}());

Health.Check = {
  methodName: "Check",
  service: Health,
  requestStream: false,
  responseStream: false,
  requestType: proto_health_pb.HealthCheckRequest,
  responseType: proto_health_pb.HealthCheckResponse
};

Health.Watch = {
  methodName: "Watch",
  service: Health,
  requestStream: false,
  responseStream: true,
  requestType: proto_health_pb.HealthCheckRequest,
  responseType: proto_health_pb.HealthCheckResponse
};

exports.Health = Health;

function HealthClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

HealthClient.prototype.check = function check(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Health.Check, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

HealthClient.prototype.watch = function watch(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(Health.Watch, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.HealthClient = HealthClient;

