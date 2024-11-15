const enterVRButton = document.getElementById("enter-vr");

enterVRButton.addEventListener("click", async () => {
  if (navigator.xr) {
    const session = await navigator.xr.requestSession("immersive-vr", {
      optionalFeatures: ["local-floor", "bounded-floor"],
    });

    session.addEventListener("end", () => {
      // Handle session end
    });

    // Setup reference space
    const refSpace = await session.requestReferenceSpace("local-floor");

    // Start the rendering loop with controllers
    startXR(session, refSpace);
  } else {
    alert("WebXR is not supported on this browser.");
  }
});

function startXR(session, refSpace) {
  const xrCanvas =
    document.querySelector("canvas") || document.createElement("canvas");
  document.body.appendChild(xrCanvas);
  const xrContext =
    xrCanvas.getContext("xrpresent") || xrCanvas.getContext("webgl");

  function onXRFrame(time, frame) {
    const session = frame.session;
    session.requestAnimationFrame(onXRFrame);

    const pose = frame.getViewerPose(refSpace);
    // if (pose) {
    //   // Handle viewer position updates
    // }

    // Access input sources for controllers
    for (const inputSource of session.inputSources) {
      if (inputSource && inputSource.targetRayMode === "tracked-pointer") {
        const gripPose = frame.getPose(inputSource.gripSpace, refSpace);

        if (gripPose) {
          // Here you can map the controller model in X3DOM
          updateControllerModel(inputSource, gripPose.transform);
        }
      }
    }
  }

  session.requestAnimationFrame(onXRFrame);
}
