'use strict'

require('../setup/tap')

const TracingPlugin = require('../../src/plugins/tracing')

describe('TracingPlugin', () => {
  describe('startSpan method', () => {
    it('passes given childOf relationship to the tracer', () => {
      const startSpanSpy = sinon.spy()
      const plugin = new TracingPlugin({
        _tracer: {
          startSpan: startSpanSpy
        }
      })
      plugin.configure({})

      plugin.startSpan('Test span', { childOf: 'some parent span' })

      expect(startSpanSpy).to.have.been.calledWith(
        'Test span',
        sinon.match({
          childOf: 'some parent span'
        })
      )
    })
  })

  describe('tagBaseService', () => {
    it('should set _dd.base_service when service is changed', () => {

    })
    it('should not set _dd.base_service when service is unchanged', () => {})
    it('should do nothing if service name flattening is not enabled', () => {})
  })
})
