import { useState } from "react";
import { NextPage } from "next";
import useSWR from "swr";
import { useTranslation } from "react-i18next";
import {
	// GridList,
	Grid,
	GridListTile,
	ListSubheader,
	GridListTileBar,
	IconButton,
	Typography,
	Menu,
	MenuItem,
	List,
	ListItem,
	ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";

import BasicLayout from "../components/BasicLayout";
import { languageFetcher } from "../utils/languageFetcher";
import i18nLoader, { serverResponseToResourcesBundle } from "../i18n";
import { fetcher, defaultOption } from "../utils/fetcher";
import { imageDimensionGetter } from "../utils/imageDimensionGetter";

i18nLoader("en", {}, "common");

const useStyles = makeStyles({
	colorTextPrimary: {
		color: "white",
	},
	upperSection: {
		marginTop: "10vh",
		marginBottom: "10vh",
	},
});

const ProjectCard = (props) => {
	const { data, i, classes, master } = props;
	const projectImageURL = data.projectImageURL
		? data.projectImageURL.length > 0
			? data.projectImageURL[0] == "/"
				? data.projectImageURL
				: "/" + data.projectImageURL
			: ""
		: "";
	console.log("ProjectCard", props.sourceDimension, props.targetDimension);
	if (master) {
		return (
			<Grid
				item
				xs={props.sourceDimension.height > props.sourceDimension.width ? 6 : 12}
			>
				<Link href={`/${data._id}`}>
					<GridListTile
						key={projectImageURL}
						style={{
							height:
								props.targetDimension.height == props.sourceDimension.height
									? props.sourceDimension.height
									: props.targetDimension.height > props.targetDimension.width
									? props.targetDimension.height / 2
									: props.targetDimension.height,
							width:
								props.targetDimension.height == props.sourceDimension.height
									? props.targetDimension.width
									: props.targetDimension.height > props.targetDimension.width
									? props.targetDimension.width
									: props.targetDimension.width / 2,
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								height: "inherit",
								justifyContent: "flex-end",
							}}
						>
							<img src={projectImageURL} alt={data.projectName} />
							<GridListTileBar
								title={data.projectName}
								subtitle={<span>by: {data.receiverName}</span>}
								actionPosition="left"
								style={{ background: "rgba(0,0,0, 0.7)" }}
								actionIcon={
									<IconButton aria-label={`info about ${data.projectName}`}>
										<Typography
											variant="h2"
											color="textPrimary"
											classes={{
												colorTextPrimary: classes.colorTextPrimary,
											}}
										>
											{i}
										</Typography>
									</IconButton>
								}
							/>
						</div>
					</GridListTile>
				</Link>
			</Grid>
		);
	}
	return (
		<Grid item>
			<Link href={`/${data._id}`}>
				<GridListTile
					key={projectImageURL}
					style={{
						height:
							props.targetDimension.height == props.sourceDimension.height
								? props.sourceDimension.height
								: props.targetDimension.height > props.targetDimension.width
								? props.targetDimension.height / 2
								: props.targetDimension.height,
						width:
							props.targetDimension.height == props.sourceDimension.height
								? props.targetDimension.width
								: props.targetDimension.height > props.targetDimension.width
								? props.targetDimension.width
								: props.targetDimension.width / 2,
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							height: "inherit",
							justifyContent: "flex-end",
						}}
					>
						<img src={projectImageURL} alt={data.projectName} />
						<GridListTileBar
							title={data.projectName}
							subtitle={<span>by: {data.receiverName}</span>}
							actionPosition="left"
							style={{ background: "rgba(0,0,0, 0.7)" }}
							actionIcon={
								<IconButton aria-label={`info about ${data.projectName}`}>
									<Typography
										variant="h2"
										color="textPrimary"
										classes={{
											colorTextPrimary: classes.colorTextPrimary,
										}}
									>
										{i}
									</Typography>
								</IconButton>
							}
						/>
					</div>
				</GridListTile>
			</Link>
		</Grid>
	);
};

const RevceiverCard = (props) => {
	const { data, i, classes, master } = props;
	if (!data.receiverWallet) {
		data.receiverWallet = {
			address: "",
			descriptionImage: "",
		};
		console.log("data receiverWallet", data);
	}
	console.log("descriptionImage", data);
	const receiverImageURL = data
		? data.descriptionImage
			? data.descriptionImage.length > 0
				? data.descriptionImage[0] == "/"
					? data.descriptionImage
					: "/" + data.descriptionImage
				: ""
			: ""
		: "";

	if (master) {
		return (
			<Grid
				item
				xs={props.sourceDimension.height > props.sourceDimension.width ? 6 : 12}
			>
				<Link href={`/receiver/${data.address}`}>
					<GridListTile
						key={receiverImageURL}
						style={{
							height:
								props.targetDimension.height == props.sourceDimension.height
									? props.sourceDimension.height
									: props.targetDimension.height > props.targetDimension.width
									? props.targetDimension.height / 2
									: props.targetDimension.height,
							width:
								props.targetDimension.height == props.sourceDimension.height
									? props.targetDimension.width
									: props.targetDimension.height > props.targetDimension.width
									? props.targetDimension.width
									: props.targetDimension.width / 2,
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								height: "inherit",
								justifyContent: "flex-end",
							}}
						>
							<img src={receiverImageURL} alt={data.address} />
							<GridListTileBar
								title={data.address}
								// subtitle={<span>by: {data.receiverName}</span>}
								actionPosition="left"
								style={{ background: "rgba(0,0,0, 0.7)" }}
								actionIcon={
									// <IconButton aria-label={`info about ${data.projectName}`}>
									<Typography
										variant="h2"
										color="textPrimary"
										classes={{
											colorTextPrimary: classes.colorTextPrimary,
										}}
									>
										{i}
									</Typography>
								}
							/>
						</div>
					</GridListTile>
				</Link>
			</Grid>
		);
	}
	return (
		<Grid item>
			<Link href={`/receiver/${data.address}`}>
				<GridListTile
					key={receiverImageURL}
					style={{
						height:
							props.targetDimension.height == props.sourceDimension.height
								? props.sourceDimension.height
								: props.targetDimension.height > props.targetDimension.width
								? props.targetDimension.height / 2
								: props.targetDimension.height,
						width:
							props.targetDimension.height == props.sourceDimension.height
								? props.targetDimension.width
								: props.targetDimension.height > props.targetDimension.width
								? props.targetDimension.width
								: props.targetDimension.width / 2,
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							height: "inherit",
							justifyContent: "flex-end",
						}}
					>
						<img src={receiverImageURL} alt={data.address} />
						<GridListTileBar
							title={data.address}
							// subtitle={<span>by: {data.receiverName}</span>}
							actionPosition="left"
							style={{ background: "rgba(0,0,0, 0.7)" }}
							actionIcon={
								<Typography
									variant="h2"
									color="textPrimary"
									classes={{
										colorTextPrimary: classes.colorTextPrimary,
									}}
								>
									{i}
								</Typography>
							}
						/>
					</div>
				</GridListTile>
			</Link>
		</Grid>
	);
};

const Page: NextPage<any> = (props: any) => {
	const classes = useStyles();
	const [projData, setProjData] = useState([]);
	const [receiversData, setReceiverData] = useState([]);
	const [anchorProjEl, setAnchorProjEl] = useState<null | HTMLElement>(null);
	const [anchorReceiverEl, setAnchorReceiverEl] = useState<null | HTMLElement>(
		null
	);
	const [selectedProjIndex, setSelectedProjIndex] = useState(1);
	const [
		selectedReceiverOptionIndex,
		setSelectedReceiverOptionIndex,
	] = useState(0);
	const { data } = useSWR(
		"/api/projects",
		(url) =>
			fetcher(url, {
				...defaultOption,
				params: {
					sortOn: JSON.stringify({
						progress: -1,
					}),
					filterOn: JSON.stringify({}),
					page: 0,
					pageSize: 3,
				},
			}),
		{
			onSuccess: (data, key, config) => {
				console.log("fetchSuccess", data, key, config);
				if (data) {
					if (Array.isArray(data.content)) {
						setProjData(data.content);
					}
				}
			},
		}
	);
	useSWR(
		"/api/receiver/list",
		(url) =>
			fetcher(url, {
				...defaultOption,
				params: {
					sortOn: JSON.stringify({
						id: -1,
					}),
					page: 0,
					pageSize: 3,
				},
			}),
		{
			onSuccess: (data, key, config) => {
				console.log("fetchSuccess", data, key, config);
				if (data) {
					if (Array.isArray(data.content)) {
						setReceiverData(data.content);
					}
				}
			},
		}
	);
	console.log("data", data, receiversData);
	const { t, i18n } = useTranslation();
	for (let lang in props.translationData.languages) {
		if (
			!i18n.hasResourceBundle(props.translationData.languages[lang], "common")
		) {
			i18n.addResourceBundle(
				props.translationData.languages[lang],
				"common",
				serverResponseToResourcesBundle(
					props.translationData,
					props.translationData.languages[lang],
					"common"
				) || {},
				true,
				true
			);
		}
	}
	if (i18n.language != props.language) {
		if (props.language) {
			i18n.changeLanguage(props.language);
		}
	}
	const imageOneDimension = imageDimensionGetter(
		projData.length > 0
			? projData[0].projectImageURL
				? projData[0].projectImageURL.length > 0
					? projData[0].projectImageURL[0] == "/"
						? projData[0].projectImageURL
						: "/" + projData[0].projectImageURL
					: ""
				: ""
			: ""
	);
	const imageTwoDimension = imageDimensionGetter(
		projData.length > 1
			? projData[1].projectImageURL
				? projData[1].projectImageURL.length > 0
					? projData[1].projectImageURL[0] == "/"
						? projData[1].projectImageURL
						: "/" + projData[1].projectImageURL
					: ""
				: ""
			: ""
	);
	const imageThreeDimension = imageDimensionGetter(
		projData.length > 2
			? projData[2].projectImageURL
				? projData[2].projectImageURL.length > 0
					? projData[2].projectImageURL[0] == "/"
						? projData[2].projectImageURL
						: "/" + projData[2].projectImageURL
					: ""
				: ""
			: ""
	);

	const receiverImageThreeDimension = imageDimensionGetter(
		receiversData
			? receiversData.length > 2
				? receiversData[2].descriptionImage
					? receiversData[2].descriptionImage.length > 0
						? receiversData[2].descriptionImage[0] == "/"
							? receiversData[2].descriptionImage
							: "/" + receiversData[2].descriptionImage
						: ""
					: ""
				: ""
			: ""
	);
	const receiverImageTwoDimension = imageDimensionGetter(
		receiversData
			? receiversData.length > 2
				? receiversData[1].descriptionImage
					? receiversData[1].descriptionImage.length > 0
						? receiversData[1].descriptionImage[0] == "/"
							? receiversData[1].descriptionImage
							: "/" + receiversData[1].descriptionImage
						: ""
					: ""
				: ""
			: ""
	);
	const receiverImageOneDimension = imageDimensionGetter(
		receiversData
			? receiversData.length > 2
				? receiversData[0].descriptionImage
					? receiversData[0].descriptionImage.length > 0
						? receiversData[0].descriptionImage[0] == "/"
							? receiversData[0].descriptionImage
							: "/" + receiversData[0].descriptionImage
						: ""
					: ""
				: ""
			: ""
	);

	const dominateDimension = {
		height: (imageOneDimension.height + receiverImageOneDimension.height) / 2,
		width: (imageOneDimension.width + receiverImageOneDimension.width) / 2,
	};

	const projectOptions = [
		{ label: t("projectByProgress"), value: "progress" },
		{ label: t("projectByHotness"), value: "hotness" },
	];

	const receiverOptions = [
		{ label: t("receiverByFinishedProj"), value: "finishedProject" },
	];

	return (
		<BasicLayout
			key="home"
			i18nInstance={i18n}
			style={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-around",
			}}
		>
			<Grid container>
				<Grid item xs={12}>
					<Grid
						container
						justify={"center"}
						classes={{ container: classes.upperSection }}
					>
						<img
							src="/icon_L.png"
							width={
								typeof window != "undefined" ? window.innerWidth / 5 : "20%"
							}
						/>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid container justify="space-around" spacing={2}>
						<Grid item xs={4}>
							<div
								style={
									dominateDimension.height > dominateDimension.width
										? {
												display: "flex",
												flexWrap: "wrap",
												justifyContent: "center",
												overflow: "hidden",
												width: dominateDimension.width / 2,
												height: dominateDimension.height + 64,
												// marginLeft: `calc((100vw - ${
												// 	dominateDimension.width * 0.5
												// }px)/2)`,
										  }
										: {
												display: "flex",
												flexWrap: "wrap",
												justifyContent: "center",
												overflow: "hidden",
												height: dominateDimension.height + 64,
												width: dominateDimension.width / 2,
												// marginLeft: `calc((100vw - ${
												// 	dominateDimension.width * 0.5
												// }px)/2)`,
										  }
								}
							>
								<Grid container justify="center">
									<ListSubheader
										component="div"
										style={{ textAlign: "center" }}
									>
										<List aria-label="Device settings">
											<ListItem
												button
												aria-haspopup="true"
												aria-controls="lock-menu"
												aria-label={projectOptions[selectedProjIndex].label}
												onClick={(event: React.MouseEvent<HTMLElement>) => {
													setAnchorProjEl(event.currentTarget);
												}}
											>
												<ListItemText
													primary={projectOptions[selectedProjIndex].label}
													style={{ textAlign: "center" }}
												/>
											</ListItem>
										</List>
										<Menu
											id="lock-menu"
											anchorEl={anchorProjEl}
											open={Boolean(anchorProjEl)}
											onClose={() => {
												setAnchorProjEl(null);
											}}
											variant="menu"
										>
											{projectOptions.map((option, index) => (
												<MenuItem
													key={option.value}
													selected={index === selectedProjIndex}
													onClick={(event: React.MouseEvent<HTMLElement>) => {
														setSelectedProjIndex(index);
														setAnchorProjEl(null);
													}}
												>
													{option.label}
												</MenuItem>
											))}
										</Menu>
									</ListSubheader>

									<ProjectCard
										data={projData.length > 0 ? projData[0] : {}}
										i={1}
										classes={classes}
										targetDimension={{
											height: dominateDimension.height / 2,
											width: dominateDimension.width / 2,
										}}
										sourceDimension={{
											height: dominateDimension.height / 2,
											width: dominateDimension.width / 2,
										}}
										master={true}
									/>
									<Grid item>
										<Grid container>
											<ProjectCard
												data={projData.length > 1 ? projData[1] : {}}
												i={2}
												classes={classes}
												targetDimension={{
													height: dominateDimension.height / 2,
													width: dominateDimension.width / 2,
												}}
												sourceDimension={{
													height: imageTwoDimension.height / 2,
													width: imageTwoDimension.width / 2,
												}}
												master={false}
											/>
											<ProjectCard
												data={projData.length > 2 ? projData[2] : {}}
												i={3}
												classes={classes}
												targetDimension={{
													height: dominateDimension.height / 2,
													width: dominateDimension.width / 2,
												}}
												sourceDimension={{
													height: imageThreeDimension.height / 2,
													width: imageThreeDimension.width / 2,
												}}
												master={false}
											/>
										</Grid>
									</Grid>
								</Grid>
							</div>
						</Grid>
						<Grid item xs={4}>
							<div
								style={
									dominateDimension.height > dominateDimension.width
										? {
												display: "flex",
												flexWrap: "wrap",
												justifyContent: "center",
												overflow: "hidden",
												width: dominateDimension.width / 2,
												height: dominateDimension.height + 64,
												// marginLeft: `calc((100vw - ${
												// 	dominateDimension.width * 0.5
												// }px)/2)`,
										  }
										: {
												display: "flex",
												flexWrap: "wrap",
												justifyContent: "center",
												overflow: "hidden",
												height: dominateDimension.height + 64,
												width: dominateDimension.width / 2,
												// marginLeft: `calc((100vw - ${
												// 	dominateDimension.width * 0.5
												// }px)/2)`,
										  }
								}
							>
								<Grid container justify="center">
									<ListSubheader
										component="div"
										style={{ textAlign: "center" }}
									>
										<List aria-label="Device settings">
											<ListItem
												button
												aria-haspopup="true"
												aria-controls="lock-menu"
												aria-label={
													receiverOptions[selectedReceiverOptionIndex].label
												}
												onClick={(event: React.MouseEvent<HTMLElement>) => {
													setAnchorReceiverEl(event.currentTarget);
												}}
											>
												<ListItemText
													primary={
														receiverOptions[selectedReceiverOptionIndex].label
													}
													style={{ textAlign: "center" }}
												/>
											</ListItem>
										</List>
										<Menu
											id="lock-menu"
											anchorEl={anchorReceiverEl}
											open={Boolean(anchorReceiverEl)}
											onClose={() => {
												setAnchorReceiverEl(null);
											}}
											variant="menu"
										>
											{receiverOptions.map((option, index) => (
												<MenuItem
													key={option.value}
													selected={index === selectedReceiverOptionIndex}
													onClick={(event: React.MouseEvent<HTMLElement>) => {
														setSelectedReceiverOptionIndex(index);
														setAnchorReceiverEl(null);
													}}
												>
													{option.label}
												</MenuItem>
											))}
										</Menu>
									</ListSubheader>

									<RevceiverCard
										data={receiversData.length > 0 ? receiversData[0] : {}}
										i={1}
										classes={classes}
										targetDimension={{
											height: dominateDimension.height / 2,
											width: dominateDimension.width / 2,
										}}
										sourceDimension={{
											height: dominateDimension.height / 2,
											width: dominateDimension.width / 2,
										}}
										master={true}
									/>
									<Grid item>
										<Grid container>
											<RevceiverCard
												data={receiversData.length > 1 ? receiversData[1] : {}}
												i={2}
												classes={classes}
												targetDimension={{
													height: dominateDimension.height / 2,
													width: dominateDimension.width / 2,
												}}
												sourceDimension={{
													height: receiverImageTwoDimension.height / 2,
													width: receiverImageTwoDimension.width / 2,
												}}
												master={false}
											/>
											<RevceiverCard
												data={receiversData.length > 2 ? receiversData[2] : {}}
												i={3}
												classes={classes}
												targetDimension={{
													height: dominateDimension.height / 2,
													width: dominateDimension.width / 2,
												}}
												sourceDimension={{
													height: receiverImageThreeDimension.height / 2,
													width: receiverImageThreeDimension.width / 2,
												}}
												master={false}
											/>
										</Grid>
									</Grid>
								</Grid>
							</div>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</BasicLayout>
	);
};

Page.getInitialProps = async ({ req }) => {
	const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
	let inCommingURL = new URL(req.url, `http://${req.headers.host}`);
	console.log("getInitialProps", inCommingURL.searchParams.get("language"));
	const { translationData, language } = await languageFetcher(req);
	return {
		userAgent,
		translationData,
		language,
	};
};

export default Page;

// <GridList
// 	cellHeight={180}
// 	style={{
// 		height: 200,
// 		flexWrap: "nowrap",
// 		// Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
// 		transform: "translateZ(0)",
// 	}}
// 	cols={3}
// >
// 	{Array.isArray(data && projData)
// 		? projData.map((row, index) => {
// 				console.log("row", row);
// 				const projectImageURL =
// 					row.projectImageURL.length > 0
// 						? row.projectImageURL[0] == "/"
// 							? row.projectImageURL
// 							: "/" + row.projectImageURL
// 						: "";
// 				return (
// 					<GridListTile key={projectImageURL}>
// 						<img
// 							src={projectImageURL}
// 							alt={row.projectName}
// 							style={{
// 								height: "100%",
// 								width: "100%",
// 								objectFit: "contain",
// 							}}
// 						/>
// 						<GridListTileBar
// 							title={row.projectName}
// 							subtitle={<span>by: {row.receiverName}</span>}
// 							actionIcon={
// 								<IconButton
// 									aria-label={`info about ${row.projectName}`}
// 								>
// 									<InfoIcon />
// 								</IconButton>
// 							}
// 						/>
// 					</GridListTile>
// 				);
// 		  })
// 		: null}
// </GridList>
