const { Campaign, Quest, Encounter, Dungeon } = require("../../models");
const { AuthenticationError } = require("../../utils/auth");
const { validateIds } = require("../../utils/validators");

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

                await validateIds(args.quests, Quest, 'quest'); // check have we quest at db

                await validateIds(args.encounters, Encounter, 'encounter'); // check have we encounter at db

                await validateIds(args.dungeons, Dungeon, 'dungeon'); // check have we dungeon at db

                await newCampaign.save(); // Save the campaign to the database

                return newCampaign; // Return the newly created campaign
            } catch (error) {
                throw new Error("Failed to create campaign: " + error.message);
            }
        }
        throw AuthenticationError;
    },
    updateCampaign: async (_, args, context) => {
        if (context.user) {
            try {
                const campaign = await Campaign.findOne({ _id: args.campaignId, userId: context.user._id })
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
                    throw new Error("Campaign not found or you are not authorized to update this campaign.");
                }

                await validateIds(args.quests, Quest, 'quest'); // check have we quest at db

                await validateIds(args.encounters, Encounter, 'encounter'); // check have we encounter at db

                await validateIds(args.dungeons, Dungeon, 'dungeon'); // check have we dungeon at db


                Object.assign(campaign, args);

                await campaign.save();
                return campaign;
            } catch (error) {
                throw new Error(`Failed to update the campaign: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
    deleteCampaign: async (_, { campaignId }, context) => {
        if (context.user) {
            try {
                const userId = context.user._id
                const campaign = await Campaign.findOne({ _id: campaignId, userId: userId });

                if (!campaign) {
                    throw new Error("Campaign not found or you don't have permission to delete it.");
                }

                await Campaign.deleteOne({ _id: campaignId });

                return campaign;
            } catch (error) {
                throw new Error("Failed to delete campaign: " + error.message);
            }
        }

        throw AuthenticationError;

    },
    addEncounterToCampaign: async (_, { campaignId, encounterId }, context) => {
        if (context.user) {
            try {
                const campaign = await Campaign.findOne({ _id: campaignId, userId: context.user._id })
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
                    throw new Error("Campaign not found or you are not authorized to update this campaign.");
                }

                await validateIds([encounterId], Encounter, 'encounter'); // check have we encounter at db

                // check unique encounter
                const encounterIndex = campaign.encounters.findIndex(encounter => encounter._id.toString() === encounterId);
                if (encounterIndex > -1) {
                    throw new Error("Encounter is already added to this campaign.");
                }

                // add new encounter
                campaign.encounters.push(encounterId);

                await campaign.save();
                const updateCampaign = await Campaign.findOne({ _id: campaignId, userId: context.user._id })
                    .populate({
                        path: "dungeons",
                        populate: [
                            { path: "encounters" },
                            { path: "quests" }
                        ]
                    })
                    .populate("encounters")
                    .populate("quests");


                return updateCampaign;
            } catch (error) {
                throw new Error(`Failed to add encounter: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
    removeEncounterFromCampaign: async (_, { campaignId, encounterId }, context) => {
        if (context.user) {
            try {
                const campaign = await Campaign.findOne({ _id: campaignId, userId: context.user._id })
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
                    throw new Error("Campaign not found or you are not authorized to update this campaign.");
                }

                const encounterIndex = campaign.encounters.findIndex(encounter => encounter._id.toString() === encounterId);
                if (encounterIndex === -1) {
                    throw new Error("Encounter not found in this campaign.");
                }

                // delete encounter from array
                campaign.encounters.splice(encounterIndex, 1);

                await campaign.save();
                return campaign;
            } catch (error) {
                throw new Error(`Failed to remove encounter: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
    addQuestToCampaign: async (_, { campaignId, questId }, context) => {
        if (context.user) {
            try {
                const campaign = await Campaign.findOne({ _id: campaignId, userId: context.user._id })
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
                    throw new Error("Campaign not found or you are not authorized to update this campaign.");
                }

                await validateIds([questId], Quest, 'quest'); // check have we quest at db

                // check unique quest
                const questIndex = campaign.quests.findIndex(quest => quest._id.toString() === questId);
                if (questIndex > -1) {
                    throw new Error("Quest is already added to this campaign.");
                }

                // add new quest
                campaign.quests.push(questId);

                await campaign.save();
                const updateCampaign = await Campaign.findOne({ _id: campaignId, userId: context.user._id })
                    .populate({
                        path: "dungeons",
                        populate: [
                            { path: "encounters" },
                            { path: "quests" }
                        ]
                    })
                    .populate("encounters")
                    .populate("quests");


                return updateCampaign;
            } catch (error) {
                throw new Error(`Failed to add quest: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
    removeQuestFromCampaign: async (_, { campaignId, questId }, context) => {
        if (context.user) {
            try {
                const campaign = await Campaign.findOne({ _id: campaignId, userId: context.user._id })
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
                    throw new Error("Campaign not found or you are not authorized to update this campaign.");
                }

                // check have we this quest in array
                const questIndex = campaign.quests.findIndex(quest => quest._id.toString() === questId);
                if (questIndex === -1) {
                    throw new Error("Quest not found in this campaign.");
                }

                // delete quest from array
                campaign.quests.splice(questIndex, 1);

                await campaign.save();
                return campaign;
            } catch (error) {
                throw new Error(`Failed to remove quest: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
    addDungeonToCampaign: async (_, { campaignId, dungeonId }, context) => {
        if (context.user) {
            try {
                const campaign = await Campaign.findOne({ _id: campaignId, userId: context.user._id })
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
                    throw new Error("Campaign not found or you are not authorized to update this campaign.");
                }

                await validateIds([dungeonId], Dungeon, 'dungeon'); // check have we dungeon at db

                // check unique dungeon
                const dungeonIndex = campaign.dungeons.findIndex(dungeon => dungeon._id.toString() === dungeonId);
                if (dungeonIndex > -1) {
                    throw new Error("Dungeon is already added to this campaign.");
                }

                // add new dungeon
                campaign.dungeons.push(dungeonId);

                await campaign.save();
                const updateCampaign = await Campaign.findOne({ _id: campaignId, userId: context.user._id })
                    .populate({
                        path: "dungeons",
                        populate: [
                            { path: "encounters" },
                            { path: "quests" }
                        ]
                    })
                    .populate("encounters")
                    .populate("quests");


                return updateCampaign;
            } catch (error) {
                throw new Error(`Failed to add dungeon: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
    removeDungeonFromCampaign: async (_, { campaignId, dungeonId }, context) => {
        if (context.user) {
            try {
                const campaign = await Campaign.findOne({ _id: campaignId, userId: context.user._id })
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
                    throw new Error("Campaign not found or you are not authorized to update this campaign.");
                }

                // check have we this dungeon in array
                const dungeonIndex = campaign.dungeons.findIndex(dungeon => dungeon._id.toString() === dungeonId);
                if (dungeonIndex === -1) {
                    throw new Error("Dungeon not found in this campaign.");
                }

                // delete dungeon from array
                campaign.dungeons.splice(dungeonIndex, 1);

                await campaign.save();
                return campaign;
            } catch (error) {
                throw new Error(`Failed to remove dungeon: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
}

module.exports = {
    campaignQueries,
    campaignMutations
};