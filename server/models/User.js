const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const Character = require('./Character');
const Dungeon = require('./Dungeon');
const Quest = require('./Quest');
const Campaign = require('./Campaign');
const Encounter = require('./Encounter');

// Schema to create User model
const UserSchema = new Schema(
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
UserSchema.statics.validatePassword = function (password) {
    const passwordRegex = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}/;
    return passwordRegex.test(password);
};


UserSchema.pre('save', async function (next) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.email = this.email.toLowerCase();
    next();
})

UserSchema.pre('findOne', function (next) {
    if (this.getQuery().email) {
        this.getQuery().email = this.getQuery().email.toLowerCase();
    }
    next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
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

UserSchema.pre('findOneAndDelete', async function (next) {

    const query = this.getQuery();
    // Retrieve userId from query
    const userId = query._id;

    await Character.deleteMany({ userId: userId });     // Delete all characters by userId
    await Campaign.deleteMany({ userId: userId });      // Delete all Campaign by userId
    await Dungeon.deleteMany({ userId: userId });       // Delete all Dungeon by userId
    await Quest.deleteMany({ userId: userId });           // Delete all Dungeon by userId
    await Encounter.deleteMany({ userId: userId });       // Delete all Dungeon by userId

    next();
});

UserSchema.virtual('fullName').get(function () {
    return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Initialize our User model
const User = model('user', UserSchema);

module.exports = User;
