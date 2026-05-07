const taskForm = document.getElementById('taskManager-form');
const taskList = document.querySelector('.taskManagerContainer__list')
const mainTaskContainer = document.querySelector('.main__taskManagerContainer');
const buttonThemeBackground = document.getElementById('themeBackground')
const taskInput = document.getElementById('taskInto-input')
loadTask();
//Evento para la generacion de tareas
taskForm.addEventListener('submit', (event) => {
    //eliminamos el evento predeterminado de carga de pagina
    event.preventDefault();
    //de acuerdo a la tarea escrita en el input se valida

    const task = taskInput.value;
    
    //si el input no quedo vacio, procede con la creacion de la tarea
    if (task) {
        taskList.append(createTaskElement(task));
        storeTaskInLocalStorage(task);
        task.textContent = '';
        taskInput.value = '';
    } else {
        //excepcion por input vacio
        window.alert('Favor de introducir una tarea')
    }
});
//creacion de una tarea
function createTaskElement(task) {
    const li = document.createElement('li');
    const p = document.createElement('p')
    p.textContent = task;
    li.className = 'task-inlist'
    li.append(p,createButtonDelete('❌', 'delete-task'), createButtonEdit('✏️', 'edit-task'));
    return li;
}
function createButtonDelete(icono, nameClass) {
    const btn = document.createElement('button');
    btn.textContent = icono;
    btn.className = nameClass;
    return btn;
}
function createButtonEdit(icono, className) {
    const btn = document.createElement('button');
    btn.textContent = icono;
    btn.className = className;
    return btn;
}

//Identificacion de accion, eliminar o editar
taskList.addEventListener('click',
    (event) => {
        //de acuerdo al evento, si este contiene una clase de eliminar o editar
        if (event.target.classList.contains('delete-task')) {
            //se toma el elemento padre de la clase ya que se requiere eliminar el conjunto de elementos de una tarea completa
            deleteTaskF(event.target.parentElement);
        }
        else if (event.target.classList.contains('edit-task')) {
            //se toma el elemento padre de la clase ya que dentro del evento de edit se requiere tomar el valor del primer hijo para posteriormente editar su contenido
            editTaskF(event.target.parentElement)
        }
    });

//funcion para eliminar tarea
function deleteTaskF(taskItem) {
    if (confirm('Estas seguro de eliminar este elemento')) {
        //se remueve en este caso el contenedor padre
        taskItem.remove();
        updateLocalStorage();
    }
}

//funcion para editar la tarea ya creada
function editTaskF(taskItem) {
    const newTask = prompt('Edita la tarea', taskItem.firstChild.textContent)
    if (newTask != null) {
        //se edita en este caso el contenido del primer hijo ya que en orden el texto de una tarea es el primer hijo <p>Task Content</p>.
        taskItem.firstChild.textContent = newTask;
        updateLocalStorage();
    }
}

//funcion para guardar en local storage
function storeTaskInLocalStorage(task) {
    //convertimos de cadena de formato json a uno objeto o arreglo
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    //inyectamos en la lista de tareas
    tasks.push(task);
    //asignamos el arreglo al local storage, ahora de manera inversa el valor lo guardaremos pero como un string
    //1 paramtro: texto que vayamos a agregar
    //2 parametro: la tarea
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


//funcion para que la informacion continue en el dom
function loadTask() {
    //preguntamos si existen tareas guardadadas en localStorage con nombre tasks, y si existen por cada tarea que exista en ese array que genere un appendChild por cada tarea
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    //en este caso se obtiene el arreglo del local storage y lo recorre, para cada vez que se recargue se agregue a tasklist el cual es el contenedor que carga las tareas en el DOM
    tasks.forEach((task) => {
        taskList.appendChild(createTaskElement(task))
    });
}

//poder actualizar en el localStorage cada tarea en su estado actual, ya sea que se edite o elimine
function updateLocalStorage() {
    //obtenemos el conjunto de nodos y a su vez lo convertimos a conjunto de tipo arrays
    const tasks = Array.from(taskList.querySelectorAll('li')).map(
        //en este caso recorremos el arreglo y a su vez solo tomamos el primer elemento (firstChild) del conjunto de hijos de li ya que solo necesitamos el texto osea el elemento <p>
        (li) => li.firstChild.textContent
    );
    //guarmos el arreglo y lo convertimos a cadena
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


//En este caso se aplica el nombre de la clase dark-theme solo al body, ya que teniendo en cuenta que es el padre de la mayoria de etiquetas, a partir de este y los elementos hijos podremos continuar aplicando estilos tipos alternos, siempre y cuando esta clase (dark-theme) este activa.
//generamos una variable para asigar el valor del valor de localstorage de theme, la cual (currentTheme) la estaremos validando posteriormente para aplicar la clase a body
const currentTheme = localStorage.getItem('theme');

//a partir del evento del cambio de fondo
buttonThemeBackground.addEventListener('click',
    () => {
        //se aplica o quita la clase dark-theme
        document.body.classList.toggle('dark-theme');
        //se asigna el valor de dark o ligth a theme, dependiendo si la clase dark-theme esta activa en la etiqueta body
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        //el valor de theme (dark o light) se asigna al localstorage para mantener persistencia de la clase y sus estilos al momento de recargar la pagina 
        localStorage.setItem('theme', theme);
    }
)

//Posterior a que termina el evento de hacer su proceso de asignacion a theme y guardar el valor al localstorage (dark o ligth), se valida en la variable currrentTheme el nuevo valor de theme, y si esta dark en el localstorage. A body se le asignara esa clase (dark-theme).
if(currentTheme === 'dark'){
    document.body.classList.add('dark-theme')
}