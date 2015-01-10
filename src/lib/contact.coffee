Promise = require "bluebird"

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

        Promise.new (res, rej) -> navigator.contacts.find queryFields, res, rej, options

module.exports = Contact

