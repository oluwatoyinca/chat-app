const generateMessage = (text) => {
    return {
        text, 
        createdAt: new Date().getTime()
    }
}

const generateLocMessage = (url) => {
    return {
        url, 
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocMessage
}