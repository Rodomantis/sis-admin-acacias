import firebase from './conexion'

var db = firebase.database();
var qUsers = db.ref("usuarios");
var qFact = db.ref("pagoExpensas");

var funciones = {
	guardarFact(nom, ap, tel, fact, total){
		var myRef = qFact.push();
		var key = myRef.key;
		var datosFactura = {
			nombre: nom,
			apellido: ap,
			telefono: tel,
			detalleFactura: fact,
			totalFact: total
		};
		myRef.set(datosFactura);
	},
	guardarDatosUsuario(nomUsuario, correo, uid){
		var myRef = qUsers.child(uid);
		var key = myRef.key;
		var datosUsers = {
			nombreUsuario: nomUsuario,
			correoUsuario: correo,
			nivel: 1,
		};
		myRef.set(datosUsers);
	},
};
module.exports = funciones;
