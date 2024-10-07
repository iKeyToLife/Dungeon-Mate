const { Schema, model } = require('mongoose');

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

// Initialize our Dungeon model
const Dungeon = model('dungeon', DungeonSchema);

module.exports = Dungeon;