const message_div = document.querySelector('.messages')
const entry = document.querySelector('.entry')
let top_height = 10

let message_history = []

function createClientMessage(text) {
    let message = document.createElement('p')
    message.innerHTML = text
    message.style.color = 'white'
    message.style.backgroundColor = 'darkslategrey'
    message_div.appendChild(message)
    message.style.right = '3px'
    message.style.top = top_height + 'px'
    message.style.overflowX = 'auto'
    message.style.maxHeight = '300px'
    message.style.borderColor = 'darkslategrey'
    message.style.textAlign = 'right'
    console.log(text)

    top_height += message.offsetHeight + 10
    message_div.scrollTop = message_div.scrollHeight
}

function createChatbotMessage(text) {
    let message = document.createElement('p')
    message.innerHTML = text
    message.style.color = 'black'
    message.style.backgroundColor = 'lightgrey'
    message_div.appendChild(message)
    message.style.left = '3px'
    message.style.top = top_height + 'px'
    message.style.overflowX = 'auto'
    message.style.maxHeight = '600px'
    message.style.borderColor = 'lightgrey'
    message.style.textAlign = 'left'
    console.log(text)

    top_height += message.offsetHeight + 10
    message_div.scrollTop = message_div.scrollHeight
}

function SendMessage() {
    let text = entry.value
    if (text != '') {
        createClientMessage(text)

        message_history.push({
            role: 'user',
            content: text
        })

        entry.value = ''
        entry.readOnly = true
        entry.placeholder = 'Please wait... Generating response...'

        // get response
        let body = {
            messages: message_history
        }

        // send to /response
        let err = false
        fetch('/response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            err = !response.ok
            return response.json()
        })
        
        // handle response
        .then(data => {
            console.log(data)

            if (err) {
                createChatbotMessage('Something went wrong. Please try again.')
                entry.readOnly = false
                entry.placeholder = 'Enter your prompt'
                message_history.pop()
            } else {
                // get the text
                let response = data['choices'][0]['message']

                message_history.push({
                    role: response['role'],
                    content: response['content']
                })
                // reenable entry and create response textbox
                createChatbotMessage(response['content'])
                entry.readOnly = false
                entry.placeholder = 'Enter your prompt'
            }
        })
    }
}


// allows Enter to press Send while Entry is in focus
entry.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.querySelector('.send-button').click();
    }
  });