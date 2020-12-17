class PaginationResponse {
    constructor(totalItems, skip, limit, result) {
        this.totalItems = totalItems;
        this.totalPages = Math.ceil(totalItems / limit);
        this.skip = skip;
        this.limit = limit;
        this.result = result;
    }
}

module.exports = {
    PaginationResponse
}