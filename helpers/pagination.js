module.exports = (objectPagination, query, countPage) => {
    
    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
    }
    if(query.limit){
        objectPagination.limitItem = parseInt(query.limit);
    }
    objectPagination.skip = parseInt((objectPagination.currentPage - 1) * objectPagination.limitItem);

    return objectPagination;
}