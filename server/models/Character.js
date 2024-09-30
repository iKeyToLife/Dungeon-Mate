const { Schema, model } = require('mongoose');
const AttributesSchema = require('./Attributes');
const SpellSchema = require('./Spells');

// Schema to create Character model
const CharacterSchema = new Schema(
    {
        // who create this character
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        race: {
            type: String,
            required: true,
            enum: ['Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Half-Elf', 'Half-Orc', 'Halfling', 'Human', 'Tiefling'],
        },
        gender: {
            type: String,
            required: true,
            enum: ['Male', 'Female'],
        },
        class: [{
            className: {
                type: String,
                required: true,
                enum: ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard']
            },
            level: {
                type: Number,
                required: true
            }
        }],
        characterImg: {
            type: String,
        },
        // level character
        level: {
            type: Number,
            required: true,
            default: 1,
            min: 1
        },
        attributes: {
            type: AttributesSchema,
            required: true
        },
        spells: [SpellSchema],
        inventory: [{
            name: {
                type: String,
                required: true,
                minlength: 1,
                maxlength: 100
            },
            type: {
                type: String,
                required: true,
                enum: ['weapon', 'armor', 'potion', 'tool', 'magicItem', 'miscellaneous'],
            },
            description: {
                type: String,
                required: true,
                minlength: 1,
                maxlength: 500
            }
        }],
    },
    {
        timestamps: true, // createdAt, updatedAt
        toJSON: { virtuals: true },
        id: false
    }
);


CharacterSchema.pre('save', function (next) {
    const totalClassLevel = this.class.reduce((sum, cls) => sum + cls.level, 0);
    if (totalClassLevel !== this.level) {
        return next(new Error('Total class levels must match character level'));
    }
    next();
});

// Initialize our Character model
const Character = model('character', CharacterSchema);

module.exports = Character;
