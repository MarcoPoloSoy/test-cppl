const { defaultNavigation, compactNavigation, futuristicNavigation, horizontalNavigation } = require('../data/navigation');

const getNavigation = (req, res) => {
    res.json({
        default: defaultNavigation,
        compact: compactNavigation,
        futuristic: futuristicNavigation,
        horizontal: horizontalNavigation
    });
};

module.exports = {
    getNavigation
};
