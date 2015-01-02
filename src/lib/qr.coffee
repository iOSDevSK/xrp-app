Promise = require "bluebird"
XRP = require "xrp-app-lib"
Timer = require "famous/utilities/Timer"

class QR
    scanRippleURI: ->
        @scan()
        .then ({text}) ->
            data = XRP.decodeURI text
        .then (data) ->
            address = data.address or
                      data.to      or
                      throw new QR::Error
            data.account = XRP.importAccountFromAddress address
            data

    scan: ->
        new Promise (res, rej) -> cordova.plugins.barcodeScanner.scan res, rej

    encode: (divOrDivID, options = width: 180, height: 180, color: "#foo") ->
        div = @_$ divOrDivID
        if options.text? then Promise.resolve new QRCode div, options
        else Promise.reject new QR::ParamsError "no uri specified"

    encodeRippleURI: (divID, data, options) ->
        Promise.resolve()
               .then ->       uri = XRP.encodeURI data
               .then (uri) => @encode divID, uri, options

    $: (idSelector) ->
        document.getElementById idSelector

    _$: (divOrDivID) ->
        if typeof divOrDivID is "string"
            div = @$ divOrDivID
        else if divOrDivID instanceof HTMLElement
            div = divOrDivID
        else throw new QR::ParamsError "bad input type"

    clearNodes: (divOrDivID) ->
        div = @_$ divOrDivID
        if div?
            while div.firstChild then div.removeChild div.firstChild
            Promise.resolve div
        else
            Promise.reject new QR::ParamsError "dom fragment does not exist"

QR::ScanError = class QRScanError extends Error
QR::ParamsError = class QRParamsError extends Error

module.exports = new QR

