$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  }
});

//------//

function Request() {
  this.type = '';
  this.url = '';
  this.data = {};
  this.dataType = 'json';
  this.success = function(response){
  }
  this.error = function(response){
  }
};

//---------------------- Tasks -----------------------

var indexTasks = function (successCB, errorCB) {
  var request = {
    type: 'GET',
    url: 'api/tasks?api_key=1',
    success: successCB,
    error: errorCB
  }
  $.ajax(request);
};

//------------------- Create a Task --------------------

var postTask = function (content, successCB, errorCB) {
  var request = {
    type: 'POST',
    url: 'api/tasks?api_key=1',
    dataType: 'json',
    data: {
      task: {
        content: content
      }
    },
    success: successCB,
    error: errorCB
  }
  console.log("POST TASK", request);
  $.ajax(request);
};

//---------------- Delete a Task by ID ----------------

function deleteOneTask(id, successCB, errorCB) {
  var newRequest = new Request();
  newRequest['type'] = 'DELETE';
  newRequest['url'] = 'api/tasks/' + id + '?api_key=1';
  newRequest['xhrFields'] = { 'withCredentials': true };
  newRequest['success'] = function(response){
    console.log(response)

    return successCB(response);
  };
  newRequest['error'] = function(request, errorMsg){
    return errorCB(request, errorMsg);
  };

  $.ajax(newRequest);
};

//--------------- Mark a Task as Completed by ID --------------

function markTaskAsComplete(id, successCB, errorCB) {
  var newRequest = new Request();
  newRequest['type'] = 'PUT';
  newRequest['url'] = 'api/tasks/' + id + '/mark_complete?api_key=1';
  newRequest['xhrFields'] = { 'withCredentials': true };
  newRequest['success'] = function(response){
    return successCB(response);
  };
  newRequest['error'] = function(request, errorMsg){
    return errorCB(request, errorMsg);
  };

  $.ajax(newRequest);
};

//--------------- Mark a Task as Active by ID --------------

function markTaskAsActive(id, successCB, errorCB) {
  var newRequest = new Request();
  newRequest['type'] = 'PUT';
  newRequest['url'] = 'api/tasks/' + id + '/mark_active?api_key=1';
  newRequest['xhrFields'] = { 'withCredentials': true };
  newRequest['success'] = function(response){
    return successCB(response);
  };
  newRequest['error'] = function(request, errorMsg){
    return errorCB(request, errorMsg);
  };

  $.ajax(newRequest);
};
