const pluginConfig = process.env.WITH_CONFIG === 'true' ? {
  validateStatus: code => false,
  hooks: {
    request: (span, req) => {
      span.setTag('req', req.constructor.name)
      span.setTag('foo', 'bar')
    }
  },
  service: 'custom'
} : {}

module.exports = require('../../..').init({
  service: 'test',
  flushInterval: 0,
  plugins: false
}).use('next', pluginConfig).use('http', { client: false })
