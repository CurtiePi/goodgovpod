import mongoose from 'mongoose';
import Contact from '../models/contacts.js';

const dataAccess = class DataAccessController {
    /**
     * List all contacts in the database
     *
     */
    async listContacts () {
        try {
            let contacts = await Contact.find();

            return contacts;
        }
        catch (err) {
            console.log(`Received an error getting contact listing:\n${err}`);
        }
    }

    /**
     * Get specific contacts by id
     *
     */
    async getContactById (id) {
        try {
            var contact_id = mongoose.Types.ObjectId(id);
            let contact = await Contact.findById({_id: contact_id});
            return contact;
        }
        catch (err) {
            console.log(`Received an error getting contact:\n${err}`);
        }
    }

    async createContact (contact_data) {
        try {
            var contact = new Contact(contact_data);
            await contact.save();

            return contact;
        }
        catch(err) {
            console.log(`Received an error creating contact:\n${err}`);
        }
    }

    /**
     * Find specific contacts based on criteria
     *
     */
    async findContacts (criteria) {
        if (criteria._id) {
            criteria._id = mongoose.Types.ObjectId(criteria._id);
        }

        try {
            let contacts = await Contact.find(criteria);
            return contacts;
        }
        catch (err) {
            console.log(`Received an error finding contact:\n${err}`);
        }
    }

    /**
     * Update specific contact
     *
     */
    async updateContact (criteria, update ) {
        if (criteria._id) {
            criteria._id = mongoose.Types.ObjectId(criteria._id);
        }

        try {
            let contact = await Contact.findOneAndUpdate(criteria, update, {new: true});
            return contact;
        }
        catch (err) {
            console.log(`Received an error updating contact:\n${err}`);
        }
    }

    /**
     * Delete Contact
     *
     */
    async deleteContact (contact) {
        var c_id = mongoose.Types.ObjectId(contact._id);

        try {
            await Contact.deleteOne({_id: c_id});

            return pdf_list;
        }
        catch(err) {
            console.log(`Received an error deleting contact:\n${err}`);
        }
    }
};

export default new dataAccess();
