import path from 'path'
import http, { get } from 'http'
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import reload from 'reload'
import React from 'react'
import compression from 'compression'
import { renderToNodeStream } from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import { ServerStyleSheet } from 'styled-components'
import serialize from 'serialize-javascript'

import pkg from '../../package.json'
import App from '../shared/App'
import routes from '../shared/routes'

const app: Application = express()
// Config file variables 
const dotenv = require('dotenv').config()
console.log('Dotenv file', dotenv)
const port = process.env.PORT || 8180
const isProd = process.env.NODE_ENV === 'production'
//console.log('isProd',isProd)
//console.log('BUILD', process.env.BUILD)
const publicPath = path.join(__dirname, 'public')
const server = http.createServer(app)
const fs = require('fs');


app.use(cors())

isProd && app.use(compression())

app.use(express.static(publicPath))
app.use(express.json())
// winston required packages
const winston = require('winston')
const moment = require('moment')

//Winston configs and setup
// log level based on env variables
if(process.env.BUILD === 'development'){
  process.env.LOG_LEVEL = 'info'
}

//Get Todays Date
const getTodaysDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  if(mm.charAt(0) === '0') {
    // to suit the format of logs
    mm = mm.substr(1);
  }
  const yyyy = today.getFullYear();
  return mm + '/' + dd + '/' + yyyy;
}
console.log('getTodaysDate', getTodaysDate())


let dailyLogFileName = getTodaysDate();
while(dailyLogFileName.includes('/')) {
  dailyLogFileName =dailyLogFileName.replace('/', '.')
}

console.log('daily log file', dailyLogFileName)
//Creating new daily log files if it is not exist
fs.writeFile(`./log/${dailyLogFileName}.log`, '', function (err) {
  if (err) throw err;
  console.log('Saved!');
});

const { combine, timestamp, align, json } = winston.format;
const timezoned = () => {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Moscow',
    hour12: false
  })
}
const logFormat = combine(
  timestamp({
    format: timezoned
  }) ,
  json(),
  align()
  
)
const logConfig = { 
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: 'combined.log',
      level: process.env.LOG_LEVEL
    }),
    new winston.transports.File({
      filename: `./log/${dailyLogFileName}.log`,
      level: process.env.LOG_LEVEL
    }),
    new winston.transports.Console()
  ] 
}
const logger = winston.createLogger(logConfig)

// Read file and iterate through it
const searchLogs = function(filePath, date = getTodaysDate(), level = null, message = null) {
  return new Promise(function(resolve, reject) {
    if(filePath != null){
      //const filePath = path.join(__dirname, fileName);
      fs.readFile(filePath, (err,data) => {
        if(err) {
          console.log('error reading file', err)
          return reject;
        } else {
          //Logs divided into an array
          const data_iterated = data.toString().split('\n');
          // last element is an empty string due to \n
          data_iterated.pop()
          //String array converted to Json objects array
          const json_array_data = data_iterated.map(log => JSON.parse(log))
          // logs are filtered according to date
          const date_filtered_results = json_array_data.filter(log => {
            return log.timestamp.includes(date)
          })
          // Adding level filter
          let level_filtered = levelFilterLogs(date_filtered_results, level);
          // Adding Message Filter
          let message_filtered = messageFilterLogs(level_filtered, message);
          return resolve(message_filtered);
        }
      });
    } else {
      return reject;
    }
  })
}

const levelFilterLogs = (logArray, levelArray = null) => {
  // Adding level filter
  let level_filtered = []
  let level_filter_object = {};
  if(levelArray != null) {
    for(let i = 0; i < levelArray.length; i++) {
      //objects added to global in order to create dynamically
      level_filter_object['level_filtered' + i] = logArray.filter((log) => {
        return log.level.includes(levelArray[i])
      })
    }
    for(let i = 0; i < levelArray.length; i++) {
      if(`level_filtered${i}` in level_filter_object){
        level_filtered = level_filtered.concat(level_filter_object[`level_filtered${i}`]);
      }
    }
  } else {
    //no level filtered
    level_filtered = logArray;
  }
  return level_filtered
}

const messageFilterLogs = (logArray, message = null) => {
  let message_filtered;
  if(message != null) {
      message_filtered = logArray.filter((log) => {
          return log.message.includes(message)
      })
  } else {
      // no message filtered 
      message_filtered = logArray;
  }
  return message_filtered;
}

//searchLogs('./combined.log', '5/28/2020' ,['warn', 'error'], 'for').then(data => console.log('method results',data));

//paths
const paths = routes.map(({ path }) => path);
if(isProd) {
  app.get(paths, async (req: Request, res: Response, next) => {
    res.setHeader('Content-Type', 'application/json')

    const fragment = {
      name: pkg.name,
      version: pkg.version,
      html: ''
    }

    const activeRoute = routes.find(route => matchPath(req.url, route)) || {}

    const data = activeRoute.fetchInitialData
      ? await activeRoute.fetchInitialData(req.path)
      : await Promise.resolve({})

    try {
      const sheet = new ServerStyleSheet()
      const markup = sheet.collectStyles(
        <StaticRouter location={req.url} context={data.context && data.context}>
          <App />
        </StaticRouter>
      )

      const bodyStream = sheet.interleaveWithNodeStream(renderToNodeStream(markup))

      fragment.html = `<script>window.__INITIAL_DATA__ = ${serialize(data)}</script><div>`
      res.write(JSON.stringify(fragment))

      bodyStream.on('data', chunk => {
        fragment.html = chunk
        res.write(JSON.stringify(fragment))
      })

      bodyStream.on('end', () => {
        fragment.html = `</div>`
        fragment.script = `${pkg.name}.js`

        res.write(JSON.stringify(fragment))
        res.end()
      })

      bodyStream.on('error', err => {
        console.error('react render error:', err)
      })
    } catch (error) {
      next(error)
    }
  })
}
else{
  app.get(paths, async (req: Request, res: Response, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')

    const activeRoute = routes.find(route => matchPath(req.url, route)) || {}

    const data = activeRoute.fetchInitialData
      ? await activeRoute.fetchInitialData(req.path)
      : await Promise.resolve({})

    try {
      const { context } = data

      const sheet = new ServerStyleSheet()
      const markup = sheet.collectStyles(
        <StaticRouter location={req.url} context={data.context}>
          <App />
        </StaticRouter>
      )

      const bodyStream = sheet.interleaveWithNodeStream(renderToNodeStream(markup))

      res.write(`<!DOCTYPE html>
    <html>
      <head>
        <title>${pkg.name} v${pkg.version}</title>
        <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
      </head>
      <body>
        <div id="root">`)

      bodyStream.on('data', chunk => res.write(chunk))

      bodyStream.on('end', () => {
        res.write(`</div>
        <script src="/reload/reload.js"></script>
        <script src="/${pkg.name}.js"></script>
      </body>
    </html>`)
        res.end()
      })

      bodyStream.on('error', err => {
        console.error('react render error:', err)
      })
    } catch (error) {
      next(error)
    }
  })

  app.post('/logger', (req, res) => {
    switch (req.body.type) {
      case 'log':
        logger.log(req.body.log)
        break;
      case 'info':
        logger.info(req.body.log)
        break;
      case 'error':
        logger.error(req.body.log)
        break;
      case 'warn':
          logger.warn(req.body.log)
        break;
    }
  })

  app.post('/getLogs', (req, res) => {
    console.log('BODY getLogs',req.body);
    // logger.info('hello');
    let date = req.body.date;
    if (date[3] == '0') {
      date = date.substr(0,3) + date.substr(4, date.length-1)
    }
    if(date) {
      if(date[0] === '0') {date = date.substr(1)}
    }
    console.log('DATE', date);
    searchLogs('./combined.log', date ,req.body.level, req.body.message).then(data => {
      return res.status(200).json({data});
    });
  })
  
}


app.get('*', (req: Request, res: Response) => res.send(''))

const runHttpServer = async (): Promise => {
  try {
    await reload(app)
    server.listen(port, () => {
      console.log(`Server is listening on port: ${port}`)
    })
  } catch (err) {
    console.error('Reload could not start, could not start server/sample app', err)
  }
}

runHttpServer()
