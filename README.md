# Restaurant List v.3 🍣
An awesome web application built with Node.js, Express, and MongoDB for you to readily manage your restaurant lists with an account: Create, view, edit, delete, filter, sort, and search restaurant are as easy as pie 🥧

## Project First Look
![Application Screen Shot in GIF](Restaurant_List.gif)

## Features
| Functions              | Detail                                            | URL                         |
| :--------------------: | ------------------------------------------------- | --------------------------- |
| Sign up for an account | 1. User can sign up an account by inputting name, email, password<br>2. User can see warning message if required columns are empty or passwords inputted are incorrect<br>3. User can be redirected to login page and receive a warning message if the account inputted has been registered | /users/register |
| Log in with email | 1. User can log in using registered email | /users/login |
| Log in with Facebook account | User can log in via Facebook with a Facebook account | /auth/facebook |
| Log in with Google account | User can log in via Google with a Google account | /auth/google |
| Log out | User can log out of an account | /users/logout |
| View all restaurants | 1. User can view name, category, and rating of all restaurants after login<br>2. User can get an error message when no restaurant to display after login | / |
| View a restaurant detail | User can view restaurant name, category, address, description and image after login | /restaurants/:id |
| Create a restaurant | 1. User can add a new restaurant by inputting related info after login<br>2. User can get a placeholder image when image URL is not provided<br> 3. User can get a warning message below corresponded column when submitting invalid info | /restaurants/new |   
| Edit a restaurant | User can update detail info of a restaurant after login | /restaurants/:id/edit |
| Delete a restaurant | 1. User can delete a restaurant after login<br>2. User can receive a warning message before actual delete | /restaurants/:id/delete |
| Search restaurants by input | User can search restaurants by inputting name or category after login | /search |
| Search restaurants by category | User can search restaurants by choosing a given category after login | /search |
| Filter restaurants | 1. User can filter restaurant list based on rating range after login<br>2. User can see the amount of restaurants at each rating range on filter panel based on given search input after login | /search|
| Sort all restaurants | User can sort restaurants list by name, rating, or category based on given search input after login | /search |
| Page not found | User can get an error message when travelling to a page not existing | /:any_other_URL |


## Installation
The following instructions will get you a copy of the project and all the setting needed to run it on your local machine.


### Prerequisites

- [Node.js v10.16.0](https://nodejs.org/en/download/)
- [MongoDB v4.0.10](https://www.mongodb.com/download-center/community)

### Clone

Clone this repository to your local machine

```
$ git clone https://github.com/smallpaes/restaurant-list-v3.git
```

### Setup

1. Enter the project folder

```
$ cd restaurant-list-CRUD-sort
```

2. Install npm packages

```
$ npm install
```

3. Import user and restaurant seeds

```
$ cd models/seeds
$ node seeder.js
```

4. Find the message for successful import

```
> db connected!
> restaurant seeds are created
```

5. Activate the server 

```
$ cd ../../
$ npm run dev
```

6. Find the message for successful activation

```
> Express is listening on http://localhost:3000
> mongodb connected!
```
You may visit the application on browser with the URL: http://localhost:3000

## Authors
[Mike Huang](https://github.com/smallpaes)