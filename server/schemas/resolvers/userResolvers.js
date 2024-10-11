const { User } = require("../../models");
const { AuthenticationError, signToken } = require("../../utils/auth");
const bcrypt = require("bcrypt");

const userQueries = {
    users: async () => {
        const users = await User.find();

        return users;
    },
    user: async (_, args, context) => {
        if (context.user) {
            try {
                const userId = context.user._id;
                const user = await User.findOne({ _id: userId }); // find by userId

                if (!user) {
                    throw new Error("User not found"); // if not found, throw error
                }

                return user;
            } catch (error) {
                throw new Error(`Failed to delete character: ${error.message}`);
            }
        } else {
            throw AuthenticationError;
        }
    },
}

const userMutations = {
    login: async (parent, { email, password }) => {
        // get user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        // compare password
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            throw new Error("Incorrect e-mail or password");
        }

        // generate token
        const token = signToken(user);

        return { token, user };
    },
    signUp: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);

        return { token, user }
    },
    updateUser: async (parent, args, context) => {
        if (context.user) {
            try {

                return await User.findByIdAndUpdate(context.user._id, args, { new: true });

            } catch (error) {
                throw new Error(`Failed to update user: ${error.message}`);
            }
        }
        throw AuthenticationError;
    },
    deleteUser: async (parent, args, context) => {
        if (context.user) {
            try {
                const user = await User.findByIdAndDelete(context.user._id);

                if (!user) {
                    throw new Error(`User not found`);
                }

                return user
            } catch (error) {
                throw new Error(`Failed to delete user: ${error.message}`);
            }
        } else {
            throw AuthenticationError
        }
    },
}

module.exports = {
    userQueries,
    userMutations,
};