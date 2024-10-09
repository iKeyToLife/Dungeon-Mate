const { Schema, model } = require('mongoose');
const Campaign = require('./Campaign');
const Dungeon = require('./Dungeon');

// Schema to create Quest model
const QuestSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        // name Quest
        title: {
            type: String,
            required: true
        },
        details: {
            type: String,
            required: true
        },
        rewards: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true, // createdAt, updatedAt
        toJSON: { virtuals: true },
    }
)

QuestSchema.pre('deleteOne', async function (next) {
    const query = this.getQuery();
    const questId = query._id;  // Retrieve questId from query 

    // Delete only current quest from campaign
    await Campaign.updateMany(
        { quests: questId },     // get all campaigns with current quest
        { $pull: { quests: questId } } // delete quest from array quests
    );
    // Delete only current quest from dungeon
    await Dungeon.updateMany(
        { quests: questId },     // get all dungeons with current quest
        { $pull: { quests: questId } } // delete quest from array quests
    );

    next();
});

// Initialize our Quest model
const Quest = model('quest', QuestSchema);

module.exports = Quest;