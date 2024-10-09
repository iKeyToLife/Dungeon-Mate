const { Schema, model } = require('mongoose');
const Campaign = require('./Campaign');
const Dungeon = require('./Dungeon');

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

EncounterSchema.pre('deleteOne', async function (next) {
    const query = this.getQuery();
    const encounterId = query._id;  // Retrieve encounterId from query 

    // Delete only current encounter from campaign
    await Campaign.updateMany(
        { encounters: encounterId },     // get all campaigns with current encounter
        { $pull: { encounters: encounterId } } // delete encounter from array encounters
    );
    // Delete only current encounter from dungeon
    await Dungeon.updateMany(
        { encounters: encounterId },     // get all dungeons with current encounter
        { $pull: { encounters: encounterId } } // delete encounter from array encounters
    );

    next();
});

// Initialize our Encounter model
const Encounter = model('encounter', EncounterSchema);

module.exports = Encounter;