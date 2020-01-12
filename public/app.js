

// $.getJSON("/articles", function(data) {
//     for (let i = 0; i < data.length; i++) {
//         $("#articles").append("<p data-id= '" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//     }
// });
console.log("app.js file is hit")
$(document).ready(function () {
    

    $(document).on("click", ".submit", function () {
        let _id = $(this).data("id");
        console.log(_id);
        // Axios.post(`/api/note/${_id}`, function() {

        // })
        
        let note = $("#" + _id).val().trim();
        console.log(note);
        $.ajax({
            method: "POST",
            url: "/api/note/" + _id,
            data: { note: note }
        })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                console.log("post route success")
                // Empty the notes section
                $("#exampleFormControlTextarea1").empty();
            });
    })
})
