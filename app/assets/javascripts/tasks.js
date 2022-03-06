/*
alterar nomes das variáveis globais
alterar funções para poderem ser chamadas a partir do static_pages.js
*/

//------------------- To do list ---------------------

var filter = "All";
var taskList = [];

var addTask = function(content, id, completed) {
    var todoList = $('#todo-list');
    var taskDiv = document.createElement('div');

    taskDiv.setAttribute('class','task');
    var taskContent = document.createElement('p');
    var markCompleteButton = document.createElement('span');
    markCompleteButton.setAttribute('class','mark-complete-button');
    if (completed) {
      taskDiv.setAttribute('class','task completed');
    }
    markCompleteButton.addEventListener('click', function() {
      var completedClass = taskDiv.getAttribute('class');
      if (completedClass === 'task completed') {
        markTaskAsActive(id, function(response) {
          if (response) {
            taskDiv.removeAttribute('class');
            taskList = taskList.map(function(task) {
              if (task.id === response.task.id) {
                return response.task;
              }
              return task;
            })
            filterTasks();
            updateHelperButtons();
          }
        }, function(request, errorMsg) {
          console.error(errorMsg);
        })
      } else {
        markTaskAsComplete(id, function(response) {
          if (response) {
            taskDiv.setAttribute('class','completed');
            taskList = taskList.map(function(task) {
              if (task.id === response.task.id) {
                return response.task;
              }
              return task;
            })
            filterTasks();
            updateHelperButtons();
          }
        }, function(request, errorMsg) {
          console.error(errorMsg);
        })
      }
    });

    var removeButton = document.createElement('span');
    removeButton.setAttribute('class','remove-button');
    removeButton.innerHTML = "×";
    removeButton.addEventListener('click', function() {
      var parent = this.parentNode.parentNode;
      var child = this.parentNode;
      deleteOneTask(id, function(response) {
        if (response.success) {
          parent.removeChild(child);
          taskList = taskList.filter(function(task) {
            return !(task.id === id);
          });
          updateHelperButtons();
        }
      }, function(request, errorMsg) {
        console.error(errorMsg);
      })
    });

    taskContent.setAttribute('class', 'task-content');
    taskContent.innerHTML = content;
    taskDiv.appendChild(markCompleteButton);
    taskDiv.appendChild(taskContent);
    taskDiv.appendChild(removeButton);
    todoList.append(taskDiv);
  };

  var refreshTasks = function() {
    indexTasks(function(response) {
      taskList = response.tasks;
      filterTasks();
      updateHelperButtons();
    }, function(request, errorMsg) {
      console.error(errorMsg);
    })
  };

  var filterTasks = function(addTasksToDOM) {
    var todoList = $('#todo-list');
    var shouldAddTasksToDOM;
    if (addTasksToDOM === undefined) {
      shouldAddTasksToDOM = true;
    } else {
      shouldAddTasksToDOM = addTasksToDOM;
    }
    var filteredTaskList = taskList.filter(function(task) {
      if (filter === 'All') {
        return true;
      } else if (filter === 'Active') {
        return task.completed === false;
      } else {
        return task.completed === true;
      }
    });
    if (shouldAddTasksToDOM) {
      todoList.text('');
      filteredTaskList.forEach(function(task) {
        addTask(task.content, task.id, task.completed);
      })
    }
    return filteredTaskList;
  }


  var updateHelperButtons = function() {
    var activeTasks = taskList.filter(function(task) {
      return !task.completed;
    });
    // Toggle All Button
    var tasksCurrentlyDisplayed = filterTasks(false);
    if (tasksCurrentlyDisplayed.length > 0) {
      $('#toggle-all').css('display', 'block');
    } else {
      $('#toggle-all').css('display', 'none');
    }

    if (activeTasks.length === 0 && taskList.length > 0) {
      $('#toggle-all').addClass('active');
    } else {
      $('#toggle-all').removeClass('active');
    }

    // Footer
    if (taskList.length === 0) {
      $('#footer').css('display', 'none');
    } else {
      $('#footer').css('display', 'flex');
      if ((taskList.length - activeTasks.length) > 0) {
        $('#clear-completed').css('display', 'inline-block');
      } else {
        $('#clear-completed').css('display', 'none');
      }
    }
    $('#active-tasks').text(activeTasks.length);
  }

  function initialisation() {
    var taskInput = $('#task-input');
      
    $('#' + filter).addClass('selected');

    taskInput.keypress(function (e) {
      var key = e.which;
      if (key == 13) {
        if (taskList.length < 10 && taskInput.val() !== '') {
          postTask(taskInput.val(), function(response) {
            taskInput.val('');
            taskList.push(response.task);
            updateHelperButtons();
            if (filter !== 'Completed') {
              addTask(response.task.content, response.task.id, response.task.completed);
            }
          }, function(request, errorMsg) {
            console.error(errorMsg);
          });
        }
      }
    });
    
    $('#clear-completed').click(function() {
      $('#All').click();
      filterTasks();
      $('.completed > .remove-button').click();
    })

    $('#toggle-all').click(function() {
      var activeTasks = taskList.filter(function(task) {
        return !task.completed;
      });

      if (activeTasks.length > 0) {
        $('.task:not(.completed) > .mark-complete-button').click();
      } else if (taskList.length > 0) {
        $('.task > .mark-complete-button').click();
      }
    });
    
    $('.filter-button').click(function() {
      var filterType = $(this).attr('id');
      if (filter !== filterType) {
        $('.filter-button').removeClass('selected');
        $(this).addClass('selected');
        filter = $(this).attr('id');
        filterTasks();
        updateHelperButtons();
      }
    });
  }