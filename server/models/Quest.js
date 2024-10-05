const { Schema, model } = require('mongoose');

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

// Initialize our Quest model
const Quest = model('quest', QuestSchema);

module.exports = Quest;