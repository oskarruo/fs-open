const tokenExctractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.replace('Bearer ', '')
        request.token = token
    } else {
        request.token = null
    }
    next()
}

module.exports = tokenExctractor