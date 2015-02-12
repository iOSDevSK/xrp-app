Promise = require "bluebird"
XRP = require "xrp-app-lib"
Timer = require "famous/utilities/Timer"
{errorConstructor} = require "./helpers"
jquery = require 'jquery'

QR =
    defaultURI: "ripple://rfemvFrpCAPc4hUa1v8mPRYdmaCqR1iFpe"

    scanRippleURI: ->
        @scan()
        .then (data) ->
            console.log "scan successful", data
            data
        .then ({text}) ->
            data = XRP.decodeURI text
        .then (data) ->
            console.log "uri decoded", data

            address = data.address or
                      data.to      or
                      throw new QR.Error
            data.account = XRP.importAccountFromAddress address
            data

    scan: ->
        new Promise (resolve, reject) ->
            result = (data) ->
                if data.cancelled is 0 then resolve data
                else reject new QR.CloseScannerError
            notAvailable = -> reject new QR.ScannerNotAvailableError
            cordova.plugins.barcodeScanner.scan result, notAvailable

    encode: (divOrDivID, options = width: 180, height: 180, colorDark: "#000") ->
        div = @_$ divOrDivID
        if options.text? then Promise.resolve new QRCode div, options
        else Promise.reject new QR.ParamsError "no uri specified"

    encodeOnHiddenCanvas: (options) ->
        div = @_$ "qr-target"
        if options.text? then new QRCode div, options
        else throw new QR.ParamsError "no uri specified"

    encodeRippleURI: (divID, data, options) ->
        Promise.resolve()
               .then ->       uri = XRP.encodeURI data
               .then (uri) => @encode divID, uri, options

    $: (idSelector) -> document.getElementById idSelector

    _$: (divOrDivID) ->
        if typeof divOrDivID is "string"
            div = @$ divOrDivID
        else if divOrDivID instanceof HTMLElement
            div = divOrDivID
        else throw new QR.ParamsError "bad input type"

    clearNodes: (divOrDivID) ->
        div = @_$ divOrDivID
        if div?
            while div.firstChild then div.removeChild div.firstChild
            Promise.resolve div
        else
            Promise.reject new QR.ParamsError "dom fragment does not exist"

QR.ScanError = errorConstructor "ScanError"
QR.ParamsError = errorConstructor "ParamsError"
QR.CloseScannerError = errorConstructor "CloseScannerError"
QR.ScannerNotAvailableError = errorConstructor "ScannerNotAvailableError"

module.exports = QR

