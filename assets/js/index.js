// Extend dayjs with advanced format plugin to allow ordinal suffix usage
dayjs.extend(window.dayjs_plugin_advancedFormat)

// Set global variables
const currentDate = dayjs()
const startTime = 9
const finishTime = 17
let tasks   // Object with all tasks, stored in local storage
let task    // Individual tasks as stored in object

// Get on-page elements
const timesContainer = $('#times')

// Display current in header
$('#currentDay').text(currentDate.format('dddd, MMMM Do'))

// Load from local storage
if (tasks = localStorage.getItem('tasks')) tasks = JSON.parse(tasks)  // If found, parse
else tasks = {}                                                       // None found, create object

// Create timeblocks
for (let i = startTime; i < finishTime + 1; i++) {
  // Get current hour and task hour
  let currentHour = dayjs().hour()
  let taskHour = dayjs().hour(i).format("hA")

  // Get task from local storage
  if (!(task = tasks['_'+i])) task = ''
  
  // Set context
  let context;
  if (currentHour < i) {
    context = 'future'
  } else if (currentHour > i) {
    context = 'past'
  } else {
    context = 'present'
  }
  
  // Create HTML for each section
  timesContainer.append(`
    <div class="row flex-row flex-nowrap time-block">
      <div class="hour col-1 ">
        <span>${taskHour}</span>
      </div>
      <textarea class="description ${context} col-10"">${task}</textarea>
      <button class="saveBtn col-1 d-flex" data-index="_${i}" data-bs-toggle="tooltip" data-bs-title="Saved ✔️" data-bs-trigger="manual">
        <i class="fa-solid fa-floppy-disk"></i>
      </button>
    </div>
  `)
}

// Get relevant user input on button click
$('.saveBtn').on('click', function() {
  // Get input and index
  const textArea = $(this).prev()
  const userInput = textArea.val()
  const index = $(this).data('index')

  // Return if no change was detected
  if (userInput === tasks[index]) return

  // Set object and save into storage
  tasks[index] = userInput

  // Stringify and store into local object
  tasksString = JSON.stringify(tasks)
  localStorage.setItem('tasks', tasksString)

  // Remove changed data attribute
  const button = $(this).removeAttr('data-changed')

  // Display saved popup
  $(this).tooltip('show')
    setTimeout(() => {
      $(this).tooltip('hide'); 
    }, 1500);
})

$('.description').on('input', function() {
  const button = $(this).next()

  // Check if value has changed
  const index = button.data('index')
  userInput = $(this).val()

  // Value hasn't changed, remove highlight
  if (userInput === tasks[index]) {
    button.removeAttr('data-changed')
    return
  }

  // Value has changed, add highlight
  button.attr('data-changed', 'true')
})

// Initialise Bootstrap tooltips
$( document ).ready(function() {
  $('[data-bs-toggle="tooltip"]').tooltip()
});