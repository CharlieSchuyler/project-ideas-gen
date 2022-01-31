$(".accept, .reject").click(function () {
  var id = $(this).parent().children('td:nth-child(1)').text();
  var title = $(this).parent().children('td:nth-child(2)').text();
  var user = $(this).parent().children('td:nth-child(3)').text();
  var action = $(this).attr("class");
  $(this).parent().remove();

  let data = { origin: "accepted", data: { id: id, title: title, user: user } };

  fetch("/admin", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => {
    console.log(`sent post request : ${data}`, res);
  });

});