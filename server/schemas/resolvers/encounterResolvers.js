const { Encounter } = require("../../models");
const { AuthenticationError } = require("../../utils/auth");


const encounterQueries = {
    encounters: async (_, args, context) => {
        if (context.user) {
            try {
                const userId = context.user._id;
                const encounters = await Encounter.find({ userId });

                if (!encounters) {
                    throw new Error("Encounters not found");
                }

                return encounters; // return all encounters
            } catch (err) {
                throw new Error(`Failed getEncounters: ${err.message}`)
            }
        } else {
            throw AuthenticationError;
        }
    },
    encounter: async (_, { encounterId }, context) => {
        if (context.user) {
            try {
                const userId = context.user._id;
                const encounter = await Encounter.findOne({ _id: encounterId, userId: userId });
                if (!encounter) {
                    throw new Error("Encounter not found or you do not have access rights to this encounter");
                }
                return encounter; // return encounter
            } catch (err) {
                throw new Error(`Failed getEncounter: ${err.message}`)
            }
        } else {
            throw AuthenticationError;
        }
    },
}

const encounterMutations = {
    addEncounter: async (_, args, context) => {
        if (context.user) {
            try {
                args.userId = context.user._id
                const newEncounter = new Encounter(args);

                await newEncounter.save(); // Save the encounter to the database

                return newEncounter; // Return the newly created encounter
            } catch (error) {
                throw new Error("Failed to create encounter: " + error.message);
            }
        }
        throw AuthenticationError;
    },
    updateEncounter: async (_, args, context) => {
        if (context.user) {
            try {
                const encounter = await Encounter.findOne({ _id: args.encounterId, userId: context.user._id });

                if (!encounter) {
                    throw new Error("Encounter not found or you are not authorized to update this encounter.");
                }
                Object.assign(encounter, args);

                await encounter.save();
                return encounter;
            } catch (error) {
                throw new Error(`Failed to update the encounter: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
    deleteEncounter: async (_, { encounterId }, context) => {
        if (context.user) {
            try {
                const userId = context.user._id
                const encounter = await Encounter.findOne({ _id: encounterId, userId: userId });

                if (!encounter) {
                    throw new Error("Encounter not found or you don't have permission to delete it.");
                }

                await Encounter.deleteOne({ _id: encounterId });

                return encounter;
            } catch (error) {
                throw new Error("Failed to delete encounter: " + error.message);
            }
        }

        throw AuthenticationError;

    }
}

module.exports = {
    encounterQueries,
    encounterMutations
};