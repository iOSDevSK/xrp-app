###*
 * @module helpers
###

###*
 * constructs an error type out of a default type and message
 *
 * @function errorConstructor
 * @param {String} type
 * @param {String} defaultMessage
 * @return {Class:Error} Throwable
###
exports.errorConstructor = (type, defaultMessage) ->
    class extends Error
        constructor: (@message = defaultMessage) ->
            super @message
            @type = type

###*
 * truncates a float to the thousandths place
 * uses string slicing
 *
 * @function truncateThousandths
 * @param {Number} n
 * @return {Number}
###
exports.truncateThousandths = (n) ->
    n_as_string = n.toString()
    parts = n_as_string.split "."
    parts[1] = parts[1].substr 0, 2
    parseFloat parts.join "."

