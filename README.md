# Snake Game
#### Video Demo:  <https://www.youtube.com/watch?v=X2oTwD9fyiE>
#### Description:
Introduction:
Snake Game is a somewhat new take on the classic snake game. I chose to make this for a few reasons, the main one being that while I dont play many games, I have been fascinated with many games that are inspired by the original snake such as Powerline.io. In addition, I wanted to learn how basic animation works in JavaScript and I figured that making a snake gmae would be a good way to learn. To make the game I used flask, but to be honest all flask does is display the index.html file because I learned that the game works much better when I use an overlay to gather and display information to the user as opposed to using different webpages that redirect to a different '/'.

Files
static/style.css
    This file is not that special or interesting but it provides the color and some of the formatting stuff for the game.

static/script.js
    The main functions of this file are to define how all of the movement of the snake should be and display the popups...basically everything important.
    Originally I did not use a main() function, but towards the end of the project I created a main function just as a means to group all of my other functions together and make it easier to understand how exactly the game works.
        One of the most important functions in the script.js are the startGame() function which does just as it sounds, as well starting the timer so that the endgame pop up can display how long the snake was alive for. It is importnat to note that the startGame function will not be triggered unless the user has correctly provided input into the username overlay and clicked play game (or pressed enter)

        Another important funciton is the update() function, this updates the position of the snake, and states the score and speed every time the snake eats and subsequently levels up.

        The draw() function works together with some of the styling in the css to create the map and snake as well as food.

        There are more functions such as the changeDirection() function which just lisents for an arrow input in order to change the direction of the snake.

        The remaining functions serve to complete task such as leveling up, displaying the overlay, and ending the game once the snake dies.

templates/index.html
    This file is pretty standard, it contains code for the webpage displayin the game, and has some variables that are updated via the script.js file as the snake levels up and increases its score.

I believe that I have covered all the important aspects of this project, in the future, my next project will be an improvemnt on this game by creating a maze and then I will attempt to do reinforcemnt learning by running the snake through the maze many times in hopes of eventually discovering the correct path to completing the maze. Also if anyone is reading this and curious, I'm a current junior in highschool who is curious about this stuff and just trying to learn more!
Thanks for reading and have a nice day!