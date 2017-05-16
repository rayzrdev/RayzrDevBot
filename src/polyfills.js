/**
 * @param {string} input The input to check
 * @memberof JSON
 */
JSON.isJSON = function (input) {
    try {
        JSON.parse(input);
        return true;
    } catch (err) {
        return false;
    }
};