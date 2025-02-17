// -----------------------------------------------------------------|
// DIGITAL CLOCK + COLOR THEME TOGGLE
// -----------------------------------------------------------------|
let hrs = document.getElementById('hrs');
let min = document.getElementById('min');
let sec = document.getElementById('sec');

setInterval(()=>{
    let currentTime = new Date();

    hrs.innerHTML = (currentTime.getHours()<10?"0":"") + currentTime.getHours();
    min.innerHTML = (currentTime.getMinutes()<10?"0":"") + currentTime.getMinutes();
    sec.innerHTML = (currentTime.getSeconds()<10?"0":"") + currentTime.getSeconds();

},1000)

const themeToggleBtn = document.querySelector('.digital-clock');
const theme = localStorage.getItem('theme');
theme && document.body.classList.add(theme);
const handleThemeToggle = () => {
    document.body.classList.toggle('color-swap');
    if (document.body.classList.contains('color-swap')) {
      localStorage.setItem('theme', 'color-swap');
    } else {
      localStorage.removeItem('theme');
    }
  };
  
themeToggleBtn.addEventListener('click', handleThemeToggle);

// -----------------------------------------------------------------|
// NOTES APP
// -----------------------------------------------------------------|
const NOTE_STORAGE_KEY = 'myNotes'; 

const notesContainer = document.querySelector('.notes-container');

let inputOpen = false;

const notesList = document.querySelector('.notes-list');
const notesNav = document.querySelector('.notes-nav');

const createNoteBtn = document.getElementById('create-note');
const saveNoteBtn = document.getElementById('save-note');
const deleteNoteBtn = document.getElementById('delete-note');
deleteNoteBtn.style.visibility = "hidden";

const clearNoteDialog = document.getElementById('clear-note');
const saveNoteDialog = document.getElementById('save-input');
const deleteNoteDialog = document.getElementById('delete-save');
const overwriteNoteDialog = document.getElementById('overwrite-input');

const optYesClear = document.getElementById('clear-note').querySelector('#optYes');
const optNoClear = document.getElementById('clear-note').querySelector('#optNo');
const optYesSave = document.getElementById('save-input').querySelector('#optYes');
const optNoSave = document.getElementById('save-input').querySelector('#optNo');
const optYesOverwrite = document.getElementById('overwrite-input').querySelector("#optYes");
const optNoOverwrite = document.getElementById('overwrite-input').querySelector("#optNo");
const optYesDelete = document.getElementById('delete-save').querySelector('#optYes');
const optNoDelete = document.getElementById('delete-save').querySelector('#optNo');
const optNoBtn = document.getElementById('optNo');

let titleBox = document.createElement('h2');            
titleBox.className = 'note-title';
titleBox.contentEditable = true;

let inputBox = document.createElement('p');
inputBox.className = 'note-input';
inputBox.contentEditable = 'true';

notesContainer.insertBefore(titleBox, notesNav);
notesContainer.insertBefore(inputBox, notesNav);

saveNoteBtn.style.visibility = "visible";
inputOpen = true;

let isEditing = false; // Flag to track if editing an existing note
let currentNoteTitle = null; // Store the title of the note being edited

createNoteBtn.addEventListener('click', () => {
    clearNoteDialog.showModal();
    
    optYesClear.addEventListener('click', () => {
        titleBox.textContent = "";
        inputBox.textContent = "";
        clearNoteDialog.close();
        deleteNoteBtn.style.visibility = "hidden"; 

        isEditing = false;
        currentNoteTitle = null; 
    })

    optNoClear.addEventListener('click', () => {
        clearNoteDialog.close();
    })
        
})

saveNoteBtn.addEventListener('click', () => {

    if(titleBox.textContent.length > 0){

        if(isEditing && currentNoteTitle){
            overwriteNoteDialog.showModal();
        }
        else{
            saveNoteDialog.showModal();
        }
    }
    
    else if(titleBox.textContent.length < 1){
        addTitleDialog.showModal();
    }
})

optYesSave.addEventListener('click', () => {
    const noteTitle = titleBox.textContent.trim();
    saveNote(noteTitle);
    saveNoteDialog.close();
})

optYesOverwrite.addEventListener('click', () =>{
    const noteTitle = titleBox.textContent.trim();
    saveNote(noteTitle);
    overwriteNoteDialog.close();
})

optNoOverwrite.addEventListener('click', () => {
    overwriteNoteDialog.close();
});

function saveNote(noteTitle) {
    const noteContent = inputBox.textContent; 
    const noteData = {
        title: noteTitle,
        content: noteContent
    };

    const trimmedNoteTitle = noteTitle.trim(); 

    if(isEditing && currentNoteTitle){
        if (currentNoteTitle !== noteTitle) {
            localStorage.removeItem(currentNoteTitle);

            const buttons = notesList.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.textContent === currentNoteTitle) {
                    notesList.removeChild(button);
                }
            });
        }

        localStorage.setItem(NOTE_STORAGE_KEY + trimmedNoteTitle, JSON.stringify(noteData));

        const buttons = notesList.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent === currentNoteTitle) {
                button.textContent = noteTitle; 
            }
        });

        currentNoteTitle = noteTitle;
        isEditing = true;

    } 
    else{
        if (localStorage.getItem(NOTE_STORAGE_KEY + trimmedNoteTitle)){
            alert('A note with that title already exists. Please choose a different title.');
            return;
        }

        localStorage.setItem(NOTE_STORAGE_KEY + trimmedNoteTitle, JSON.stringify(noteData));

        const newNoteButton = document.createElement('button');
        newNoteButton.textContent = noteTitle;
        notesList.appendChild(newNoteButton);

        newNoteButton.addEventListener('click', () => {
            const currentNote = JSON.parse(localStorage.getItem(NOTE_STORAGE_KEY + trimmedNoteTitle));
            titleBox.textContent = currentNote.title;
            inputBox.textContent = currentNote.content;
            isEditing = true;
            currentNoteTitle = currentNote.title;
            deleteNoteBtn.style.visibility = "visible";
        });

        isEditing = false;
        currentNoteTitle = null;
    }

    renderNotesList();
    titleBox.textContent = "";
    inputBox.textContent = "";
    deleteNoteBtn.style.visibility = "hidden";
    isEditing = false;
    currentNoteTitle = null;
}

function renderNotesList() {
    notesList.innerHTML = '';

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key.startsWith(NOTE_STORAGE_KEY)) {
            const savedNote = JSON.parse(localStorage.getItem(key)); 
            const newNoteButton = document.createElement('button');
            newNoteButton.textContent = savedNote.title;
            notesList.appendChild(newNoteButton);

            newNoteButton.addEventListener('click', () => {
                const currentNote = JSON.parse(localStorage.getItem(key));
                titleBox.textContent = currentNote.title;
                inputBox.textContent = currentNote.content;
                isEditing = true;
                currentNoteTitle = currentNote.title;
                deleteNoteBtn.style.visibility = "visible";
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {  
    for(let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if(key.startsWith(NOTE_STORAGE_KEY)){ 
            const noteTitle = key.substring(NOTE_STORAGE_KEY.length);

            const newNoteButton = document.createElement('button');
            newNoteButton.textContent = noteTitle;
            notesList.appendChild(newNoteButton);

            newNoteButton.addEventListener('click', () => {
                const currentNote = JSON.parse(localStorage.getItem(key)); 
                titleBox.textContent = currentNote.title;
                inputBox.textContent = currentNote.content;
                isEditing = true;
                currentNoteTitle = currentNote.title;
                deleteNoteBtn.style.visibility = "visible";
            });
        }
    }
});

optNoSave.addEventListener('click', () => {
    saveNoteDialog.close();
    console.log('Note saving process canceled.')
})

deleteNoteBtn.addEventListener('click', () =>{
    deleteNoteDialog.showModal();

    optYesDelete.addEventListener('click', () => {
        if(isEditing && currentNoteTitle){
            const trimmedCurrentNoteTitle = currentNoteTitle.trim();
            localStorage.removeItem(NOTE_STORAGE_KEY + trimmedCurrentNoteTitle);
    
            const buttons = notesList.querySelectorAll('button');
            buttons.forEach(button => {
                if(button.textContent === currentNoteTitle){
                    button.remove();
                }
            });
    
            titleBox.textContent = "";
            inputBox.textContent = "";
            isEditing = false;
            console.log(`Note "${currentNoteTitle}" deleted.`);
            currentNoteTitle = null;
            deleteNoteBtn.style.visibility = 'hidden';

            renderNotesList(); 
        }
        deleteNoteDialog.close();
    });

    optNoDelete.addEventListener('click', () => {
        deleteNoteDialog.close();
    });
});

// -----------------------------------------------------------------|
// APP SELECTION NAVIGATION
// -----------------------------------------------------------------|
let currentActiveLink = null; 
let navSelection = document.querySelector('.nav-selection'); 
const navSelectText = {         
    '1' : 'Notes App',  
    '2' : 'To-Do List',
    // '3' : 'Placeholder'
};

const list = document.querySelectorAll('.list');

const notesAppCSS = document.querySelectorAll('.display-notesApp');
const todoAppCSS = document.querySelectorAll('.displayToDo');

const originalDisplayStyles = {};

function storeOriginalStyles(elements, target){
    elements.forEach(div => {
        originalDisplayStyles[target + div.classList.value] = window.getComputedStyle(div).display;
    });
}

storeOriginalStyles(notesAppCSS, "notes");
storeOriginalStyles(todoAppCSS, "todo");

function activeLink() {
    list.forEach(item => item.classList.remove('active'));
    this.classList.add('active');
    currentActiveLink = this.innerText; 

    navSelection.textContent = navSelectText[currentActiveLink] || ''; //

    if(currentActiveLink === '1'){
        notesAppCSS.forEach(div => {
            const classList = "notes" + div.classList.value;
            div.style.display = originalDisplayStyles[classList] || 'flex' 
        });
        todoAppCSS.forEach(div => div.style.display = 'none');
    }
    else if(currentActiveLink === '2'){
        notesAppCSS.forEach(div => div.style.display = 'none');
        todoAppCSS.forEach(div => {
            const classList = "todo" + div.classList.value; //Get the classList
            div.style.display = originalDisplayStyles[classList] || 'block'; //Restore or default to block
        });
    }
}

// Call activeLink for the first list item (Notes App) on page load
window.addEventListener('DOMContentLoaded', () => {
    const firstLink = document.querySelector('.list:nth-child(1)'); // Select the first list item
    if (firstLink) {
        firstLink.click(); 
    }
});

list.forEach(item => item.addEventListener('click', activeLink));

// -----------------------------------------------------------------|
// TODO LIST APP
// -----------------------------------------------------------------|

const TASK_STORAGE_KEY = 'todoTasks'; //Key for localStorage

const generateTask = document.querySelector('.generate-task');
const createTaskDialog = document.getElementById('create-task-dialog');
const deleteTaskDialog = document.getElementById('delete-task-dialog');
const cancelTaskInput = document.querySelector('.cancel-task-input');
const submitTaskInput = document.querySelector('.submit-task-input');

const taskList = document.getElementById('task-list'); //<ul class='task-list'>
const taskData = {}; //Object to store task data, see submitTaskInput

const optYesDeleteTask = document.getElementById('delete-task-dialog').querySelector('#optYes');
const optNoDeleteTask = document.getElementById('delete-task-dialog').querySelector('#optNo');

const discardChangesDialog = document.getElementById('discard-changes-dialog');
const continueTaskCreation = discardChangesDialog.querySelector('#continue-task-creation');
const discardTaskCreation = discardChangesDialog.querySelector('#discard-task-creation');

const addTitleDialog = document.getElementById('add-title-dialog');
const optContinue = addTitleDialog.querySelector('#optContinue');

function loadTasksFromStorage(){
    const storedTasks = localStorage.getItem(TASK_STORAGE_KEY);
    if (storedTasks){
        const tasks = JSON.parse(storedTasks);
        for (const taskId in tasks){
            const task = tasks[taskId];
            taskData[taskId] = { ...task }; // Load into taskData
            createTaskElement(taskId, task.title, task.info, false); // Create the element
        }

        // After loading tasks, display the first one if available
        const firstTaskKey = Object.keys(tasks)[0]; // Get the first task's key
        if(firstTaskKey){
            displayTaskDetails(firstTaskKey);
        }
    }
}

function saveTasksToStorage(){
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(taskData));
}

function displayTaskDetails(taskId){
    const task = taskData[taskId];
    if (task){
        const taskTitleDisplay = document.querySelector('.task-title');
        const taskInfoDisplay = document.querySelector('.task-info');
        taskTitleDisplay.textContent = task.title;
        taskInfoDisplay.textContent = task.info;
        taskTitleDisplay.dataset.originalTitle = task.title;
        taskInfoDisplay.dataset.originalInfo = task.info;

        if(task.completed){
            taskTitleDisplay.classList.add('task-completed');
        }
        else{
            taskTitleDisplay.classList.remove('task-completed');
        }
    }
}

function createTaskElement(taskId, taskTitle, taskInfo, updateDisplay = true){
    const newItem = document.createElement('li');
    newItem.id = taskId;

    taskData[taskId] = taskData[taskId] || { //Use existing data if available
        title: taskTitle,
        info: taskInfo,
        completed: false 
    };

    const displayTask = document.createElement('button');
    displayTask.classList.add('display-task');
    displayTask.textContent = taskTitle;

    displayTask.classList.toggle('task-completed', taskData[taskId].completed);

    displayTask.addEventListener('click', () => {
        displayTaskDetails(taskId);
    });

    newItem.appendChild(displayTask);
    taskList.appendChild(newItem);

    if(updateDisplay){
        const taskTitleDisplay = document.querySelector('.task-title');
        const taskInfoDisplay = document.querySelector('.task-info');
        taskTitleDisplay.textContent = taskTitle;
        taskInfoDisplay.textContent = taskInfo;
        taskTitleDisplay.dataset.originalTitle = taskTitle;
        taskInfoDisplay.dataset.originalInfo = taskInfo;
    }
    saveTasksToStorage(); 
    updateEditableState();
}

generateTask.addEventListener('click', () => {
    // Deactivate check and delete modes
    checkActive = false;
    deleteActive = false;
    generateCheckTasks.style.backgroundColor = '';
    generateDeleteTasks.style.backgroundColor = '';

    // Remove check buttons
    const checkButtons = taskList.querySelectorAll('.check-task');
    checkButtons.forEach(button => button.remove());

    // Remove delete buttons and their listeners
    const deleteButtons = taskList.querySelectorAll('.delete-task');
    deleteButtons.forEach(button => button.remove());
    optYesDeleteTask.removeEventListener('click', optYesDeleteTask.myCurrentHandler); 

    createTaskDialog.showModal();

    // Add backdrop click event to continue ask if editing or discard
    createTaskDialog.addEventListener('click', (event) => {
        if(event.target === createTaskDialog) { 
            discardChangesDialog.showModal();
        }
    });
});

cancelTaskInput.addEventListener('click', () => {
    const inputTaskTitle = createTaskDialog.querySelector('.input-task-title p');
    const inputTaskInfo = createTaskDialog.querySelector('.input-task-info p');
    inputTaskTitle.textContent = ""; 
    inputTaskInfo.textContent = ""; 
    createTaskDialog.close();
});

submitTaskInput.addEventListener('click', () => {

    const inputTaskTitle = createTaskDialog.querySelector('.input-task-title p');
    const inputTaskInfo = createTaskDialog.querySelector('.input-task-info p');
    const taskTitle = inputTaskTitle.textContent;
    const taskInfo = inputTaskInfo.textContent;

    //Check if taskTitle is empty or contains only whitespace
    if(!taskTitle.trim()){
        addTitleDialog.showModal();
        return; //Stop the function execution
    }
    // Unique ID generated with Date.now() with sanitization:
    const safeTitle = taskTitle.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
    const uniqueId = `task-${safeTitle}-${Date.now()}`;
    

    createTaskElement(uniqueId, taskTitle, taskInfo); 

    inputTaskTitle.textContent = "";
    inputTaskInfo.textContent = "";
    createTaskDialog.close();
});

optNoDeleteTask.addEventListener('click', () => {
    deleteTaskDialog.close();
});

const taskTitleDisplay = document.querySelector('.task-title');
const taskInfoDisplay = document.querySelector('.task-info');

function updateEditableState(){ 
    const taskCount = taskList.querySelectorAll('li').length;
    const isEditable = taskCount > 0 && !checkActive && !deleteActive; 
    toggleTaskEditability(isEditable);
}

//Initialize to set correct state
updateEditableState();

taskTitleDisplay.addEventListener('focus', () => {
    taskTitleDisplay.dataset.originalTitle = taskTitleDisplay.textContent;
});

taskTitleDisplay.addEventListener('blur', () => {
    const originalTitle = taskTitleDisplay.dataset.originalTitle;
    const currentTitle = taskTitleDisplay.textContent;

    if (currentTitle.length === 0) { // Check for empty title
        addTitleDialog.showModal();
        taskTitleDisplay.textContent = originalTitle; // Revert to original title
        taskTitleDisplay.focus();
        return; 
    }
  
    if (currentTitle !== originalTitle) { // Check for changes
        let activeTaskId = null;
        for (const taskId in taskData){
            if (taskData[taskId].title === originalTitle) { // Find by original title
            activeTaskId = taskId;
            break;
            }
        }
  
        if (activeTaskId){
            taskData[activeTaskId].title = currentTitle;
            const taskButton = document.querySelector(`#${activeTaskId} .display-task`);
            if (taskButton) {
            taskButton.textContent = currentTitle;
            }
            saveTasksToStorage();
            console.log("Task data updated:", taskData[activeTaskId]);
        } 
        else{
            console.log("No matching task found for update (using original title).");
        }
    } 
    else{
        console.log("Title unchanged."); // Handle no change
    }
  
    delete taskTitleDisplay.dataset.originalTitle; // Clean up 
  
});

taskInfoDisplay.addEventListener('focus', () => {
    taskInfoDisplay.dataset.originalInfo = taskInfoDisplay.textContent;
});

taskInfoDisplay.addEventListener('blur', () => {
    const originalInfo = taskInfoDisplay.dataset.originalInfo;
    const currentInfo = taskInfoDisplay.textContent;
    const currentTitle = taskTitleDisplay.textContent;

    if(currentInfo !== originalInfo){
        let activeTaskId = null;
        for(const taskId in taskData){
            if(taskData[taskId].title === currentTitle){
                activeTaskId = taskId;
                break;
            }
        }

        if(activeTaskId){
            taskData[activeTaskId].info = currentInfo;
            saveTasksToStorage();
            console.log("Task data updated: ", taskData[activeTaskId]);
        }
        else{
            console.log("No matching task found for update.");
        }
    }
    else{
        console.log("Nothing was updated.");
    }

    delete taskInfoDisplay.dataset.originalInfo; //Cleanup
});

// Load tasks on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage(); 
    updateEditableState(); 
});

const generateCheckTasks = document.querySelector('.generate-check-tasks');
const generateDeleteTasks = document.querySelector('.generate-delete-tasks');

let checkActive = false;
let deleteActive = false;

//Toggle editability of task title and info
function toggleTaskEditability(isEditable){
    taskTitleDisplay.contentEditable = isEditable;
    taskInfoDisplay.contentEditable = isEditable;
    taskTitleDisplay.style.cursor = isEditable ? 'text' : 'default';
    taskInfoDisplay.style.cursor = isEditable ? 'text' : 'default';
}

generateCheckTasks.addEventListener('click', () => {
    checkActive = !checkActive; //Toggle the active state
    deleteActive = false; //Ensure only one button can be active at a time

    generateCheckTasks.style.backgroundColor = checkActive ? 'rgb(208, 255, 208)' : '' // Set or reset background
    generateDeleteTasks.style.backgroundColor = ''; //Reset the other button's background

    //Remove delete buttons
    const deleteButtons = taskList.querySelectorAll('.delete-task'); 
    deleteButtons.forEach(button => button.remove());

    if(checkActive){    
        //Insert check buttons
        const listItems = taskList.querySelectorAll('li'); 

        listItems.forEach(li => {
            const checkButton = document.createElement('button');
            checkButton.classList.add('check-task');

            checkButton.innerHTML = '<ion-icon name="checkmark-circle-sharp"></ion-icon>';

            //Checkmark Button Logic
            checkButton.addEventListener('click', () => {
                const displayTask = li.querySelector('.display-task');
                const taskId = li.id;
        
                displayTask.classList.toggle('task-completed');
                taskData[taskId].completed = displayTask.classList.contains('task-completed');
                saveTasksToStorage();

                //Update displayTaskTitle / displayTaskInfo
                const task = taskData[taskId];
                if(task){
                    taskTitleDisplay.textContent = task.title;
                    taskInfoDisplay.textContent = task.info;
                    taskTitleDisplay.dataset.originalTitle = task.title;
                    taskInfoDisplay.dataset.originalInfo = task.info;

                    if(task.completed){
                        taskTitleDisplay.classList.add('task-completed');
                    }
                    else{
                        taskTitleDisplay.classList.remove('task-completed');
                    }
                }
                //
            });
            
            li.insertBefore(checkButton, li.firstChild); // Insert at the beginning
        });
        toggleTaskEditability(false); //Disable editing when check mode is active
    }
    else{
        //Remove check buttons
        const checkButtons = taskList.querySelectorAll('.check-task');
        checkButtons.forEach(button => {
            button.remove();
        });
        toggleTaskEditability(taskList.querySelectorAll('li').length > 0); //Re-enable if tasks exist and no other mode is active
    }
});

generateDeleteTasks.addEventListener('click', () => {
    deleteActive = !deleteActive //Toggle the active state
    checkActive = false; // Ensure only one button can be active at a time

    generateDeleteTasks.style.backgroundColor = deleteActive ? 'rgb(252, 177, 255)' : ''; //Set or reset background
    generateCheckTasks.style.backgroundColor = ''; //Reset the other button's background

    //Remove check buttons
    const checkButtons = taskList.querySelectorAll('.check-task'); 
    checkButtons.forEach(button => button.remove());

    if(deleteActive){
        //Insert delete buttons
        const listItems = taskList.querySelectorAll('li');
        listItems.forEach(li => {
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-task');
            deleteButton.innerHTML = '<ion-icon name="close-circle-sharp"></ion-icon>';

            // Add event listener to each delete button *inside* the loop
            deleteButton.addEventListener('click', () => {

                const taskId = li.id;
                const task = taskData[taskId];
                if(task){
                    taskTitleDisplay.textContent = task.title;
                    taskInfoDisplay.textContent = task.info;
                    taskTitleDisplay.dataset.originalTitle = task.title; //Update original values
                    taskInfoDisplay.dataset.originalInfo = task.info;
                }

                deleteTaskDialog.showModal();

                // Store the <li> element to delete it later if confirmed
                deleteTaskDialog.liToDelete = li;  // Attach the li to the dialog

                const yesDeleteHandler = () => {    //Define the handler function
                    deleteTaskDialog.close();
                    if(deleteTaskDialog.liToDelete){
                        const taskIdToDelete = deleteTaskDialog.liToDelete.id; //Get ID *before* removing
                        delete deleteTaskDialog.liToDelete.remove();
                        delete taskData[taskIdToDelete]; 
                        saveTasksToStorage();
                        updateEditableState(); //Update after deletion

                        const firstTask = taskList.querySelector('li'); //Get the first remaining task
                        if(firstTask){
                            const taskId = firstTask.id;
                            const task = taskData[taskId];
                            if(task){
                                taskTitleDisplay.textContent = task.title;
                                taskInfoDisplay.textContent = task.info;
                                taskTitleDisplay.dataset.originalTitle = task.title;
                                taskInfoDisplay.dataset.originalInfo = task.info;
                            }
                        }
                        else{ //If no tasks left
                            taskTitleDisplay.textContent = "";
                            taskInfoDisplay.textContent = "";
                        }
                    }
                    optYesDeleteTask.removeEventListener('click', yesDeleteHandler); // Remove *this* handler
                };
                optYesDeleteTask.addEventListener('click', yesDeleteHandler); //Add *this* handler
            });

            li.insertBefore(deleteButton, li.firstChild);
        });

        toggleTaskEditability(false);
    }
    else{
        //Remove delete buttons
        const deleteButtons = taskList.querySelectorAll('.delete-task');
        deleteButtons.forEach(button => button.remove());
        optYesDeleteTask.removeEventListener('click', yesDeleteHandler);
        updateEditableState();
        toggleTaskEditability(taskList.querySelectorAll('li').length > 0);
    }
});

discardTaskCreation.addEventListener('click', () => {
    const inputTaskTitle = createTaskDialog.querySelector('.input-task-title p');
    const inputTaskInfo = createTaskDialog.querySelector('.input-task-info p');
    inputTaskTitle.textContent = "";
    inputTaskInfo.textContent = ""; 

    discardChangesDialog.close();
    createTaskDialog.close();
});

continueTaskCreation.addEventListener('click', () => {
    discardChangesDialog.close();
});

optContinue.addEventListener('click', () => {
    addTitleDialog.close();
    if(discardChangesDialog){
        discardChangesDialog.close();
    }
});
