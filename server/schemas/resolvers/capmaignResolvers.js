const { Campaign } = require("../../models");
const { AuthenticationError } = require("../../utils/auth");


const campaignQueries = {
    campaigns: async (_, args, context) => {
        if (context.user) {
            try {
                const userId = context.user._id;
                const campaigns = await Campaign.find({ userId })
                    .populate({
                        path: "dungeons",
                        populate: [
                            { path: "encounters" },
                            { path: "quests" }
                        ]
                    })
                    .populate("encounters")
                    .populate("quests");

                if (!campaigns) {
                    throw new Error("Campaign not found");
                }

                return campaigns; // return all dungeon
            } catch (err) {
                throw new Error(`Failed getCampaign: ${err.message}`)
            }
        } else {
            throw AuthenticationError;
        }
    },
    campaign: async (_, { campaignId }, context) => {
        if (context.user) {
            try {
                const userId = context.user._id;
                const campaign = await Campaign.findOne({ _id: campaignId, userId: userId })
                    .populate({
                        path: "dungeons",
                        populate: [
                            { path: "encounters" },
                            { path: "quests" }
                        ]
                    })
                    .populate("encounters")
                    .populate("quests");

                if (!campaign) {
                    throw new Error("campaign not found or you do not have access rights to this campaign");
                }
                return campaign; // return campaign
            } catch (err) {
                throw new Error(`Failed getCampaign: ${err.message}`)
            }
        } else {
            throw AuthenticationError;
        }
    },
}

const campaignMutations = {
    addCampaign: async (_, args, context) => {
        if (context.user) {
            try {

                args.userId = context.user._id
                const newCampaign = new Campaign(args);

                await newCampaign.save(); // Save the campaign to the database

                return newCampaign; // Return the newly created campaign
            } catch (error) {
                throw new Error("Failed to create campaign: " + error.message);
            }
        }
        throw AuthenticationError;
    },

}

module.exports = {
    campaignQueries,
    campaignMutations
};