'use strict'

const {
  FakeAgent,
  createSandbox,
  checkSpansForServiceName,
  spawnPluginIntegrationTestProc
} = require('../../../../integration-tests/helpers')
const { assert } = require('chai')

describe('esm', () => {
  let agent
  let proc
  let sandbox

  before(async function () {
    this.timeout(50000)
    sandbox = await createSandbox(['@grpc/grpc-js', '@grpc/proto-loader', 'get-port@^3.2.0'], false, [
      `./packages/datadog-plugin-grpc/test/*`])
  })

  after(async () => {
    await sandbox.remove()
  })

  beforeEach(async () => {
    agent = await new FakeAgent().start()
  })

  afterEach(async () => {
    proc && proc.kill()
    await agent.stop()
  })

  context('grpc', () => {
    it('is instrumented', async () => {
      const res = agent.assertMessageReceived(({ headers, payload }) => {
        console.log(headers, payload)
        assert.propertyVal(headers, 'host', `127.0.0.1:${agent.port}`)
        assert.isArray(payload)
        console.log(12312321, checkSpansForServiceName(payload, 'grpc.client') === true)
        console.log(12312321, headers.host === `127.0.0.1:${agent.port}`)
        assert.strictEqual(checkSpansForServiceName(payload, 'grpc.client'), true)
      })

      proc = await spawnPluginIntegrationTestProc(sandbox.folder, 'integration-test/server.mjs', agent.port)

      await res

      console.log('check something')
    }).timeout(50000)
  })
})