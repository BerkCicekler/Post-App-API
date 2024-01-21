# Post App API
Its a basic Restful API coded with NodeJS for my flutter project

## Features
User log-in
User Sign-in
Post send
Image storage
Auth Token

## Documentation

### Users end points 

#### User Log-in (GET)
```
http://localhost:3000/users
```
```JSON
{
  "main": "example@gmail.com",
  "password": "examplePassword",
}
```
##### Status
200 = Success | 
400 = Invalid request | 
401 = Invalid Password / Invalid Mail

##### Responde(200)
```JSON
{
    "id": 11,
    "photoPath": "uploads\\WİRO 2.png",
    "name": "Berk",
    "mail": "berk@gmail.com"
}
```

####  User Sign-in (POST)
```
http://localhost:3000/users
```
```JSON
{
  "name": "Berk Cicekler",
  "mail": "berk@gmail.com",
  "password": "password123",
  "profileImage": "(jpeg/png file)",
  "token": "authToken"
}
```
##### Status
200 = Success | 400 = Invalid body  | 409 = Already exist

### Posts end points
#### Posts (GET)
This end point will return max 20 posts ordered by last to new 
```
http://localhost:3000/posts/(startIndex)
```
```JSON
[
    {
        "id": 2,
        "title": "post title",
        "context": "This is the context of this post",
        "imagePath": "uploads\new.png",
        "userId": 1,
        "userPhoto": "uploads\berk.png",
        "userName": "Berk Cicekler"
    }
]
```
#### Posts (POST)
```
http://localhost:3000/posts/
```
```JSON
{
  "title": "Example title",
  "context": "Example context",
  "image": "(jpeg/png image)",
  "token": "auth token"
}
```
