import express from 'express';
import { findContacts, createContact, deleteContact, updateContact, getContactList, getContactById } from '../controllers/routingController.js';

const contactRouter = express.Router();

/*
 * Contact routes
 */

/**
 * @api {get} contacts
 */
contactRouter.get('/', getContactList);           // Get list of all contacts
contactRouter.get('/:id', getContactById);        // Get a contact by Id

/**
 * @api {post} contacts
 */
contactRouter.post('/search', findContacts);      // Find contacts based on criteria
contactRouter.post('/update', updateContact);     // Update contact information
contactRouter.post('/create', createContact);     // Create a contact
contactRouter.post('/delete', deleteContact, (req, res, next) => {
    res.status(200).json({message: 'ok'});
});                                                 // Remove a contact

export default contactRouter;
