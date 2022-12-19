Node.js SNPP Client
===================

A client for the Simple Network Paging Protocol (SNPP) written for Node.js.

The Simple Network Paging Protocol is defined in [RFC 1861](http://tools.ietf.org/html/rfc1861) and is designed to provide time-sensitive, simple communications.

Forked From: https://github.com/benburwell/snpp-client 

**Usage**

1. Ensure you have Node.JS v18+ and npm 8.6+ installed
2. Checkout this repository
3. `npm install` to install all dependencies
4. Within the repository run `node scenarios/index.js --host [HOSTNAME] --port [PORT] --pagerId [PAGER ID] --text "[MESSAGE TEXT]" --username [USERNAME] --password [PASSWORD]`
