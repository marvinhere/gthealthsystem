//Code created by Jeremias García  y Marvin Quiñónez (@marvinhere)
const db = firebase.database();
var apellidos = document.getElementById('apellidos');
var codigo = document.getElementById('codigo');

function verification(){
	var us=document.getElementById('user').value;
	if(apellidos.checked == true){
		
		var ref = db.ref('users').orderByChild("lastname").startAt(us).endAt(us+"\uf8ff")
		datau(ref);
	}

	if(codigo.checked==true){
		var ref = db.ref('users/'+us);
		datac(ref);
	}
}
function datau(query){

	query.on("value", function(snapshot){
	let tabla = document.getElementById('mostrarTabla');
	let html = '<tbody id="dataTable"><tr><th>Nombre</th><th>Apellidos</th><th>Estado</th><th>Cel</th><th>Direccion</th><th >Bloquear</th><th class="text-center">Historial</th></tr>';
	snapshot.forEach(function(childSnapshot) {
    let name = childSnapshot.val().name;
    let idu=childSnapshot.key; 
	let lastname = childSnapshot.val().lastname;	
	let phone=childSnapshot.val().phone;
	let places=childSnapshot.val().street;
	let status=childSnapshot.val().status;
	if(status=="blocked"){
		html +='<tr><td>'+name+'</td><td>'+lastname+'</td><td>'+status+'</td><td>'+phone+'</td></td><td>'+places+'</td><td><button id='+idu+' class="btn btn-primary btn-block" onclick="updstatusClean(this)">Limpiar</button></td><td><button id='+idu+' class="btn btn-primary btn-block" onclick="verHistorial(this)">Ver historial</button></td></tr>';
	}else{
		html +='<tr><td>'+name+'</td><td>'+lastname+'</td><td>'+status+'</td><td>'+phone+'</td></td><td>'+places+'</td><td><button id='+idu+' class="btn btn-primary btn-block" onclick="updstatus(this)">Bloquear</button></td><td><button id='+idu+' class="btn btn-primary btn-block" onclick="verHistorial(this)">Ver historial</button></td></tr>';
	}
		}); 
	
	html += '</tbody>';
	tabla.innerHTML = html;
	});
}

function datac(query){

	query.on("value", function(snapshot){
	let tabla = document.getElementById('mostrarTabla');
	let html = '<tbody id="dataTable"><tr><th>Nombre</th><th>Apellidos</th><th>Estado</th><th>Cel</th><th>Direccion</th><th >Bloquear</th><th class="text-center">Bloquear usuario y personas cercanas</th></tr>';
    let name = snapshot.val().name;
    let idu=snapshot.key; 
	let lastname = snapshot.val().lastname;	
	let phone=snapshot.val().phone;
	let places=snapshot.val().street;
	let status=snapshot.val().status;
	if(status=="blocked"){
		html +='<tr><td>'+name+'</td><td>'+lastname+'</td><td>'+status+'</td><td>'+phone+'</td></td><td>'+places+'</td><td><button id='+idu+' class="btn btn-primary btn-block" onclick="updstatusClean(this)">Limpiar</button></td><td><button id='+idu+' class="btn btn-primary btn-block" onclick="verHistorial(this)">Ver historial</button></td></tr>';
	}else{
		html +='<tr><td>'+name+'</td><td>'+lastname+'</td><td>'+status+'</td><td>'+phone+'</td></td><td>'+places+'</td><td><button id='+idu+' class="btn btn-primary btn-block" onclick="updstatus(this)">Bloquear</button></td><td><button id='+idu+' class="btn btn-primary btn-block" onclick="verHistorial(this)">Ver historial</button></td></tr>';
	}
	html += '</tbody>';
	tabla.innerHTML = html;
	});
}

function verHistorial(btn){
	let tabla = document.getElementById('mostrarTabla');
	let html = '<tbody id="dataTable"><tr><th>Codigo de Usuario</th><th>Ubicacion</th><th>Timestamp</th></tr>';
	var ref = db.ref('users/'+btn.id);
	ref.child('places').on("value", function(snapshot){
		if(snapshot.val()==null){
			tabla.innerHTML = "Sin historial"
		}
	snapshot.forEach(function(childSnapshot){
		
		var id= childSnapshot.val().id;

		var placeInfo = db.ref("userPlaces/"+id).on("value",function(snap){
			var idPlace = snap.child("id").val();
			var timestamp= snap.child("timestamp").val();

		var placeData = db.ref("places/"+idPlace).on("value",function(s){
			var namePlace = s.child("name").val();
			html +='<tr><td>'+btn.id+'</td><td>'+namePlace+"-"+idPlace+'</td><td>'+timtestampToDate(timestamp)+'</td></tr>';
			html += '</tbody>';
			tabla.innerHTML = html;
		});
		
			
		});

		
	});
	
	});
}

function searchDate(){
	let tabla = document.getElementById('mostrarDate');
	var place = document.getElementById('place').value;
	let html = '<tbody id="dataTable"><tr><th>Codigo</th><th>Nombre</th><th>Apellidos</th><th>Estado</th><th>Cel</th><th>Direccion</th><th>Fecha y Hora</th><th >Bloquear</th></tr>';
	var dateStart = document.getElementById('dateStart').value;	
	var time = document.getElementById('timeStart').value;
	var hora = time.toString().split(":")[0];
	var minutos = time.toString().split(":")[1];
	var horamil = Number(hora)*3600000;
	var minutosmil = Number(minutos)*60000;
	var enmil1 = horamil+minutosmil;



	var timestamp1 = dateToTimestamp(dateStart)+enmil1+21600000;
	

	var realtimestam1 = timestamp1.toString();
	//realtimestam1 = realtimestam1.slice(0, -3);
	realtimestam1 = parseInt(realtimestam1);

	
	var ref = db.ref('userPlaces').orderByChild("timestamp").startAt(realtimestam1);
	
	ref.on("value", function(snapshot){
		
		if(snapshot.val()==null){
			tabla.innerHTML = "<br>No se encontro nada"
		}
		
		snapshot.forEach(function(childSnap){
			if(childSnap.val().id==place){
				
				var placeData = db.ref("users/"+childSnap.val().user).on("value",function(snap){
				
				var name = snap.val().name;
				let idu=snap.key; 
				let lastname = snap.val().lastname;	
				let phone=snap.val().phone;
				let places=snap.val().street;
				let status=snap.val().status;
				if(status=="blocked"){
		html +='<tr><td>'+childSnap.val().user+'</td><td>'+name+'</td><td>'+lastname+'</td><td>'+status+'</td><td>'+phone+'</td></td><td>'+places+'</td><td>'+timtestampToDate(childSnap.val().timestamp)+'</td><td><button id='+idu+' class="btn btn-primary btn-block" onclick="updstatusClean2(this)">Limpiar</button></td></tr>';
	}else{
		html +='<tr><td>'+childSnap.val().user+'</td><td>'+name+'</td><td>'+lastname+'</td><td>'+status+'</td><td>'+phone+'</td></td><td>'+places+'</td><td>'+timtestampToDate(childSnap.val().timestamp)+'</td><td><button id='+idu+' class="btn btn-primary btn-block" onclick="updstatus2(this)">Bloquear</button></td></tr>';
	}	
	html += '</tbody>';
	tabla.innerHTML = html;
			
		});
			}else{
				tabla.innerHTML = "<br>No se encontro nada"
			}
			
		})
		
	});

}


function login(){



	var email = document.getElementById('inputEmail').value;
	var password = document.getElementById('inputPassword').value;
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorCode)
	
  // ...
});

}

function logout(){
	firebase.auth().signOut().then(function() {
		window.location.href = "login.html";
	}).catch(function(error) {
  		alert("Error");
	});
}

function updstatus(btn){
	var id = btn.id;
	var ref = db.ref('users/'+id);
	var data={
	    status: "blocked"
	};
	ref.update(data);
}

function updstatusClean(btn){
	var id = btn.id;
	var ref = db.ref('users/'+id);
	var data={
	    status: "clean"
	};
	ref.update(data);
	
}

function updstatusClean2(btn){
	var id = btn.id;
	var ref = db.ref('users/'+id);
	var data={
	    status: "clean"
	};
	ref.update(data);
	searchDate();
}
function updstatus2(btn){
	var id = btn.id;
	var ref = db.ref('users/'+id);
	var data={
	    status: "blocked"
	};
	ref.update(data);

	searchDate();
}


function timtestampToDate(unix_timestamp){
	//var unixtimestamp = unix_timestamp;
	var stringTime = unix_timestamp.toString();
	var unixtimestamp = stringTime.slice(0, -3);
	unixtimestamp = parseInt(unixtimestamp);
 // Unixtimestamp
 

 // Months array
 var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

 // Convert timestamp to milliseconds
 var date = new Date(unixtimestamp*1000);

 // Year
 var year = date.getFullYear();

 // Month
 var month = months_arr[date.getMonth()];

 // Day
 var day = date.getDate();

 // Hours
 var hours = date.getHours();

 // Minutes
 var minutes = "0" + date.getMinutes();

 // Seconds
 var seconds = "0" + date.getSeconds();

 // Display date time in MM-dd-yyyy h:m:s format
 var convdataTime = day+'-'+month+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
 
 return convdataTime;
 
}

function dateToTimestamp(data){
	

	var date = new Date(data);
	var answer = date.getTime();
	return answer;

}



function userStatus(){
	var user = firebase.auth().currentUser;
	var ref = db.ref('places/'+user.uid);
	ref.on("value", function(snapshot){

		if(snapshot.val()==null){
			logout();
			alert("No puedes estar aquí")
		}else{
			 window.location.href = "index.html";
		}
		});
}