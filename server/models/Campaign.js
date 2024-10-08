const { Schema, model } = require('mongoose');

// Schema to create Campaign model
const CampaignSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        // name Campaign
        title: {
            type: String,
            required: true
        },
        // story
        description: {
            type: String,
        },
        npcs: [{
            description: {
                type: String,
                required: true
            }
        }],
        notes: [{
            description: {
                type: String,
                required: true
            }
        }],
        creatures: [{
            index: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }],
        quests: [{
            type: Schema.Types.ObjectId,
            ref: 'quest',
            required: true
        }],
        encounters: [{
            type: Schema.Types.ObjectId,
            ref: 'encounter',
            required: true
        }],
        dungeons: [{
            type: Schema.Types.ObjectId,
            ref: 'dungeon',
            required: true
        }],
    },
    {
        timestamps: true, // createdAt, updatedAt
        toJSON: { virtuals: true },
    }
)

// Initialize our Campaign model
const Campaign = model('campaign', CampaignSchema);

module.exports = Campaign;