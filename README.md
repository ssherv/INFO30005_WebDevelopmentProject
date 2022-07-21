# INFO30005_WebDevelopmentProject
A web app that helps people to manage their diabetes in the convenience of their own home, recording data that can be monitored remotely by their clinician. Includes 2 different user-interfaces: one for clinicians (desktop only) and another for patients (desktop, tablet, mobile). 

This web-application implements responsive design to a moderate degree. The web-app should only be viewed at the following resolutions: 
<ul>
  <li> PHONE: 375 x 812 (portrait)</li>
  <li> TABLET: 1024 x 768 (iPad, landscape)</li>
  <li> Desktop: 1920 × 1080 (monitor, landscape)</li>
</ul>

<h4> Completed in June 2022 (Semester 2) with a group of 5 participants</h4>

<hr>

The web-app can be accessed @ https://gekko-solutions-webapp.herokuapp.com/

Log-in credentials:
>> <b>PATIENT:</b> Pat Cummins ( username: pat.cummins@gmail.com   /   password: helloitspat ) <br>
>> <b>CLINICIAN:</b> Chris Hemsworth ( username: chemsworth@gmail.com   /   password: 00000000 )

<hr>

<b>Technologies and tools used:</b>
<ul>
  <li> The web stack is: Node, Express, Handlebars, MongoDB</li>
  <li> This is supported by: authentication using Passport, database access using Mongoose</li>
  <li> The programming language is: JavaScript</li>
  <li> The webapp is deployed to cloud platforms: Heroku and Atlas</li>
  <li> Prototyping was completed with Adobe Xd</li>
</ul>

<b>To run locally:</b>
  1. Clone this repository
  2. Navigate to this repository in your terminal and execute ```npm i``` to download all dependencies
  3. Then execute ```nodemon app.js``` or ```node app.js``` to run the web-app on port 3000 (http://localhost:3000)

<hr>

<b>My contributions:</b>
<br>

<em>Front-end:</em>
<ul>
  <li> Lead the prototyping phase and created a high-fidelity, interactive mock-up via Adobe Xd </li>
  <li> Created Handlebars templates (HTML) for all of the Patient web-pages for Mobile, Tablet, and Desktop viewports <em>(Data entry, Historical data, Leaderboard, Preferences, About Diabetes, About this website)</em> </li>
  <li> Assisted with the creation of Handlebars templates (HTML) for the majority of the Clinician web-pages for Desktop viewports <em>(Dashboard, Patient comments, Register new patient, Individual Patient page, Editing patient preferences, Preferences)</em> </li>
  <li> Styled the majority of the Patient pages with CSS, assisted other team members with styling of the other pages </li>
  <li> Input validation on client-side (via HTML/JavaScript) and server-side (via Mongoose -> MongoDB) </li>
</ul>

<em>Back-end:</em>
<ul>
  <li> Populated the Patient pages with data stored in the database (User details, user historical health information) </li>
  <li> Assited in storing newly entered health data in the database </li>
  <li> Assisted in the creation of the Mongoose data models  </li>
  <li> Wrote some of the routes used in this web-application  </li>
  <li> Assited in writing some of the functions used in controllerDoctor.js and controllerPatient.js web-application  </li>
</ul>






<b>Context and Functionality:</b>
Cachex is a perfect-information two-player game played on an n × n rhombic, hexagonally tiled board, based on the strategy game Hex. Two players (named Red and Blue) compete, with the goal to form a connection between the opposing sides of the board corresponding to their respective color. The primary task was to design and implement a program to play the game of Cachex. That is, given information about the evolving state of the game, your program will decide on an action to take on each of its turns. The assessors have provided a driver program (titled 'referee') which communicates with the player agents to execute all administrative functions to run the program. The 'player' class implements the specific game-playing strategies. This assignment also includes a report which discusses the strategies we used to play the game and the algorithms implmented.

<b>Topics of focus:</b>
The aim of this project is to (1) practice applying game-playing techniques discussed in the lectures (in this case; depth-limited Minimax with alpha-beta pruning), (2) develop your own strategies for playing Cachex, and (3) conduct research into more advanced algorithmic game-playing techniques to extend the functionality of our agent.
<hr>

See 'Cachex_Rules' for a full explanation of the rules of the game; including the gameplay sequence, the capturing mechanism (unique to Cachex); and the conditions required to terminate a game.

See 'Cachex_Agent_Specification' to understand the specific functionality of the program, including the control flow (between the referee and player class), as well as the program constraints to aid in efficient automatic testing.

<b>To run this console application:</b>
<ol>
  <li> Download the folders 'Referee', 'auto-player' and 'user-input-player' (these modules include Python code files) and place these folders in a directory </li>
  <li> Navigate to the working directory to play a game using: <code>python -m referee "n" "red module" "blue module"</code> <br> 
    <em>DO NOT INCLUDE THE DOUBLE QUOTES ("") when typing out this command e.g. only use [ python n red-module blue-module" </em> <br> 
  <b>Where:</b> python is the game of a Python 3.6 interpreter, "<n>" is the size of the game board and "<red module>" and "<blue module>" are the names of modules contining the classes "Player" to be used for Red and Blue respectively.</li>
</ol>

<b>A few notes:</b>
<ul>
  <li> <code>Referee</code> is the referee class which plays the game </li>
  <li> <code>auto-player</code> is the player class which implements the algorithms and strategies we used to play the game automatically. Use <code> python n auto-player auto-player </code> to have a completely automatic game </li>
  <li> <code>user-input-player</code> is the player class to be used if you want to play the game manually. Subsitute <code> user-input-player </code> for either "Red" or "Blue" or both to have a manual game </li>
</ul>