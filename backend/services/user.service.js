const userModel = require('../models/user.model');

module.exports.createUser = async (userData) => {
    try {
        // Extract values from the userData object
        const { fullname, email, password } = userData;

        // Validate required fields
        if (!fullname?.firstname || !email || !password) {
            throw new Error('All fields are required');
        }

        // Create user using the proper structure
        const user = await userModel.create({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname || '' // Make lastname optional
            },
            email,
            password
        });

        return user;
    } catch (error) {
        throw error;
    }
};