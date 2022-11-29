window.addEventListener("DOMContentLoaded", init);

function init() {
  getUserSignUpInfo();
}

/**
 * This function rertrieves the information the user inputs.
 */
function getUserSignUpInfo() {
  // getting database
  const db = getDB();
  // find form
  let loginForm = document.querySelector("form");
  // when user click submit btn, check for records in localstorage
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // get form data
    const formData = new FormData(loginForm);
    // save form data into userInput to find relevant credential
    let userInput = {};
    formData.forEach((value, key) => (userInput[key] = value));

    console.log(userInput);

    if (userInput) {
      //object exists
      const username = userInput.username;
      const password = userInput.password;
      const confirmPassword = userInput.confirmPassword;
      if (password !== confirmPassword) {
        const checkPass = document.querySelector(".warning-signup");
        checkPass.textContent = "Passwords don't match!";
        loginForm.addEventListener("keypress", (event) => {
          //clears warning when user types
          checkPass.textContent = "";
        });
      }
      // checking for uniquness of username
      else if (usernameExists(db, username)) {
        // show warning message handling
        const checkPass = document.querySelector(".duplicate-username");
        checkPass.textContent = "Username already exists!";
        loginForm.addEventListener("keypress", (event) => {
          //clears warning when user types
          checkPass.textContent = "";
        });
      } else {
        //handle using local storage and if passwords match, taken to list
        console.log("Passwords match!");

        const userObj = {
          username: username,
          password: password,
          tasks: [[], [], [], [], [], [], []],
        };

        //create the new user object and put it in database
        //TODO: line 61 seems to be causing an issue when signing up
        
        db.push({
          username: userObj.username,
          password: userObj.password,
          tasks: [...userObj.tasks],
        });
        
        /*
       db.username = userObj.username;
       db.password = userObj.password;
       db.tasks = [...userObj.tasks];
       
        */
        localStorage.setItem("todoListDB", JSON.stringify(db));

        // clear the form and errors
        const checkPass = document.querySelector(".warning-signup");
        checkPass.textContent = "";
        const userDup = document.querySelector(".duplicate-username");
        userDup.textContent = "";
        loginForm.reset();

        // setting the user as an logged in user in the system
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: userObj.username,
            tasks: [...userObj.tasks],
          })
        );

        // redirect to the new page
        location.replace("homePage.html");
      }
    }
  });
}

/** 
 * Function to get database from local storage
  If it is already exist, return database in javascript object form
  or return null indicaing nothing found.

 * @returns {object} - database "todoListDB" as a javascript object 
**/
function getDB() {
  const db = localStorage.getItem("todoListDB");
  if (db) {
    return JSON.parse(db);
  } else {
    console.log("NO Database Found");
    return [];
  }
}

/**
 * Function checks for user existence in the database
 * 
 * @param {Object[]} db
 * @param {string} username
 * @returns {boolean} indicates if the user information is stored in the database
 */
function usernameExists(db, username) {
  //populating username array
  let size = db.length;

  for (let i = 0; i < size; i++) {
    if (db[i].username === username) {
      return true;
    }
  }

  return false;
}