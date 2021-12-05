import { extendTheme } from '@chakra-ui/react';
import { isProduction } from './consts';

const fonts = isProduction ? {
  heading: 'inherit',
  body: 'inherit',
  mono: 'inherit',
} : {
  heading: 'inherit',
  body: 'inherit',
  mono: 'inherit',
};

const colors = {
  text: {
    700: '#84888C',
  },
  primary: {
    400: '#2C3036',
  },
  input: {
    100: '#9D9FA4',
    300: '#3A3C43',
    400: '#72767D',
  },
  background: {
    200: '#414052',
    300: '#20212C',
    400: '#17181F',
  },
};

const global = {
  body: {
    background: null,
    backgroundColor: null,
    bg: null,
    color: null,
    fontFamily: null,
    lineHeight: null,
    // TODO: add rest
    // font-family: var(--chakra-fonts-body);
    // transition-property: background-color;
    // transition-duration: var(--chakra-transition-duration-normal);
    // line-height: var(--chakra-lineHeights-base);
  },
};

const theme = extendTheme({
  styles: {
    global,
  },
  colors,
  fonts,
});

export default theme;
