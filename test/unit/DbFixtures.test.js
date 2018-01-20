'use strict';
const assert = require('chai').assert;
const sinon = require('sinon');
const dbFixtures = require('../../lib/DbFixtures');

describe('DbFictures', function () {
  const sandbox = sinon.createSandbox();
  let doubles = {};

  beforeEach(function () {
    doubles.driverOneStub = {
      truncate: sandbox.stub(),
      insertFixtures: sandbox.stub(),
      close: sandbox.stub(),
    };
    doubles.driverTwoStub = {
      truncate: sandbox.stub(),
      insertFixtures: sandbox.stub(),
      close: sandbox.stub(),
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('setFixtures()', function () {
    it('should call each registered driver\'s truncate() with the tables in the right order to be truncated, then call their insertFixtures(), then their close() and return a Promise that resolves to void', function () {
      doubles.driverOneStub.truncate.returns(Promise.resolve());
      doubles.driverOneStub.insertFixtures.returns(Promise.resolve());
      doubles.driverOneStub.close.returns(Promise.resolve());
      doubles.driverTwoStub.truncate.returns(Promise.resolve());
      doubles.driverTwoStub.insertFixtures.returns(Promise.resolve());
      doubles.driverTwoStub.close.returns(Promise.resolve());

      dbFixtures.setDrivers(doubles.driverOneStub, doubles.driverTwoStub);

      const fixtures = {
        tableB: [
          { col1: 3, col2: 'user name', col5: 'true' },
          { col1: 2, col2: 'another name', col5: 'false' },
        ],
        tableC: [
          { col2: 'checked', col3: 8 },
          { col2: '', col3: 3 },
          { col1: '38', col2: 'true' },
        ],
        tableA: [
          { col1: null, col2: 9 },
        ],
      };
      const returnValue = dbFixtures.insertFixtures(fixtures);

      assert.typeOf(returnValue, 'Promise');
      return(
        returnValue.then((data) => {
          assert.isUndefined(data);
          assert.isTrue(doubles.driverOneStub.truncate.calledOnce);
          assert.deepEqual(doubles.driverOneStub.truncate.args[0], [['tableA', 'tableC', 'tableB']]);
          assert.isTrue(doubles.driverTwoStub.truncate.calledOnce);
          assert.deepEqual(doubles.driverTwoStub.truncate.args[0], [['tableA', 'tableC', 'tableB']]);
          assert.strictEqual(doubles.driverOneStub.insertFixtures.callCount, 3);
          assert.deepEqual(doubles.driverOneStub.insertFixtures.args[0], ['tableB', fixtures.tableB]);
          assert.deepEqual(doubles.driverOneStub.insertFixtures.args[1], ['tableC', fixtures.tableC]);
          assert.deepEqual(doubles.driverOneStub.insertFixtures.args[2], ['tableA', fixtures.tableA]);
          assert.strictEqual(doubles.driverTwoStub.insertFixtures.callCount, 3);
          assert.deepEqual(doubles.driverTwoStub.insertFixtures.args[0], ['tableB', fixtures.tableB]);
          assert.deepEqual(doubles.driverTwoStub.insertFixtures.args[1], ['tableC', fixtures.tableC]);
          assert.deepEqual(doubles.driverTwoStub.insertFixtures.args[2], ['tableA', fixtures.tableA]);
          assert.isTrue(doubles.driverOneStub.close.calledOnce);
          assert.isTrue(doubles.driverTwoStub.close.calledOnce);
        }, () => {
          assert.fail();
        })
      );
    });

    describe('if a table has no rows of fixtures', function () {
      it('should include that table in the calls to the driver\'s truncate() but not to insertFixtures()', function () {
        doubles.driverOneStub.truncate.returns(Promise.resolve());
        doubles.driverOneStub.insertFixtures.returns(Promise.resolve());
        doubles.driverOneStub.close.returns(Promise.resolve());
        doubles.driverTwoStub.truncate.returns(Promise.resolve());
        doubles.driverTwoStub.insertFixtures.returns(Promise.resolve());
        doubles.driverTwoStub.close.returns(Promise.resolve());
        
        dbFixtures.setDrivers(doubles.driverOneStub, doubles.driverTwoStub);
  
        const fixtures = {
          tableA: [],
        };
        const returnValue = dbFixtures.insertFixtures(fixtures);

        assert.typeOf(returnValue, 'Promise');
        return(
          returnValue.then((data) => {
            assert.isUndefined(data);
            assert.isTrue(doubles.driverOneStub.truncate.calledOnce);
            assert.deepEqual(doubles.driverOneStub.truncate.args[0], [['tableA']]);
            assert.isTrue(doubles.driverTwoStub.truncate.calledOnce);
            assert.deepEqual(doubles.driverTwoStub.truncate.args[0], [['tableA']]);
            assert.isTrue(doubles.driverOneStub.insertFixtures.notCalled);
            assert.isTrue(doubles.driverTwoStub.insertFixtures.notCalled);
            assert.isTrue(doubles.driverOneStub.close.calledOnce);
            assert.isTrue(doubles.driverTwoStub.close.calledOnce);
          }, () => {
            assert.fail();
          })
        );
      });
    });

    describe('if a call to truncate() fails', function () {
      it('should call that driver\'s close() and return a Promise that rejects with the error message', function () {
        doubles.driverOneStub.truncate.returns(Promise.resolve());
        doubles.driverOneStub.insertFixtures.returns(Promise.resolve());
        doubles.driverOneStub.close.returns(Promise.resolve());
        doubles.driverTwoStub.truncate.returns(Promise.reject('driverTwo.truncate() reject msg.'));
        doubles.driverTwoStub.insertFixtures.returns(Promise.resolve());
        doubles.driverTwoStub.close.returns(Promise.resolve());
        
        dbFixtures.setDrivers(doubles.driverOneStub, doubles.driverTwoStub);
  
        const fixtures = {
          tableB: [
            { col1: 3, col2: 'user name', col5: 'true' },
            { col1: 2, col2: 'another name', col5: 'false' },
          ],
          tableA: [
            { col1: null, col2: 9 },
          ],
        };
        const returnValue = dbFixtures.insertFixtures(fixtures);

        assert.typeOf(returnValue, 'Promise');
        return(
          returnValue.then((data) => {
            assert.fail();
          }, (reason) => {
            assert.strictEqual(reason, 'driverTwo.truncate() reject msg.');
            assert.isTrue(doubles.driverOneStub.truncate.calledOnce);
            assert.deepEqual(doubles.driverOneStub.truncate.args[0], [['tableA', 'tableB']]);
            assert.isTrue(doubles.driverTwoStub.truncate.calledOnce);
            assert.deepEqual(doubles.driverTwoStub.truncate.args[0], [['tableA', 'tableB']]);
            assert.strictEqual(doubles.driverOneStub.insertFixtures.callCount, 2);
            assert.deepEqual(doubles.driverOneStub.insertFixtures.args[0], ['tableB', fixtures.tableB]);
            assert.deepEqual(doubles.driverOneStub.insertFixtures.args[1], ['tableA', fixtures.tableA]);
            assert.isTrue(doubles.driverTwoStub.insertFixtures.notCalled);
            assert.isTrue(doubles.driverOneStub.close.calledOnce);
            assert.isTrue(doubles.driverTwoStub.close.calledOnce);
          })
        );
      });
    });

    describe('if a call to insertFixtures() fails', function () {
      it('should call that driver\'s close() and return a Promise that rejects with the error message', function () {
        doubles.driverOneStub.truncate.returns(Promise.resolve());
        doubles.driverOneStub.insertFixtures.returns(Promise.resolve());
        doubles.driverOneStub.close.returns(Promise.resolve());
        doubles.driverTwoStub.truncate.returns(Promise.resolve());
        doubles.driverTwoStub.insertFixtures.returns(Promise.reject('driverTwo.insertFixtures() reject msg.'));
        doubles.driverTwoStub.close.returns(Promise.resolve());
        
        dbFixtures.setDrivers(doubles.driverOneStub, doubles.driverTwoStub);
  
        const fixtures = {
          tableB: [
            { col1: 3, col2: 'user name', col5: 'true' },
            { col1: 2, col2: 'another name', col5: 'false' },
          ],
          tableA: [
            { col1: null, col2: 9 },
          ],
        };
        const returnValue = dbFixtures.insertFixtures(fixtures);

        assert.typeOf(returnValue, 'Promise');
        return(
          returnValue.then((data) => {
            assert.fail();
          }, (reason) => {
            assert.strictEqual(reason, 'driverTwo.insertFixtures() reject msg.');
            assert.isTrue(doubles.driverOneStub.truncate.calledOnce);
            assert.deepEqual(doubles.driverOneStub.truncate.args[0], [['tableA', 'tableB']]);
            assert.isTrue(doubles.driverTwoStub.truncate.calledOnce);
            assert.deepEqual(doubles.driverTwoStub.truncate.args[0], [['tableA', 'tableB']]);
            assert.strictEqual(doubles.driverOneStub.insertFixtures.callCount, 2);
            assert.deepEqual(doubles.driverOneStub.insertFixtures.args[0], ['tableB', fixtures.tableB]);
            assert.deepEqual(doubles.driverOneStub.insertFixtures.args[1], ['tableA', fixtures.tableA]);
            assert.strictEqual(doubles.driverTwoStub.insertFixtures.callCount, 1);
            assert.deepEqual(doubles.driverTwoStub.insertFixtures.args[0], ['tableB', fixtures.tableB]);
            assert.isTrue(doubles.driverOneStub.close.calledOnce);
            assert.isTrue(doubles.driverTwoStub.close.calledOnce);
          })
        );
      });
    });

    describe('if a call to close() fails', function () {
      it('should return a Promise that rejects with the error message', function () {
        doubles.driverOneStub.truncate.returns(Promise.resolve());
        doubles.driverOneStub.insertFixtures.returns(Promise.resolve());
        doubles.driverOneStub.close.returns(Promise.reject('driverOne.close() error msg.'));
        doubles.driverTwoStub.truncate.returns(Promise.resolve());
        doubles.driverTwoStub.insertFixtures.returns(Promise.resolve());
        doubles.driverTwoStub.close.returns(Promise.resolve());
        
        dbFixtures.setDrivers(doubles.driverOneStub, doubles.driverTwoStub);
  
        const fixtures = {
          tableB: [
            { col1: 3, col2: 'user name', col5: 'true' },
            { col1: 2, col2: 'another name', col5: 'false' },
          ],
          tableA: [
            { col1: null, col2: 9 },
          ],
        };
        const returnValue = dbFixtures.insertFixtures(fixtures);

        assert.typeOf(returnValue, 'Promise');
        return(
          returnValue.then((data) => {
            assert.fail();
          }, (reason) => {
            assert.strictEqual(reason, 'driverOne.close() error msg.');
            assert.isTrue(doubles.driverOneStub.truncate.calledOnce);
            assert.deepEqual(doubles.driverOneStub.truncate.args[0], [['tableA', 'tableB']]);
            assert.isTrue(doubles.driverTwoStub.truncate.notCalled);
            assert.strictEqual(doubles.driverOneStub.insertFixtures.callCount, 2);
            assert.deepEqual(doubles.driverOneStub.insertFixtures.args[0], ['tableB', fixtures.tableB]);
            assert.deepEqual(doubles.driverOneStub.insertFixtures.args[1], ['tableA', fixtures.tableA]);
            assert.isTrue(doubles.driverTwoStub.insertFixtures.notCalled);
            assert.isTrue(doubles.driverOneStub.close.calledOnce);
            assert.isTrue(doubles.driverTwoStub.close.notCalled);
          })
        );
      });
    });
  });
});