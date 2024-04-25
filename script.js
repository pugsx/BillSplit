const profilePic = document.getElementById("uploaded-image");
const userFile = document.getElementById("file-path");
const submitBtn = document.getElementById("submit-btn");

// Function to simulate file input click on image click
profilePic.onclick = function () {
  userFile.click();
};

userFile.onchange = function () {
  const file = userFile.files[0];
  if (file) {
    profilePic.src = URL.createObjectURL(file);
  }
};

// Function to handle the submission and API call
const handleSubmission = () => {
  const myFile = userFile.files[0];
  if (!myFile) {
    alert("Please select a file first.");
    return;
  }

  let data = new FormData();
  data.append("document", myFile, myFile.name);

  let xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText); // This will print the raw JSON response as a string
      try {
        const responseJson = JSON.parse(this.responseText);
        console.log(responseJson); // This will print the JSON object
        // Here you can add code to update the UI with the response information
      } catch (e) {
        console.error("Could not parse JSON response", e);
        // Optionally, handle the parsing error, like showing an error message to the user
      }
    }
  });

  xhr.open("POST", "https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict");
  xhr.setRequestHeader("Authorization", "Token 3af74b35d51fe545a07df73d3d7309a5");
  xhr.send(data);
};


// Add event listener to the submit button
submitBtn.addEventListener("click", handleSubmission);
