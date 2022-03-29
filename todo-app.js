(function() {
    //Заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    };

    // Форма для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    };

    //Список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    };

    function createTodoItem(name) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton
        }
    };

    const doneButton = (todoItemsArray, indexItem, todoItem, key) => {
        todoItem.doneButton.addEventListener('click', function() {
            todoItem.item.classList.toggle('list-group-item-success');
            todoItemsArray[indexItem].done = !todoItemsArray[indexItem].done;
            if (key) localStorage.setItem(key, JSON.stringify(todoItemsArray));
        });
    }

    const deleteButton = (todoItemsArray, indexItem, todoItem, key) => {
        todoItem.deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                todoItem.item.remove();
                todoItemsArray.splice(indexItem, 1);
                if (key) localStorage.setItem(key, JSON.stringify(todoItemsArray));
            }
        });
    }


    function createTodoApp(container, title = 'Список дел', key = null) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        let todoItemsArray = [];

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        todoItemForm.form.addEventListener('input', function(event) {
            if (todoItemForm.input.value) todoItemForm.button.disabled = false;
        })

        let restoredSession = JSON.parse(localStorage.getItem(key));

        if (!(restoredSession === null) && key != null) {
            restoredSession.map(element => {
                let todoItem = createTodoItem(element.name);
                todoItemsArray.push(element)
                todoList.append(todoItem.item);
                if (element.done) todoItem.item.classList.toggle('list-group-item-success');
                let indexItem = todoItemsArray.findIndex(el => el.name === element.name && el.done === element.done);

                doneButton(todoItemsArray, indexItem, todoItem, key);
                deleteButton(todoItemsArray, indexItem, todoItem, key);
                        
                localStorage.setItem(key, JSON.stringify(todoItemsArray));                        
            })
        }

        //браузер создает событие на форме по нажатию Enter или на кнопку 'добавить'
        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();

            let nameItem = todoItemForm.input.value;
            let todoItem = createTodoItem(nameItem);

            todoList.append(todoItem.item);
            todoItemsArray.push({'name': nameItem, 'done': false})
            let indexItem = todoItemsArray.findIndex(el => el.name === nameItem);

            doneButton(todoItemsArray, indexItem, todoItem, key);
            deleteButton(todoItemsArray, indexItem, todoItem, key);

            //обнуляем занчение в поле
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;

            if (key) localStorage.setItem(key, JSON.stringify(todoItemsArray));
        });

    };


    window.createTodoApp = createTodoApp;
})();