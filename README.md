## Travel_Blog

### For Start
I use Linux Ubuntu 14.04

In folder *Blog-master* create new folder **data** and in folder data create folder **db** -> **data/db**. Open a *terminal* and set the path to the folder **Blog-master**, after that:
```
 npm install
 sudo service mongod stop
 mongod --dbpath data/db
```
Open a new *tab* in the terminal:
```
 export DATABASEURL=mongodb://localhost/blog_post
 node app.js
```
