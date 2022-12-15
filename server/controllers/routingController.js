import dataAccess from './dataAccessController.js';


/*
 * Contacts
 *
 */
const getContactList = async (req, res, next) => {
    try {
        var contacts = await dataAccess.listContacts();
        res.status(200).json(contacts);
    }
    catch(err) {
        res.status(500).json({
            message: `Error retrieving contact list ${err}` 
        })
    }
}

const getContactById = async (req, res, next) => {
    try {
        var contact = await dataAccess.getContactById(req.params.id);
        res.status(200).json(contact);
    }
    catch(err) {
        res.status(500).json({
            message: `Error retrieving contact ${err}` 
        });
    }
}

const findContacts = async (req, res, next) => {
    try {
        var contacts = await dataAccess.findContacts(req.body.criteria);
        res.status(200).json(contacts);
    }
    catch(err) {
        res.status(500).json({
            message: `Error searching for contacts ${err}` 
        });
    }
}

const createContact = async(req, res, next) => {
    try{
        var contact = await dataAccess.createContact(req.body);
        res.status(200).json(contact);
    }
    catch(err) {
        res.status(500).json({
            message: `Error creating contact ${err}`
        });
    }
}

const updateContact = async (req, res, next) => {
    try {
        var contact = await dataAccess.updateContact(req.body.criteria, req.body.update);
        res.status(200).json(contact);
    }
    catch(err) {
        res.status(500).json({
            message: `Error updating contact ${err}` 
        });
    }
}

const deleteContact = async (req, res, next) => {
    try{
        req.pdf_list = await dataAccess.deleteContact(req.body.contact);
        next();
    }
    catch(err) {
        res.status(500).json({
            message: `Error deleting contact ${err}`
        });
    }
}

export { getContactList, getContactById, findContacts, createContact, updateContact, deleteContact };
