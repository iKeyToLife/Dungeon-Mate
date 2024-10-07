const { Campaign } = require("../../models");
const { AuthenticationError } = require("../../utils/auth");

const campaignQueries = {
  // Get all campaigns tied to the user
  campaigns: async (_, __, context) => {
    if (context.user) {
      return Campaign.find({ userId: context.user._id });
    }
    throw new AuthenticationError('Not logged in');
  },

  // Get a specific campaign by ID
  campaign: async (_, { campaignId }, context) => {
    if (context.user) {
      return Campaign.findOne({ _id: campaignId, userId: context.user._id });
    }
    throw new AuthenticationError('Not logged in');
  },
};

const campaignMutations = {
  // Add a new campaign for the logged-in user
  addCampaign: async (_, args, context) => {
    if (context.user) {
      const campaign = new Campaign({ ...args, userId: context.user._id }); // Create new campaign tied to the user
      return campaign.save(); 
    }
    throw new AuthenticationError('Not logged in');
  },

  // Update an existing campaign
  updateCampaign: async (_, { campaignId, ...args }, context) => {
    if (context.user) {
      return Campaign.findOneAndUpdate(
        { _id: campaignId, userId: context.user._id }, // Only update if belongs to the user
        args,
        { new: true } // Return updated campaign
      );
    }
    throw new AuthenticationError('Not logged in');
  },

  // Delete a campaign if it belongs to the user
  deleteCampaign: async (_, { campaignId }, context) => {
    if (context.user) {
      return Campaign.findOneAndDelete({ _id: campaignId, userId: context.user._id });
    }
    throw new AuthenticationError('Not logged in');
  },
};

module.exports = { campaignQueries, campaignMutations };