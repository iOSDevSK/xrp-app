{errorConstructor} = require "./helpers"
$ = require "superagent"
XRP = require "xrp-app-lib"

#fieldTypes = navigator.contacts.fieldType

Contact =
    pickOne: ->
        new Promise (res, rej) -> navigator.contacts.pickContact res, rej

    find: (queryString, fields) ->
        fieldTypes = navigator.contacts.fieldType
        options = new ContactFindOptions
        options.filter = queryString
        options.multiple = true
        options.desiredFields = [
            fieldTypes.id
            fieldTypes.name
            fieldTypes.email
        ]

        unless fields instanceof Array then fields = [fields]
        queryFields = [fieldTypes.id]
        queryFields.push fieldTypes[field] for field of fields

        new Promise (res, rej) -> navigator.contacts.find queryFields, res, rej, options

    saveLocally: (contact, account) ->
        rippleURI = "ripple://#{account.publicKey}"
        url = new ContactField 'urls', rippleURI, false

        if contact.urls? then contact.urls.push url else contact.urls = [url]
        new Promise (res, rej) -> contact.save res, rej

    # Interacting with attest address service
    queryLink: (contact) ->        @request contact, "get"
    publish: (contact, account) -> @request contact, account, "post"

    request: (contact, account, request) ->
        unless request? then request = account

        if contact.emails && contact.emails[0] && contact.emails[0].value
            query = type: "email", value: contact.emails[0].value

        else if contact.phoneNumbers && contact.phoneNumbers[0] && contact.phoneNumbers[0].value
            query = type: "phone", value: contact.phoneNumbers[0].value

        else return Promise.reject new Contact.BadFormatError

        url = "https://attest.ripplewith.me/v1/links/#{query.type}/#{query.value}"
        if request is "post" then url += "/#{account.publicKey}"

        req = $[request] url
        req.set "Content-Type", "application/json"
        new Promise (res, rej) ->
            req.end ({ok, body, text}) -> if ok then res body else rej text

    hasARippleAddress: (contact) ->
        for url in contact.urls
            try return true if XRP.decodeURI url.value
            catch e then continue
        return false

Contact.BadFormatError = errorConstructor "BadFormatError"

module.exports = Contact

