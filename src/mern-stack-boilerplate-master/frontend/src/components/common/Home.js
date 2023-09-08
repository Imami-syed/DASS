import React, { useState, Component } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import axios from 'axios';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Plot from 'react-plotly.js';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { tableCellClasses } from '@mui/material/TableCell';
import { spacing } from "@mui/system";
import Plotly from 'plotly.js-dist';

var varX = [];
var varY = [];
var template;
var layout;
var allFields = [];

const Input = styled('input')({
	display: 'block',
	margin: '20px auto',
	width: '100%',
	marginBottom: '1rem',
});


const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: theme.palette.text.secondary,
}));


function Home() {
	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
	const [isSelected, setIsSelected] = useState(false);
	const [extractedData, setExtractedData] = useState([]);
	const [isDataExtracted, setIsDataExtracted] = useState(false);
	const [isShowData, setIsShowData] = useState(false);
	const [isShowGraph, setIsShowGraph] = useState(false);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsSelected(true);
	};

	const handleSubmission = (e) => {
		e.preventDefault();
		const formData = new FormData();

		formData.append('file', selectedFile);
		axios.post('http://localhost:5000/api/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
			.then(res => {
				console.log("Data Sent");
				console.log("Data Sent succesfully");
			}
			)
			.catch(err => {
				//console.log("Error Recieved");
				console.log(err);
			}
			);
	};
	// const clearbutton= (e) => {
	// 	e.preventDefault();
		
	// };
	const handlegraphs = (e) => {
		e.preventDefault();
		axios
			.get('http://localhost:5000/api/data')
			.then(res => {
				setExtractedData(res.data);
				setIsDataExtracted(true);
				setIsShowGraph(true);
			})
			.catch(err => {
				console.log(err);
			});
	};

	function gengraphs (e, props, strVal){
		e.preventDefault();
		varX = [];
		varY = [];
		props.map((row) => (
			varX.push(row['Date & Time']),
			varY.push(row[strVal])
		));
	
		template = {
			x: varX,
			y: varY,
			type: 'scatter',
			mode: 'markers'
		};

		layout = {
			title: strVal
		}
	
		Plotly.newPlot(document.getElementById('myDiv'), [template], layout);		
	}

	const handleShowData = (e) => {
		e.preventDefault();
		axios
			.get('http://localhost:5000/api/data')
			.then(res => {
				setExtractedData(res.data);
				setIsDataExtracted(true);
				setIsShowData(true);
			})
			.catch(err => {
				console.log(err);
			});

	}

	return (
		<div>
			<div>
				<Input type="file" name="file" onChange={changeHandler} />
				{isSelected ? (
					<div>
						<p>Filename: {selectedFile.name}</p>
						<p>Filetype: {selectedFile.type}</p>
						<p>Size in bytes: {selectedFile.size}</p>
						<p>
							Last Modified Date:{' '}
							{selectedFile.lastModifiedDate.toLocaleDateString()}
						</p>
					</div>
				) : (
					null
				)}
				<Grid>
					<Box mt={10}>
						<Button
							variant="contained"
							color="primary"
							sx={{ mx: 2 }}
							onClick={handleSubmission}>Submit</Button>
						<Button
							variant="contained"
							color="primary"
							sx={{ mx: 2 }}
							onClick={handlegraphs}>Generate Graphs</Button>
						<Button
							variant="contained"
							color="primary"
							sx={{ mx: 2 }}
							onClick={handleShowData}>Show Data</Button>
					</Box>
					{
						(isDataExtracted && isShowGraph) ?
							(
								console.log(extractedData.data[0]),
								<Box mt={5}>
									<Button
										variant="contained"
										color="primary"
										sx={{ mx: 2, my: 2 }}
										onClick={(event) => gengraphs(event, extractedData.data, "IF - EMF 23")}>IF - EMF 23</Button>
									<Button
										variant="contained"
										color="primary"
										sx={{ mx: 2, my: 2 }}
										onClick={(event) => gengraphs(event, extractedData.data, "IF - EMF 33")}>IF - EMF 33</Button>
									<Button
										variant="contained"
										color="primary"
										sx={{ mx: 2, my: 2 }}
										onClick={(event) => gengraphs(event, extractedData.data, "IF - EMF 47")}>IF - EMF 47</Button>
									<Button
										variant="contained"
										color="primary"
										sx={{ mx: 2, my: 2 }}
										onClick={(event) => gengraphs(event, extractedData.data, "IP - EMF 47")}>IP - EMF 47</Button>
									<Button
										variant="contained"
										color="primary"
										sx={{ mx: 2, my: 2 }}
										onClick={(event) => gengraphs(event, extractedData.data, "IP - EMF 33")}>IP - EMF 33</Button>
									<Button
										variant="contained"
										color="primary"
										sx={{ mx: 2, my: 2 }}
										onClick={(event) => gengraphs(event, extractedData.data, "IP - EMF 23")}>IP - EMF 23</Button>
									<Button
										variant="contained"
										color="primary"
										sx={{ mx: 2, my: 2 }}
										onClick={(event) => gengraphs(event, extractedData.data, "WS01-DMA07-AZP 01")}>WS01-DMA07-AZP 01</Button>
									<Button
										variant="contained"
										color="primary"
										sx={{ mx: 2, my: 2 }}
										onClick={(event) => gengraphs(event, extractedData.data, "WS01-DMA07-CMP01")}>WS01-DMA07-CMP01</Button>
									<Button
										variant="contained"
										color="primary"
										sx={{ mx: 2, my: 2 }}
										onClick={(event) => gengraphs(event, extractedData.data, "WS01-DMA07-CMP 02")}>WS01-DMA07-CMP 02</Button>
									<Button
										variant="contained"
										color="primary"
										sx={{ mx: 2, my: 2 }}
										onClick={(event) => gengraphs(event, extractedData.data, "WS01-DMA07-CMP 03")}>WS01-DMA07-CMP 03</Button>
								</Box>
							)
							: (null)
					}
					<div id='myDiv'></div>
					{
						(isDataExtracted && isShowData) ? (
							<Item>
								<TableContainer component={Paper}>
									<Table sx={{ minWidth: 700 }} aria-label="customized table">
										<TableHead>
											<TableRow>
												<StyledTableCell>Date</StyledTableCell>
												<StyledTableCell align="center">Time</StyledTableCell>
												<StyledTableCell align="center">Date and Time</StyledTableCell>
												<StyledTableCell align="center">WS01-DMA07-CMP 02</StyledTableCell>
												<StyledTableCell align="center">WS01-DMA07-CMP 03</StyledTableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{extractedData.data.map((row, id) => (
												<StyledTableRow key={id}>
													<StyledTableCell component="th" scope="row"><h3>{row.Date}</h3></StyledTableCell>
													<StyledTableCell align="center">{row.Time}</StyledTableCell>
													<StyledTableCell align="center">{row['Date & Time']}</StyledTableCell>
													<StyledTableCell align="center">{row['WS01-DMA07-CMP 02']}</StyledTableCell>
													<StyledTableCell align="center">{row['WS01-DMA07-CMP 03']}</StyledTableCell>
												</StyledTableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</Item>
						) : (null)
					}		
				</Grid>
			</div>
		</div>
	)
}

export default Home;