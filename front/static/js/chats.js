loadPage()
let madeChats

async function loadPage() {
    try {
        const chats = await axios.get("/api/chats")
        madeChats = 0
        renderCards(chats.data.chats)
        checkForMadeCards(chats.length)
    } catch (err) {
        console.log(err)
    }
}

function addEventListeners() {
    const chatBtns = [...document.querySelectorAll("#chat-button")]
    chatBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
            window.location.href = `chat?id=${getId(btn)}`
        })
    )
}

async function renderCards(chats) {
    try {
        const cards = document.querySelector("#chat-list")
        cards.innerHTML = ""
        chats.forEach (async (chatId) => {
            try {
                const chatSmall = await axios.get(`/api/chats/${chatId}/small`)
                const latestMessageDate = new Date(chatSmall.data.time)
                let latestMessageHour = latestMessageDate.getHours()
                if (latestMessageHour < 10) {
                    latestMessageHour = "0" + latestMessageHour
                }
                let latestMessageMinute = latestMessageDate.getMinutes()
                if (latestMessageMinute < 10) {
                    latestMessageMinute = "0" + latestMessageMinute
                }
                cards.innerHTML += createCard(chatId, chatSmall.data.chatName, chatSmall.data.latestMessage, latestMessageHour, latestMessageMinute)
                madeChats++
            } catch (err) {
                console.log(err)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

function createCard(chatId, chatName, latestMessage, latestMessageHour, latestMessageMinute) {
    const card = `
    <div chat-id="${chatId}" class="friend-drawer friend-drawer--onhover">
        <img class="profile-image" src="img/user-white.png" alt="">
        <div class="text">
            <span class="time text-muted small">${latestMessageHour}:${latestMessageMinute}</span>
            <h6>${chatName}</h6>
            <p class="text-muted">${latestMessage}</p>
        </div>
        <button id="chat-button" type="button" class="btn btn-primary">Show messages</button>
    </div>`
    return card
}

function getId(btn) {
    const parent = btn.parentElement
    const id = parent.getAttribute("chat-id")
    return id
}

async function checkForMadeCards(chatLength) {
    try {
        await sleep(1000)
        if (madeChats == chatLength) {
            addEventListeners()
            await sleep(30000)
            loadPage()
        } else {
            checkForMadeCards(chatLength)
        }
    } catch (err) {
        console.log(err)
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const sendButton = document.querySelector("#start-chat-button")
sendButton.addEventListener("click", getInput)

async function getInput() {
    try {
        const chatName = document.querySelector("#chatName")
        const participantsString = document.querySelector("#participants")
        const participantsStringTrimmed = participantsString.value.replace(/\s+/g, '')
        const participants = participantsStringTrimmed.split(",")
        const newChat = {
            name: chatName.value,
            participants: participants
        }
        await axios.post("/api/chats", newChat)
        chatName.value = ""
        participantsString.value = ""
        loadPage()
    } catch (err) {
        console.log(err)
    }
}