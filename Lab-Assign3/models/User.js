const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true          // removes extra spaces from start and end
    },

    email: {
        type: String,
        required: true,
        unique: true,       // no two users can have the same email
        lowercase: true,    // always saves email in lowercase
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6        // minimum 6 characters
    },

    role: {
        type: String,
        enum: ['customer', 'admin'],   // role can only be one of these two values
        default: 'customer'            // new users are always customers by default
    }

}, { timestamps: true });


// This runs automatically BEFORE saving a user to the database
// It scrambles the password so it cannot be read
UserSchema.pre('save', async function() {

    // Only scramble the password if it was changed (not on every save)
    if (!this.isModified('password')) return;

    // bcrypt scrambles the password — the number 10 means how strong the scramble is
    this.password = await bcrypt.hash(this.password, 10);
});


// This is a helper method we can call to check if a typed password is correct
// It compares the typed password to the scrambled one in the database
UserSchema.methods.comparePassword = async function(typedPassword) {
    return await bcrypt.compare(typedPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);
