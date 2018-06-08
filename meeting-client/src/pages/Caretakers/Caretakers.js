import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import { ButtonGroup, Button, Modal, Glyphicon, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import AddCaretakerModal from './AddCaretaker';
import UpdateCaretakerModal from './UpdateCaretaker';

var Caretakers = React.createClass({

	getInitialState: function() {

		return {
			data: null,
			selectedCaretakerId: null,
			showAddModal: false,
			showUpdateModal: false
		}
    },
	
	componentDidMount: function() {
		this.refreshTable();
	},
	
	render: function() {

		var selectRowProp = {
			mode: "radio",
			clickToSelect: true,
			className: "selected-row",
			bgColor: 'rgb(101, 148, 255)',			
			onSelect: this.onRowSelect
		};		
		
		if(!this.state.data){
			return (<div></div>);
		}
		
		return (
			<div>
				<ButtonGroup className="m-10">
					<Button bsStyle="primary" onClick={this.openAddModal}><Glyphicon glyph="plus" />Add</Button>
					<Button bsStyle="warning" disabled={this.state.selectedCaretakerId === null} onClick={this.openUpdateModal}><Glyphicon glyph="refresh" />Update</Button>
					<Button bsStyle="danger" disabled={this.state.selectedCaretakerId === null} onClick={this.onDeleteBtnClicked}><Glyphicon glyph="trash" />Delete</Button>
				</ButtonGroup>
			
				<BootstrapTable data={this.state.data} 
								striped={true} 
								hover={true} 
								pagination={true} 
								search={true} 
								selectRow={selectRowProp}>
					<TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Caretaker ID</TableHeaderColumn>
					<TableHeaderColumn dataField="name" dataSort={true}>Caretaker Name</TableHeaderColumn>
				</BootstrapTable>
							
				<AddCaretakerModal parent={this} ref="addCaretaker" />

				<UpdateCaretakerModal parent={this} ref="updateCaretaker"/>
			</div>		
		);
	},
	
	// Keep selected row
	onRowSelect: function(row, isSelected) {

		if(isSelected) {
			this.setState({ selectedCaretakerId: row.id });
		}else {
			this.setState({ selectedCaretakerId: null });
		}
	},
	
	//Add modal open/close
	closeAddModal: function() {
		this.setState({ showAddModal: false });
		this.refs.addCaretaker.clearAddObject();
	},

	openAddModal: function() {
		this.refs.addCaretaker.clearAddObject();		
		this.setState({ showAddModal: true });
	},

	//Update modal open/close
	closeUpdateModal: function() {
		this.setState({showUpdateModal: false});
		this.refs.updateCaretaker.clearUpdateObject();
	},
	
	openUpdateModal: function() {
		this.refs.updateCaretaker.fillUpdateObject();
		this.setState({showUpdateModal: true});
	},

	//BEGIN: Delete Route
	onDeleteBtnClicked: function() {
		
		axios.delete('http://172.16.1.129:8080/caretakers/' + this.state.selectedCaretakerId)
			.then(function (response) {
				this.refreshTable();
			}.bind(this))
			.catch(function (error) {
				console.log(error);
			});		
	},
	//END: Delete Route
	
	getCaretakerById: function(id) {

		for(var i in this.state.data) {
			if(this.state.data[i].id === id) {
				return this.state.data[i];
			}
		}
		return '';
	},

	//Get table data and update the state to render
	refreshTable: function() {
		
		axios.get('http://172.16.1.129:8080/caretakers')
		.then(function (caretakers) {
			this.setState({data: caretakers.data});
		}.bind(this));
	}
});

export default Caretakers;