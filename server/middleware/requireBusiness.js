const requireBusiness = (req, res, next) => {
    if (!req.user || req.user.role !== 'business') {
        return res.status(403).json({ message: 'Access denied. Business role required.' });
    }
    next();
};

module.exports = requireBusiness;
