import React, { Component, ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Puedes registrar el error en un servicio de logging si lo deseas
		console.error('ErrorBoundary caught an error', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div>
					<h1>Ha ocurrido un error.</h1>
					<p>{this.state.error?.toString()}</p>
				</div>
			);
		}
		return this.props.children;
	}
}