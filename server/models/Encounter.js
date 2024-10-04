const { Schema, model } = require('mongoose');

// Schema to create Encounter model
const EncounterSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        // name Encounter
        title: {
            type: String,
            required: true
        },
        details: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
        toJSON: { virtuals: true },
    }
)

// Initialize our Encounter model
const Encounter = model('encounter', EncounterSchema);

module.exports = Encounter;