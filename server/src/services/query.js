
const DEFAULT_LIMIT = 0;
const DEFAULE_PAGE = 1;

function getPagination(query){
    const limit = Math.abs(query.limit) || DEFAULT_LIMIT;
    const page = Math.abs(query.page) || DEFAULE_PAGE;
    const skip = (page - 1) * limit;
    return {
        limit,
        skip
    }
}

module.exports = {
    getPagination
}