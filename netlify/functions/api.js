const express = require('express');
const serverless = require('serverless-http');
const app = require('../../src/Backend/server');

module.exports.handler = serverless(app);