import { useRouter } from "next/router";
import { NextPage } from "next";
import useSWR from "swr";
import QRCode from "qrcode.react";

import globalStyle from "../styles/globalStyle";
import BasicLayout from "../components/BasicLayout";
import { fetcher } from "../utils/fetcher";
import { languageFetcher } from "../utils/languageFetcher";
import { abi } from "../utils/USDCAbi";
import { useTranslation } from "react-i18next";
import i18nLoader, { serverResponseToResourcesBundle } from "../i18n";
import {
	Grid,
	Card,
	CardContent,
	Button,
	Typography,
	Input,
	Link,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { useState } from "react";
import { ethers } from "ethers";
import { detect } from "detect-browser";

interface DetailProps {
	userAgent?: string;
	err?: string;
	language?: string;
	translationData?: any;
}
i18nLoader("en", {}, "common");

const Page: NextPage<DetailProps> = (props: DetailProps) => {
	const router = useRouter();
	const { data } = useSWR(`/api/project/${router.query.id}`, fetcher);
	const [fundCardVisible, setFundCardVisible] = useState(false);
	const [payAmount, setPayAmount] = useState(0);
	const [payModalVisible, setPayModalVisible] = useState(false);
	let projectData = {
		_id: "",
		receiverWallet: {
			_id: "",
			address: "",
			balance: 0,
		},
		receiverName: "",
		projectName: "",
		projectDescciption: "",
		projectImageURL: "",
		projectWhitePaperURL: "",
		targetAmount: 0,
		raisedAmount: 0,
		progress: 0,
		expiredAt: "",
	};
	if (Array.isArray(data && data.content)) {
		if (data.content.length > 0) {
			projectData = Object.assign({}, data.content[0]);
		}
	}

	const { t, i18n } = useTranslation();
	for (let lang in props.translationData.languages) {
		if (
			!i18n.hasResourceBundle(props.translationData.languages[lang], "common")
		) {
			console.log(props.translationData.languages[lang]);
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

	let formatedRaisedRatio = projectData.progress.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	console.log("data", projectData);
	return (
		<BasicLayout key="detail" i18nInstance={i18n}>
			<Grid container justify="center">
				{!fundCardVisible && (
					<Card style={{ ...globalStyle.centerContent, marginTop: 40 }}>
						<Grid item xs={12}>
							<CardContent>
								<Grid container justify="space-between">
									<Grid item>{projectData.projectName}</Grid>
									<Grid item>
										<Button
											onClick={() => {
												if (typeof window != "undefined") {
													setPayModalVisible(true);
													setFundCardVisible(true);
												}
											}}
										>
											{t("fundTheirProj")}
										</Button>
									</Grid>
								</Grid>
							</CardContent>
						</Grid>
						<Grid item xs={12}>
							<img src={projectData.projectImageURL} width={"100%"} />
						</Grid>
						<Grid item xs={12}>
							<CardContent>
								{t("receiver")}:
								<Link
									href={`/receiver/${projectData.receiverWallet.address}`}
									rel="noreferrer"
									underline="none"
								>
									{`${projectData.receiverName}`}
								</Link>
							</CardContent>
						</Grid>
						<Grid item xs={12}>
							<CardContent>
								{`${t("projDesc")}: ${projectData.projectDescciption}`}
							</CardContent>
						</Grid>
						<Grid item xs={12}>
							<CardContent>
								{`${t("progress")}: ${formatedRaisedRatio}%`}
							</CardContent>
						</Grid>
						<Grid item xs={12}>
							<CardContent>
								<Link href={projectData.projectWhitePaperURL}>
									{t("downloadWhitePaper")}
								</Link>
							</CardContent>
						</Grid>
					</Card>
				)}
				{fundCardVisible && (
					<Card style={{ ...globalStyle.centerContent, marginTop: 40 }}>
						<Grid item xs={12}>
							<CardContent>
								<QRCode
									value={projectData.receiverWallet.address}
									style={{ marginLeft: "35%", width: "30%", height: "30%" }}
								/>
							</CardContent>
						</Grid>
						<Grid item xs={12}>
							<CardContent>
								<Typography>
									<p>Instruction:</p>
									<p>1. Scan the barcode using USDC enabled App</p>
									<p>2. Input amount</p>
									<p>3. Send the payment</p>
									<p>4. wait for a while</p>
									<p>5. Done!</p>
								</Typography>
							</CardContent>
						</Grid>
						<Grid item xs={12}>
							<CardContent>
								<Grid item>
									<Button onClick={() => setFundCardVisible(!fundCardVisible)}>
										Back
									</Button>
								</Grid>
							</CardContent>
						</Grid>
					</Card>
				)}
			</Grid>
			<Dialog
				open={payModalVisible}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				onBackdropClick={() => {
					setPayModalVisible(false);
				}}
			>
				{typeof window != "undefined" ? (
					window.ethereum ? (
						window.ethereum.isMetaMask ? (
							<DialogContent>
								<DialogContentText id="alert-dialog-description">
									{t("fundAmount")}
								</DialogContentText>
								<DialogContentText id="alert-dialog-description">
									<Input
										onChange={(e) => {
											setPayAmount(
												Math.round(parseFloat(e.target.value) * 1000000)
											);
										}}
									/>
								</DialogContentText>
							</DialogContent>
						) : (
							<DialogContent>
								<DialogContentText id="alert-dialog-description">
									{t("metamaskRecommand")}
								</DialogContentText>
							</DialogContent>
						)
					) : (
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								{t("metamaskRecommand")}
							</DialogContentText>
						</DialogContent>
					)
				) : null}

				<DialogActions>
					{typeof window != "undefined" ? (
						window.ethereum ? (
							window.ethereum.isMetaMask ? (
								<Button
									color="primary"
									onClick={() => {
										if (typeof window != "undefined") {
											if (window.web3) {
												if (window.ethereum) {
													const { ethereum } = window;
													if (ethereum.isMetaMask) {
														ethereum.enable().then((ac) => {
															let USDCInterface = new ethers.utils.Interface(
																abi
															);
															let transferCallData = USDCInterface.functions.transfer.encode(
																[projectData.receiverWallet.address, payAmount]
															);
															const params = [
																{
																	from: ac[0],
																	to:
																		"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
																	data: transferCallData,
																},
															];
															console.log("functions", transferCallData);
															window.ethereum.sendAsync(
																{
																	method: "eth_sendTransaction",
																	params: params,
																	from: ac[0], // Provide the user's account to use.
																},
																(err, response) => {
																	if (err) {
																		// Handle the error
																		console.log("transferCallData err", err);
																	} else {
																		let result = USDCInterface.functions.transfer.decode(
																			response.result
																		);
																		setPayModalVisible(false);
																		console.log(
																			"transferCallData result",
																			result
																		);
																	}
																}
															);
														});
													}
												}
											} else {
												setFundCardVisible(true);
											}
										}
									}}
								>
									{t("fundTheirProj")}
								</Button>
							) : (
								<Button
									color="primary"
									onClick={() => {
										setPayModalVisible(false);
										setFundCardVisible(true);
									}}
								>
									<Link
										href={
											typeof window != "undefined"
												? detect().name == "chrome"
													? "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
													: "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
												: ""
										}
										target="_blank"
										rel="noreferrer"
										underline="none"
									>
										{t("tryMetaMask")}
									</Link>
								</Button>
							)
						) : (
							<Button
								color="primary"
								onClick={() => {
									setPayModalVisible(false);
									setFundCardVisible(true);
								}}
							>
								<Link
									href={
										typeof window != "undefined"
											? detect().name == "chrome"
												? "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
												: "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
											: ""
									}
									target="_blank"
									rel="noreferrer"
									underline="none"
								>
									{t("tryMetaMask")}
								</Link>
							</Button>
						)
					) : null}
				</DialogActions>
			</Dialog>
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
