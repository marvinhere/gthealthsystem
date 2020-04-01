var html = '';
function productCard(name,image,price,store){
  var database = firebase.database().ref('stores/'+store).once('value').then(function(snapshot) {
          
        html += '<div class="shadow card-border mb-4">'
      +'<img class="card-img-top card-img-border" src="'+image+'" alt="Card image" style="">'
      +'<div class="card-body">'
      +'<h5 class="card-title bold">'+name+'</h5>'
      +'<img src="'+snapshot.val().image+'">'
      +'<a class="card-username">'+snapshot.val().name+'</a><br>'
    +'<div class="text-right container">'
    +'<a class="font-weight-bold">'+price+'</a>'
    +'</div>'
    +'</div>'
    +'</div>';
            
  // ...
      });


}