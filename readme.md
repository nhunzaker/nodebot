#Nodebot

A helper robot written for the busy developer. Nodebot can (currently):

- Validate html (websites too), css, and javascript 
- Watch files for changes and validate them there is a supported validator
- Report system information such as ip addresses, free memory, and host names
- Query Wolfram|Alpha for definitions and answers to complex questions.

---

```
npm install nodebot -g
```

### Example commands

```
$ nodebot What is the capital of Spain?

$ nodebot is nodebot.js valid?

$ nodebot watch ./nodebot.js

$ nodebot how much free memory do I have?
```

### Validate Javascript, CSS, and HTML (websites work too)
```
$ nodebot

Nodebot: What can I help you with?
 Response: is nodebot.js valid?

Nodebot: Oh snap! I found 1 error in nodebot.js: 
----------------------------------
48:12 - Don't make functions within a loop.
 
```


### General Information
```
$ nodebot

Nodebot: What can I help you with?
 Response: what is the current directory

Nodebot: The current directory is /Users/nate/Sites/nodebot

Nodebot: What can I help you with?
 Response: what is my ip address?

Nodebot: User's ip address is 

   local - 127.0.0.1
external - 172.30.9.66

Nodebot: What can I help you with?
 Response: What is your name?

Nodebot: Nodebot's name is Nodebot

``` 
 
