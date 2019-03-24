import Color from 'color'; 

function hueToBackgroundColour( hue ) {
 return Color.hsl(
    Math.floor( hue ), 75, 75,
  ).hex();
} 

function hueToBorderColour( hue ) {
 return Color.hsl(
    Math.floor( hue ), 75, 50,
  ).hex();
} 

function hueToProgressColour( hue ) {
 return Color.hsl(
    Math.floor( hue ), 75, 25,
  ).hex();
} 


export default {
  hueToBackgroundColour,
  hueToBorderColour,
  hueToProgressColour,
};