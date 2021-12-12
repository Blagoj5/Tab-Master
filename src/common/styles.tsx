/* eslint-disable import/prefer-default-export */
import styled, { createGlobalStyle, css } from 'styled-components';
// TODO: fix the Uni Sans issue, you need to add public folder to config

export const GlobalStyle = createGlobalStyle<{extensionId?: string}>`
  :root {
		--primary-color: hsl(216, 10.204081632653061%, 19.215686274509803%);
		--text-color: hsl(210.0000000000001, 3.3613445378151265%, 53.33333333333334%);
		--input-primary: hsl(218.18181818181816, 4.602510460251041%, 46.86274509803921%);
		--input-primary-light: hsl(226.66666666666666, 7.200000000000002%, 24.50980392156863%);
		--input-primary-extra-light: hsl(222.85714285714292, 3.7037037037037055%, 62.94117647058823%); 
	}


	@font-face {
		font-family: 'Uni Sans';
		src: url('src/common/fonts/uni-sans.heavy-caps.otf') format('opentype');
		font-style: normal;
		font-weight: 600;
	}

	@font-face {
		font-family: 'Uni Sans';
		src: url('src/common/fonts/uni-sans.thin-caps.otf') format('opentype');
		font-style: normal;
		font-weight: 400;
	}

	body {
		margin: 0;
		font-family:  'Uni Sans', Arial, sans-serif;
	}

	.frame-content, .frame-root, body {
		overflow: hidden;
	}
`;

export const Pane = styled.div`
  background: var(--primary-color);
	border-radius: 0.625rem;
	padding: 1rem;
	width: 650px;
	z-index: 1000;
	height: 400px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	margin: auto;
`;

export const Center = styled.div`
	height: 100vh;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const Backdrop = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	z-index: 1;
	background: hsla(0, 0%, 0%, 0.719);
`;

export const Input = styled.input`
	background: var(--input-primary);
	color: white;
	::placeholder {
		color: var(--input-primary-extra-light)
	}
	:focus-visible {
		outline: unset;
	}
	border-radius: 5px;
	font-size: 1.3rem;
	padding: 1rem 0.5rem;
	margin-bottom: 0.5rem;
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),0 10px 10px -5px rgba(0, 0, 0, 0.04);
	border: none;
`;

export const HStack = styled.div<{spacing?: number}>`
  display: flex;
	width: 100%;
	> * {
		margin-right: ${(props) => props.spacing || '1rem'};
	}
	:last-child {
		margin-right: 0;
	}
`;

export const VStack = styled.div<{spacing?: number}>`
  display: flex;
	width: 100%;
	flex-direction: column;
	> * {
		margin-bottom: ${(props) => props.spacing || '1rem'};
	}
	:last-child {
		margin-bottom: 0;
	}
`;

export const SearchedTab = styled.div<{ isSelected?: boolean }>`
	display: flex;
	height: 40px;
	padding: 0 0.3rem;
	background: ${(props) => (props.isSelected ? 'var(--input-primary-light)' : 'auto')};
	user-select: none;
	border-radius: 4px;
	overflow: hidden;
	cursor: pointer;
	align-items: center;
	:hover {
		background: var(--input-primary-light);
	}
`;

export const Avatar = styled.img`
	background: transparent;
	width: 20px;
	height: 20px;
`;

export const Text = styled.p`
	color: white;
`;

export const EllipsisTextStyle = styled(Text)`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	> span {
		width: 100%;
	}
`;

export const EllipsisText = ({ children, ...rest }: {children: string}) => (
		<EllipsisTextStyle {...rest}>
			<span>
				{children}
			</span>
		</EllipsisTextStyle>
);

export const scrollbarStyle = css`
	::-webkit-scrollbar {
			width: 10px;
	}

  ::-webkit-scrollbar-track {
		background: #292B2F;
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb {
    border-radius: 10px;
		background: #202225;
	}
`;
