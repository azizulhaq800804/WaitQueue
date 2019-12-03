require('winston-daily-rotate-file');
const MESSAGE = Symbol.for('message');
var config = require('./config'); //import config file for DB information

var winston = require('winston');
const timezoned = () => {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Dhaka'
  });
};

const jsonFormatter = (logEntry) => {
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
  const base = { timestamp: localISOTime };
  const json = Object.assign(base, logEntry)
  logEntry[MESSAGE] = JSON.stringify(json);
  return logEntry;
}

winston.loggers.add('logger', {
    format: winston.format(jsonFormatter)(),   
    transports: [
new (winston.transports.Console)(
            {
                level: config.logLevel,
                colorize: true
                
            }),
        
        //new files will be generated each day, the date patter indicates the frequency of creating a file.
        new winston.transports.DailyRotateFile({
                name: 'debug-log',
                filename: '/users/test/Documents/WaitQueueManagement/server/log/waitqueue.log',
                //filename: '/home/idms//WaitQueueManagement/server/log/waitqueue.log',
                level: 'debug',
                prepend: true,
                datePattern: 'YYYY-MM-DD',
                maxFiles: '50m'
               
            }
        ),
        new (winston.transports.DailyRotateFile)({
               name: 'error-log',
               filename: '/users/test/Documents/WaitQueueManagement/server/log/waitqueue-error.log',
               //filename: '/home/idms/WaitQueueManagement/server/log/waitqueue-error.log',
                level: 'error',
                prepend: true,
                datePattern: 'YYYY-MM-DD',
                maxFiles: '50m'
        })
    ]
});

var logger = winston.loggers.get('logger');
Object.defineProperty(exports, "LOG", {value: logger});


// Usage
//var log = require('./logger.js').LOG
//log.error('hello');