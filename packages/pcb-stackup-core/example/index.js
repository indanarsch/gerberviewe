'use strict'

const fs = require('fs')
const path = require('path')
const runParallel = require('run-parallel')
const runWaterfall = require('run-waterfall')

const xid = require('@tracespace/xml-id')
const gerberToSvg = require('gerber-to-svg')
const whatsThatGerber = require('whats-that-gerber')
const pcbStackupCore = require('pcb-stackup-core')

const GERBERS_DIR = path.join(__dirname, '../../fixtures/boards/arduino-uno')

const TOP_OUT = path.join(__dirname, 'arduino-uno-top.svg')
const BOTTOM_OUT = path.join(__dirname, 'arduino-uno-bottom.svg')

const GERBER_PATHS = [
  'arduino-uno.cmp',
  'arduino-uno.drd',
  'arduino-uno.gko',
  'arduino-uno.plc',
  'arduino-uno.sol',
  'arduino-uno.stc',
  'arduino-uno.sts'
].map(filename => path.join(GERBERS_DIR, filename))

runWaterfall([renderAllLayers, renderStackupAndWrite], error => {
  if (error) return console.error('Error rendering stackup', error)

  console.log(`Wrote:\n  ${TOP_OUT}\n  ${BOTTOM_OUT}`)
})

function renderStackupAndWrite (layers, done) {
  const options = {
    id: xid.random(),
    maskWithOutline: true
  }

  const stackup = pcbStackupCore(layers, options)
  const tasks = [
    next => fs.writeFile(TOP_OUT, stackup.top.svg, next),
    next => fs.writeFile(BOTTOM_OUT, stackup.bottom.svg, next)
  ]

  runParallel(tasks, done)
}

function renderAllLayers (done) {
  const tasks = GERBER_PATHS.map(file => next => renderLayer(file, next))

  runParallel(tasks, done)
}

function renderLayer (filename, done) {
  const file = fs.createReadStream(filename)
  const type = whatsThatGerber(filename)

  const options = {
    id: xid.random(),
    plotAsOutline: type === 'out'
  }

  const converter = gerberToSvg(file, options, error => {
    if (error) return done(error)
    done(null, {type, converter})
  })
}
