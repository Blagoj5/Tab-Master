import { extendTheme, theme as chakraTheme } from '@chakra-ui/react';

const fonts = {
  heading: `Fira Sans ${chakraTheme.fonts.heading}`,
  body: `Fira Sans ${chakraTheme.fonts.body}`,
  mono: `Fira Sans ${chakraTheme.fonts.mono}`,
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
};

const theme = extendTheme({
  colors,
  fonts,
});

export default theme;
