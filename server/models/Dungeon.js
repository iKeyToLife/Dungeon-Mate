const { Schema, model } = require('mongoose');
const Campaign = require('./Campaign');

// Schema to create Dungeon model
const DungeonSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        // name Dungeon
        title: {
            type: String,
            required: true
        },
        // story
        description: {
            type: String,
        },
        encounters: [{
            type: Schema.Types.ObjectId,
            ref: 'encounter',
            required: true
        }],
        quests: [{
            type: Schema.Types.ObjectId,
            ref: 'quest',
            required: true
        }],
    },
    {
        timestamps: true, // createdAt, updatedAt
        toJSON: { virtuals: true },
    }
)

DungeonSchema.pre('deleteOne', async function (next) {
    const query = this.getQuery();
    const dungeonId = query._id;  // Retrieve dungeonId from query 

    // Delete only current dungeon from campaign
    await Campaign.updateMany(
        { dungeons: dungeonId },     // get all campaigns with current dungeon
        { $pull: { dungeons: dungeonId } } // delete dungeon from array dungeons
    );

    next();
});

// Initialize our Dungeon model
const Dungeon = model('dungeon', DungeonSchema);

module.exports = Dungeon;