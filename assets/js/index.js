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
      <button class="saveBtn col-1 d-flex" data-index="_${i}">
        <i class="fa-solid fa-floppy-disk"></i>
      </button>
    </div>
  `)
}

// Get relevant user input on button click
$('.saveBtn').on('click', function() {
  // Validate there is an input in the field
  const textArea = $(this).prev()
  const userInput = textArea.val()
  if (!userInput) return

  // Set object and save into storage
  const index = $(this).data('index')
  tasks[index] = userInput

  // Stringify and store into local object
  tasksString = JSON.stringify(tasks)
  localStorage.setItem('tasks', tasksString)

  // Remove changed data attribute
  const button = $(this).removeAttr('data-changed')
})

$('.description').change(function() {
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

// Greyed out button when not needed
// change all icons to be greyed by default
// add event listener that looks for change
// Run a check to see if it matches existing data saved in field
// if changed, add class
// add a full page event listener that, on close, prompts user they have unsaved changes (with browser if possible)

// add popup when they save
// remove the pointer when the data cannot be saved

// ADDITIONAL FUNCTIONALITY 
// Potentially create logic to colour on hover?
// Improve styling?
// Customise times?