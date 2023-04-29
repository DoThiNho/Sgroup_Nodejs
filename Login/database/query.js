const executeQuery = ({ db, query, params }) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, rows) => {
            if(err) return reject(err)
            resolve(rows)
        })
    })
}

const getOne = async ({ db, query, params }) => {
    const records = await executeQuery({db, query, params})
    if(records.length > 0) {
        return records[0]
    }
    return null
}

const create = async ({db, query, params}) => {
    const result = await executeQuery({db, query, params})
    if(result.affectedRows > 0){
        return true
    }
    return false
}

const update = async({db, query, params}) => {
    const result = await executeQuery({db, query, params})
    if(result.affectedRows > 0){
        return true
    }
    return false
}

module.exports = {
    getOne,
    create,
    update,
    executeQuery
}