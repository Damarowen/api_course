const advanceResults = (model, populate) => async (req, res, next) => {


    let query;

    // create copy of req query
    const reqQuery = {
        ...req.query
    };

    //field to exclude
    const removeField = ['select', 'sort', 'page', 'limit'];

    //loop over removeFiled and delete them from req query
    removeField.forEach(field => delete reqQuery[field]);
    console.log(reqQuery)
    console.log(req.query.select)

    // send to server translate to JSON
    let queryStr = JSON.stringify(reqQuery);
    // create query with operator filter
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|in)\b/g, match => `$${match}`);


    //finding resource
    query = model.find(JSON.parse(queryStr));

    //jika permintaan ada select
    if (req.query.select) {
        //split use for i.e name,address join use for i.e name addreess
        const field = req.query.select.split(',').join(' ');
        query = query.select(field);
    };

    //if req sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy);
    } else {
        //default 
        query = query.sort('-createdAt');
    }


    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    console.log('this is page ' + page)

    const limit = parseInt(req.query.limit, 10) || 20;
    console.log('this is limit ' + limit)

    const startIndex = (page - 1) * limit;
    console.log('this is startIndex ' + startIndex)

    const endIndex = page * limit;
    console.log('this is endIndex ' + endIndex)

    const total = await model.countDocuments();
    console.log('this is total ' + total)


    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }
    //executing query
    const results = await query

    // pagination result 

    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
        console.log(pagination)
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advanceResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next();

}

module.exports = advanceResults;