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
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true
            }
        }],
    },
    {
        timestamps: true, // createdAt, updatedAt
        toJSON: { virtuals: true },
        id: false
    }
)

// Initialize our Dungeon model
const Dungeon = model('dungeon', DungeonSchema);

module.exports = Dungeon;