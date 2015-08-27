import XRP from 'xrp-app-lib'
import Timer from 'famous/utilities/Timer'
import {errorConstructor} from './helpers'
import jquery from 'jquery'
import QRCode from 'qr-code'

/* global HTMLElement */
/* global document */
/* global Promise */

/**
 * @module helpers
 */

export async function scanRippleURI() {
  const data = await scan()
  console.log('scan successful', data)

  const decodedURI = XRP.decodeURI(data.text)
  console.log('uri decoded', decodedURI)

  const address = decodedURI.address
  if (address === undefined) {
    throw new ParamsError('bad uri scanned')
  }

  decodedURI.account = XRP.importAccountFromAddress(address)
  return decodedURI
}

export function encodeOnHiddenCanvas(options) {
  const div = _$('qr-target')
  if (!!options.text) {
    return new QRCode(div, options)
  }
  else {
    throw new ParamsError('no uri specified')
  }
}

function scan() {
  return new Promise((resolve, reject) => {
    function result(data) {
      if (data.cancelled) {
        reject(new CloseScannerError())
      }
      else {
        resolve(data) 
      }
    }

    function notAvailable() {
      reject(new ScannerNotAvailableError())
    }
    
    window.cordova.plugins.barcodeScanner.scan(result, notAvailable)
  })
}

function $(idSelector) {
  return document.getElementById(idSelector)
}

function _$(divOrDivID) {
  let div
  if (typeof divOrDivID === 'string') {
    div = $(divOrDivID)
  }
  else if (divOrDivID instanceof HTMLElement) {
    div = divOrDivID
  }
  else {
    throw new ParamsError('bad input type')
  }
  return div
}

export class ScannerNotAvailableError extends Error {}
export class CloseScannerError extends Error {}
export class ParamsError extends Error {}

