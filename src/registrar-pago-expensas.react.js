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

var db = firebase.database();

class RegExpensas extends React.Component{
	constructor(props) {
		super(props);
		this.state = { 
			showModal: false,
			listaProd: [],
			valIdProd: '',
			listaFactura:[],
			cod: '', parte: '', precUn: '',
			filaProd: [],
			factLista: [],
			tamTabla: '',
			sumaPartes: 0,
			nombre: '', apellido: '', telefono: '', sumaTotal: 0,
		};
	}
	//En ES6 el willmount va dentro del contructor
	componentWillMount() {
		console.log(this.state.arrayPartes);
		qPartes.on("value", (snapshot) => {
			this.setState({
				arrayPartes: snapshot.val(),
			});
		},this );
		this.sumarTotal();
	}
	close=()=> { this.setState({ showModal: false });}
	open=()=>  { this.setState({ showModal: true });}
	sumarTotal=()=> {
		var tabMF = document.getElementById("tablaModalFact");
		var sum = 0;
		_.each(this.state.factLista,(val, index) => {
			var can = Number(tabMF.rows[index+1].cells[2].innerHTML);
			var prec = Number(tabMF.rows[index+1].cells[3].innerHTML);
			sum = sum + (can*prec);
		},this);
		this.setState({
			sumaTotal: sum,
		});
	}
	guardarFactura=()=> {
		funciones.guardarFact(
			this.state.nombre,
			this.state.apellido,
			this.state.telefono,
			this.state.factLista,
			this.state.sumaTotal	
		);
		this.close();
	}
	transferirTabla=()=> {
		var tabP = document.getElementById("tablaCot");
		this.open();
		var listPart = [];
		_.each(this.state.filaProd,(val, index) => {
				var cCod = tabP.rows[index+1].cells[1].innerHTML;
				var cNom = tabP.rows[index+1].cells[2].innerHTML;
				var cCant = tabP.rows[index+1].cells[3].children[0].value;
				var cPrec = tabP.rows[index+1].cells[4].innerHTML;
				listPart.push({
						codigo: cCod,
						nombreProd: cNom,
						cantidad: cCant,
						precio : cPrec
				});
				console.log(cCod);
				console.log(cNom);
				console.log(cCant);
				console.log(cPrec);
				console.log(listPart);
		},this);
		alert(this.state.filaProd.length);
		this.setState({
			factLista: listPart,
		},() => {
			this.sumarTotal();
		});
	}
	limpiarTabla=()=> {
		
	}
	handleAddParteExp=()=> {
		/*NOTA IMPORTANTE:  cuando se hace un setState de manera asincrona, esta no se hace en orden
		de manera que si hacemos un setState y luego usamos esos states para realizar otro setState a continuacion
		no realizara el cambio. Para hacer esto se hace el setState de las variables que queremos tomar cerrando ese setState
		se hace un function de la sgte manera 	
					this.setState({estado1: ''},function(){
						this.setState({estado2: estado1});
					};
					);      
		para que haga el seguimiento de los cambios de estado*/
		qPartes.orderByChild("codigoParte").equalTo(this.state.valIdProd).on("child_added",(snapshot) => {
		this.setState({
			cod: snapshot.val().codigoParte,
			parte: snapshot.val().nombre,
			precUn: snapshot.val().precioUnBs,
		},() => {
			this.setState({
				filaProd: this.state.filaProd.concat(
				<tr>
					<td><Button bsStyle="danger" onClick={this.handleRemoverPartes}>-</Button></td>
					<td>{snapshot.val().codigoParte}</td>
					<td>{snapshot.val().nombre}</td>
					<td><FormControl type="text" style={{"width":"100px"}} defaultValue="1" /></td>
					<td>{snapshot.val().precioUnBs}</td>
				</tr>),
			});
		});
		console.log(this.state.filaProd);
		},this);
	}
	handleListaPartes=(e)=> {
			this.setState({
				valIdProd: e.target.value.substr(0, e.target.value.indexOf(' '))
			});
	}
	handleGuardarNombre=(e)=> {
		this.setState({ nombre: e.target.value, });
	}
	handleGuardarApellido=(e)=> {
		this.setState({ apellido: e.target.value, });
	}
	handleGuardarTelefono=(e)=> {
		this.setState({ telefono: e.target.value, });
	}
	selectCliente=()=> {
		var sel = _.filter(this.state.arrayCl, (val) =>
			val.idCi == this.state.selCliente
		);
		_.map(sel, (val)=>
			this.setState({
				nombre: val.nombre,
				apellido: val.apellido,
				carnetId: val.idCi,
				telefono: val.telefono,
			})
		);
		/*this.setState({
			nombre: sel.nombre, 
			apellido: sel.apellido, 
			telefono: sel.te, 
			carnetId: '',
		});*/
	}
	render() {
		var estiloLista = { height: 250, borderRadius: 10 };
		return (
		<div className="RegCotizacion">
				<div><Row>
				<Col xs={12} sm={6} md={4}>
					<div>
						<h3>Lista de materias disponibles</h3>
						<FormControl componentClass="select" multiple id="selPartes" onClick={this.handleListaPartes} name="selPartes" style={estiloLista}>
						{_.map(this.state.arrayPartes,(value) => 
							<option>{value.codigoParte}  {value.nombre}</option>
							)
						}	
						</FormControl>
						<Button bsStyle="primary" onClick={this.handleAddParteCot}>Añadir</Button>
						<p />
					</div>
				</Col>
				<Col xs={12} sm={12} md={8}>
				<div>
					<h3>Lista productos para comprar:</h3>
					<div style={{"overflowY": "scroll","overflowX": "scroll", "height": "250px"}}>
					<Table responsive ref="tablaCot" id="tablaCot">
						<thead>
							<tr>
								<th>#</th>
								<th>Codigo</th>
								<th>Nombre</th>
								<th>Cantidad</th>
								<th>Precio Unidad</th>
							</tr>
						</thead>
						<tbody>
						{/*nota cuando se usa el innerHTML se debe pasar a la sintaxis normal de bootstrap y no la react Bootstrap
						ademas los comentarios en react bootstrap tampoco son los mismos
							<tr>
								<th>Codigo</th>
								<th>Nombre</th>
								<th><FormControl type="text" name="cant" id="cant" style={{"width":"100px"}} defaultValue="1" /></th>
						</tr>*/}
						{this.state.filaProd}
						</tbody>
					</Table></div>
					<Button bsStyle="primary" onClick={this.transferirTabla}>Generar Cotizacion</Button>
						{/*<Checkbox />{''}*/}
				</div>
				</Col>
				</Row>
		</div>
		<Modal show={this.state.showModal} onHide={this.close}>
			<Modal.Header closeButton>
				<Modal.Title>generacion de cotizacion</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<FormControl type="text" onChange={this.handleBuscarCl} value={this.state.buscarCl} placeholder="Apellido del cliente" />
					<FormControl componentClass="select" onChange={this.handleSelCliente} multiple style={{"height":"100px"}}>
						{
							this.state.buscarCl === ''?
							_.map(this.state.arrayCl, (val,key) =>
								<option>{val.idCi} {val.nombre} {val.apellido}</option>
							):
							_.map(this.state.arrayBusCl, (val,key) =>
								<option>{val.idCi} {val.nombre} {val.apellido}</option>
							)
						}
				</FormControl>
				<div className="FormGroup">
					<Label>Nombre</Label>
					<FormControl type="text" name="nombre" ref="nombre" onChange={this.handleGuardarNombre} value={this.state.nombre} placeholder="Nombre Cliente" />
				</div>
				<div className="FormGroup">
					<Label>Apellidos</Label>
					<FormControl type="text" name="apellidos" ref="apellidos" onChange={this.handleGuardarApellido} value={this.state.apellido} placeholder="Apellidos Cliente" />
				</div>
				<div className="FormGroup">
					<Label>Telefono</Label>
					<FormControl type="text" name="telefono" ref="telefono" onChange={this.handleGuardarTelefono} value={this.state.telefono} placeholder="Telefono Cliente" />
				</div>
				<div className="FormGroup">
					<Label>Productos a facturar:</Label>
					<div style={{"overflowY": "scroll","overflowX": "scroll", "height": "200px"}}>
					<Table responsive id="tablaModalFact" name="tablaModalFact">
						<thead>
							<tr>
								<th>Codigo</th>
								<th>Nombre</th>
								<th>Cantidad</th>
								<th>Precio Un.</th>
							</tr>
						</thead>
						<tbody>
						{_.map(this.state.factLista, (value) =>
								<tr>
									<td>{value.codigo}</td>
									<td>{value.nombreProd}</td>
									<td>{value.cantidad}</td>
									<td>{value.precio}</td>
								</tr>
							)
						}
						</tbody>
					</Table></div>
				</div>
				<div className="FormGroup">
					<Label>Total</Label>
					<FormControl type="text" name="total" id="total" value={this.state.sumaTotal} placeholder="0.00" />
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button bsStyle="primary" onClick={this.guardarFactura}>Guardar</Button>
				<Button bsStyle="success">Guardar e Imprimir</Button>
				<Button onClick={this.close}>Cerrar</Button>
			</Modal.Footer>
		</Modal>
		</div>
    );
  }
}

module.exports = RegExpensas