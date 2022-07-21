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
  2. Navigate to the 'Diabetes@Home' folder in your terminal and execute ```npm i``` to download all dependencies
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

