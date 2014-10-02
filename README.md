RockFall
========

A Web Connect Four Game

#version
0.6.3

#todo
* UI [ALMOST]
    * Game UI
        * Board [OK]
        * Animations [IN PROGRESS...]
    * Notifications UI [ALMOST]
        * Implementation: short-polling? [THINKNG]
        * Achievements ? [IN CONSIDERATION]
        * Look for an online opponent [IN PROGRESS...]
        * Sent/Receive a challenge request [IN PROGRESS...]
        * Start/End turn [OK]
    * Others UI
        * Leadderboard (online classment) [IN PROGRESS]
        * Settings [OK]
            * Edit name
            * Edit avatar
            * Edit password
            * Edit email
* IA [SOON]
    * Check the winner [OK]
    * Challenge the IA (offline mode) [THINKING]
    * Time turn (optional) [OK]
* Database [OK]
    * Create an online/offline database [OK]
    * Connect the app with the database [OK]
    * Tables
        * Create a users table [OK]
        * Create a parties table [OTHER IDEA]
        * (+ Primary/Foreigh key between the two tables) [OFF]
    * Create a user account [OK]
    * Login to a user account [OK]
    * Create a party [IN PROGRESS]
    * Challenge an opponent [IN PROGRESS]
    * Add/Delete/Edit rows in both users table & parties table [OK]
* Server [SOON]
    * Get an online server (Heroku, Azure) [OK]
    * Configuration (domain name, Node.js init)
    * Deploy the application to the Cloud
    * Test that everything works fine


#kernel
[Node.js](http://nodejs.org/)

#devs
* [Emmanuel Elisa](man_y_c@hotmail.fr)
* [Jérémie Corpinot](jeremiecorpinot@outlook.com)
