const validateIds = async (ids, Model, idType) => {
    if (ids && ids.length > 0) {
        const existingDocuments = await Model.find({ _id: { $in: ids } });
        if (existingDocuments.length !== ids.length) {
            throw new Error(`One or more ${idType} IDs are invalid.`);
        }
    }
};

module.exports = { validateIds }