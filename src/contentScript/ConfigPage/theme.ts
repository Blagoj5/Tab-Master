import { extendTheme } from '@chakra-ui/react';

const fonts = {
  heading: "'Roboto', sans-serif",
  body: "'Roboto', sans-serif",
  mono: "'Roboto', sans-serif",
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

const theme = extendTheme({
  colors,
  fonts,
});

export default theme;
