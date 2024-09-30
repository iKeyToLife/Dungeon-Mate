const { Schema } = require('mongoose');

const SpellSchema = new Schema({
    index: {
        type: String,
        required: true
        // Unique identifier for the spell (e.g., "acid-arrow")
    },
    name: {
        type: String,
        required: true
        // Name of the spell (e.g., "Acid Arrow")
    },
    desc: [{
        type: String,
        required: true
        // Description of the spell as an array of strings
        // (e.g., "A shimmering green arrow streaks toward a target...")
    }],
    higher_level: [{
        type: String,
        // Additional effects when casting with higher-level spell slots
        // (e.g., "The damage increases by 1d4 for each slot level above 2nd.")
    }],
    range: {
        type: String,
        required: true
        // Range of the spell (e.g., "90 feet")
    },
    components: [{
        type: String,
        enum: ['V', 'S', 'M'],
        required: true
        // Components required for casting the spell:
        // 'V' — Verbal component,
        // 'S' — Somatic component,
        // 'M' — Material component
    }],
    material: {
        type: String,
        // Material components required, if any (e.g., "Powdered rhubarb leaf and an adder's stomach")
    },
    ritual: {
        type: Boolean,
        default: false
        // Indicates if the spell can be cast as a ritual (default: false)
    },
    duration: {
        type: String,
        required: true
        // Duration of the spell's effect (e.g., "Instantaneous")
    },
    concentration: {
        type: Boolean,
        default: false
        // Indicates if the spell requires concentration (default: false)
    },
    casting_time: {
        type: String,
        required: true
        // Time required to cast the spell (e.g., "1 action")
    },
    level: {
        type: Number,
        required: true
        // Spell level (e.g., 2 for a 2nd-level spell)
    },
    attack_type: {
        type: String,
        enum: ['melee', 'ranged'],
        // Type of attack: 'melee' (close combat) or 'ranged' (distance attack)
    },
    damage: {
        damage_type: {
            index: {
                type: String,
                required: true
                // Damage type identifier (e.g., "acid")
            },
            name: {
                type: String,
                required: true
                // Damage type name (e.g., "Acid")
            }
        },
        damage_at_slot_level: {
            type: Map,  // Using Map for dynamic keys (spell slot levels)
            of: String
            // Damage values based on the spell slot level (e.g., "2": "4d4", "3": "5d4")
        }
    },
    school: {
        index: {
            type: String,
            required: true
            // School of magic identifier (e.g., "evocation")
        },
        name: {
            type: String,
            required: true
            // Name of the school of magic (e.g., "Evocation")
        }
    }
});

module.exports = SpellSchema;