export const logoutUser = (req, res) => {
    try {
        // Perform logout actions here, such as clearing the user's session or token
        // For example, if using sessions:
        res.status(200).json({ message: 'Logged out complete' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
//# sourceMappingURL=logoutUserController.js.map