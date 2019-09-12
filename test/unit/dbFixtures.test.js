'use strict';
const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon');

const dbFixtures = require('../../lib/dbFixtures');

describe('DbFixtures', function () {
  const sandbox = sinon.createSandbox();
  let doubles;

  beforeEach(function () {
    doubles = {
      driverOneStub: {
        truncate: sandbox.stub(),
        insertFixtures: sandbox.stub(),
        close: sandbox.stub(),
      },
      driverTwoStub: {
        truncate: sandbox.stub(),
        insertFixtures: sandbox.stub(),
        close: sandbox.stub(),
      }
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('setDrivers()', function () {
    it('should not throw an Error', function () {
      assert.doesNotThrow(function () {
        dbFixtures.setDrivers({});
      });
    });
  });

  describe('insertFixtures', function () {
    describe('if 1 driver was set', function () {
      beforeEach(function () {
        doubles.driverOneStub.truncate.returns(Promise.resolve());
        
        dbFixtures.setDrivers(doubles.driverOneStub);
      });

      it('should call the driver\'s truncate() property once', function () {
        return(
          dbFixtures.insertFixtures({})
          .then(function () {
            assert.isTrue(doubles.driverOneStub.truncate.calledOnce);
          })
        );
      });
      
      it('should call the driver\'s truncate() property with 1 argument', function () {
        return(
          dbFixtures.insertFixtures({})
          .then(function () {
            assert.strictEqual(doubles.driverOneStub.truncate.args[0].length, 1);
          })
        );
      });
      
      it('should call the driver\'s truncate() property with an array of the keys from the object provided as 1st argument to this function', function () {
        return(
          dbFixtures.insertFixtures({
            key1: [],
            key2: [],
            anotherKey: [],
          })
          .then(function () {
            assert.deepEqual(
              doubles.driverOneStub.truncate.args[0][0],
              [ 'key1', 'key2', 'anotherKey' ]
            );
          })
        );
      });

      describe('if the object provided as 1st argument to this function has 1 property', function () {
        it('should call the insertFixtures() property of the driver once', function () {
          return(
            dbFixtures.insertFixtures({ key: [] })
            .then(function () {
              assert.isTrue(doubles.driverOneStub.insertFixtures.calledOnce);
            })
          );
        });
        
        it('should call the insertFixtures() property of the driver with 2 arguments', function () {
          return(
            dbFixtures.insertFixtures({ key: [] })
            .then(function () {
              assert.strictEqual(doubles.driverOneStub.insertFixtures.args[0].length, 2);
            })
          );
        });

        describe('1st argument of the call to the driver\'s insertFixtures() property', function () {
          it('should be the 1st key of the object provided as argument to this function', function () {
            return(
              dbFixtures.insertFixtures({ key: [] })
              .then(function () {
                assert.strictEqual(doubles.driverOneStub.insertFixtures.args[0][0], 'key');
              })
            );
          });
        });
        
        describe('2nd argument of the call to the driver\'s insertFixtures() property', function () {
          it('should be the value associated with the 1st key of the object provided as argument to this function', function () {
            const value1 = [ {} ];
            return(
              dbFixtures.insertFixtures({ key: value1 })
              .then(function () {
                assert.strictEqual(doubles.driverOneStub.insertFixtures.args[0][1], value1);
              })
            );
          });
        });

        it('should not call the driver\'s close() property', function () {
          return(
            dbFixtures.insertFixtures({ otherKey: [ {}, {} ] })
            .then(function () {
              assert.isTrue(doubles.driverOneStub.close.notCalled);
            })
          );
        });
      });

      describe('if the object provided as 1st argument to this function has 2 properties', function () {
        it('should call the insertFixtures() property of the driver 2 times', function () {
          return(
            dbFixtures.insertFixtures({ key: [], otherKey: [] })
            .then(function () {
              assert.strictEqual(doubles.driverOneStub.insertFixtures.callCount, 2);
            })
          );
        });
        
        describe('1st call to the driver\'s insertFixtures() property', function () {
          it('should call it with 2 arguments', function () {
            return(
              dbFixtures.insertFixtures({ key: [], otherKey: [] })
              .then(function () {
                assert.strictEqual(doubles.driverOneStub.insertFixtures.args[0].length, 2);
              })
            );
          });

          describe('1st argument', function () {
            it('should be the 1st key of the object provided as argument to this function', function () {
              return(
                dbFixtures.insertFixtures({ key: [], otherKey: [] })
                .then(function () {
                  assert.strictEqual(doubles.driverOneStub.insertFixtures.args[0][0], 'key');
                })
              );
            });
          });
          
          describe('2nd argument', function () {
            it('should be the value associated with the 1st key of the object provided as argument to this function', function () {
              const value1 = [ {} ];
              return(
                dbFixtures.insertFixtures({ key: value1, otherKey: [] })
                .then(function () {
                  assert.strictEqual(doubles.driverOneStub.insertFixtures.args[0][1], value1);
                })
              );
            });
          });
        });

        describe('2nd call to the driver\'s insertFixtures() property', function () {
          it('should call it with 2 arguments', function () {
            return(
              dbFixtures.insertFixtures({ key: [], otherKey: [] })
              .then(function () {
                assert.strictEqual(doubles.driverOneStub.insertFixtures.args[1].length, 2);
              })
            );
          });

          describe('1st argument', function () {
            it('should be the 2nd key of the object provided as argument to this function', function () {
              return(
                dbFixtures.insertFixtures({ key: [], otherKey: [] })
                .then(function () {
                  assert.strictEqual(doubles.driverOneStub.insertFixtures.args[1][0], 'otherKey');
                })
              );
            });
          });
          
          describe('2nd argument', function () {
            it('should be the value associated with the 2nd key of the object provided as argument to this function', function () {
              const value2 = [ {} ];
              return(
                dbFixtures.insertFixtures({ key: [], otherKey: value2 })
                .then(function () {
                  assert.strictEqual(doubles.driverOneStub.insertFixtures.args[1][1], value2);
                })
              );
            });
          });
        });

        it('should not call the driver\'s close() property', function () {
          return(
            dbFixtures.insertFixtures({ key: [], otherKey: [ {}, {} ] })
            .then(function () {
              assert.isTrue(doubles.driverOneStub.close.notCalled);
            })
          );
        });

        describe('if the 1st call to the driver\'s insertFixtures() property returns a promise that rejects', function () {
          it('should return a promise that rejects with that Error object', function () {
            const testError = new Error('first call error message');
            doubles.driverOneStub.insertFixtures.onCall(0).returns(Promise.reject(testError));
            return(
              dbFixtures.insertFixtures({ key: [ {}, {} ], otherKey: [ {} ] })
              .then(function () {
                assert.fail();
              })
              .catch(function (error) {
                assert.strictEqual(error, testError);
              })
            );
          });
        });
      });

      it('it should return a promise that resolves with void', function () {
        return(
          dbFixtures.insertFixtures({})
          .then(function (result) {
            assert.isUndefined(result);
          })
        );
      });

      describe('if the call to the driver\'s truncate() property returns a promise that rejects', function () {
        it('should return a promise that rejects with that Error object', function () {
          const testError = new Error('test error message');
          doubles.driverOneStub.truncate.returns(Promise.reject(testError));
          return(
            dbFixtures.insertFixtures({ key: [] })
            .then(function () {
              assert.fail();
            })
            .catch(function (error) {
              assert.strictEqual(error, testError);
            })
          );
        });
        
        it('should not call the driver\'s insertFixtures() property', function () {
          const testError = new Error('test error message');
          doubles.driverOneStub.truncate.returns(Promise.reject(testError));
          return(
            dbFixtures.insertFixtures({ key: [] })
            .catch(function () {
              assert.isTrue(doubles.driverOneStub.insertFixtures.notCalled);
            })
          );
        });
      });

      describe('if the call the insertFixtures() property of the driver returns a promise that rejects', function () {
        it('should return a promise that rejects with that Error object', function () {
          const testError = new Error('insertFictures() call 1 error message');
          doubles.driverOneStub.insertFixtures.onCall(0).returns(Promise.reject(testError));
          return(
            dbFixtures.insertFixtures({ otherKey: [ {}, {} ] })
            .then(function () {
              assert.fail();
            })
            .catch(function (error) {
              assert.strictEqual(error, testError);
            })
          );
        });
      });
    });

    describe('if 2 drivers were set', function () {
      beforeEach(function () {
        doubles.driverOneStub.truncate.returns(Promise.resolve());
        doubles.driverTwoStub.truncate.returns(Promise.resolve());

        dbFixtures.setDrivers(doubles.driverOneStub, doubles.driverTwoStub);
      });

      describe('1st driver', function () {
        it('should call the truncate() property once', function () {
          return(
            dbFixtures.insertFixtures({ key: [ {}, {} ] })
            .then(function () {
              assert.isTrue(doubles.driverOneStub.truncate.calledOnce);
            })
          );
        });
        
        it('should call the truncate() property with 1 argument', function () {
          return(
            dbFixtures.insertFixtures({ key: [ {}, {} ] })
            .then(function () {
              assert.strictEqual(doubles.driverOneStub.truncate.args[0].length, 1);
            })
          );
        });
        
        it('should call the truncate() property with an array of the properties of the object provided as argument to this function', function () {
          return(
            dbFixtures.insertFixtures({
              key: [],
              otherKey: [],
              prop: [],
            })
            .then(function () {
              assert.deepEqual(doubles.driverOneStub.truncate.args[0][0], [ 'key', 'otherKey', 'prop' ]);
            })
          );
        });

        describe('if the fixtures object has 1 property', function () {
          it('should call the insertFixtures() property once', function () {
            return(
              dbFixtures.insertFixtures({ prop: [ {} ] })
              .then(function () {
                assert.isTrue(doubles.driverOneStub.insertFixtures.calledOnce);
              })
            );
          });
          
          it('should call the insertFixtures() property with 2 arguments', function () {
            return(
              dbFixtures.insertFixtures({ prop: [ {} ] })
              .then(function () {
                assert.strictEqual(doubles.driverOneStub.insertFixtures.args[0].length, 2);
              })
            );
          });
  
          describe('1st argument of the call to the insertFixtures()', function () {
            it('should be the name of the 1st property of the object provided as argument to this function', function () {
              return(
                dbFixtures.insertFixtures({ prop: [ {} ] })
                .then(function () {
                  assert.strictEqual(doubles.driverOneStub.insertFixtures.args[0][0], 'prop');
                })
              );
            });
          });
          
          describe('2nd argument of the call to the insertFixtures()', function () {
            it('should be the value associated with the 1st property of the object provided as argument to this function', function () {
              const testValue = [ {} ];
              return(
                dbFixtures.insertFixtures({ prop: testValue })
                .then(function () {
                  assert.strictEqual(doubles.driverOneStub.insertFixtures.args[0][1], testValue);
                })
              );
            });
          });
        });

        describe('if the fixtures object has 2 properties', function () {
          it('should call the insertFixtures() property 2 times', function () {
            return(
              dbFixtures.insertFixtures({ prop: [ {} ], key: [ {}, {} ] })
              .then(function () {
                assert.strictEqual(doubles.driverOneStub.insertFixtures.callCount, 2);
              })
            );
          });
          
          describe('1st call to the insertFixtures() property', function () {
            it('should receive 2 arguments', function () {
              return(
                dbFixtures.insertFixtures({ prop: [ {} ], key: [ {}, {} ] })
                .then(function () {
                  assert.strictEqual(doubles.driverOneStub.insertFixtures.args[0].length, 2);
                })
              );
            });
  
            describe('1st argument', function () {
              it('should be the 1st property of the fixtures object provided to this function', function () {
                return(
                  dbFixtures.insertFixtures({ prop: [ {} ], key: [ {}, {} ] })
                  .then(function () {
                    assert.strictEqual(doubles.driverOneStub.insertFixtures.args[0][0], 'prop');
                  })
                );
              });
            });
            
            describe('2nd argument', function () {
              it('should be value associated with the 1st property of the fixtures object provided to this function', function () {
                const value1 = [ {} ];
                return(
                  dbFixtures.insertFixtures({ prop: value1, key: [ {}, {} ] })
                  .then(function () {
                    assert.strictEqual(doubles.driverOneStub.insertFixtures.args[0][1], value1);
                  })
                );
              });
            });
          });
  
          describe('2nd call to the insertFixtures() property', function () {
            it('should receive 2 arguments', function () {
              return(
                dbFixtures.insertFixtures({ prop: [ {} ], key: [ {}, {} ] })
                .then(function () {
                  assert.strictEqual(doubles.driverOneStub.insertFixtures.args[1].length, 2);
                })
              );
            });
  
            describe('1st argument', function () {
              it('should be the 2nd property of the fixtures object provided to this function', function () {
                return(
                  dbFixtures.insertFixtures({ prop: [ {} ], key: [ {}, {} ] })
                  .then(function () {
                    assert.strictEqual(doubles.driverOneStub.insertFixtures.args[1][0], 'key');
                  })
                );
              });
            });
            
            describe('2nd argument', function () {
              it('should be value associated with the 2nd property of the fixtures object provided to this function', function () {
                const value2 = [ {}, {} ];
                return(
                  dbFixtures.insertFixtures({ prop: [ {} ], key: value2 })
                  .then(function () {
                    assert.strictEqual(doubles.driverOneStub.insertFixtures.args[1][1], value2);
                  })
                );
              });
            });
          });
        });

        it('should not call the close() property', function () {
          return(
            dbFixtures.insertFixtures({ prop: [ {} ] })
            .then(function () {
              assert.isTrue(doubles.driverOneStub.close.notCalled);
            })
          );
        });

        describe('if the call to the truncate() property returns a promise that rejects', function () {
          it('should return a promise that rejects with that Error object', function () {
            const testError = new Error('test error message');
            doubles.driverOneStub.truncate.returns(Promise.reject(testError));
            return(
              dbFixtures.insertFixtures({ otherKey: [ {} ], index: [ {}, {} ] })
              .then(function () {
                assert.fail();
              })
              .catch(function (error) {
                assert.strictEqual(error, testError);
              })
            );
          });
          
          it('should still call the 2nd driver\'s truncate() property once', function () {
            const testError = new Error('test error message');
            doubles.driverOneStub.truncate.returns(Promise.reject(testError));
            return(
              dbFixtures.insertFixtures({ otherKey: [ {} ], index: [ {}, {} ] })
              .catch(function () {
                assert.isTrue(doubles.driverTwoStub.truncate.calledOnce);
              })
            );
          });
          
          it('should still call the 2nd driver\'s insertFixtures() property 2 times', function () {
            const testError = new Error('test error message');
            doubles.driverOneStub.truncate.returns(Promise.reject(testError));
            return(
              dbFixtures.insertFixtures({ otherKey: [ {} ], index: [ {}, {} ] })
              .catch(function () {
                assert.strictEqual(doubles.driverTwoStub.insertFixtures.callCount, 2);
              })
            );
          });
        });

        describe('if the call to the insertFixtures() property returns a promise that rejects', function () {
          it('should return a promise that rejects with that Error object', function () {
            const testError = new Error('driver 1 insertFixtures() error message');
            doubles.driverOneStub.insertFixtures.onCall(0).returns(Promise.reject(testError));
            return(
              dbFixtures.insertFixtures({ key: [] })
              .then(function () {
                assert.fail();
              })
              .catch(function (error) {
                assert.strictEqual(error, testError);
              })
            );
          });
        });
      });

      describe('2nd driver', function () {
        it('should call the truncate() property once', function () {
          return(
            dbFixtures.insertFixtures({ key: [ {}, {} ] })
            .then(function () {
              assert.isTrue(doubles.driverTwoStub.truncate.calledOnce);
            })
          );
        });
        
        it('should call the truncate() property with 1 argument', function () {
          return(
            dbFixtures.insertFixtures({ key: [ {}, {} ] })
            .then(function () {
              assert.strictEqual(doubles.driverTwoStub.truncate.args[0].length, 1);
            })
          );
        });
        
        it('should call the truncate() property with an array of the properties of the object provided as argument to this function', function () {
          return(
            dbFixtures.insertFixtures({
              key: [],
              prop: [],
              otherProp: [],
              prop2: [],
            })
            .then(function () {
              assert.deepEqual(doubles.driverTwoStub.truncate.args[0][0], [ 'key', 'prop', 'otherProp', 'prop2' ]);
            })
          );
        });

        describe('if the fixtures object has 1 property', function () {
          it('should call the insertFixtures() property once', function () {
            return(
              dbFixtures.insertFixtures({ prop: [ {} ] })
              .then(function () {
                assert.isTrue(doubles.driverTwoStub.insertFixtures.calledOnce);
              })
            );
          });
          
          it('should call the insertFixtures() property with 2 arguments', function () {
            return(
              dbFixtures.insertFixtures({ prop: [ {} ] })
              .then(function () {
                assert.strictEqual(doubles.driverTwoStub.insertFixtures.args[0].length, 2);
              })
            );
          });
  
          describe('1st argument of the call to the insertFixtures() property', function () {
            it('should be the name of the 1st property of the object provided as argument to this function', function () {
              return(
                dbFixtures.insertFixtures({ testKey: [ {} ] })
                .then(function () {
                  assert.strictEqual(doubles.driverTwoStub.insertFixtures.args[0][0], 'testKey');
                })
              );
            });
          });
          
          describe('2nd argument of the call to the insertFixtures() property', function () {
            it('should be the value associated with the 1st property of the object provided as argument to this function', function () {
              const testValue = [ {} ];
              return(
                dbFixtures.insertFixtures({ prop: testValue })
                .then(function () {
                  assert.strictEqual(doubles.driverTwoStub.insertFixtures.args[0][1], testValue);
                })
              );
            });
          });
        });

        describe('if the fixtures object has 2 properties', function () {
          it('should call the insertFixtures() property 2 times', function () {
            return(
              dbFixtures.insertFixtures({ prop: [ {} ], key: [ {}, {} ] })
              .then(function () {
                assert.strictEqual(doubles.driverTwoStub.insertFixtures.callCount, 2);
              })
            );
          });
  
          describe('1st call to the insertFixtures() property', function () {
            it('should receive 2 arguments', function () {
              return(
                dbFixtures.insertFixtures({ prop: [ {} ], key: [ {}, {} ] })
                .then(function () {
                  assert.strictEqual(doubles.driverTwoStub.insertFixtures.args[0].length, 2);
                })
              );
            });
  
            describe('1st argument', function () {
              it('should be the 1st property of the fixtures object provided to this function', function () {
                return(
                  dbFixtures.insertFixtures({ prop: [ {} ], otherKey: [ {}, {} ] })
                  .then(function () {
                    assert.strictEqual(doubles.driverTwoStub.insertFixtures.args[0][0], 'prop');
                  })
                );
              });
            });
            
            describe('2nd argument', function () {
              it('should be the value associated with the 1st property of the fixtures object provided to this function', function () {
                const value = [ {} ];
                return(
                  dbFixtures.insertFixtures({ prop: value, otherKey: [ {}, {} ] })
                  .then(function () {
                    assert.strictEqual(doubles.driverTwoStub.insertFixtures.args[0][1], value);
                  })
                );
              });
            });
          });
  
          describe('2nd call to the insertFixtures() property', function () {
            it('should receive 2 arguments', function () {
              return(
                dbFixtures.insertFixtures({ prop: [ {} ], key: [ {}, {} ] })
                .then(function () {
                  assert.strictEqual(doubles.driverTwoStub.insertFixtures.args[1].length, 2);
                })
              );
            });
  
            describe('1st argument', function () {
              it('should be the 2nd property of the fixtures object provided to this function', function () {
                return(
                  dbFixtures.insertFixtures({ prop: [ {} ], otherKey: [ {}, {} ] })
                  .then(function () {
                    assert.strictEqual(doubles.driverTwoStub.insertFixtures.args[1][0], 'otherKey');
                  })
                );
              });
            });
            
            describe('2nd argument', function () {
              it('should be the value associated with the 2nd property of the fixtures object provided to this function', function () {
                const value = [ {}, {} ];
                return(
                  dbFixtures.insertFixtures({ prop: [ {} ], otherKey: value })
                  .then(function () {
                    assert.strictEqual(doubles.driverTwoStub.insertFixtures.args[1][1], value);
                  })
                );
              });
            });
          });
        });

        it('should not call the close() property', function () {
          return(
            dbFixtures.insertFixtures({ prop: [ {} ] })
            .then(function () {
              assert.isTrue(doubles.driverTwoStub.close.notCalled);
            })
          );
        });

        describe('if the call to the truncate() property returns a promise that rejects', function () {
          it('should return a promise that rejects with that Error object', function () {
            const testError = new Error('test error message');
            doubles.driverTwoStub.truncate.returns(Promise.reject(testError));
            return(
              dbFixtures.insertFixtures({ otherKey: [ {} ], index: [ {}, {} ] })
              .then(function () {
                assert.fail();
              })
              .catch(function (error) {
                assert.strictEqual(error, testError);
              })
            );
          });
          
          it('should not call the insertFixtures() property', function () {
            const testError = new Error('test error message');
            doubles.driverTwoStub.truncate.returns(Promise.reject(testError));
            return(
              dbFixtures.insertFixtures({ otherKey: [ {} ], index: [ {}, {} ] })
              .catch(function () {
                assert.isTrue(doubles.driverTwoStub.insertFixtures.notCalled);
              })
            );
          });
          
          it('should still call the 1st driver\'s truncate() property once', function () {
            const testError = new Error('test error message');
            doubles.driverTwoStub.truncate.returns(Promise.reject(testError));
            return(
              dbFixtures.insertFixtures({ otherKey: [ {} ], index: [ {}, {} ] })
              .catch(function () {
                assert.isTrue(doubles.driverOneStub.truncate.calledOnce);
              })
            );
          });
          
          it('should still call the 1st driver\'s insertFixtures() property 2 times', function () {
            const testError = new Error('test error message');
            doubles.driverTwoStub.truncate.returns(Promise.reject(testError));
            return(
              dbFixtures.insertFixtures({ otherKey: [ {} ], index: [ {}, {} ] })
              .catch(function () {
                assert.strictEqual(doubles.driverOneStub.insertFixtures.callCount, 2);
              })
            );
          });
        });

        describe('if the call to the insertFixtures() property returns a promise that rejects', function () {
          it('should return a promise that rejects with that Error object', function () {
            const testError = new Error('driver 2 insertFixtures() error message');
            doubles.driverTwoStub.insertFixtures.onCall(0).returns(Promise.reject(testError));
            return(
              dbFixtures.insertFixtures({ key: [] })
              .then(function () {
                assert.fail();
              })
              .catch(function (error) {
                assert.strictEqual(error, testError);
              })
            );
          });

          it('should still call the 1st driver\'s insertFixtures() once', function () {
            const testError = new Error('driver 2 insertFixtures() error message');
            doubles.driverTwoStub.insertFixtures.onCall(0).returns(Promise.reject(testError));
            return(
              dbFixtures.insertFixtures({ key: [] })
              .catch(function () {
                assert.isTrue(doubles.driverOneStub.insertFixtures.calledOnce);
              })
            );
          });
        });
      });

      it('should return a promise that resolves with void', function () {
        return(
          dbFixtures.insertFixtures({})
          .then(function (result) {
            assert.isUndefined(result);
          })
        );
      });
    });
  });

  describe('closeDrivers()', function () {
    describe('if 1 driver is set', function () {
      beforeEach(function () {
        doubles.driverOneStub.close.returns(Promise.resolve());
        
        dbFixtures.setDrivers(doubles.driverOneStub);
      });

      it('should call the driver\'s close() once', function () {
        dbFixtures.closeDrivers();
        assert.strictEqual(doubles.driverOneStub.close.callCount, 1);
      });

      it('should return a promise that resolves with void', function () {
        return(
          dbFixtures.closeDrivers()
          .then(function (res) {
            assert.isUndefined(res);
          })
        );
      });

      describe('if the call to the driver\'s close() returns a promise that rejects', function () {
        it('should return a promise that rejects with that Error object', function () {
          const testError = new Error('close error message');
          doubles.driverOneStub.close.returns(Promise.reject(testError));
          return(
            dbFixtures.closeDrivers()
            .then(function () {
              assert.fail();
            })
            .catch(function (error) {
              assert.strictEqual(error, testError);
            })
          );
        });
      });
    });

    describe('if 2 drivers are set', function () {
      beforeEach(function () {
        doubles.driverOneStub.close.returns(Promise.resolve());
        doubles.driverTwoStub.close.returns(Promise.resolve());
        
        dbFixtures.setDrivers(doubles.driverOneStub, doubles.driverTwoStub);
      });

      it('should call the 1st driver\'s close() once', function () {
        return(
          dbFixtures.closeDrivers()
          .then(function () {
            assert.strictEqual(doubles.driverOneStub.close.callCount, 1);
          })
        );
      });
      
      it('should call the 2nd driver\'s close() once', function () {
        return(
          dbFixtures.closeDrivers()
          .then(function () {
            assert.strictEqual(doubles.driverTwoStub.close.callCount, 1);
          })
        );
      });

      it('should return a promise that resolves with void', function () {
        return(
          dbFixtures.closeDrivers()
          .then(function (res) {
            assert.isUndefined(res);
          })
        );
      });

      describe('if the call to the 1st driver\'s close() returns a promise that rejects', function () {
        let testError;
        beforeEach(function () {
          testError = new Error('close error message');
          doubles.driverOneStub.close.returns(Promise.reject(testError));
        });

        it('should return a promise that rejects with that Error object', function () {
          return(
            dbFixtures.closeDrivers()
            .then(function () {
              assert.fail();
            })
            .catch(function (error) {
              assert.strictEqual(error, testError);
            })
          );
        });

        it('should still call the 2nd driver\'s close() once', function () {
          return(
            dbFixtures.closeDrivers()
            .then(function () {
              assert.fail();
            })
            .catch(function () {
              assert.strictEqual(doubles.driverTwoStub.close.callCount, 1);
            })
          );
        });
      });
      
      describe('if the call to the 2nd driver\'s close() returns a promise that rejects', function () {
        let testError;
        beforeEach(function () {
          testError = new Error('close error message');
          doubles.driverTwoStub.close.returns(Promise.reject(testError));
        });

        it('should return a promise that rejects with that Error object', function () {
          return(
            dbFixtures.closeDrivers()
            .then(function () {
              assert.fail();
            })
            .catch(function (error) {
              assert.strictEqual(error, testError);
            })
          );
        });

        it('should still call the 1st driver\'s close() once', function () {
          return(
            dbFixtures.closeDrivers()
            .then(function () {
              assert.fail();
            })
            .catch(function () {
              assert.strictEqual(doubles.driverOneStub.close.callCount, 1);
            })
          );
        });
      });
    });
  });
});