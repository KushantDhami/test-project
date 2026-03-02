const isAdmin = async (req, res, next) => {
    try {
        if (req.role !== 'admin') {
            return res.status(403).json({
                message: "Access Denied: Admin rights required.",
                success: false
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default isAdmin;