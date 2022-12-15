import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    phone: {
        type: String
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});


ContactSchema.index({fname: 1, lname: 1, email: 1, phone: 1}, {unique: true});
ContactSchema.methods.getFullName = function() {

    fullName = `${this.fname} ${this.lname}`
    return fullName

}

const Contact = mongoose.model('Contact', ContactSchema);

export default Contact;
