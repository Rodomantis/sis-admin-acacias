import firebase from './conexion'

var db = firebase.database();
var qPartes = db.ref("partes");
var qUnidades = db.ref("unidades");
var qCategorias = db.ref("categorias");
var qMarcas = db.ref("marcas");
var qMatriz = db.ref("datosMatriz");
var qSucursales = db.ref("datosSucursales");
var qFactura = db.ref("cotizaciones");
var qUsers = db.ref("usuarios");

var funciones = {
	guardarUnidades(u){
		var myRef = qUnidades.push();
		var key = myRef.key;
		myRef.set({nomUnidad: u});
	},
	guardarPartes(c,n,u,cant,ca,m,p){
		var myRef = qPartes.push();
		var key = myRef.key;
		var newData={
			id: key,
			codigoParte: c,
			nombre: n,
			unidad : u,
			cantidadTotal: cant,
			categoria : ca,
			marca: m,
			precioUnBs: p,
		}
		myRef.set(newData);
	},
	guardarCategorias(c){
		var myRef = qCategorias.push();
		var key = myRef.key;
		myRef.set({nombreCat: c});
	},
	guardarMarcas(m){
		var myRef = qMarcas.push();
		var key = myRef.key;
		myRef.set({nombreMar: m});
	},
	guardarDatosMatriz(n,d,t,e,r,doc,num,a){
		var myRef = qMatriz.push();
		var key = myRef.key;
		myRef.set({
			nombreEmpresa: n,
			direccionMatriz: d,
			telefonoMatriz: t,
			eMailEmpresa: e,
			responsableEmpresa: r,
			tipoDocumento: doc,
			numDocumento: num,
			actEconomica: a,
		});
	},
	guardarDatosSucursal(d,t,r,doc,num){
		var myRef = qMatriz.push();
		var key = myRef.key;
		myRef.set({
			direccionSucursal: d,
			telefonoSucursal: t,
			responsableSucursal: r,
			tipoDocumentoS: doc,
			numDocumentoS: num,
		});
	},
	guardarFact(nom, ap, tel, fact, total){
		var myRef = qFactura.push();
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
	guardarDatosUsuario(datosUsuario, correo, uid){
		var myRef = qUsers.child(uid);
		var key = myRef.key;
		var datosUsers = {
			datosUsuarios: datosUsuario,
			correoUsuario: correo,
			nivel: 1,
		};
		myRef.set(datosUsers);
	},
};
module.exports = funciones;
