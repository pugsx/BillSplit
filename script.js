const profilePic = document.getElementById("uploaded-image");
const userFile = document.getElementById("file-path");
const submitBtn = document.getElementById("submit-btn");
const nextPage = document.getElementById("next-page23")

profilePic.onclick = function () {
    userFile.click();
};

userFile.onchange = function () {
    const file = userFile.files[0];
    if (file) {
        profilePic.src = URL.createObjectURL(file);
    }
};

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
            try {
                const responseJson = JSON.parse(this.responseText);
                localStorage.setItem('receiptData', JSON.stringify(responseJson));
                // window.location.href = "participantsPage.html"; // Redirect to participants page
            } catch (e) {
                console.error("Could not parse JSON response", e);
            }
        } else if (this.readyState === XMLHttpRequest.DONE) {
            console.error('Request failed with status:', this.status);
        }
    });

    xhr.open("POST", "https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict");
    xhr.setRequestHeader("Authorization", "Token 3af74b35d51fe545a07df73d3d7309a5");
    xhr.send(data);
};

submitBtn.addEventListener("click", handleSubmission);

nextPage.addEventListener("click", function () {
  console.log("working")
  window.location.href = "particpantsPage.html";
});



// document.getElementById('nameForm').addEventListener('submit2', function(event) {
//     event.preventDefault();
//     const input = document.getElementById('nameInput');
//     const name = input.value.trim();
//     if (name) {
  
//         const li = document.createElement('li');
//         nameArray.push(name);
//         li.textContent = name;
//         document.getElementById('nameList').appendChild(li);
//         input.value = ''; // Clear input after adding
  
//     }
  
//   });
  
  
  
  