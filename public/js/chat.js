const socket = io()

// const messageTemp = $('message-temp').html()
const messageTemp = document.querySelector('#message-temp').innerHTML
const locTemp = document.querySelector('#loc-temp').innerHTML
const sideTemp = document.querySelector('#sidebar-temp').innerHTML

//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    //Height of new message element
    const heg= parseInt($('#messages').children().last().css('marginBottom')) + $('#messages').children().last().outerHeight()
    //Visible height of messages container
    const visibleHeight = parseInt($('#messages').outerHeight())
    //Height of messages container
    const contHeight = $('#messages').prop('scrollHeight')
    //How far have I scrolled
    const scrollOffset = parseInt($('#messages').scrollTop()) + visibleHeight

    if (contHeight - heg <= scrollOffset) {
        $('#messages').scrollTop($('#messages').prop('scrollHeight'))
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemp, {username: message.username, message: message.text, createdAt: moment(message.createdAt).format('h:mm A')})
    $('#messages').append(html)
    autoscroll()
})

socket.on('locationMessage', (locdata) => {
    console.log(locdata)
    const html = Mustache.render(locTemp, {username: message.username, locurl: locdata.url, createdAt: moment(locdata.createdAt).format('h:mm A')})
    $('#messages').append(html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sideTemp, {room, users})
    $('#sidebarr').html(html)
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

socket.emit('join', {username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})