import React from 'react';
import funciones from './funciones-guardar';
//import guardarPartes from './funciones-guardar';
import _ from 'underscore';
import firebase from './conexion'
import Firebase from 'firebase'
import ReactFireMixin from 'reactfire'
import { firebaseConnect } from 'react-firebase'
import { ControlLabel, Button, Form, Label, FormControl, FormGroup, Password, Modal, Popover, Tooltip, Select } from 'react-bootstrap';
import { Nav, NavItem, handleSelect, DropdownButton, MenuItem, Row, Col, ButtonGroup, Table } from 'react-bootstrap';

//var db = firebase.database();

/*
<script src="https://www.gstatic.com/firebasejs/3.7.2/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBnN1ppFoSSFkBPfAwukIJg7TAjXvW4vWA",
    authDomain: "bd-cotizacion.firebaseapp.com",
    databaseURL: "https://bd-cotizacion.firebaseio.com",
    storageBucket: "bd-cotizacion.appspot.com",
    messagingSenderId: "290907389991"
  };
  firebase.initializeApp(config);
</script>*/

var db = firebase.database();
var qExpensas = db.ref("expensas");
var qVec = db.ref("vecinos");

/*var guardarPartes = (c,n,u,cant,ca,m,p) => {
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
}; 
var  guardarUnidades = (u) => {
	var myRef = qUnidades.push();
	var key = myRef.key;
	myRef.set({nomUnidad: u});
};*/

class RegistrosEdificio extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			mostrarModalExp:false, mostrarModalVec: false,
			CiVec:'',nombreVec:'',apellidoVec:'',telefonoVec:'',
			arrayExp: [], arrayVec:[],
			codigoExp:'', nombreExp:'', empresaExp:'',
		};
	}
	//En ES6 el willmount de cualquier cosa que no sea modificacion de state va dentro del contructor
	componentWillMount(){
		qExpensas.on("value",(snapshot) => {
			this.setState({ arrayExp: snapshot.val() });
		},this );
		qVec.on("value",(snapshot) => {
			this.setState({ arrayVec: snapshot.val() });
		},this );
	}
	registrarExpensas =()=>{
		funciones.guardarExp(
			this.state.nombreExp,
			this.state.codigoExp,
			this.state.empresaExp,
		);
		this.cerrarModalExp();
	}
	registrarVecinos=()=>{
		funciones.guardarVecino(
			this.state.CiVec,
			this.state.nombreVec,
			this.state.apellidoVec,
			this.state.telefonoVec
		);
		this.cerrarModalVec();
	}
	abrirModalExp=()=>{this.setState({ mostrarModalExp: true });}
	cerrarModalExp=()=>{this.setState({ mostrarModalExp: false });}
	abrirModalVec=()=>{this.setState({ mostrarModalVec: true });}
	cerrarModalVec=()=>{this.setState({ mostrarModalVec: false });}
	handleGuardarCodigo=(e)=> { this.setState({ codigoExp: e.target.value, });}
	handleGuardarNombre=(e)=> { this.setState({ nombreExp: e.target.value, });}
	handleGuardarEmpresa=(e)=> { this.setState({ empresaExp: e.target.value,});}
	handleGuardarNombreVec=(e)=> {this.setState({ nombreVec: e.target.value, });}
	handleGuardarApellidoVec=(e)=> {this.setState({ apellidoVec: e.target.value, });}
	handleGuardarTelefonoVec=(e)=> {this.setState({ telefonoVec: e.target.value, });}
	handleGuardarCiVec=(e)=> {this.setState({ CiVec: e.target.value, });}
	render() {
		return (
		<div className="RegistrosEdificio">
			<Row>
				<Col xs={36} sm={18} md={12}>
					<ButtonGroup>
							<Button bsSize="large" bsStyle="primary" onClick={this.abrirModalExp}>Registrar Nuevas Expensas</Button>
							<Button bsSize="large" bsStyle="danger" onClick={this.abrirModalVec}>Registrar Nuevos Vecinos</Button>
					</ButtonGroup>
				</Col>
			</Row>
			<Modal show={this.state.mostrarModalExp} onHide={this.cerrarModalExp}>
				<Modal.Header closeButton>
					<Modal.Title>Productos</Modal.Title>
				</Modal.Header>
				<Modal.Body>
				<div>
					<Label>Codigo Expensa: </Label>
					<FormControl type="text" onChange={this.handleGuardarCodigo} value={this.state.codigoExp} placeholder="Codigo" />
					<Label>Nombre Expensa: </Label>
					<FormControl type="text" onChange={this.handleGuardarNombre} value={this.state.nombreExp} placeholder="Nombre" />
					<Label>Nombre Empresa a pagar: </Label>
					<FormControl type="text" onChange={this.handleGuardarEmpresa} value={this.state.empresaExp} placeholder="Empresa" />
					<Label>Seleccionar Unidad:</Label>
					<Table responsive style={{"height":"200px"}}>
						<thead>
							<tr>
								<th>Codigo</th>
								<th>Nombre</th>
								<th>Empresa</th>
								<th>Fecha</th>
								</tr>
						</thead>
						<tbody>
							{_.map(this.state.arrayExp,(value) => 
								<tr>
									<td>{value.codigoExpensa}</td>
									<td>{value.nombreExpensa}</td>
									<td>{value.empresaProv}</td>
									<td>{value.fechaRegistro}</td>
								</tr>
							)}
						</tbody>
					</Table>
				</div>
				</Modal.Body>
				<Modal.Footer>
					<Button bsSize="large" bsStyle="primary" onClick={this.registrarExpensas}> Registrar</Button>
					<Button bsSize="large" bsStyle="danger" onClick={this.cerrarModalExp}>Cerrar</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={this.state.mostrarModalVec} onHide={this.cerrarModalVec}>
				<Modal.Header closeButton>
					<Modal.Title>Registro de vecinos</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Label bsStyle="primary">Nombre</Label>
					<FormControl type="text" onChange={this.handleGuardarNombreVec} value={this.state.nombreVec} placeholder="Nombre vecino" />
					<Label bsStyle="primary">Apellido</Label>
					<FormControl type="text" onChange={this.handleGuardarApellidoVec} value={this.state.apellidoVec} placeholder="Apellido vecino" />
					<Label bsStyle="primary">Telefono</Label>
					<FormControl type="text" onChange={this.handleGuardarTelefonoVec} value={this.state.telefonoVec} placeholder="Telefono vecino" />
					<Label bsStyle="primary">Carnet ID</Label>
					<FormControl type="text" onChange={this.handleGuardarCiVec} value={this.state.CiVec} placeholder="CI ID vecino" />
					<Label bsStyle="primary">Lista de vecinos</Label>
					<FormControl componentClass="select" multiple style={{"height":"100px"}}>
						{
							_.map(this.state.arrayVec, (val)=>
								<option>{val.idCi} {val.nombre} {val.apellido}</option>
							)
						}
					</FormControl>
				</Modal.Body>
				<Modal.Footer>
					<Button bsStyle="success" onClick={this.registrarVecinos}>Guardar Cliente</Button>
					<Button bsStyle="danger" onClick={this.cerrarModalVec}>Cerrar</Button>
				</Modal.Footer>
			</Modal>
		</div>
		);
	}		
}

export default RegistrosEdificio