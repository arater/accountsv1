import React from 'react'
​
​
export const logger = {
​
    log: (log='deneme') => {
        fetch('http://localhost:81/logger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log: JSON.stringify(log), type: 'log' }),
    });
    },
    info: (log='deneme') => {
        fetch('http://localhost:81/logger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log: JSON.stringify(log), type: 'info' }),
    });
    },
    error: (log) => {
        fetch('http://localhost:81/logger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log: JSON.stringify(log), type: 'error' }),
    });
    },
    warn: (log) => {
        fetch('http://localhost:81/logger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log: JSON.stringify(log), type: 'warn' }),
    });
    }
    
}