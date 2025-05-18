import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

// Modern CSS Reset (adapted from a popular reset)
globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('html, body', {
  height: '100%',
});

globalStyle('body', {
  lineHeight: vars.lineHeights.normal,
  fontFamily: vars.fonts.body,
  color: vars.colors.text,
  backgroundColor: vars.colors.background,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle('img, picture, video, canvas, svg', {
  display: 'block',
  maxWidth: '100%',
});

globalStyle('input, button, textarea, select', {
  font: 'inherit',
});

globalStyle('p, h1, h2, h3, h4, h5, h6', {
  overflowWrap: 'break-word',
});

globalStyle('#root, #__next', {
  isolation: 'isolate',
  height: '100%',
});

globalStyle('ul[role="list"], ol[role="list"]', {
  listStyle: 'none',
});

// Set core root defaults
globalStyle('html:focus-within', {
  scrollBehavior: 'smooth',
});

globalStyle('a:not([class])', {
  textDecorationSkipInk: 'auto',
});

// Make images easier to work with
globalStyle('img[alt]', {
  fontStyle: 'italic',
  color: vars.colors.textLight, 
}); 