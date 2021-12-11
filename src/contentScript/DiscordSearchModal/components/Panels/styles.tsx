import styled from 'styled-components';
import { Avatar, EllipsisText, HStack } from '../../../../common/styles';

export const Text = styled(EllipsisText)<{textAlign?: string, isUrl?: boolean}>`
	flex: 1;
	text-align: ${(props) => props.textAlign || 'left'};
	color: ${(props) => (props.isUrl ? 'var(--text-color)' : 'white')};
`;

export const Favicon = styled(Avatar)`
	margin-right: 1.5rem;
`;

export const CustomFlex = styled(HStack)`
	flex: 1;
	width: 0;
	justify-content: space-between;
	align-items: center;
`;

export const Container = styled.div<{isScrollable: boolean}>`
	width: 100%;
	align-items: flex-start;
	flex: 1;
	overflow-y: ${(props) => (props.isScrollable ? 'auto' : 'initial')};
`;

export const Title = styled.h3`
 color: white;
 font-size: 0.8rem;
 padding: 0.2rem;
`;

export const Url = styled.h3`
 color: #e7e0e0;
 font-size: 0.8rem;
 padding: 0.2rem;
`;
