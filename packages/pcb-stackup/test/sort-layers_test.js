// test suite for the layer mapping function
'use strict'

var expect = require('chai').expect

var sortLayers = require('../lib/sort-layers')

describe('sort layers function', function() {
  it('should reduce layers into an object with keys top and bottom', function() {
    var result = sortLayers([])

    expect(result.top).to.exist
    expect(result.bottom).to.exist
    expect(result.mech).to.exist
  })

  it('should add top layers to the top object', function() {
    var layers = [
      {type: {id: 'tcu'}, converter: {}},
      {type: {id: 'tsm'}, converter: {}},
      {type: {id: 'tss'}, converter: {}},
      {type: {id: 'tsp'}, converter: {}}
    ]

    var result = sortLayers(layers)

    expect(result.mech).to.be.empty
    expect(result.bottom).to.be.empty
    expect(result.top.cu).to.equal(layers[0].converter)
    expect(result.top.sm).to.equal(layers[1].converter)
    expect(result.top.ss).to.equal(layers[2].converter)
    expect(result.top.sp).to.equal(layers[3].converter)
  })

  it('should add bottom layers to the bottom object', function() {
    var layers = [
      {type: {id: 'bcu'}, converter: {}},
      {type: {id: 'bsm'}, converter: {}},
      {type: {id: 'bss'}, converter: {}},
      {type: {id: 'bsp'}, converter: {}}
    ]

    var result = sortLayers(layers)

    expect(result.mech).to.be.empty
    expect(result.top).to.be.empty
    expect(result.bottom.cu).to.equal(layers[0].converter)
    expect(result.bottom.sm).to.equal(layers[1].converter)
    expect(result.bottom.ss).to.equal(layers[2].converter)
    expect(result.bottom.sp).to.equal(layers[3].converter)
  })

  it('should add mechanical layers to the mech object', function() {
    var layers = [
      {type: {id: 'out'}, converter: {}},
      {type: {id: 'drl'}, converter: {defs: 'drl1'}},
      {type: {id: 'drl'}, converter: {defs: 'drl2'}}
    ]

    var result = sortLayers(layers)

    expect(result.top).to.be.empty
    expect(result.bottom).to.be.empty
    expect(result.mech.out).to.equal(layers[0].converter)
    expect(result.mech.drl1).to.equal(layers[1].converter)
    expect(result.mech.drl2).to.equal(layers[2].converter)
  })

  it('should ignore everything else', function() {
    var layers = [
      {type: {id: 'drw'}, layer: {}},
      {type: {id: 'drw'}, layer: {}},
      {type: {id: 'drw'}, layer: {}}
    ]

    var result = sortLayers(layers)

    expect(result.mech).to.be.empty
    expect(result.top).to.be.empty
    expect(result.bottom).to.be.empty
  })
})
