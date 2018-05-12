import React from 'react';

const UNDEF_ERROR = `You must provide a cratebox instance to the createCrateProvider function`;

const {
	Provider: ReactProvider,
	Consumer: ReactConsumer
} = React.createContext();

export function createContext(cratebox) {
	if (!createbox) throw new Error(UNDEF_ERROR);

	return {
		Provider(props) {
			return <ReactProvider value={cratebox}>{props.children}</ReactProvider>;
		}
	};
}

class CrateConsumer extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props.cratebox.getState(this.props.store) || {};
	}

	componentDidMount() {
		this.cratebox.subscribe(this.props.store, (model) => {
			this.setState(() => ({ ...model }));
		});
	}

	render() {
		return React.cloneElement(this.props.children, {
			cratebox: this.props.cratebox,
			...this.state
		});
	}
}

export function Consumer(props) {
	return (
		<ReactConsumer>
			{(cratebox) => (
				<CrateConsumer store={props.store} cratebox={cratebox}>
					{props.children}
				</CrateConsumer>
			)}
		</ReactConsumer>
	);
}
