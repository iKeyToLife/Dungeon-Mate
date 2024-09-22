const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            match: [/.+@.+\..+/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['master', 'player'],
            default: 'player',
        },
        profile: {
            firstName: String,
            lastName: String,
            avatar: { // Url for avatar user
                type: String,
                validate: {
                    validator: function (v) {
                        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(v);
                    },
                    message: 'Invalid image URL'
                }
            },
            bio: String
        },
    },

    {
        timestamps: true,
        toJSON: { virtuals: true },
        id: false
    }
);



userSchema.virtual('fullName').get(function () {
    return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Initialize our User model
const User = model('user', userSchema);

module.exports = User;
