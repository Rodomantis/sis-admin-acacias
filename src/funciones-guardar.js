import firebase from './conexion'

var db = firebase.database();
var qUsers = db.ref("usuarios");
var qFact = db.ref("pagoExpensas");
var qExp = db.ref("expensas");
var qVec = db.ref("vecinos");

var funciones = {
	guardarVecino(ciId,nom,ap,tel){
		var myRef =qVec.child(ciId)
		var key = myRef.key;
		var datosVecino = {
			nombre: nom,
			idCi: ciId,
			apellido: ap,
			telefono: tel,
		};
		myRef.set(datosVecino);
	},
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
	guardarExp(nom,cod,empresa){
		var fecha = new Date().toJSON().slice(0,10).replace(/-/g,'/');
		var myRef = qExp.child(cod);
		var key = myRef.key;
		var datosExp = {
			nombreExpensa: nom,
			codigoExpensa: cod,
			fechaRegistro: fecha,
			empresaProv: empresa,
		};
		myRef.set(datosExp);
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
