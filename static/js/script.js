const { startRegistration, startAuthentication } = SimpleWebAuthnBrowser;

// Registration
const statusRegister = document.getElementById("statusRegister");
const dbgRegister = document.getElementById("dbgRegister");

// Authentication
const statusAuthenticate = document.getElementById("statusAuthenticate");
const dbgAuthenticate = document.getElementById("dbgAuthenticate");


/**
 * Helper methods
 */

function printToDebug(elemDebug, title, output) {
  if (elemDebug.innerHTML !== "") {
    elemDebug.innerHTML += "\n";
  }
  elemDebug.innerHTML += `// ${title}\n`;
  elemDebug.innerHTML += `${output}\n`;
}

function resetDebug(elemDebug) {
  elemDebug.innerHTML = "";
}

function printToStatus(elemStatus, output) {
  elemStatus.innerHTML = output;
}

function resetStatus(elemStatus) {
  elemStatus.innerHTML = "";
}

function getPassStatus() {
  return "✅";
}

function getFailureStatus(message) {
  return `🛑 (Reason: ${message})`;
}

/**
 * Register Button
 */
document
  .getElementById("btnRegister")
  .addEventListener("click", async () => {
    resetStatus(statusRegister);
    resetDebug(dbgRegister);

    // Get options
	console.log("getting options (sripts.js)")
    const resp = await fetch("/generate-registration-options");
	  console.log("RESP response: ",resp);
    const opts = await resp.json();
	console.log("recieved registration response (scripts.js)");
    printToDebug(
      dbgRegister,
      "Registration Options",
      JSON.stringify(opts, null, 2)
    );

    // Start WebAuthn Registration
    let regResp;
    try {
	  console.log("awaiting startRegistration (scripts.js)");
      regResp = await startRegistration(opts);
	  console.log("recieved startRegistration(opts) (scripts.js)");
      printToDebug(
        dbgRegister,
        "Registration Response",
        JSON.stringify(regResp, null, 2)
      );
    } catch (err) {
      printToStatus(statusRegister, getFailureStatus(err));
      throw new Error(err);
    }

    // Send response to server
    const verificationResp = await fetch(
      "/verify-registration-response",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(regResp),
      }
    );

    // Report validation response
    const verificationRespJSON = await verificationResp.json();
    const { verified, msg } = verificationRespJSON;
	
    if (verified) {
      printToStatus(statusRegister, getPassStatus());
    } else {
      printToStatus(statusRegister, getFailureStatus(err));
    }
    printToDebug(
      dbgRegister,
      "Verification Response",
      JSON.stringify(verificationRespJSON, null, 2)
    );
	// send data to python server
	$.ajax({
		url:"/registration",
		type:"POST",
		contentType: "application/json",
		data: JSON.stringify(verificationRespJSON)});
	// if verificationRespJSON property value == true => redirect to logged in screen
	  // else registration verification not valid
	if (verified == true){
		window.location = "/demo.authorized";
	} else{
		console.log("Something went wrong");
	}
  });



/**
 * Authenticate Button
 */
document
  .getElementById("btnAuthenticate")
  .addEventListener("click", async () => {
    resetStatus(statusAuthenticate);
    resetDebug(dbgAuthenticate);

    // Get options
    const resp = await fetch("/generate-authentication-options");
    const opts = await resp.json();
    printToDebug(
      dbgAuthenticate,
      "Authentication Options",
      JSON.stringify(opts, null, 2)
    );

    // Start WebAuthn Authentication
    let authResp;
    try {
		// begin bug
		/* bug - incredibly long wait on random devices */
		console.log("Starting Authentication")
      authResp = await startAuthentication(opts);
	  console.log("finished Authentication")
		console.log(authResp);
      printToDebug(
        dbgAuthenticate,
        "Authentication Response",
        JSON.stringify(authResp, null, 2)
      ); // end bug
    } catch (err) {
      printToStatus(statusAuthenticate, getFailureStatus(err));
      throw new Error(err);
    }

	  // debugging
		console.log("fetching verification response");
    // Send response to server
    const verificationResp = await fetch(
      "/verify-authentication-response",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authResp),
      }
    );
	  // debugging
		console.log("retrieved verification response")
	  // debugging
		console.log("checking verification response")
    // Report validation response
    const verificationRespJSON = await verificationResp.json();
    const { verified, msg } = verificationRespJSON;
    if (verified) {
      printToStatus(statusAuthenticate, getPassStatus());
    } else {
      printToStatus(statusAuthenticate, getFailureStatus(err));
    }
    printToDebug(
      dbgAuthenticate,
      "Verification Response",
      JSON.stringify(verificationRespJSON, null, 2)
    );
	  // debugging
		console.log("checked verification response")
	  // debugging
		console.log("ajax POST request")
	// send data to python server
	$.ajax({
		url:"/auth",
		type:"POST",
		contentType: "application/json",
		data: JSON.stringify(verificationRespJSON)});
	// if verificationRespJSON property value == true => redirect to logged in screen
	// else verification not valid
	if (verified == true){
		window.location = "/demo.authorized";
	} else{
		console.log("Something went wrong");
	}
  });
