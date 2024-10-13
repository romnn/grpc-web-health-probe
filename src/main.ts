#!/usr/bin/env node
// const { program } = require('commander');
// import * as xhr from 'xmlhttprequest'
// import xhr from 'xhr2';
import {grpc} from '@improbable-eng/grpc-web';
import {program} from 'commander';
// import XHR from 'sw-xhr';
import {HealthCheckRequest, HealthCheckResponse} from './gen/proto/health_pb.js';
import {Health} from './gen/proto/health_pb_service';
// import {HealthClient} from './gen/proto/health_pb_service.js';
import {NodeHttpTransport} from '@improbable-eng/grpc-web-node-http-transport';
// import {HealthClient} from './gen/proto/HealthServiceClientPb';

// StatusInvalidArguments indicates specified invalid arguments.
const StatusInvalidArguments = 1;
// StatusConnectionFailure indicates connection failed.
const StatusConnectionFailure = 2;
// StatusRPCFailure indicates rpc failed.
const StatusRPCFailure = 3;
// StatusUnhealthy indicates rpc succeeded but indicates unhealthy service.
const StatusUnhealthy = 4;
// StatusSpiffeFailed indicates failure to retrieve credentials using spiffe
// workload API
const StatusSpiffeFailed = 20;

program.usage('--addr address of grpc web servers')
    .option(
        '-d, --addr <address>', '(required) tcp host:port to connect', String)
    .option(
        '-s, --service <service>', 'service name to check (default: \"\")',
        String)
    .option(
        '--user-agent <user_agent>', 'service name to check (default: \"\")',
        String, 'grpc_web_health_probe')
    .option(
        '-t, --timeout <timeout>', 'timeout for establishing connection',
        Number, 1)
    .parse(process.argv);

program.parse();

const options = program.opts();
console.log(options);
// const limit = options.first ? 1 : undefined;

// grpc-web uses XMLHttpRequest, but it does not exist in cli.
// declare global {
//   var XMLHttpRequest: typeof xhr;
// }

/* @ts-ignore */
// global.XMLHttpRequest = require('sw-xhr');
// global.XMLHttpRequest = require('xhr2');
// global.XMLHttpRequest = xhr;

// function toString(status: string) {
//   for (let key in HealthCheckResponse.ServingStatus) {
//     if (HealthCheckResponse.ServingStatus[key] === status) {
//       return key;
//     }
//   }
//   return 'UNKNOWN';
// };

// function sayMyName(name: string): void {
//   if (name === 'Heisenberg') {
//     console.log('You\'re right 👍');
//   } else {
//     console.log('You\'re wrong 👎');
//   }
// }

// sayMyName('Heisenberg');
//
// (async () => {
  // console.log('start');
  // var healthClient = new HealthClient(options.addr);
  // let request = new HealthCheckRequest();
  // var timeout = new Date();
  //   timeout.setSeconds(timeout.getSeconds() + options.timeout);

  //   await healthClient.check(request, {deadline:
  //   timeout.getTime().toString()})
  //       .then(response => {
  //         // let status = toString(response.getStatus());
  //         let status = response.getStatus();
  //         console.log('status: ' + status);

  //         if (status !== HealthCheckResponse.ServingStatus.SERVING) {
  //           process.exitCode = StatusUnhealthy;
  //         }
  //       })
  //       .catch(err => {
  //         console.log(`Unexpected error for check: code = ${
  //             err.code}, message = "${err.message}"`);
  //         process.exitCode = StatusRPCFailure;
  //       });
  // console.log('done');
// })();
//
//
grpc.invoke(Health.Check, {
  request: new HealthCheckRequest(),
  host: options.addr,
  transport: NodeHttpTransport(),
  // onMessage: (message: HealthCheck.responseType) => {
  onMessage: (message: any) => {
    console.log('got book: ', message.toObject());
  },
  onEnd: (code: grpc.Code, msg: string|undefined, trailers: grpc.Metadata) => {
    if (code == grpc.Code.OK) {
      console.log('all ok')
    } else {
      console.log('hit an error', code, msg, trailers);
    }
  }
});
