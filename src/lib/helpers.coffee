exports.errorConstructor = (type, defaultMessage) ->
    class extends Error
        constructor: (@message = defaultMessage) ->
            super @message
            @type = type

exports.truncateThousandths = (n) ->
    n_as_string = n.toString()
    parts = n_as_string.split "."
    parts[1] = parts[1].substr 0, 2
    parseFloat parts.join "."

