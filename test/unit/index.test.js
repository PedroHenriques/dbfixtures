'use strict';
const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const dbFixtures = require('../../lib/dbFixtures');

describe('entry point file', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyIndex;

  beforeEach(function () {
    doubles = {
      dbFixturesStub: sandbox.stub(dbFixtures),
    };
    proxyIndex = proxyquire('../../lib/index', {
      './dbFixtures': doubles.dbFixturesStub,
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should have an exported "setDrivers" property', function () {
    assert.isDefined(proxyIndex.setDrivers);
  });
  
  it('should have an exported "setDrivers" property that points to the setDrivers() of the "dbFixtures" module', function () {
    assert.strictEqual(proxyIndex.setDrivers, doubles.dbFixturesStub.setDrivers);
  });

  it('should have an exported "insertFixtures" property', function () {
    assert.isDefined(proxyIndex.insertFixtures);
  });

  it('should have an exported "insertFixtures" property that points to the insertFixtures() of the "dbFixtures" module', function () {
    assert.strictEqual(proxyIndex.insertFixtures, doubles.dbFixturesStub.insertFixtures);
  });
});