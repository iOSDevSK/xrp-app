exports.errorConstructor = (type, defaultMessage) ->
    class extends Error
        constructor: (message) ->
            super message
            @type = type
