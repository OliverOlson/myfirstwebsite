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
    
    const user = firebase.auth().currentUser;
    
    firebase.database().ref('users/' + user.uid).once('value', function(snapshot) {
        const userData = snapshot.val();
        const firstName = userData.firstName;
        const lastInitial = userData.lastName.charAt(0);
        const displayName = firstName + ' ' + lastInitial + '.';
        
        firebase.database().ref('messages').push({
            text: message,
            sender: displayName,
            timestamp: Date.now()
        });
        
        input.value = ''; // clear the input box
    });
}

document.getElementById('messageInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Listen for messages and display them
firebase.database().ref('messages').on('value', function(snapshot) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    
    snapshot.forEach(function(child) {
    const val = child.val();
    if (!val.text) return;
    
    const messageId = child.key;
    const adminUID = 'TnkpB0VOT9U5weILoLKtAGc8rYj2';
    const currentUser = firebase.auth().currentUser;
    
    // Create message container
    const div = document.createElement('div');
    div.style.borderBottom = '1px solid #ccc';
    div.style.padding = '10px 0';
    
    // Message text and sender
    const sender = val.sender ? val.sender : 'Unknown';
    const p = document.createElement('p');
    p.innerText = val.text + '  •  ' + sender;
    div.appendChild(p);
    
    // Delete button — only for admin
    if (currentUser && currentUser.uid === adminUID) {
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = '🗑️ Delete';
        deleteBtn.onclick = function() {
            firebase.database().ref('messages/' + messageId).remove();
        };
        div.appendChild(deleteBtn);
    }
    
    messagesDiv.appendChild(div);
});
});
// Show/hide auth forms
function showSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function showLogin() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function showForgotPassword() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('forgot-form').style.display = 'block';
}

function sendResetEmail() {
    const email = document.getElementById('forgotEmail').value.trim();
    
    if (!email) {
        alert('Please enter your email!');
        return;
    }
    
    firebase.auth().sendPasswordResetEmail(email)
        .then(function() {
            alert('Reset email sent! Check your inbox.');
            showLogin();
        })
        .catch(function(error) {
            alert(error.message);
        });
}
function signup() {
    const firstName = document.getElementById('signupFirst').value.trim();
    const lastName = document.getElementById('signupLast').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if (!firstName || !lastName || !email || !password) {
        alert('Please fill in all fields!');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            const user = userCredential.user;
            // Store name in database
            firebase.database().ref('users/' + user.uid).set({
                firstName: firstName,
                lastName: lastName,
                email: email
            });

            // Send welcome email
            emailjs.init('8bkNhIWygssfih90a');
            emailjs.send('service_qmf2cun', 'template_8xdsbga', {
                to_name: firstName,
                to_email: email
            });
        })
        .catch(function(error) {
            alert(error.message);
        });
}

// Login
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            alert(error.message);
        });
}

// Logout
function logout() {
    firebase.auth().signOut();
}

// Listen for auth state changes
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is logged in
        firebase.database().ref('users/' + user.uid).once('value', function(snapshot) {
            const userData = snapshot.val();
            if (userData) {
                document.getElementById('welcome-message').innerText = 
                    `Welcome, ${userData.firstName} ${userData.lastName}!`;
            }
        });
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('board-section').style.display = 'block';
    } else {
        // User is logged out
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('board-section').style.display = 'none';
    }
});

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

// Chat history for AI memory
let chatHistory = [];

async function sendChat() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Show user message in chat display
    const chatDisplay = document.getElementById('chat-display');
    const userMsg = document.createElement('p');
    userMsg.innerText = 'You: ' + message;
    chatDisplay.appendChild(userMsg);
    
    // Add to history
    chatHistory.push({ role: 'user', content: message });
    
    // Clear input
    input.value = '';
    
    // Show loading
    const loadingMsg = document.createElement('p');
    loadingMsg.id = 'loading';
    loadingMsg.innerText = 'AI is thinking...';
    chatDisplay.appendChild(loadingMsg);
    
    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history: chatHistory })
        });
        
        const data = await response.json();
        const reply = data.reply;
        
        // Remove loading message
        document.getElementById('loading').remove();
        
        // Show AI response
        const aiMsg = document.createElement('p');
        aiMsg.innerText = 'AI: ' + reply;
        chatDisplay.appendChild(aiMsg);
        
        // Add to history
        chatHistory.push({ role: 'assistant', content: reply });
        
    } catch (error) {
        document.getElementById('loading').remove();
        const errorMsg = document.createElement('p');
        errorMsg.innerText = 'Something went wrong. Try again!';
        chatDisplay.appendChild(errorMsg);
    }
}

// Enter key sends chat message
if (document.getElementById('chatInput')) {
    document.getElementById('chatInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendChat();
        }
    });
}
