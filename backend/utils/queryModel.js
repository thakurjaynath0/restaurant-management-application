const queryModel = async (request, Model, Settings, queryObj={}) => {
    const { 
        booleanFields= [],
        otherFields = [],
        numericFields = [],
        dateFields = [],
        allowSorting=true,
        allowSelection=true,
        allowPagination=true,
    } = Settings;

    const query = request.query;
    const others = {};
    const adminPrivilage = ['superuser', 'admin'].includes(request.user.role) ? true : false;
    
    // let queryObj = {}
    if(adminPrivilage){
        booleanFields.forEach(field => {
            query[field] && (queryObj[field] = query[field] === 'true' ? true : false)
        })

        otherFields.forEach(field => {
            query[field] && (queryObj[field] = { $in: query[field].split(',')})
        })

        if(!(numericFields.length <= 0 && otherFields.length <= 0) && (query['numericFilters'] || query['dateFilters'])){
            const operatorMap = {
                '>': '$gt',
                '>=': '$gte',
                '=': '$eq',
                '<': '$lt',
                '<=': '$lte',
              };
              const regEx = /\b(<|>|>=|=|<|<=)\b/g;
              let filtersNum = query['numericFilters']?.replace(regEx, (match) => `---${operatorMap[match]}---`);
              let filtersDate = query['dateFilters']?.replace(regEx, (match) => `---${operatorMap[match]}---`);
              
              const options = {
                  numeric: numericFields,
                  date: dateFields
              }
              
              filtersNum = filtersNum?.split(',').forEach((item) => {
                const [field, operator, value] = item.split('---');
                if (options.numeric.includes(field)) {
                  queryObj[field] = { ...queryObj[field], [operator]: Number(value) };
                }
              });
      
              filtersDate = filtersDate?.split(',').forEach((item) => {
                const [field, operator, value] = item.split('---');
                if (options.date.includes(field)) {
                  queryObj[field] = { ...queryObj[field], [operator]: new Date(value) };
                }
              });
        }
    }


    if(!adminPrivilage){
        const today = new Date(new Date().toLocaleDateString());
        const tommorow = new Date(new Date(today.toLocaleDateString()).setDate(today.getDate() + 1));
        queryObj['createdAt'] = {
            '$gte':today,
            '$lt':tommorow
        }
    }

    let result = Model.find(queryObj);
    console.log(queryObj)
    
    if(allowSorting && query['sort']){
        const sortList = query['sort'].split(',').join(' ');
        result = result.sort(sortList)
    } else {
        result = result.sort('-createdAt')
    }

    if(allowPagination){
        const limit = (query['limit'] && (parseInt(query['limit'], 10) > 0) ) ? parseInt(query['limit'], 10) : 10;
        const page = (query['page'] && (parseInt(query['page'], 10) > 0) ) ? parseInt(query['page'], 10) : 1;
        const skip = (page - 1) * limit;
        result = result.limit(limit).skip(skip);
        const docsCount = await Model.countDocuments(queryObj)
        others.totalPage = Math.ceil(docsCount / limit);
    }

    if(allowSelection && query['fields']){
        const fieldsList = query['fields'].split(',').join(' ');
        result = result.select(fieldsList)
    }

    return { result, others }
}

module.exports = queryModel