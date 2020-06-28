import { Component } from "react";
import {
	HeadlineOneButton,
	HeadlineTwoButton,
	HeadlineThreeButton,
} from "draft-js-buttons";
import { EditorState } from "draft-js";
import { withStyles } from "@material-ui/styles";

interface HeadlinesPickerProps {
	onOverrideContent: (override: any) => void;
	setEditorState: (editorState: EditorState) => void;
	getEditorState: () => EditorState;
	classes: any;
}
class HeadlinesPicker extends Component<HeadlinesPickerProps> {
	componentDidMount() {
		setTimeout(() => {
			window.addEventListener("click", this.onWindowClick);
		});
	}

	componentWillUnmount() {
		window.removeEventListener("click", this.onWindowClick);
	}

	onWindowClick = () =>
		// Call `onOverrideContent` again with `undefined`
		// so the toolbar can show its regular content again.
		this.props.onOverrideContent(undefined);

	render() {
		const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
		return (
			<div>
				{buttons.map((
					Com,
					i // eslint-disable-next-line
				) => (
					<Com key={i} {...this.props} />
				))}
			</div>
		);
	}
}

class HeadlinesButton extends Component<HeadlinesPickerProps> {
	onClick = () =>
		// A button can call `onOverrideContent` to replace the content
		// of the toolbar. This can be useful for displaying sub
		// menus or requesting additional information from the user.
		this.props.onOverrideContent(HeadlinesPicker);

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.headlineButtonWrapper}>
				<button onClick={this.onClick} className={classes.headlineButton}>
					H
				</button>
			</div>
		);
	}
}

export const StyleButton = (props) => {
	return (
		<span
			style={{
				color: props.active ? "#5890ff" : "#999",
				cursor: "pointer",
				marginRight: "16px",
				padding: " 2px 0",
				display: " inline-block",
			}}
			onMouseDown={(e) => {
				e.preventDefault();
				props.onToggle(props.style);
			}}
		>
			{props.label}
		</span>
	);
};
export const InlineStyleControls = (props) => {
	let currentStyle = props.editorState.getCurrentInlineStyle();
	let INLINE_STYLES = [
		{ label: "Bold", style: "BOLD" },
		{ label: "Italic", style: "ITALIC" },
		{ label: "Underline", style: "UNDERLINE" },
		{ label: "Monospace", style: "CODE" },
	];
	return (
		<div
			style={{
				borderTop: "1px solid #ddd",
				cursor: "text",
				fontSize: "16px",
				marginTop: "10px",
			}}
		>
			{INLINE_STYLES.map((type) => (
				<StyleButton
					key={type.label}
					active={currentStyle.has(type.style)}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			))}
		</div>
	);
};

export const BlockStyleControls = (props) => {
	const { editorState } = props;
	const selection = editorState.getSelection();
	console.log("selection", selection);
	const blockType = editorState
		.getCurrentContent()
		.getBlockForKey(selection.getStartKey())
		.getType();

	const BLOCK_TYPES = [
		{ label: "H1", style: "header-one" },
		{ label: "H2", style: "header-two" },
		{ label: "H3", style: "header-three" },
		{ label: "H4", style: "header-four" },
		{ label: "H5", style: "header-five" },
		{ label: "H6", style: "header-six" },
		{ label: "Blockquote", style: "blockquote" },
		{ label: "UL", style: "unordered-list-item" },
		{ label: "OL", style: "ordered-list-item" },
		{ label: "Code Block", style: "code-block" },
	];
	return (
		<div
			style={{
				fontFamily: "Helvetica  sans-serif",
				fontSize: "14px",
				marginBottom: "5px",
				userSelect: "none",
				marginLeft: 10,
			}}
		>
			{BLOCK_TYPES.map((type) => (
				<StyleButton
					key={type.label}
					active={type.style === blockType}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			))}
		</div>
	);
};

export default withStyles({
	editor: {
		boxSizing: "border-box",
		border: "1px solid #ddd",
		cursor: "text",
		padding: "16px",
		borderRadius: "2px",
		marginBottom: "2em",
		boxShadow: "inset 0px 1px 8px -3px #ABABAB",
		background: "#fefefe",
	},
	headlineButton: {
		background: "#fbfbfb",
		color: "#888",
		fontSize: "18px",
		border: 0,
		paddingTop: "5px",
		verticalAlign: "bottom",
		height: "34px",
		width: "36px",
	},
	headlineButtonWrapper: {
		display: "inline-block",
	},
})(HeadlinesButton);
