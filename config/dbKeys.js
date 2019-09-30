// DB Keys for production and local development

// Check for environment
if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prodDBKeysConfig');
} else {
    module.exports = require('./devDBKeysConfig');
}