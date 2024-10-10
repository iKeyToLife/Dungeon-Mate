const { Schema, model } = require('mongoose');
const AttributesSchema = require('./Attributes');

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
                required: true,
                default: 1,
                min: 1
            }
        }],
        characterImg: {
            type: String,
        },
        alignment: {
            type: String,
            enum: [
                'Lawful Good', 'Neutral Good', 'Chaotic Good',
                'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
                'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
            ],
            required: true
        },
        bio: {
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
        spells: [{
            // for fetch data dnd
            index: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true
            }
        }],
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
        }],
        proficiencies: [{
            type: String,
            required: true
        }]
    },
    {
        timestamps: true, // createdAt, updatedAt
        toJSON: { virtuals: true },
        id: false
    }
);


CharacterSchema.pre('save', function (next) {
    // find classNames
    const classNames = this.class.map(cls => cls.className);
    // check class is already
    const hasDuplicates = classNames.length !== new Set(classNames).size;

    // if there is already one in the array
    if (hasDuplicates) {
        return next(new Error('Class names must be unique in the class array.'));
    }
    // totalClassLevel must be the same or less
    const totalClassLevel = this.class.reduce((sum, cls) => sum + cls.level, 0);
    if (totalClassLevel > this.level) {
        return next(new Error("The overall class level must match or be less than the character's level."));
    }

    const spellIndexes = this.spells.map(spell => spell.index);
    const hasDuplicateSpells = spellIndexes.length !== new Set(spellIndexes).size;

    if (hasDuplicateSpells) {
        return next(new Error('Spell indexes must be unique in the spells array.'));
    }


    next();
});

// Initialize our Character model
const Character = model('character', CharacterSchema);

module.exports = Character;
