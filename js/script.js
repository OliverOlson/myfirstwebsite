let isBlue = false;
let messageChanged = false; // track state

function showMessage() {
    let paragraph = document.getElementById('message');

    if (!messageChanged) {
        paragraph.innerText = "This page is where I'm learning how to build websites using HTML. (You clicked the button!)";
        messageChanged = true;
    } else {
        paragraph.innerText = "This page is where I'm learning how to build websites using HTML.";
        messageChanged = false;
    }
}
                    
function changeColor() {
    let button = document.getElementById('colorButton');

   if (!isBlue) {
        document.body.style.backgroundColor = 'lightblue';
        button.innerText = 'Turn White';
        isBlue = true;
    } else {
        document.body.style.backgroundColor = 'white';
        button.innerText = 'Turn Blue';
        isBlue = false;
    }
}

function toggleSidebar() {
    let sidebar = document.getElementById('sidebar');
    if (sidebar.style.width === '250px') {
        sidebar.style.width = '0';
    } else {
        sidebar.style.width = '250px'; // open width
    }
}
async function fetchTwinsRecord() {
    try {
        // To test error handling, swap which line is commented out:
const response = await fetch('https://statsapi.mlb.com/api/v1/standings?leagueId=103&season=2026'); // WORKING
// const response = await fetch('https://statsapi.mlb.com/api/v1/BROKEN'); // BROKEN
        const data = await response.json();
const divisions = data.records;
        for (let division of divisions) {
            for (let team of division.teamRecords) {
                if (team.team.id === 142) {
                    const wins = team.leagueRecord.wins;
                    const losses = team.leagueRecord.losses;
                    document.getElementById('twins-record').innerText = `Record: ${wins}-${losses}`;
                    const now = new Date();
document.getElementById('last-updated').innerText = `Updated as of ${now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
                }
            }
        }
    } catch (error) {
        document.getElementById('twins-record').innerText = 'Could not load record. I guess the Twins are just too good! 🤨 (Try again later!)';
    }
}

fetchTwinsRecord();

// Send a message to Firebase
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message === '') return; // don't send empty messages
    
    firebase.database().ref('messages').push({
        text: message,
        timestamp: Date.now()
    });
    
    input.value = ''; // clear the input box
}

// Listen for messages and display them
firebase.database().ref('messages').on('value', function(snapshot) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    
    snapshot.forEach(function(child) {
        const p = document.createElement('p');
        p.innerText = child.val().text;
        messagesDiv.appendChild(p);
    });
});
