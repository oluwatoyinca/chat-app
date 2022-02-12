const socket = io()

// const messageTemp = $('message-temp').html()
const messageTemp = document.querySelector('#message-temp').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemp)
    $('#messages').append(html)
})

$('form').on('submit', (e) => {
    e.preventDefault()

    $('#formsub').attr('disabled', true)

    var mess = $('#message').val()
    //last paramenter enables acknowledgement when message is delivered. 
    //It's a callback funtion and should be called in the .on() listener for this event
    socket.emit('sendMessage', mess, (error) => {
        $('#formsub').attr('disabled', false)
        $('#message').val('')
        $('#message').focus()

        if(error) {
            return console.log(error)
        }
        
        console.log('Message Delivered')
    })
})

$('#location').on('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $('#location').attr('disabled', true)
    
    navigator.geolocation.getCurrentPosition((position) => {
        const data = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
        }
        socket.emit('sendLocation', data, () => {
            console.log('Location shared')
            $('#location').attr('disabled', false)
        })
    })
})