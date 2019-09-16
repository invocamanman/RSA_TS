var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();
import { expect } from 'chai';
import * as Rsa from '../src/Rsa';
import 'mocha';


beforeEach('Setting up the userList', function(done){
    Rsa.newKeys();
  });

describe('Test Keys', function () {
 it('should return number of charachters in a string', function (done) {
        let keyPair= Rsa.newKeys()
    });
 it('should return first charachter of the string', function () {
        assert.equal("Hello".charAt(0), 'H');
    });
});