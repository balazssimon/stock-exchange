# stock-exchange

This is a stock-exchange application written in NodeJS using Angular2 and Express.



# Initial Angular2 + Express project

To create a new Angular2 + Express project:
 1. Copy the contents of **angular2_express_initial** into a new folder
 2. Enter the newly created project folder
 3. Rename the project inside **package.json**
 4. Run the following command to install the required packages:
 ```
 npm install
 ```
 5. If the typings folder doesn't show up after running npm install, you'll need to install it manually with the command:
 ```
 npm run typings install
 ```
 6. Run the following command to compile TypeScript files:
 ```
 tsc
 ```

Now you can open the project in VSCode.

## Debug

To run in debug mode type:
```
gulp
```
If Chrome cannot be started make sure to correct the path inside **gulpfile.js**.

To automatically refresh files, click the **File > Preferences > Keyboard Shortcuts** menu, and insert the following code into the **keybindings.json** file:
```
[
    {
        "key": "ctrl+s",          
        "command": "workbench.action.tasks.build" 
    }
]
```

## Production

To run in production mode run:
```
npm start
```

