const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const Character = require('./Character');
const Dungeon = require('./Dungeon');

// Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
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
            type: [String],
            enum: ['master', 'player'],
            default: ['player'],
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
        timestamps: true, // createdAt, updatedAt
        toJSON: { virtuals: true },
        id: false
    }
);

// check validate password
userSchema.statics.validatePassword = function (password) {
    const passwordRegex = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}/;
    return passwordRegex.test(password);
};


userSchema.pre('save', async function (next) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.email = this.email.toLowerCase();
    next();
})

userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        const User = model('user');

        if (!User.validatePassword(update.password)) {
            return next(new Error('Password validation failed. Password must contain at least 8 characters, including letters, numbers, and special characters.'));
        }
        const saltRounds = 10;
        update.password = await bcrypt.hash(update.password, saltRounds);
    }

    if (update.email) {
        update.email = update.email.toLowerCase();
    }

    next();
});

userSchema.pre('findOneAndDelete', async function (next) {

    const query = this.getQuery();
    // Retrieve userId from query
    const userId = query._id;

    await Character.deleteMany({ userId: userId }); // Delete all characters by userId
    await Dungeon.deleteMany({ userId: userId }); // Delete all Dungeon by userId

    next();
});

userSchema.virtual('fullName').get(function () {
    return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Initialize our User model
const User = model('user', userSchema);

module.exports = User;
