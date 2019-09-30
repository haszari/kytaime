import Color from 'color';

function hueToBackgroundColour( hue, highlighted ) {
  return Color.hsl(
    Math.floor( hue ), 75, highlighted ? 85 : 90,
  ).hex();
}

function hueToBorderColour( hue ) {
  return Color.hsl(
    Math.floor( hue ), 75, 70,
  ).hex();
}

function hueToProgressColour( hue ) {
  return Color.hsl(
    Math.floor( hue ), 75, 50,
  ).hex();
}

export default {
  hueToBackgroundColour,
  hueToBorderColour,
  hueToProgressColour,
};
