const form = document.getElementById("toDoForm")
const taskTitle = document.getElementById("taskTitle")
const taskDate = document.getElementById("taskDate")
const priority = document.getElementsByName("priority")
const taskList = document.getElementById("taskList")

const formValidation = {
    title: false,
    date: false, 
    priority: false
}
const task = {
    id: "",
    title: "",
    date: "", 
    priority: "",
    completed: false
}

//Radio button change border color
const radioButContainer = document.querySelector(".priorityBox")
const radioB = document.querySelectorAll(".prioritySelect")

radioButContainer.addEventListener('change', e =>{
    if(e){
        radioB.forEach(element =>{
            element.parentElement.classList.remove("labelBorder")           
        })
    }
    e.target.parentElement.classList.add("labelBorder")
})

//Listener submit form
form.addEventListener('submit', e =>{
    e.preventDefault()    
    
    //Validations
    if(taskTitle.value.trim().length > 0 && taskTitle.value.trim().length <= 100 ) {
        formValidation.title = true
        task.title = taskTitle.value.trim()
    }else{
        formValidation.title = false
        task.title = ""
    }

    if((Date.parse(taskDate.value) > Date.now())) {
        formValidation.date = true
        task.date = taskDate.value
    }else{
        formValidation.date = false
        task.date = ""
    }

    priority.forEach(e =>{
        if(e.checked) {
            formValidation.priority = true
            task.priority = e.value
        }else{
            formValidation.priority = false
        }
    })
 
    //Invalid Task -> Error Message
    if(!task.title || !task.date || !task.priority){       
        const errorBox = document.getElementById("errorBox");
        const errorFragment = new DocumentFragment()

        errorBox.innerHTML=""
            
        if(!task.title){   
            errorFragment.appendChild(errorMessage("Please write the title of the task"))
        }

        if(!task.date){ 
            errorFragment.appendChild(errorFragment.appendChild(errorMessage("Invalid date")))
        }

        if(!task.priority){  
            errorFragment.appendChild(errorFragment.appendChild(errorMessage("Please select priority level")))
        }

        errorBox.appendChild(errorFragment)        
        errorBox.classList.remove("errorHidden")        
    }
    else{
        //Valid Task
        errorBox.classList.add("errorHidden")
        addTask(task)      
    } 
})

//Listener load page
window.addEventListener('load', () =>{
    showTasks()
    setInterval((timer), 1000)    
})

//Functions
const errorMessage = (text)=>{
    const p = document.createElement('p')
    p.textContent = text
    return p
}

const addTask = (task) =>{
    const allTasks = JSON.parse(localStorage.getItem('todo'))      
    const id = Date.now()

    task.id = id
    allTasks.push(task)

    localStorage.setItem('todo', JSON.stringify(allTasks))
    form.reset()
    showTasks()
}

const updateTask = id =>{
    const allTasks = JSON.parse(localStorage.getItem('todo'))    
    const updatedTask = allTasks.map( e =>{
        if(e.id === id) {
            e.completed = !e.completed
            return e
        }
        return e
    })      
 
    localStorage.setItem('todo', JSON.stringify(updatedTask))
    showTasks()  
}

const deleteTask = id => {    
    const allTasks = JSON.parse(localStorage.getItem('todo'))
    const newAllTask = allTasks.filter(e => e.id !== id)

    localStorage.setItem('todo', JSON.stringify(newAllTask))
    showTasks()
}

const showTasks = () =>{ 

    if(!localStorage.getItem('todo')){        
        localStorage.setItem('todo', JSON.stringify([]))        
    }

    let allTasks = JSON.parse(localStorage.getItem('todo')) 
    const fragment = new DocumentFragment()
  
    //Order by date of creation
    allTasks=allTasks.sort((a,b) => a.id - b.id) 

    taskList.innerHTML = ""

    allTasks.forEach( e =>{
             
        let completed = ""
        let checked = ""
        const div = document.createElement('div')      
        div.classList.add('gridContainer')
        
        if(e.priority === 'low') div.classList.add('low')
        if(e.priority === 'medium') div.classList.add('medium')
        if(e.priority === 'high') div.classList.add('high')

        if(e.completed){            
            completed = "completed"
            checked = "checked"
        }    

        div.innerHTML +=`            
                <input type="checkbox" class="listCheckbox"  onchange="updateTask(${e.id})" ${checked}>
                <p class="titleList textFormat ${completed}">${e.title}</p>
                <p class="timeLeft textFormat" data-date=${e.date}></p>
                <button class="btnDelete" onclick="deleteTask(${e.id})">X</button>`;     
        
        fragment.appendChild(div)  
    })
    taskList.appendChild(fragment)
} 

const timer= () =>{
    const timeLeft = document.querySelectorAll(".timeLeft")   
    
    timeLeft.forEach(e =>{
        //Countdown timer
        const date = new Date(e.getAttribute("data-date")).getTime()
        let currentTime = new Date(Date.now()).getTime()
        let day 
        let hour 
        let min 
        let sec 
        let ms
        let diff = date - currentTime
        
        ms = diff % 1000
        diff = (diff - ms) /1000
        sec = diff % 60
        diff = (diff - sec) /60
        min = diff % 60
        diff = (diff -min) /60
        hour = diff % 24
        day = (diff -hour) / 24 

        day = day.toString().padStart(2, '0')
        hour = hour.toString().padStart(2, '0')
        min = min.toString().padStart(2, '0')
        sec = sec.toString().padStart(2, '0')

        if(day >= 0 && hour >= 0 && min >=0 && sec >= 0 ){            
            e.textContent= `${day}-${hour}-${min}-${sec}`
        }else{
            e.textContent= "Time is up!!"
        }        
    }) 
}