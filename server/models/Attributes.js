const { Schema } = require('mongoose');

// subdocument attributes for characters
const AttributesSchema = new Schema({
    strength: {
        type: Number,
        required: true,
        default: 8,
        min: 1,
        max: 30
    },
    dexterity: {
        type: Number,
        required: true,
        default: 8,
        min: 1,
        max: 30
    },
    constitution: {
        type: Number,
        required: true,
        default: 8,
        min: 1,
        max: 30
    },
    intelligence: {
        type: Number,
        required: true,
        default: 8,
        min: 1,
        max: 30
    },
    wisdom: {
        type: Number,
        required: true,
        default: 8,
        min: 1,
        max: 30
    },
    charisma: {
        type: Number,
        required: true,
        default: 8,
        min: 1,
        max: 30
    },
    hitPoints: { 
        type: Number, 
        required: true, 
        default: 0, 
        min: 0
    },
    armorClass: { 
        type: Number, 
        required: true, 
        default: 0, 
        min: 0
    },
    attackPower: { 
        type: Number, 
        required: true, 
        default: 0, 
        min: 0
    },
    magicPower: { 
        type: Number, 
        required: true, 
        default: 0, 
        min: 0
    },
}, { _id: false });

module.exports = AttributesSchema;
