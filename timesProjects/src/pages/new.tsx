import { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { Input, InputLabel, makeStyles, Button, Link } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Grid from "@material-ui/core/Grid";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { languageFetcher } from "../utils/languageFetcher";
import { useTranslation } from "react-i18next";
import { detect } from "detect-browser";
import { convertToRaw, RichUtils, EditorState, Editor } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { ethers } from "ethers";

import i18nLoader, { serverResponseToResourcesBundle } from "../i18n";
import { fetcher, defaultOption } from "../utils/fetcher";
import BasicLayout from "../components/BasicLayout";
import globalStyle from "../styles/globalStyle";
import {
	InlineStyleControls,
	BlockStyleControls,
} from "../components/rte-toolbar";

const useStyles = makeStyles({
	...globalStyle,
	textInput: {
		textAlign: "center",
	},
});
registerPlugin(FilePondPluginImagePreview);
registerPlugin(FilePondPluginFileEncode);
registerPlugin(FilePondPluginFileValidateType);

interface TextInputProps {
	name: string;
	classes: any;
	fieldName: string;
	readOnly?: boolean;
}

const TextInputField = (props: TextInputProps) => {
	const { name, fieldName } = props;
	return (
		<Field name={fieldName}>
			{({
				field, // { name, value, onChange, onBlur }
				meta,
			}: FieldProps) => (
				<div style={{ marginTop: 20, textAlign: "center" }}>
					<InputLabel>{name}</InputLabel>
					<Input
						type="text"
						placeholder={
							typeof field.value == "string"
								? field.value
								: field.value.toString()
						}
						{...field}
						required
						inputProps={{
							style: {
								textAlign: "center",
							},
						}}
						readOnly={props.readOnly || false}
					/>
					{meta.touched && meta.error && (
						<div style={globalStyle.error}>{meta.error}</div>
					)}
				</div>
			)}
		</Field>
	);
};

interface NewPageProps {
	userAgent?: string;
	err?: string;
	language: string;
	translationData: any;
}
i18nLoader("en", {}, "common");

const Page: NextPage<NewPageProps> = (props: NewPageProps) => {
	const classes = useStyles();
	const [projectImage, setProjectImage] = useState([]);
	const [receiverImage, setReceiverImage] = useState([]);
	const [projectWhitePaper, setProjectWhitePaper] = useState([]);
	const [projectImageDataURL, setProjectImageDataURL] = useState("");
	const [receivertImageDataURL, setReceivertImageDataURL] = useState("");
	const [projectWhitePaperDataURL, setProjectWhitePaperDataURL] = useState("");
	const [inputAddress, setInputAddress] = useState(false);
	const [inputAddressManually, setInputAddressManually] = useState(false);
	const [recommandMetamask, setRecommandMetamask] = useState(false);
	const [payload, setPayload] = useState({});
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [editorInstance, setEditorInstance] = useState(null);
	const { data: projectPayload } = useSWR(
		Object.keys(payload).length > 0 && "/api/projects",
		(url) =>
			fetcher(url, {
				...defaultOption,
				method: "PUT",
				body: JSON.stringify({
					...payload,
				}),
			})
	);
	const { data } = useSWR(projectPayload && "/api/updateProjFile", (url) =>
		fetcher(url, {
			...defaultOption,
			method: "POST",
			body: JSON.stringify({
				projectWhitePaper: projectWhitePaperDataURL,
				projectImage: projectImageDataURL,
				projectId: projectPayload["content"]["_id"],
			}),
		})
	);
	console.log("projectPayload", projectPayload, receivertImageDataURL);
	const { data: imageStatus } = useSWR(
		data && "/api/updateReceiverFile",
		(url) =>
			fetcher(url, {
				...defaultOption,
				method: "POST",
				body: JSON.stringify({
					files: [
						{
							data: receivertImageDataURL,
							name: projectPayload.content.receiverWallet.address,
						},
					],
					receiverWalletObj: projectPayload.content.receiverWallet,
				}),
			})
	);
	if (data && imageStatus) {
		let router = useRouter();
		router.push(`/${projectPayload["content"]["_id"]}`);
	}
	const handleSubmit = (value: any, action: any) => {
		// e.preventDefault();
		console.log(value, action);
		setProjectImageDataURL(projectImage[0].getFileEncodeDataURL());
		setProjectWhitePaperDataURL(projectWhitePaper[0].getFileEncodeDataURL());
		setReceivertImageDataURL(receiverImage[0].getFileEncodeDataURL());

		console.log("receivertImageDataURL", receivertImageDataURL);
		const hashConfig = {
			trigger: "#",
			separator: " ",
		};
		const markup = draftToHtml(rawContentState, hashConfig);
		setPayload({
			receiverWallet: {
				address: value.receiverWalletAddress,
				balance: "0",
				password: value.receiverWalletPassword,
				externalLink: value.receiverExternalLink,
				description: markup,
			},
			receiverName: value.receiverName,
			projectName: value.projectName,
			projectDescciption: value.projectDescciption,
			projectImageURL: "",
			projectWhitePaperURL: "",
			targetAmount: value.targetAmount,
			raisedAmount: "0",
			createdDate: "",
		});
	};
	const handleInit = () => {
		console.log("FilePond instance has initialised");
	};

	const { t, i18n } = useTranslation();
	// console.log("languageBundle", serverResponseToResourcesBundle(props.translationData, i18n.language,"common"));
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

	const contentState = editorState.getCurrentContent();
	const rawContentState = convertToRaw(contentState);
	const hashConfig = {
		trigger: "#",
		separator: " ",
	};
	const markup = draftToHtml(rawContentState, hashConfig);
	console.log(
		"markup",
		markup,
		/<(p|h1|h2|h3|h4|h5|h6|blockquote|ul|li|ol|img|!--).*?>|<([a-z]+).*?<\/\1>/i.test(
			markup
		)
	);

	return (
		<BasicLayout key="list" i18nInstance={i18n}>
			<link
				href="https://unpkg.com/filepond/dist/filepond.css"
				rel="stylesheet"
			/>
			<link
				href="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
				rel="stylesheet"
			/>
			<Formik
				initialValues={{
					receiverWalletAddress: "",
					receiverName: "",
					projectName: "",
					projectDescciption: "",
					targetAmount: 0,
					receiverWalletPassword: "",
					receiverExternalLink: "",
				}}
				validationSchema={Yup.object().shape({
					receiverWalletAddress: Yup.string().required(
						"This field is required"
					),
					receiverWalletPassword: Yup.string().required(
						"This field is required"
					),
					receiverExternalLink: Yup.string(),
					receiverName: Yup.string().required("This field is required"),
					projectName: Yup.string().max(255).required("This field is required"),
					projectDescciption: Yup.string()
						.max(255)
						.min(10)
						.required("This field is required"),
					targetAmount: Yup.number().required("This field is required"),
				})}
				onSubmit={handleSubmit}
			>
				{(formikProps) => (
					<Form
						onReset={formikProps.handleReset}
						onSubmit={formikProps.handleSubmit}
					>
						<Grid container justify={"center"} style={{ minWidth: 666 }}>
							<Grid item xs={12} className={classes.centerContent}>
								<FilePond
									files={projectImage}
									oninit={() => handleInit()}
									onupdatefiles={(fileItems) => {
										setProjectImage(fileItems);
									}}
									style={{ height: 20 }}
									allowFileSizeValidation
									allowFileTypeValidation
									maxFileSize="10MB"
									labelMaxFileSizeExceeded="The max size of image is 10MB"
									acceptedFileTypes={["image/png", "image/jpg", "image/jpeg"]}
									labelFileTypeNotAllowed="Input must be a image file"
									labelIdle={`<p>${t("projImageUploader")}</p>`}
								></FilePond>
							</Grid>
							<Grid item xs={12} className={classes.centerContent}>
								<TextInputField
									name={`${t("projName")}`}
									classes={classes}
									fieldName="projectName"
									readOnly={false}
								/>
							</Grid>
							<Grid item xs={12} className={classes.centerContent}>
								<TextInputField
									name={`${t("projDesc")}`}
									classes={classes}
									fieldName="projectDescciption"
									readOnly={false}
								/>
							</Grid>
							<Grid item xs={12} className={classes.centerContent}>
								<TextInputField
									name="target"
									classes={classes}
									fieldName="targetAmount"
									readOnly={false}
								/>
							</Grid>
							<Grid item xs={12} className={classes.centerContent}>
								<TextInputField
									name={`${t("receiverWalletPassword")}`}
									classes={classes}
									fieldName="receiverWalletPassword"
									readOnly={false}
								/>
							</Grid>

							<Grid item xs={12} className={classes.centerContent}>
								<TextInputField
									name={`${t("receiverName")}`}
									classes={classes}
									fieldName="receiverName"
									readOnly={false}
								/>
							</Grid>
							<Grid item xs={12} className={classes.centerContent}>
								<TextInputField
									name={`${t("receiverExternalLink")}`}
									classes={classes}
									fieldName="receiverExternalLink"
									readOnly={false}
								/>
							</Grid>
							<Grid item xs={12} className={classes.centerContent}>
								{!inputAddress ? (
									<div style={{ marginTop: 20, textAlign: "center" }}>
										<InputLabel>{`${t("receiverWalletAddress")}`}</InputLabel>
										<Grid container justify={"center"}>
											<Grid item xs={9} style={{ minWidth: "33vw" }}>
												<Grid container justify={"center"} spacing={2}>
													<Grid item xs={2}>
														<Button
															onClick={() => {
																if (typeof window != "undefined") {
																	if (window.web3) {
																		const provider = new ethers.providers.Web3Provider(
																			window.web3.currentProvider
																		);
																		// There is only ever up to one account in MetaMask exposed
																		const signer = provider.getSigner();
																		console.log("signer", signer);
																		if (window.ethereum) {
																			if (window.ethereum.isMetaMask) {
																				console.log("isMetaMusk");
																				window.ethereum.enable().then((ac) => {
																					formikProps.setFieldValue(
																						"receiverWalletAddress",
																						ac[0]
																					);
																					setInputAddress(true);
																					setInputAddressManually(false);
																				});
																			}
																		}
																	} else {
																		setRecommandMetamask(true);
																	}
																}
															}}
															style={{
																textAlign: "center",
															}}
														>
															{t("connectMetamask")}
														</Button>
													</Grid>
													<Grid item xs={2}>
														<Button
															onClick={() => {
																if (typeof window != "undefined") {
																	let wallet = ethers.Wallet.createRandom();
																	if (window.ethereum) {
																		if (window.ethereum.isMetaMask) {
																			const provider = new ethers.providers.Web3Provider(
																				window.web3.currentProvider
																			);
																			wallet.connect(provider);
																		} else {
																			setRecommandMetamask(true);
																		}
																	} else {
																		setRecommandMetamask(true);
																	}
																	wallet.getAddress().then((address) => {
																		formikProps.setFieldValue(
																			"receiverWalletAddress",
																			address
																		);
																		setInputAddress(true);
																		setInputAddressManually(false);
																		navigator.clipboard
																			.writeText(wallet.mnemonic)
																			.then(() => {
																				alert(
																					"the backup secret of the wallet copied"
																				);
																			});
																	});
																}
															}}
														>
															{t("generateOneWallet")}
														</Button>
													</Grid>
													<Grid item xs={2}>
														<Button
															onClick={() => {
																setInputAddress(true);
																setInputAddressManually(true);
															}}
														>
															{t("inputManually")}
														</Button>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</div>
								) : (
									<TextInputField
										name={`${t("receiverWalletAddress")}`}
										classes={classes}
										fieldName="receiverWalletAddress"
										readOnly={!inputAddressManually}
									/>
								)}
							</Grid>
							<Grid item xs={12} className={classes.centerContent}>
								<Grid container justify="center">
									<div
										style={{
											marginTop: 20,
											marginBottom: 20,
											textAlign: "center",
											border: "1px solid",
											borderRadius: "1px",
											minWidth: "33vw",
											minHeight: "25vh",
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
										}}
										onClick={
											editorInstance ? () => editorInstance.focus() : () => {}
										}
									>
										<div>
											<InputLabel style={{ marginTop: 10, marginBottom: 10 }}>
												{t("receiverDescription")}
											</InputLabel>
											<Editor
												editorState={editorState}
												onChange={(editorState) => {
													setEditorState(editorState);
												}}
												ref={(element) => {
													setEditorInstance(element);
												}}
											/>
										</div>
										<div>
											<InlineStyleControls
												editorState={editorState}
												onToggle={(inlineStyle) =>
													setEditorState(
														RichUtils.toggleInlineStyle(
															editorState,
															inlineStyle
														)
													)
												}
											/>
											<BlockStyleControls
												editorState={editorState}
												onToggle={(blockType) => {
													setEditorState(
														RichUtils.toggleBlockType(editorState, blockType)
													);
												}}
											/>
										</div>
									</div>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.centerContent}>
								<FilePond
									files={receiverImage}
									oninit={() => handleInit()}
									onupdatefiles={(fileItems) => {
										setReceiverImage(fileItems);
									}}
									style={{ height: 20 }}
									allowFileSizeValidation
									allowFileTypeValidation
									maxFileSize="10MB"
									labelMaxFileSizeExceeded="The max size of image is 10MB"
									acceptedFileTypes={["image/png", "image/jpg", "image/jpeg"]}
									labelFileTypeNotAllowed="Input must be a image file"
									labelIdle={`<p>${t("receiverImageUploader")}</p>`}
								></FilePond>
							</Grid>
							<Grid item xs={12} className={classes.centerContent}>
								<FilePond
									files={projectWhitePaper}
									oninit={() => handleInit()}
									onupdatefiles={(fileItems) => {
										setProjectWhitePaper(fileItems);
										console.log("fileItems", fileItems);
									}}
									allowFileSizeValidation
									allowFileTypeValidation
									maxFileSize="10MB"
									labelMaxFileSizeExceeded="The max size of PDF is 10MB"
									acceptedFileTypes={["application/pdf"]}
									labelFileTypeNotAllowed="Input must be a PDF"
									style={{ ...globalStyle.centerContent, height: 20 }}
									labelIdle={`<p>${t("projWhitepaperUploader")}</p>`}
								></FilePond>
							</Grid>
							<Grid item xs={12}>
								<Grid
									container
									// className={classes.centerContent}
									style={{ marginTop: 10 }}
									justify="center"
								>
									<Grid item xs={6}>
										<Grid container justify="center">
											<Grid item xs={2}>
												<Button type="submit">{t("submit")}</Button>
											</Grid>
											<Grid item xs={2}>
												<Button
													type="reset"
													onClick={() => {
														setInputAddress(false);
														setInputAddressManually(false);
													}}
												>
													{t("reset")}
												</Button>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
			<Dialog
				open={recommandMetamask}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						we recommand using metamask to manage your wallet
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						color="primary"
						onClick={() => {
							setRecommandMetamask(false);
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
							Try metamusk
						</Link>
					</Button>
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

declare global {
	interface Window {
		web3: any;
		ethereum: any;
	}
	// interface Navigator {
	//   clipboard: any;
	// }
}

export default Page;
