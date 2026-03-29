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