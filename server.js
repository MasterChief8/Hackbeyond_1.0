const express = require("express"); // 1. Import
const app = express(); // 2. Initialize
const fs = require("fs");
const crypto = require("crypto");

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' }); // Files are saved to the 'uploads' folder

function hash(pass) {
  return crypto.createHash("sha256").update(pass).digest("hex");
}

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  // 3. Handle Request
  res.send("Hello World");
  // 4. Send Response
});

if (!fs.existsSync("data.json")) {
  fs.writeFileSync(
    "data.json",
    JSON.stringify({ email: [], pass: [] }, null, 2)
  );
}

///


function data_storage(user,data, res) {
  user_data = JSON.parse(fs.readFileSync("post.json", "utf8"));


  user_data.post.push({user:user,data:data});

  

  user_data = JSON.stringify(user_data, null, 2);

    fs.writeFileSync("post.json", user_data);
}



///

function store_cred(email, pass, res) {
  let user_cred = JSON.parse(fs.readFileSync("data.json", "utf8"));

  let flag = 0;

  if (user_cred.email.includes(email)) {
    flag = 1;
    return res.send("User already exists");
  }

  if (flag == 0) {
    user_cred.email.push(email);

  

    user_cred.pass.push(hash(pass));

    user_cred = JSON.stringify(user_cred, null, 2);

    fs.writeFileSync("data.json", user_cred);

    return res.send("succesful signup");
    
  }
}

function read_cred(email, pass, res) {
  let user_cred = JSON.parse(fs.readFileSync("data.json", "utf8"));

  let flag = 0;
  let email_pos = 0;
  for (const [pos, em] of user_cred.email.entries()) {
    if (email == em) {
      email_pos = pos;

      flag = 1;
      break;
    }
  }

  if (flag == 0) {
    res.send("user not found");
    // console.log("user not Found!");
  } else if (flag == 1) {
    if (hash(pass) == user_cred.pass[email_pos]) {

      setTimeout(()=>{

        res.redirect("/dash.html");
        // res.json({status:"success",msg:"Logging in!"});
      },500);
      

      //   console.log("redirects to dash.html");
    } else {
      res.send("wrond credentials")
      //   console.log("Wrong Credentials!");
    }
  }
}


app.get("/post", (req, res) => {

  try{

  jsonStr = fs.readFileSync("./post.json","utf8");

  const data = JSON.parse(jsonStr);
  res.json(data);
  // res.send("posted")
}

catch (error) {
          console.error("Error reading or parsing post.json:", error);
          res.status(500).json({ error: "Could not load data" });
      }
});


app.post("/signup", (req, res) => {
  // const user = req.body.user;
  const email = req.body.email;
  const pass = req.body.pass;

  store_cred(email, pass, res);

});

let c_em_val = "";


  app.post("/index", (req, res) => {
  console.log("app.post /index is working");

  const email = req.body.email;
  const pass = req.body.pass;

  c_em_val = email;

  read_cred(email, pass, res);

});



app.post("/dash", (req, res) => {
  console.log("app.post /test_area is working");

  console.log(c_em_val);
  const disp = req.body.disp;

  data_storage(c_em_val,disp,res);
  
  console.log(disp); 
});

app.post('/upload-endpoint', upload.single('uploadedFile'), (req, res) => {
  // req.file now contains information about the file (like its path on the server)
  console.log('File received:', req.file);
  res.json({ message: 'File uploaded successfully', fileName: req.file.filename });
});


app.listen(3000, () => {
  console.log("server is running on : http://localhost:3000");
}); // 5. Listen
``