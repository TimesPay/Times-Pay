import { useRouter } from "next/router";
import { NextPage } from "next";
import useSWR from "swr";
import { useTranslation } from "react-i18next";
import {
	Grid,
	Card,
	CardContent,
	CardMedia,
	Link,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	Button,
	TableBody,
	TableCell,
	Avatar,
	Slider,
	TablePagination,
} from "@material-ui/core";
import { useState } from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

import constants from "../../utils/constants";
import i18nLoader, { serverResponseToResourcesBundle } from "../../i18n";
import BasicLayout from "../../components/BasicLayout";
import { languageFetcher } from "../../utils/languageFetcher";
import { fetcher } from "../../utils/fetcher";

const useStyles = makeStyles({
	"spinner-root": {
		position: "absolute",
		marginLeft: "48%",
		marginTop: "48vh",
	},
	"expand-icon-row-root": {
		display: "flex !important",
		flexDirection: "row",
		justifyContent: "center",
		width: "100vw",
		position: "absolute",
	},
	"table-header-column-root": {
		width: "20%",
	},
});

interface ReceiverProps {
	language?: string;
	translationData?: any;
}
i18nLoader("en", {}, "common");

const Page: NextPage<ReceiverProps> = (props: ReceiverProps) => {
	const router = useRouter();
	const [projData, setProjData] = useState([
		{
			_id: "",
			receiverWallet: {
				address: "",
				balance: 0,
				externalLink: "",
				description: "",
				descriptionImage: "",
			},
			receiverName: "",
			projectName: "",
			projectDescciption: "",
			projectImageURL: "",
			projectWhitePaperURL: "",
			targetAmount: 0,
			raisedAmount: 0,
			createdAt: "",
			expiredAt: "",
			progress: 0,
		},
	]);
	const [sortOnObj, setSortOnObj] = useState<any>({
		projName: 1,
	});
	const [currentPage, setCurrentPagej] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);

	useSWR(`/api/receiver/${router.query.address}`, fetcher, {
		onSuccess: (data, key, config) => {
			console.log("wallet address", router.query.address, data);
			if (data) {
				setProjData(data.content);
			}
		},
	});
	const classes = useStyles();
	const { i18n, t } = useTranslation();
	const headers = [
		{ name: "projName", filterType: "string" },
		{ name: "raised", filterType: "quantity" },
		{ name: "target", filterType: "quantity" },
		{ name: "progress", filterType: "quantity" },
		{ name: "createdAt", filterType: "date" },
		{ name: "expiredAt", filterType: "date" },
	];

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
	const linkList = projData.map((value, index) => {
		return (
			<Grid item xs={12}>
				<Link
					href={value.receiverWallet.externalLink}
					rel="noreferrer"
					underline="none"
					target="_blank"
				>
					link{index}
				</Link>
			</Grid>
		);
	});

	if (typeof window != "undefined") {
		window.document.getElementById("customize-description").innerHTML =
			projData[0].receiverWallet.description;
	}
	return (
		<BasicLayout key="receiver" i18nInstance={i18n}>
			<Grid
				container
				justify="space-between"
				direction="column"
				style={{ minHeight: "94vh", overflowY: "auto" }}
				spacing={1}
			>
				<Grid item xs={12}>
					<Grid container justify="flex-start" direction="row">
						<Grid item xs={9}>
							<Grid container justify="flex-start">
								<Grid item xs={12}>
									<CardContent>
										<div id={"customize-description"}></div>
									</CardContent>
								</Grid>
								<Grid item xs={12}>
									{t("receiverExternalLink")}:
								</Grid>
								{linkList}
							</Grid>
						</Grid>
						<Grid item xs={3}>
							<Card style={{ minHeight: "100%" }}>
								<Grid container justify="center">
									<Grid item xs={12}>
										<CardMedia>
											<img
												src={
													projData[0].receiverWallet.descriptionImage
														? projData[0].receiverWallet.descriptionImage[0] ==
														  "/"
															? projData[0].receiverWallet.descriptionImage
															: "/" +
															  projData[0].receiverWallet.descriptionImage
														: ""
												}
												style={{ maxWidth: "25vw" }}
											/>
										</CardMedia>
									</Grid>
									<Grid item xs={12}>
										<CardContent>{projData[0].receiverName}</CardContent>
									</Grid>
								</Grid>
							</Card>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid container>
						<TableContainer component={Card}>
							<Table stickyHeader={true}>
								<TableHead>
									<TableRow>
										{headers.map((value: any) => {
											return (
												<TableCell
													align="center"
													classes={{
														root: classes["table-header-column-root"],
													}}
												>
													<Button
														onClick={() => {
															console.log(
																"sortOnObj",
																sortOnObj,
																Object.keys(sortOnObj),
																value.name
															);
															if (
																Object.keys(sortOnObj).indexOf(value.name) >= 0
															) {
																setSortOnObj({
																	[value.name]: -1 * sortOnObj[value.name],
																});
															} else {
																setSortOnObj({
																	[value.name]: 1,
																});
															}
														}}
													>
														{t(value.name)}
														{sortOnObj[value.name] ? (
															sortOnObj[value.name] == -1 ? (
																<ArrowDropDownIcon />
															) : (
																<ArrowDropUpIcon />
															)
														) : null}
													</Button>
												</TableCell>
											);
										})}
									</TableRow>
								</TableHead>
								<TableBody>
									{Array.isArray(projData)
										? projData.map((row: any) => {
												console.log("row", row.projectImageURL);
												return (
													<TableRow key={row._id}>
														<TableCell
															component="th"
															scope="row"
															align="center"
														>
															<Button>
																<Link href={`/${row._id}`}>
																	<Grid container justify="flex-start">
																		<Grid item>
																			<Avatar
																				src={
																					row.projectImageURL.length > 0
																						? row.projectImageURL[0] == "/"
																							? row.projectImageURL
																							: "/" + row.projectImageURL
																						: ""
																				}
																				alt={row.projectName}
																			/>
																		</Grid>
																		<Grid item>{row.projectName}</Grid>
																	</Grid>
																</Link>
															</Button>
														</TableCell>
														<TableCell align="center">
															{row.raisedAmount}
														</TableCell>
														<TableCell align="center">
															{row.targetAmount}
														</TableCell>
														<TableCell align="center">
															<Grid container>
																<Grid item xs={12}>
																	<Slider
																		value={row.progress}
																		aria-labelledby="continuous-slider"
																	/>
																</Grid>
																<Grid item xs={12}>
																	{row.progress}%
																</Grid>
															</Grid>
														</TableCell>
														<TableCell align="center">
															{moment(row.createdAt).format(
																constants["dateFormat"]
															)}
														</TableCell>
														<TableCell align="center">
															{moment(row.expiredAt).format(
																constants["dateFormat"]
															)}
														</TableCell>
													</TableRow>
												);
										  })
										: null}
								</TableBody>
								<TablePagination
									count={-1}
									onChangePage={(event: object, page: number) => {
										setCurrentPagej(page);
									}}
									onChangeRowsPerPage={(event: any) => {
										console.log(event);
										setRowsPerPage(event.target.value);
									}}
									page={currentPage}
									rowsPerPage={rowsPerPage}
									rowsPerPageOptions={[4, 5, 10, 20]}
								/>
							</Table>
						</TableContainer>
					</Grid>
				</Grid>
			</Grid>
		</BasicLayout>
	);
};

Page.getInitialProps = async ({ req }) => {
	const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
	const { translationData, language } = await languageFetcher(req);
	return {
		userAgent,
		namespacesRequired: ["common"],
		translationData,
		language,
	};
};

export default Page;
