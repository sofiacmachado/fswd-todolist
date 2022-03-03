// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/
$(document).on("turbolinks:load", function () {
  if ($('.static_pages.index').length > 0) {
    indexTasks(function (response) {
      var htmlString = response.tasks.map(function(task) {
        return "<div class='col-12 mb-3 p-2 border rounded task' data-id='" + task.id + "'> \
          " + task.content + "\</div>";
      });
      $("#tasks").html(htmlString);
    });
  }
});
