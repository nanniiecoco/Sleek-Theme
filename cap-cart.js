document.addEventListener("change", function (e) {
  if (e.target.classList.contains("quantity__input")) {
    fetch("/cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: e.target.getAttribute("data-quantity-variant-id"),
        quantity: e.target.value,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setTimeout(() => {
          if (window.initCapCart) {
            window.initCapCart();
          }
        }, 1000);
      });
  }
});
window.initCapCart = function () {
  "use strict";

  const MESSAGE_KEYS = {
    OTP_EXPIRED: ["otp_expired_resend", "OTP expired. Please resend."],
    OTP_RESEND_SUCCESS: ["otp_sent_registered_mobile", "An OTP is sent to your registered mobile number."],
    OTP_RESEND_FAILED: ["unable_to_resend_otp", "Unable to resend OTP."],
    OTP_RESENDING_FAILED: ["error_resending_otp", "Error resending OTP."],
    MOBILE_NO_NOT_FOUND: ["phone_not_found_resend_otp", "Phone number not found to resend OTP."],
    SUBMIT_ADD_CARD_ERROR: ["has_error_try_again", "Has error, please try again later."],
    JPS_ID_BLANK: ["please_enter_jps_club_id", "Please enter your JPS Club ID"],
    MOBILE_NO_INVALID: ["please_enter_valid_phone", "Please enter a valid phone number in this field."],
    MOBILE_NO_BLANK: ["please_enter_mobile_no", "Please enter your MOBILE NO"],
    OTP_INVALID: ["please_enter_correct_otp", "Please enter the correct OTP"],
    VERIFY_OTP_FAILED: ["error_verifying_otp", "An error occurred while verifying OTP."],
    OTP_AUTH_FAILED: ["otp_authentication_error", "OTP authentication error"],
    OTP_SEND_FAILED: ["please_enter_valid_id_or_contact", "Please enter a valid [MyCard id/Mobile No.] or visit MyCard Customer care for more help."],
    PHONE_NO_NOT_FOUND: ["error_not_found_phone_validate", "Error: Not found the phone number to validate."],
    MISSING_VAL_TO_LINK: ["missing_jps_id_or_customer_id", "Missing JPS ID or Customer ID to link card."],
    CARD_METHOD_NOT_FOUND: ["please_select_valid_method", "Please select a valid method."]
  };

  const MESSAGES = Object.fromEntries(
      Object.entries(MESSAGE_KEYS).map(([k, [path, fallback]]) => [
        k,
        window?.translations?.[path] ?? fallback
      ])
  );

  const optionVal = {
    mobileNoMethodVal: "mobile_no",
    jpsClubMethodVal: "jps_club",
    typeJps: "JPS Default",
    typeJpsTier: "JPS",
    typeJpsPlus: "JPS Plus",
    typeJpsX: "JPS X",
  };

  const loaderDom = {
    overlay: document.getElementById("loader-overlay"),
  };

  const methodDom = {
    jpsClub: document.querySelector(".mycards-content .jps_club.method"),
    mobileNo: document.querySelector(".mycards-content .mobile_no.method"),
    myJpsCardId: document.getElementById("myjpscard_id"),
    myMobileNo: document.getElementById("mymobile_no"),
    linkMethod: document.getElementById("link-method"),
  };

  const contentDom = {
    title: document.querySelector(".cap-block__title"),
    content: document.querySelector(".cap-block__content"),
    jpsCardGroup: document.querySelector(".jpscard-group"),
    jpsImg: document.querySelector(".jpscard-group-img"),
    jpsPoints: document.querySelector(".jpscard-group .points"),
  };

  const cardDom = {
    nameTypeCard: document.getElementById("name-type-card"),
  };

  const actionDom = {
    addJpsButton: document.querySelector(".add-jpscard-button"),
    error: document.querySelector(".mycard-error-msg"),
  };

  const otpDom = {
    container: document.querySelector(".otp-inputs"),
    phoneContainer: document.querySelector("p.phone-number"),
    resendContent: document.querySelector(".resend-content"),
    popupForm: document.getElementById("otpPopupForm"),
    closeButton: document.getElementById("closeOtpButton"),
    resendLink: document.getElementById("resendOtpLink"),
    timeAllowShowResend: document.getElementById("resend-time"),
    phone: document.getElementById("phone-val"),
    customerId: document.getElementById("customer-id-val"),
    timer: document.getElementById("otpTimer"),
    submitButton: document.getElementById("submitOtpButton"),
    errorMsg: document.getElementById("otpErrorMessage"),
  };

  const config = {
    timerDuration: 5 * 60,
    middlewareUrl: window.shopGlobalConfig.middlewareUrl ?? "",
    webhookParamUrl: window.shopGlobalConfig.webhookParamUrl ?? "",
    capillaryCheckUrl: window.shopGlobalConfig.capillaryCheckApi ?? "",
    capillaryHostUrl: window.shopGlobalConfig.capillaryHostUrl ?? "",
    webhookUrl: `${window.shopGlobalConfig.middlewareUrl ?? ""}${
      window.shopGlobalConfig.webhookParamUrl ?? ""
    }`,
    validateUrl: window.shopGlobalConfig.capillaryValidateApi ?? "",
    generateUrl: window.shopGlobalConfig.capillaryGenerateApi ?? "",
    countryCode: window.shopGlobalConfig.countryCode ?? "",
    urlCheckApi: new URL(
      `${window.shopGlobalConfig.capillaryHostUrl ?? ""}${
        window.shopGlobalConfig.capillaryCheckApi ?? ""
      }`
    ),
    jpsImg: window.shopGlobalConfig.jpsImg ?? "",
    jpsTierImg: window.shopGlobalConfig.jpsTierImg ?? "",
    jpsPlusImg: window.shopGlobalConfig.jpsPlusImg ?? "",
    jpsXImg: window.shopGlobalConfig.jpsXImg ?? "",
  };

  async function _init() {
    if (contentDom?.jpsCardGroup?.classList.length > 0) {
      contentDom?.jpsCardGroup.classList.add("active");
      if (cardDom?.nameTypeCard.value === optionVal.typeJpsTier) {
        contentDom.jpsImg.src = config.jpsTierImg;
      } else if (cardDom?.nameTypeCard.value === optionVal.typeJpsPlus) {
        contentDom.jpsImg.src = config.jpsPlusImg;
      } else if (cardDom?.nameTypeCard.value === optionVal.typeJpsX) {
        contentDom.jpsImg.src = config.jpsXImg;
      } else {
        contentDom.jpsImg.src = config.jpsImg;
      }
      contentDom.jpsPoints.innerText = await displayPoints();
    }
  }

  async function callApi(payload, errorMessage = "API Error", method = "POST") {
    try {
      payload.store = config.countryCode;
      return await fetch(config.webhookUrl, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Error in callApi:", error);
      throw error;
    }
  }

  function initEventListeners() {
    // if (contentDom.content) {
    //   contentDom.title?.addEventListener('click', () => {
    //     toggleContent();
    //   });
    // }

    methodDom.linkMethod?.addEventListener("change", handleLinkMethod);

    actionDom.addJpsButton?.addEventListener("click", handleSubmitAddCard);

    otpDom.submitButton?.addEventListener("click", handleSubmitLinkCard);

    otpDom.closeButton?.addEventListener("click", hideOtpForm);

    otpDom.resendLink?.addEventListener("click", handleResend);

    window.addEventListener("click", (event) => {
      if (event.target === otpDom.popupForm) {
        hideOtpForm();
      }
    });

    if (otpDom.container) {
      const inputs = Array.from(
        otpDom.container.querySelectorAll(".otp-input")
      );

      inputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
          const value = e.target.value;
          if (value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
          }
        });

        input.addEventListener("keydown", (e) => {
          const { key } = e;

          if (key === "Backspace" && input.value === "" && index > 0) {
            inputs[index - 1].focus();
          }

          if (key >= "0" && key <= "9") {
            input.value = ""; // Clear old value so new digit replaces it
          }
        });

        input.addEventListener("paste", (e) => {
          e.preventDefault();
          const paste = (e.clipboardData || window.clipboardData).getData(
            "text"
          );
          const digits = paste.replace(/\D/g, "").split("");

          digits.forEach((digit, i) => {
            if (inputs[i]) inputs[i].value = digit;
          });

          const nextIndex = Math.min(digits.length, inputs.length - 1);
          inputs[nextIndex].focus();
        });
      });
    }
  }

  function toggleContent() {
    if (contentDom.content.classList.contains("active")) {
      contentDom.content.classList.remove("active");
    } else {
      contentDom.content.classList.add("active");
    }
  }

  function showOtpForm() {
    otpDom.popupForm.style.display = "flex";
    hideError();
    hideOtpError();
    startTimer(config.timerDuration);
  }

  function showPhoneNumber() {
    const currentPhone = otpDom.phone.value;
    otpDom.phoneContainer.textContent =
      "+66 ******" + String(currentPhone).slice(-4);
  }

  function hideOtpForm() {
    otpDom.popupForm.style.display = "none";
    clearInterval(timerInterval);
    hideError();
    cleanInputOtp();
  }

  function cleanInputOtp() {
    otpDom.container
      .querySelectorAll(".otp-input")
      .forEach((input) => (input.value = ""));
  }

  function convertToCapillaryFormat(phone) {
    const value = phone.replace(/\D/g, '');
    if (/^0\d{9}$/.test(value)) {
      return '66' + value.substring(1);
    } else if (/^66\d{8}$/.test(value)) {
      return value;
    } else if (/^\d{11}$/.test(value)) {
      return value;
    } else {
      return phone;
    }
  }

  const handleLinkMethod = (event) => {
    const mycardsMethodActive = document.querySelectorAll(
        ".mycards-content .method.active"
      ),
      selectedMethod = event.target.value;
    mycardsMethodActive.forEach((el) => {
      el.classList.remove("active");
    });
    const activateMethod = (method) => {
      methodDom.jpsClub.classList.toggle(
        "active",
        method === optionVal.jpsClubMethodVal
      );
      methodDom.mobileNo.classList.toggle(
        "active",
        method === optionVal.mobileNoMethodVal
      );
    };
    activateMethod(selectedMethod);
    hideError();
    hideOtpError();
  };

  const validators = {
    jps_club: () => {
      const value = methodDom.myJpsCardId.value.trim();
      if (!value) return MESSAGES.JPS_ID_BLANK;
      return ""; // Valid
    },
    mobile_no: () => {
      const value = convertToCapillaryFormat(methodDom.myMobileNo.value.trim());
      if (!value) return MESSAGES.MOBILE_NO_BLANK;
      if (!/^\d{10,11}$/.test(value)) return MESSAGES.MOBILE_NO_INVALID;
      return ""; // Valid
    },
  };

  const getActiveMethod = () => {
    const active = document.querySelector(".mycards-content .method.active");
    return active?.classList.contains(optionVal.jpsClubMethodVal)
      ? optionVal.jpsClubMethodVal
      : active?.classList.contains(optionVal.mobileNoMethodVal)
      ? optionVal.mobileNoMethodVal
      : null;
  };

  const showError = (msg) => {
    actionDom.error.innerText = msg;
    actionDom.error.classList.add("active");
  };

  const hideError = () => {
    actionDom.error.classList.remove("active");
    actionDom.error.innerText = "";
  };

  const showOtpError = (msg) => {
    if (msg) {
      otpDom.errorMsg.innerText = msg;
      otpDom.errorMsg.style.display = "block";
    }
  };

  const hideOtpError = () => {
    otpDom.errorMsg.innerText = "";
    otpDom.errorMsg.style.display = "none";
  };

  const validateCardVal = () => {
    const method = getActiveMethod();
    if (!method || !validators[method]) {
      showError(MESSAGES.CARD_METHOD_NOT_FOUND);
      return false;
    }
    const error = validators[method]();
    if (error) {
      showError(error);
      return false;
    }

    showError("");
    return method === "jps_club"
      ? { external_id: methodDom.myJpsCardId.value.trim() }
      : { mobile: convertToCapillaryFormat(methodDom.myMobileNo.value.trim()) };
  };

  let timerInterval;
  function startTimer(duration) {
    clearInterval(timerInterval);
    let timer = duration,
      minutes,
      seconds,
      timeAllowShowResendVal = otpDom.timeAllowShowResend.value * 1000;
    otpDom.timer.textContent = formatTime(duration);
    disableResendContent();
    setTimeout(enableResendContent, timeAllowShowResendVal);

    timerInterval = setInterval(function () {
      timer--;
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      otpDom.timer.textContent = minutes + ":" + seconds;

      if (timer < 0) {
        clearInterval(timerInterval);
        otpDom.timer.textContent = "00:00";
        const msg = MESSAGES.OTP_EXPIRED;
        showOtpError(msg);
      }
    }, 1000);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  async function handleResend(event) {
    event.preventDefault();
    hideOtpError();
    cleanInputOtp();
    loaderDom.overlay.style.display = "flex";
    const currentPhone = otpDom.phone.value;
    let msg = "";
    if (currentPhone) {
      try {
        const payload = {
          url: `${config.capillaryHostUrl}${config.generateUrl}`,
          entityValue: currentPhone,
        };
        const result = await generateOtpApiCall(payload);

        if (result?.createdId) {
          startTimer(config.timerDuration);
          msg = MESSAGES.OTP_RESEND_SUCCESS;
        } else {
          msg = MESSAGES.OTP_RESEND_FAILED;
        }
      } catch (error) {
        msg = error.message || MESSAGES.OTP_RESENDING_FAILED;
      } finally {
        loaderDom.overlay.style.display = "none";
      }
    } else {
      msg = MESSAGES.MOBILE_NO_NOT_FOUND;
    }
    showOtpError(msg);
  }

  async function generateOtpApiCall(payload) {
    const response = await callApi(payload);
    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.json();
        throw new Error(errorBody?.message || "Failed to generate OTP");
      } catch (e) {
        throw new Error(e.message || "OTP creation error");
      }
    }
    return await response.json();
  }

  async function linkCardApiCall() {
    const cardValue = methodDom.myJpsCardId.value ||
        convertToCapillaryFormat(methodDom.myMobileNo.value.trim());
    const customerIdValue = otpDom.customerId.value;

    if (!cardValue || !customerIdValue) {
      throw new Error(MESSAGES.MISSING_VAL_TO_LINK);
    }

    const bodyLinkCard = {
      url: config.urlCheckApi.href,
      jps_id: cardValue,
      shopify_customer_id: customerIdValue,
    };

    const response = await callApi(bodyLinkCard);
    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.json();
        throw new Error(errorBody?.message || "linkCard Failed");
      } catch (e) {
        throw new Error(e.message || "Error cant Call linkCard");
      }
    }

    return await response.json();
  }

  async function displayPoints() {
    const myJpsCardId = { external_id: methodDom.myJpsCardId.value.trim() };
    let msg = "";
    if (myJpsCardId) {
      try {
        const [key, value] = Object.entries(myJpsCardId)[0];
        config.urlCheckApi.search = "";
        config.urlCheckApi.searchParams.set(key, value);
        const bodyCheckApi = {
          url: config.urlCheckApi.href,
          action: "getPoints",
        };
        const responseCheck = await callApi(bodyCheckApi);
        if (!responseCheck.ok) {
          let errorBody = null;
          try {
            errorBody = await responseCheck.json();
            throw new Error(errorBody?.message || "Customer API Error");
          } catch (e) {
            throw new Error(e.message || "Customer API Error");
          }
        }

        const result = await responseCheck.json();

        if (result?.points) {
          return result.points;
        } else {
          return "0";
        }
      } catch (error) {
        msg = error.message || MESSAGES.SUBMIT_ADD_CARD_ERROR;
      } finally {
        showError(msg);
      }
    }
  }

  async function handleSubmitAddCard() {
    hideError();
    hideOtpError();
    const validCardVal = validateCardVal();
    let msg = "";
    if (validCardVal) {
      try {
        const [key, value] = Object.entries(validCardVal)[0];
        config.urlCheckApi.search = "";
        config.urlCheckApi.searchParams.set(key, value);
        loaderDom.overlay.style.display = "flex";
        const bodyCheckApi = {
          url: config.urlCheckApi.href,
        };
        const responseCheck = await callApi(bodyCheckApi);
        if (!responseCheck.ok) {
          let errorBody = null;
          try {
            errorBody = await responseCheck.json();
            throw new Error(errorBody?.message || "Customer API Error");
          } catch (e) {
            throw new Error(e.message || "Customer API Error");
          }
        }

        const resultGenerate = await responseCheck.json();

        if (resultGenerate?.createdId) {
          otpDom.timeAllowShowResend.value =
            resultGenerate?.timeAllowShowResend || 30;
          otpDom.phone.value = resultGenerate?.mobile;
          config.timerDuration = resultGenerate?.expiryTime || config.timerDuration;
          showPhoneNumber();
          showOtpForm();
        } else {
          msg = MESSAGES.OTP_SEND_FAILED;
        }
      } catch (error) {
        msg = error.message || MESSAGES.SUBMIT_ADD_CARD_ERROR;
      } finally {
        loaderDom.overlay.style.display = "none";
        showError(msg);
      }
    }
  }

  async function handleSubmitLinkCard() {
    {
      hideError();
      hideOtpError();
      const inputs = document.querySelectorAll(".otp-input");
      let otpValue = "",
        msg = "";
      inputs.forEach((input) => {
        otpValue += input.value.trim();
      });

      if (!/^\d{6}$/.test(otpValue)) {
        msg = MESSAGES.OTP_INVALID;
        showOtpError(msg);
        return;
      }

      const currentPhone = otpDom.phone.value;
      if (!currentPhone) {
        msg = MESSAGES.PHONE_NO_NOT_FOUND;
        showOtpError(msg);
        return;
      }

      try {
        loaderDom.overlay.style.display = "flex";
        const bodyValidate = {
          url: `${config.capillaryHostUrl}${config.validateUrl}`,
          entityValue: currentPhone,
          code: otpValue,
        };

        const responseValidate = await callApi(bodyValidate);
        if (!responseValidate.ok) {
          msg = MESSAGES.OTP_AUTH_FAILED;
          showOtpError(msg);
          return;
        }

        const dataValidate = await responseValidate.json();

        if (dataValidate?.entity === true) {
          await linkCardApiCall();
          window.location.reload();
        } else {
          msg = `OTP authentication failed: ${dataValidate?.message}`;
          showOtpError(msg);
          return;
        }
      } catch (error) {
        msg = error.message || MESSAGES.VERIFY_OTP_FAILED;
      } finally {
        loaderDom.overlay.style.display = "none";
      }
      showOtpError(msg);
    }
  }

  function disableResendContent() {
    if (otpDom.resendContent.classList.contains("active")) {
      otpDom.resendContent.classList.remove("active");
    }
  }

  function enableResendContent() {
    if (!otpDom.resendContent.classList.contains("active")) {
      otpDom.resendContent.classList.add("active");
    }
  }

  if (otpDom.container) {
    const inputs = otpDom.container.querySelectorAll(".otp-input");

    inputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        const value = e.target.value;
        if (value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace") {
          if (input.value === "" && index > 0) {
            inputs[index - 1].focus();
          }
        } else if (e.key >= "0" && e.key <= "9") {
          input.value = "";
        }
      });

      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData("text");
        const digits = paste.replace(/\D/g, "").split("");
        digits.forEach((digit, i) => {
          if (inputs[i]) {
            inputs[i].value = digit;
          }
        });
        const nextIndex =
          digits.length >= inputs.length ? inputs.length - 1 : digits.length;
        inputs[nextIndex].focus();
      });
    });
  }
  _init();
  initEventListeners();
};
window.initCapCart();
