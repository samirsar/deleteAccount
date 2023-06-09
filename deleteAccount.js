const invalidFeedback=document.getElementById('invalidFeedback');
const enterMobileNumber=document.getElementById('enterMobileNumber');
const responseContainer = document.getElementById("otpPhone");
const otpHeader = document.getElementById("otpHeader");
const invalidFeedbackOtp=document.getElementById('invalidFeedbackOtp');
const modal=document.getElementById('staticBackdrop');
const deleteAccountBtn=document.getElementById('deleteAccountBtn');


// all function here
// hide a element by it's id
function hideElementById(Id) {
  const hideElement = document.getElementById(Id);
  hideElement.classList.add("hide");
  hideElement.classList.remove('show');
}


// show a element by it's id
function showElementById(Id) {
  const showElement = document.getElementById(Id);
  showElement.classList.add("show");
  showElement.classList.remove('hide');
}


hideElementById("otpInput");
hideElementById('otpHeader')




// validation of mobile number using regex 
function validateMobileNumber(mobileNumber) {
  const regex = /^[0-9]{10}$/;

  const trimmedNumber = mobileNumber.replace(/\s/g, "");

  if (regex.test(trimmedNumber)) {
    return true;
  } else {
    return false;
  }
}

let validMobileNumer = null; 


// send otp function 
function sendOtp(event) {
  event.preventDefault();
  const url = "https://dev.unorg.tech/api/v1/send-otp/";

  const headers = {
    "Content-Type": "application/json",
    Cookie:
      "csrftoken=LgfeJPjUjVtJeWa41Lm2Xuars3ljVKpW; sessionid=3zfssdaavnte1vvoo820gnnoftuofk72",
  };

  const mobileNumber = document.getElementById("phone").value;

  const isValid = validateMobileNumber(mobileNumber);
  if (isValid) {
    validMobileNumer = mobileNumber;
    hideElementById("mobileInput");
    showElementById("otpInput");
    hideElementById('enterMobileNumber');
    showElementById('otpHeader');
    enterMobileNumber.classList.remove('showBlock');

    const data = {
      phone: mobileNumber,
    };

    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((responseData) => {
        responseContainer.innerHTML = ` ${mobileNumber.substr(8)}`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    invalidFeedback.classList.add('showBlock');

  }
}

function resendOtp(event){
  const url = "https://dev.unorg.tech/api/v1/send-otp/";

  const headers = {
    "Content-Type": "application/json",
    Cookie:
      "csrftoken=LgfeJPjUjVtJeWa41Lm2Xuars3ljVKpW; sessionid=3zfssdaavnte1vvoo820gnnoftuofk72",
  };

  const isValid = validateMobileNumber(validMobileNumer);
  if (isValid) {
    const data = {
      phone: validMobileNumer
    };

    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData, "ye resend data hai");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("Please Enter a valid mobile number");
  }

}


// delete account function   
let accessToken=null;
function verifyAccount(event) {
    event.preventDefault();

  const validOtp = document.getElementById("validOtp").value;

  const url = "https://dev.unorg.tech/api/v1/verify-otp/";
  const headers = {
    "Content-Type": "application/json",
    Cookie:
      "csrftoken=KYJ3PwDgWAJhMrOqMpo8klV7lmeVmaZZ; sessionid=rzkppmmuzec99v6nxob80q2zqmnpi7cz",
  };
  const data = {
    phone: validMobileNumer,
    otp: validOtp,
  };

  fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseData) => {
      // Process the response data
      if(responseData.success){
       
       accessToken=responseData.access;
    
      openmodal();
      }
      else
      {
        invalidFeedbackOtp.classList.add('showBlock');
      }


    })
    .catch((error) => {
      // Handle any errors that occur during the request
      invalidFeedbackOtp.classList.add('showBlock');
      console.error("Error:", error);
    });

}

function deleteAccount(event)
{
    const url = "https://dev.unorg.tech/api/v1/delete/";
    headers={
        'Authorization': `Bearer ${accessToken}`,
      };
      fetch(url, {
        method: "POST",
        headers: headers,
    
      })
        .then((response) => response.json())
        .then((responseData) => {
         
          
          var toast = document.getElementById('toast');
          toast.style.display = 'block';
          setTimeout(function() {
            toast.style.display = 'none';
            location.reload();
          }, 3000); // Hide the toast after 3 seconds
        })
        .catch((error) => {
          // Handle any errors that occur during the request
          alert("Error",error);
          console.error("Error:", error);
        });


}

// cancle deletion of account function 
function cancelDeleteAccount(event) {
  event.preventDefault();
  location.reload();
  
}




// all element has been started
//seding otp when click on button 
const sendOtpBtn = document.getElementById("sendOtpBtn");
sendOtpBtn.addEventListener("click", (event) => {
  sendOtp(event);
});




const resendOtpBtn=document.getElementById('resendOtpBtn');
const countdownSeconds = 30;
let remainingSeconds = countdownSeconds;

function startCountdown()
{
    
    resendOtpBtn.disabled = true;
    updateButtonText();
    const countdownTimer = setTimeout(() => {
        remainingSeconds--;
        updateButtonText();
    
        if (remainingSeconds > 0) {
          startCountdown();
        } else {
          resendOtpBtn.disabled = false;
          updateButtonText();
        }
      }, 1000);
}


function updateButtonText() {
    if (remainingSeconds > 0) {
      resendOtpBtn.textContent = `Resend OTP (${remainingSeconds})`;
    } else {
      resendOtpBtn.textContent = 'Resend OTP';
    }
  }
startCountdown();
resendOtpBtn.addEventListener('click',(event)=>{
    resendOtp();
    remainingSeconds = countdownSeconds;
    startCountdown();
});


// delete acccount 




//cancle deletion of account
const cancelDeleteAccountBtn = document.getElementById(
  "cancelDeleteAccountBtn"
);
cancelDeleteAccountBtn.addEventListener("click", (event) => {
  cancelDeleteAccount(event);
});



// verify otp 
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const modal1=new bootstrap.Modal(modal);

function openmodal()
{
     modal1.show();
}

verifyOtpBtn.addEventListener("click", (event) => {
  verifyAccount(event);
});


deleteAccountBtn.addEventListener('click',(event)=>{
    deleteAccount(event);
})


    
    


