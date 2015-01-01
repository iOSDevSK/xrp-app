module.exports =
    create: (id, text, color) ->
        new QRCode document.getElementById(id),
            width: 180
            text: text
            colorDark: color
        
