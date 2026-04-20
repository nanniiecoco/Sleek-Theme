// Talisma(tm) is a trademark and service mark of Talisma Corp. Copyright(c) 1998-2001 Talisma Corporation Pvt. Ltd. and its licensors. All rights reserved. -->
//HTML Templet Sample Shopify

var CHATFORM =
  '<div id="chat-form" class="forms"><form name="sample" id="sample" method="post" target="chat" action="about:blank"><div class="form" style="width: 90%; margin: 4px auto; padding: 4px; border-bottom: 1px solid #dedddd; text-align: center;"><p><input type="text" name="VName" id="VName" value="" size="40" placeholder="Name*"/></p><p><input type="text" name="Email" id="Email" value="" size="40" placeholder="Email id*"/></p><p><input type="text" name="76" id="Mobile" value="" size="40" placeholder="Mobile number*"/></p> <p><a class="btn bgcolor" id="btnStart" onclick="StartChat(); ">START CHAT</a></p></div></form></div>';

//************************************************************Configurations************************************************************//

var ChatWindow_Height = 450;
var ChatWindow_Width = 370;
var TL_MiddleURL =
  "https://130519Web1.SaaS.TalismaOnline.Com/visitorchat/mailchat.aspx"; // Middle chat delflection URL
var TL_MediaURL = "https://130519Web1.SaaS.TalismaOnline.Com/Media130519"; // Media chat server URL
var TL_WebtrackURL = "https://130519Web1.SaaS.TalismaOnline.Com/webtrak"; // Webtrak server URL
var TL_ChatTitle = "Talisma Chat";
var TL_EstimateBtnId = "btnEstimate";
var TL_StartChatBrnId = "btnStart";
var TL_MsgFormId = "sample";
var TL_LaunchInSamePage = true;
var chatFromRight = "20";
var sFont = "font-family:Open Sans !important;font-size:.8em;";
var sColor = "background: #f78a76;color: #ffffff;";
var TL_ValidationBeforeSubmit = function (ignore) {
  var Name = document.getElementById("VName");

  if (Name && Name.value == "") {
    alert("Please enter your name");
    Name.focus();
    return false;
  }

  if (Name) {
    var email = document.forms["sample"]["Email"].value;
    var reason = document.getElementsByClassName("select_lang")[0].value.trim();
    var terms_condition = document.forms["sample"]["terms_condition"].checked;
    var remember = document.getElementById("checkbox");
    var Exist = document.forms["sample"]["Email"];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (email == "") {
      console.log(email);
      alert("Please enter your email");
      //email.focus();
      return false;
    } else {
      let bool = emailRegex.test(email);
      console.log(bool);

      if (bool == false) {
        alert("Please enter Correct email");
        return false;
      } else {
      }
    }

    if (reason === "") {
      alert("Please select one of the reason");
      console.log(reason);
      return false;
    }

    if (!remember.checked) {
      alert("Please agree our terms & condition");
      console.log(reason);
      return false;
    }
  }

  return true;
};

//For Proactive Chat Start----------------------------
var TL_Proactive = false;
var TL_CheckChatInterval = 7;
var TL_ConsiderForWebtrakAfter = 10;
var TL_ProactiveMsgBoxTitle = "Talisma Chat";
var TL_GetSiteVisitorData = function () {
  var svFormValue = [];
  svFormValue.tName = null;
  svFormValue.tEmail = null;
  svFormValue.bIgnoreCust = null;
  svFormValue.tURL = window.parent.location.href;
  svFormValue.tIPAddress = "";
  svFormValue.tBrowser = navigator.appName;
  svFormValue.nCartValue = null;
  svFormValue.tReferrer = null;
  svFormValue.nFormSubmit = null;
  svFormValue.tDemo = null;
  svFormValue.nDemoClicked = null;
  svFormValue.tBannerAd = null;
  svFormValue.nBannerAdClicked = null;
  svFormValue.tDownloadedFiles = null;
  svFormValue.tSurvey = null;

  return svFormValue;
};
//For Proactive Chat End------------------------------
//************************************************************Configurations************************************************************//
var CheckChatStop = true;
var StartImage = new Image();
StartImage.width = 0;
StartImage.height = 0;
var DefImage = new Image();
DefImage.width = 0;
DefImage.height = 0;
var sContextProps = "";
var CheckChatInterval = 0;
var IntroMsg = "";
var InputNamePlaceholer = "First Name / Last Name*";
var PreChatHeader = "Jaspal Chat";
var PreChatHeaderBelow = "Your Chat assistant";
var PreChatContinueButton = "START CHAT";
// var PreChatSupportTermLbl = "Support Terms";
var PreChatSupportTermLbl =
  "<span class='agreed'><input type='checkbox' id='checkbox' value='' onclick='safari()'; />:<p class='terms'>I agree to terms and conditions.</p></span>";
var PreChatSkipLbl = "Skip";
var curDlg = null;

function InitReactive() {
  var loadChatUI = function (option) {
    var left = document.createElement("span");
    left.className = "left header_content";
    left.setAttribute("id", "heading");

    var leftUI =
      "<img class='jp_logo' src='https://cdn.shopify.com/s/files/1/0754/8531/5296/files/home-treat.png?v=1756105540'>";
    leftUI +=
      "<span class='heading_left'><img src='https://cdn.shopify.com/s/files/1/0754/8531/5296/files/header-text.png?v=1756105540' class='logo-text'/>Jaspal Group</span>";

    left.innerHTML = leftUI;
//height controll here
    if (typeof option.middleURL == "undefined") {

      if ($(window).width() < 990) {
        curDlg = Dialog({
          radius: [300, $(window).height()],
          nobg: true,
          bottom: "5px",
          right: "20px",
          header: true,
          dbody: option.content,
          dfooter: option.footer,
          maximize: false,
          left: left,
        });
      
    } else {
      curDlg = Dialog({
        radius: [300, 400],
        nobg: true,
        bottom: "5px",
        right: "20px",
        header: true,
        dbody: option.content,
        dfooter: option.footer,
        maximize: false,
        left: left,
      });
    }
     

      
      left.style.display = "flex";
    } else {
      
      var content =
        "<iframe id='fChat' style='height:480px' src='" +
        option.middleURL +
        "' name='chat'></iframe>";
      curDlg = Dialog({
        radius: [400, 450],
        nobg: true,
        bottom: "5px",
        right: "20px",
        header: true,
        dbody: content,
        maximize: false,
        left: left,
      });
    }
    curDlg.open();
    $(left).on("click", "li,.btn", function () {
      if ($("#fChat").length > 0 && $(this).attr("action"))
        console.log($(this).attr("action"));
      document
        .getElementById("fChat")
        .contentWindow.postMessage(
          '{"type":"' + $(this).attr("action") + '"}',
          "*"
        );
    });
  };
  if (sessionStorage.getItem("chat") == "active") {
    var nURL = "about:blank";
    loadChatUI({ middleURL: nURL });
    sessionStorage.setItem("chat", "active");
    curDlg.body.innerHTML +=
      "<div id='chat-frame'><form style='margin-top:30px;' id='" +
      TL_MsgFormId +
      "' name='sample' method='POST' target='chat' action='about:blank'></form></div>";
    StartChat(false);
  } else {
    if (getQuery("instid") != "") {
      var nURL = TL_MiddleURL + "?instid=" + getQuery("instid");
      loadChatUI({ middleURL: nURL });
      sessionStorage.setItem("chat", "active");
    } else {
      var button = document.createElement("div");
      button.className = "bubble";
      button.innerHTML =
        "<div class='bubble_chat' id='bubble_button' onclick='Opacity_change(),hideButton()' ><img class='bubble_image' onclick='hideButton()' src='https://cdn.shopify.com/s/files/1/0754/8531/5296/files/Jaspal_Chat_Bubble_60_x_60_px.png?v=1756105540'></img></div>";
      button.onclick = function () {
        if ($("#chat-frame").length == 0) {
          var content =
            "<div id='chat-frame'><h2 class='center'>" +
            PreChatHeader +
            "</h2>";
          content +=
            "<div class='center Label'>" + PreChatHeaderBelow + "</div>";
          content +=
            "<form style='margin-top:15px;' id='" +
            TL_MsgFormId +
            "' name='sample' method='post' target='chat' action='about:blank'>";
          content +=
            "<div class='field'><input required placeholder='" +
            InputNamePlaceholer +
            "' id='VName' style='text-align:left' name='VName'></input></div>";
          content +=
            "<div class='field'><input type='email' placeholder='Email*' id='Email' style='text-align:left;' name='Email' value=''/></div>";
          /*content +=
                        "<div class='field'><input required placeholder='Enter your Mobile number' id='21894' style='text-align:left' name='76'></input></div>";*/

          content +=
            "<div class='field'><input type='text' placeholder='JPS Club Member ID' id='21953' style='text-align:left' name='21953' value=''></input></div>";
          content +=
            "<div class='field'><input type='text' class='channel_id' placeholder='Channel ID' id='21947' style='text-align:left' name='21947' value='LynnWebChat' ></input></div>";
          content +=
            "<div class='field select_box'><button type='button' id='thai' class='active-select' onclick='thai_options()'>ไทย</button><button type='button' id='eng' onclick='eng_options()' >English</button></div>";
          content +=
            "<div class='field'><select id='21952' class='select_lang' style='text-align:left' name='21952' class='reason' value=''> <option>Contact Reason</option> </select></div>";

          content +=
            "<div class='field' style='display:none;'><input required placeholder='' value='2' id='21866' style='text-align:left' name='21866'></input></div>";
          content +=
            "<div class='field submit_button'><div class='field checkbox_field'><input required type='checkbox' placeholder='agree' value='' id='checkbox' style='text-align:left' name='terms_condition' class='terms_condition' onclick='safari()' ></input><span class='agreement'>I agree to <a href='https://www.jpsclub.com/#/user_privacy' class='privacy_link' target='_blank'>JPSClub Privacy Policy, and Legal Statement</a></span></div><button onclick='StartChat(false);' id='btnSubmit' >" +
            PreChatContinueButton +
            "</button></div>";

          content += "</form></div>";
          content +=
            "<iframe style='display:none;' id='fChat' src='' name='chat' ></iframe>";

          var footer =
            "<div class='left'><a class='btn'>" +
            PreChatSupportTermLbl +
            "</a></div>";
          footer +=
            "<div class='right'><a class='btn' onclick='check_form();'>" +
            PreChatSkipLbl +
            "</a></div>";
          curDlg.closeMe();
          loadChatUI({ content: content, footer: footer });
        }
        // calling thai options function for already active element
        thai_options();
      };
      document.body.appendChild(button);
      var ingro = "<div class='nMsg'>" + IntroMsg + "</div>";
      curDlg = Dialog({
        radius: [270, 0],
        nobg: true,
        bottom: "110px",
        right: "20px",
        noheader: true,
        dbody: ingro,
      });
      setTimeout(function () {
        curDlg.open();
      }, 2000);
    }
  }
}

function create_bubble(){
// Check if the element with class "bubble" already exists
var existingBubble = document.querySelector('.bubble');

// If the element does not exist, create it
if (!existingBubble) {
    var bubble_new_btn = document.createElement("div");
    bubble_new_btn.className = "bubble";
    bubble_new_btn.innerHTML = "<div class='bubble_chat' id='bubble_button' onclick='hideButton()'><img class='bubble_image' onclick='hideButton()' src='https://cdn.shopify.com/s/files/1/0069/1909/4327/files/Jaspal_Chat_Bubble_60_x_60_px.png?v=1706504240'></img></div>";

    // Append the new element
    var ndlgElement = document.querySelector('.nDlg');
    ndlgElement.parentNode.insertBefore(bubble_new_btn, ndlgElement.nextSibling);
}else{
  var show_btn=document.getElementById('bubble_button');
  show_btn.style.display="flex";
}
}

function minimize_chat(){

      var bodyElement=document.body;
    var htmlElement=document.documentElement;
    if ($(window).width() < 990) {
      bodyElement.style.overflow="auto";
      htmlElement.style.overflow="auto";
      htmlElement.style.height="100%";
    }
   var minimize_chat=document.getElementById("chat_minimize");
   var maximize_chat=document.getElementById("chat_maximize");
  var iframe=document.getElementById("fChat");
  var nDlg = document.querySelector(".nDlg");
    nDlg.classList.add("hide_form");
  create_bubble();
  // show_button();
  
}
function maximize_chat(){
   var minimize_chat=document.getElementById("chat_minimize");
   var maximize_chat=document.getElementById("chat_maximize");
  var iframe=document.getElementById("fChat");
  var nDlg = document.querySelector(".nDlg");
  iframe.style.height="480px";
  nDlg.style.height = "480px";
  nDlg.style.bottom="5px";
   minimize_chat.style.display="block";
   maximize_chat.style.display="none";
}




function minimize_window(){
 var minimize_chat=document.getElementById("minimize_window");
  var maximize_chat=document.getElementById("maximize_window");
  var nDlg = document.querySelector(".nDlg");
  var nDlgBody = document.querySelector(".nDlgBody");
nDlg.classList.add("hide_form");
  show_button();


  var bodyElement=document.body;
       var htmlElement=document.documentElement;
    
    if ($(window).width() < 990) {
      bodyElement.style.overflow="auto";
      htmlElement.style.overflow="auto";
      htmlElement.style.height="100%";
    }

  
}


function maximize_window(){
  var minimize_chat=document.getElementById("minimize_window");
  var maximize_chat=document.getElementById("maximize_window");
  var nDlg = document.querySelector(".nDlg");
  var nDlgBody = document.querySelector(".nDlgBody");
  nDlg.style.height = "400px";
   nDlg.style.bottom="5px";
  maximize_chat.style.display="none";
  minimize_chat.style.display="block";
  setTimeout(function() {
     nDlgBody.style.display="block";
}, 300);

}



function safari() {
  var isSafariBrowser = isSafari();
  if (isSafariBrowser == true) {
    var form = document.getElementById("sample");
    form.setAttribute("target", " ");
  }
}
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function hideButton() {
  var button = document.getElementById("bubble_button");
  button.style.display = "none";
  var ndlg=document.querySelector(".nDlg");
    ndlg.classList.remove("hide_form");
   var bodyElement=document.body;
       var htmlElement=document.documentElement;
    
    if ($(window).width() < 990) {
      bodyElement.style.overflow="hidden";
      htmlElement.style.overflow="hidden";
      htmlElement.style.height="100%";
    }
}

function show_button() {

  
    var bodyElement=document.body;
    var htmlElement=document.documentElement;
    if ($(window).width() < 990) {
      bodyElement.style.overflow="auto";
      htmlElement.style.overflow="auto";
      htmlElement.style.height="100%";
    }
  var button = document.getElementById("bubble_button");
  console.log("working");
  button.style.display = "flex";
}

function Opacity_change() {
  const nDlg = document.querySelector(".nDlg");
  nDlg.style.opacity = "1";

   // code for body 
   // var bodyElement=document.body;
   //     var htmlElement=document.documentElement;
    
   //  if ($(window).width() < 990) {
   //    bodyElement.style.overflow="hidden";
   //    htmlElement.style.overflow="hidden";
   //    htmlElement.style.height="100%";
   //  }
}

function thai_options() {
  document.getElementById("thai").setAttribute("class", "active-select");
  document.getElementById("eng").removeAttribute("class");

  // Get a reference to the select element by its class (you can use any selector method)
  var selectElements = document.getElementsByClassName("select_lang");

  // Define the new options you want to replace with
  var newOptions = [
    {
      text: "คุณต้องการความช่วยเหลือด้านใด?",
      value: "",
    },
    { text: "ยัสปาลโฮม", value: "ยัสปาลโฮม" },
    { text: "ข้อมูลสินค้า", value: "ข้อมูลสินค้า" },
    { text: "สถานะการจัดส่งสินค้า", value: "สถานะการจัดส่งสินค้า" },
    { text: "การเปลี่ยนและคืนสินค้า", value: "การเปลี่ยนและคืนสินค้า" },
    { text: "โปรโมชั่นและส่วนลด", value: "โปรโมชั่นและส่วนลด" },
    { text: "สมาชิก JPS Club", value: "สมาชิก JPS Club" },
    { text: "ข้อมูลร้านค้า", value: "ข้อมูลร้านค้า" },
    { text: "ข้อเสนอแนะ", value: "ข้อเสนอแนะ" },
    { text: "อื่นๆ", value: "อื่นๆ" },

    // Add more options as needed
  ];

  // Loop through each select element and replace its options
  for (var i = 0; i < selectElements.length; i++) {
    var selectElement = selectElements[i];

    // Remove existing options
    while (selectElement.options.length > 0) {
      selectElement.remove(0);
    }

    // Add new options
    for (var j = 0; j < newOptions.length; j++) {
      var option = new Option(newOptions[j].text, newOptions[j].value);
      selectElement.add(option);
    }
  }
  // console.log("thai");
  // selectElement.options[0].disabled = true;
    selectElement.options[0].hidden = true;
}

function eng_options() {
  // adding a active class and removing the active class from the other button
  document.getElementById("eng").setAttribute("class", "active-select");
  document.getElementById("thai").removeAttribute("class");
  // Get a reference to the select element by its class (you can use any selector method)
  var selectElements = document.getElementsByClassName("select_lang");

  // Define the new options you want to replace with
  var newOptions = [
    {
      text: "How may I help you?",
      value: "",
    },
    {
      text: "Jaspal Home",
      value: "Jaspal Home",
    },
    {
      text: "Products Information",
      value: "Products Information",
    },
    { text: "Shipping Status", value: "Shipping Status" },
    {
      text: "Order, Change and Return Product",
      value: "Order, Change and Return Product",
    },
    { text: "Promotions", value: "Promotions" },
    {
      text: "JPS Club",
      value: "JPS Club",
    },
    { text: "Stores Information", value: "Stores Information" },
    { text: "Suggestions", value: "Suggestions" },
    { text: "Others", value: "Others" },

    // Add more options as needed
  ];

  // Loop through each select element and replace its options
  for (var i = 0; i < selectElements.length; i++) {
    var selectElement = selectElements[i];

    // Remove existing options
    while (selectElement.options.length > 0) {
      selectElement.remove(0);
    }

    // Add new options
    for (var j = 0; j < newOptions.length; j++) {
      var option = new Option(newOptions[j].text, newOptions[j].value);
      selectElement.add(option);
    }
  }

  console.log("eng");
  // Disable the first option in the select element
  // selectElement.options[0].disabled = true;
   selectElement.options[0].hidden = true;
   selectElement.options[0].default = true;
}

function check_form() {
  // check if all the fields are filled
  var name = document.forms["sample"]["VName"].value;
  var email = document.forms["sample"]["Email"].value;
  var reason = document.getElementsByClassName("select_lang")[0].value;
  var terms_condition = document.forms["sample"]["terms_condition"].checked;
  var remember = document.getElementById("checkbox");
  console.log(email);
  if (name == "") {
    alert("Name must be filled out");
    return false;
  } else if (email == "") {
    alert("Email must be filled out");
    return false;
  } else if (reason == "") {
    alert("Please choose the reason!");
    return false;
  } else if (!remember.checked) {
    alert("Terms and condition must be filled");
    return false;
  } else {
    StartChat(false, true);
  }
}

function StartChat(proactive, ignorecheck) {
  if (OpenChat(proactive, ignorecheck)) {
    if (document.getElementById("fChat"))
      document.getElementById("fChat").style.display = "block";
    if (document.getElementById("chat-frame")) {
      document.getElementById("chat-frame").style.display = "none";
      curDlg.updateSize([400, 450]);
    }
    $(curDlg.footer).remove();
    $("#menu").show();
    curDlg.footer = null;
    $(curDlg.header).remove();
     var bodyElement=document.body;
    if ($(window).width() < 990) {
     // bodyElement.style.overflow="hidden"
       curDlg.updateSize([400, $(window).height()]);
    }else{
       curDlg.updateSize([400, 480]);
    }
   
	if(isSafari()){
        curDlg.closeMe();
        show_button();
	}
  }
}

var onReadyChangeFunc = function () {
  if (document.readyState == "complete" || document.readyState == "loaded") {
    LoadStyle();
    if (TL_Proactive == true) {
      if (
        TL_StartChatBrnId != "" &&
        typeof document.getElementById(TL_StartChatBrnId) != "undefined"
      )
        document.getElementById(TL_StartChatBrnId).style.display = "none";
      if (typeof document.getElementById(TL_MsgFormId) != "undefined") {
        if (document.getElementsByName("Auto").length == 0) {
          var cntrlAuto = document.createElement("input");
          cntrlAuto.setAttribute("name", "Auto");
          cntrlAuto.setAttribute("id", "Auto");
          cntrlAuto.setAttribute("type", "hidden");
          document.getElementById(TL_MsgFormId).appendChild(cntrlAuto);
        }
        document.getElementsByName("Auto")[0].value = "Yes";
        document.getElementsByName("Auto")[0].setAttribute("value", "Yes");
        StartChecking();
        CheckChatStop = false;
      }
    }
    LoadScript();
    LoadStyleFiles();
  }
};

function LoadStyleFiles() {
  var tjs = document.createElement("link");
  tjs.type = "text/css";
  tjs.rel = "stylesheet";
  tjs.href =
    "http://ecom-ccdoubleo.myshopify.com/cdn/shop/t/6/assets/treatcode_icon.css?v=102989464176517064231756107253";
  document.head.appendChild(tjs);
  // var tjs1 = document.createElement("link");
  // tjs1.type = "text/css";
  // tjs1.rel = "stylesheet";
  // tjs1.href =
  //   "https://lynaccs.myshopify.com/cdn/shop/t/19/assets/normalize.css?v=79559626580315710021706506911";
  // document.head.appendChild(tjs1);
}

if (typeof document.onreadystatechange != "undefined")
  document.onreadystatechange = onReadyChangeFunc;
else {
  document.addEventListener("DOMContentLoaded", onReadyChangeFunc);
}

function LoadScript() {
  var tjs = document.createElement("script");
  tjs.type = "text/javascript";
  tjs.src = "//ecom-ccdoubleo.myshopify.com/cdn/shop/t/6/assets/jquery.js";
  document.head.appendChild(tjs);
  tjs.onload = function () {
    var tjs1 = document.createElement("script");
    tjs1.type = "text/javascript";
    tjs1.src = "//ecom-ccdoubleo.myshopify.com/cdn/shop/t/6/assets/jquery-ui.js";
    document.head.appendChild(tjs1);
    InitReactive();
  };
}

if (typeof document.onreadystatechange != "undefined")
  document.onreadystatechange = onReadyChangeFunc;
else {
  document.addEventListener("DOMContentLoaded", onReadyChangeFunc);
}

//******** Same page Chat Window UI Start

function LoadStyle() {
  var cStyle = document.createElement("style");
  cStyle.type = "text/css";
  var strStyle = ".bordert{box-shadow:4px -1px 6px 2px rgba(38, 35, 35, 1);}";
  strStyle += "html{" + sFont + "}";
  strStyle +=
    ".transitions{-webkit-transition: all 0.2s ease-in-out 0.2s;-moz-transition: all 0.2s ease-in-out 0.2s;-o-transition: all 0.2s ease-in-out 0.2s;-ms-transition: all 0.2s ease-in-out 0.2s;transition: all 0.2s ease-in-out 0.2s;}";
  strStyle +=
    ".chat-title {height:100px;width:100%;line-height:25px;cursor:pointer;}";
  strStyle += ".chat-title > div {float:right;}";
  strStyle +=
    ".chat-title > span {float:left;margin:2px 5px;font-weight: bold;}";
  strStyle +=
    ".close{ display: block;cursor: pointer;float: right;height: 30px;width: 33px;font-size: 15px !important;line-height: 28px;text-align: center;box-shadow: -1px 0 0px 0 rgba(0, 0, 0, 0.2); }";
  strStyle += ".close:hover {background-color: #ffffff;color: #505050;}";
  strStyle +=
    ".chat-body {width:100%;height: " +
    (ChatWindow_Height - 30) +
    "px;background-color:#fff;position:relative;}";
  strStyle +=
    ".absolutes {position: fixed;right: " +
    chatFromRight +
    "px;bottom: 0px;z-index:100;}";
  strStyle += ".bgcolor {" + sColor + ";text-decoration: none;}";
  //strStyle += ".btn{font-family:'PT Sans';font-weight:400;padding:13px 12px;font-size:14px;box-sizing:border-box;zoom:1;border-radius:0%;width:104px;}";
  //strStyle += ".btn:hover {text-shadow: 0 0 15px #000000;}";
  if (cStyle.styleSheet) cStyle.styleSheet.cssText = strStyle;
  else cStyle.innerHTML = strStyle;
  document.body.appendChild(cStyle);
}

function LoadChatUI(isVideo) {
  var frameDiv = document.createElement("div");
  frameDiv.setAttribute("id", "chat-frame");
  frameDiv.setAttribute("class", "chat-frame absolutes bordert");
  if (typeof isVideo != "undefined") frameDiv.style.width = "640px";
  var titleDiv = document.createElement("div");
  titleDiv.setAttribute("class", "chat-title bgcolor");
  titleDiv.innerHTML = "<span>" + TL_ChatTitle + "</span>";
  titleDiv.setAttribute("onclick", "minimizeMe()");
  var cBtn = document.createElement("i");
  cBtn.className = "close";
  cBtn.setAttribute("onclick", "closeMe('chat-frame')");
  cBtn.innerHTML = "✖";
  cBtn.setAttribute("class", "close");
  var bDiv = document.createElement("div");
  bDiv.appendChild(cBtn);
  titleDiv.appendChild(bDiv);
  var bodyDiv = document.createElement("div");
  bodyDiv.setAttribute("class", "chat-body transitions");
  bodyDiv.setAttribute("id", "chat-body");
  bodyDiv.innerHTML =
    '<iframe style="display:none;" id="fChat" src="" name="chat" sandbox="allow-scripts"></iframe>';
  frameDiv.appendChild(titleDiv);
  frameDiv.appendChild(bodyDiv);
  frameDiv.appendChild(bodyDiv);
  var frmeHeight = document.getElementById("chat-frame").offsetHeight;
  document.getElementById("chat-body").style.height = frmeHeight - 30 + "px";


}

function minimizeMe() {
  if (document.getElementById("chat-body")) {
    if (document.getElementById("chat-body").style.height == "0px")
      document.getElementById("chat-body").style.height =
        ChatWindow_Height - 30 + "px";
    else document.getElementById("chat-body").style.height = 0 + "px";
  }
}
function closeMe(id) {
  curDlg.closeMe();
}

//******** Same page Chat Window UI End
function ran() {
  return Math.floor(10000 * Math.random());
}

function LaunchAlert(option) {
  option.oklabel = typeof option.oklabel != "undefined" ? option.oklabel : "Ok";
  option.cencellabel =
    typeof option.cencellabel != "undefined" ? option.cencellabel : "Cancel";
  option.promsg =
    typeof option.promsg != "undefined"
      ? option.promsg
      : "Our customer service representative will come online to assist you. Please wait...";
  var popUpDiv = top.document.createElement("div");
  popUpDiv.setAttribute("id", "NewPopup");
  popUpDiv.className = "transitions bordert";
  popUpDiv.style.backgroundColor = "white";
  //popUpDiv.style.boxShadow = "0px 0px 0px 10px rgba(255,255,255,0.1);";
  popUpDiv.style.padding = "1px";
  popUpDiv.style.position = "absolute";
  popUpDiv.style.width = "0";
  popUpDiv.style.height = "0";
  popUpDiv.style.left = "-100px";
  popUpDiv.style.top = "-100px";
  var okButton = top.document.createElement("input");
  okButton.setAttribute("type", "button");
  okButton.className = "btn bgcolor";
  okButton.value = option.oklabel;
  okButton.style.cssFloat = "right";
  okButton.onclick = function () {
    if (typeof option.onok != "undefined") {
      option.onok(function () {
        top.document.body.removeChild(popUpDiv);
      });
    }
  };
  var cancelButton = top.document.createElement("input");
  cancelButton.value = option.cencellabel;
  cancelButton.setAttribute("type", "button");
  cancelButton.className = "btn bgcolor";
  cancelButton.style.cssFloat = "right";
  cancelButton.style.marginLeft = "5px";
  cancelButton.onclick = function () {
    if (typeof option.oncancel != "undefined") {
      option.oncancel(function () {
        top.document.body.removeChild(popUpDiv);
      });
    }
  };
  var titleDiv = top.document.createElement("div");
  titleDiv.innerHTML =
    "<span>" +
    TL_ProactiveMsgBoxTitle +
    "</span><div><i onclick='closeMe(\"NewPopup\");' class='close'>✖</i></div>";
  titleDiv.className = "bgcolor chat-title";
  var Message = top.document.createElement("div");
  Message.innerHTML = option.promsg;
  //Message.style.width = "100%";
  Message.style.height = "70px";
  Message.style.padding = "5px";
  if (Message.style.borderBottom)
    Message.style.borderBottom = "1px solid rgba(38, 35, 35, 0.20)";
  var buttons = top.document.createElement("div");
  buttons.style.cssFloat = "right";
  buttons.appendChild(cancelButton);
  buttons.appendChild(okButton);
  popUpDiv.appendChild(titleDiv);
  popUpDiv.appendChild(Message);
  popUpDiv.appendChild(buttons);
  top.document.body.appendChild(popUpDiv);
  setTimeout(function () {
    var popUpDiv = document.getElementById("NewPopup");
    popUpDiv.style.width = "400px";
    popUpDiv.style.height = "150px";
    popUpDiv.style.left = "40%";
    popUpDiv.style.top = "20%";
  }, 1000);
}

// This function will be called when visitor visits proactive chat page first time to insert a row in site visitor
function StartCheck() {
  var svFormValue = TL_GetSiteVisitorData();
  var re = / /g;
  svFormValue.tBrowser = svFormValue.tBrowser.replace(re, "%20");

  // Pass possible values on any/all of below fields for updation on webtrak DB while visitor visits Chat Page
  QryStr =
    (svFormValue.tName == null ||
    svFormValue.tName == "" ||
    svFormValue.tName == "undefined"
      ? ""
      : "&tName=" + escape(svFormValue.tName)) +
    (svFormValue.tEmail == null ||
    svFormValue.tEmail == "" ||
    svFormValue.tEmail == "undefined"
      ? ""
      : "&tEmail=" + escape(svFormValue.tEmail)) +
    (svFormValue.bIgnoreCust == null ||
    svFormValue.bIgnoreCust == "" ||
    svFormValue.bIgnoreCust == "undefined"
      ? ""
      : "&bIgnoreCust=" + escape(svFormValue.bIgnoreCust)) +
    (svFormValue.tURL == null ||
    svFormValue.tURL == "" ||
    svFormValue.tURL == "undefined"
      ? ""
      : "&tURL=" + escape(svFormValue.tURL)) +
    (svFormValue.tIPAddress == null ||
    svFormValue.tIPAddress == "" ||
    svFormValue.tIPAddress == "undefined"
      ? ""
      : "&tIPAddress=" + escape(svFormValue.tIPAddress)) +
    (svFormValue.tBrowser == null ||
    svFormValue.tBrowser == "" ||
    svFormValue.tBrowser == "undefined"
      ? ""
      : "&tBrowser=" + escape(svFormValue.tBrowser)) +
    (svFormValue.nCartValue == null ||
    svFormValue.nCartValue == "" ||
    svFormValue.nCartValue == "undefined"
      ? ""
      : "&nCartValue=" + escape(svFormValue.nCartValue)) +
    (svFormValue.tReferrer == null ||
    svFormValue.tReferrer == "" ||
    svFormValue.tReferrer == "undefined"
      ? ""
      : "&tReferrer=" + escape(svFormValue.tReferrer)) +
    (svFormValue.nFormSubmit == null ||
    svFormValue.nFormSubmit == "" ||
    svFormValue.nFormSubmit == "undefined"
      ? ""
      : "&nFormSubmit=" + escape(svFormValue.nFormSubmit)) +
    (svFormValue.tDemo == null ||
    svFormValue.tDemo == "" ||
    svFormValue.tDemo == "undefined"
      ? ""
      : "&tDemo=" + escape(svFormValue.tDemo)) +
    (svFormValue.nDemoClicked == null ||
    svFormValue.nDemoClicked == "" ||
    svFormValue.nDemoClicked == "undefined"
      ? ""
      : "&nDemoClicked=" + escape(svFormValue.nDemoClicked)) +
    (svFormValue.tBannerAd == null ||
    svFormValue.tBannerAd == "" ||
    svFormValue.tBannerAd == "undefined"
      ? ""
      : "&tBannerAd=" + escape(svFormValue.tBannerAd)) +
    (svFormValue.nBannerAdClicked == null ||
    svFormValue.nBannerAdClicked == "" ||
    svFormValue.nBannerAdClicked == "undefined"
      ? ""
      : "&nBannerAdClicked=" + escape(svFormValue.nBannerAdClicked)) +
    (svFormValue.tDownloadedFiles == null ||
    svFormValue.tDownloadedFiles == "" ||
    svFormValue.tDownloadedFiles == "undefined"
      ? ""
      : "&tDownloadedFiles=" + escape(svFormValue.tDownloadedFiles)) +
    (svFormValue.tSurvey == null ||
    svFormValue.tSurvey == "" ||
    svFormValue.tSurvey == "undefined"
      ? ""
      : "&tSurvey=" + escape(svFormValue.tSurvey));

  strsrc =
    TL_WebtrackURL +
    "/Webtrak.aspx?Fn=Start&SetCookie=True" +
    QryStr +
    "&num=" +
    ran();
  StartImage.src = strsrc;
  CheckChatInterval = window.setInterval(
    "CheckOnTime()",
    TL_CheckChatInterval * 1000
  );
}

// This function will be called to start Proactive ChatSession
function StartChatSession(sAuto) {
  var strurl = "";
  if (sAuto != true) {
    return false;
  }
  if (CheckChatInterval != 0) {
    CheckChatStop = true;
    window.clearInterval(CheckChatInterval);
  }
  if (TL_MediaURL.length > 0) {
    CreateChatNow(true);
  }
  return true;
}

// This function will in loop to check if agent has sent invitation or not
function CheckOnTime() {
  var cHeight = 0;
  var cWidth = 0;
  if (StartImage.naturalHeight) {
    cHeight = StartImage.naturalHeight;
    cWidth = StartImage.naturalWidth;
  } else {
    cHeight = StartImage.height;
    cWidth = StartImage.width;
  }
  // StartImage Height/width will be 1 if BeginTrakUrlStar succceeds
  if (CheckChatStop == true || cHeight != 1 || cWidth != 1) return;

  if (DefImage.naturalHeight) {
    cHeight = DefImage.naturalHeight;
    cWidth = DefImage.naturalWidth;
  } else {
    cHeight = DefImage.height;
    cWidth = DefImage.width;
  }
  // DefImage Height/width will be 1 if BeginTrakUrlEnd succceeds (user sends invitation to visitor)
  if (cHeight != 1 || cWidth != 1) {
    var strsrc = TL_WebtrackURL + "/Webtrak.aspx?fn=CheckChat&num=" + ran();
    DefImage.src = strsrc;
    return;
  } else {
    StartChatSession(true);
  }
}

// This function will be called to get wait time and position in queue estimation for next visitor chat, Without initiating chat session.
// Output of this function will be jason - ReturnCode:0,WaitTime:0,Position:0
// One can pass any of below fields using form post for exact estimation:
// CurURL - For Current URL.
// CaseID - For Case Id.
// TeamID - For Team Id.
// MediaID - For MediaId.
function EstimateTime() {
  var strurl = "";
  var retValue = "False";
  var querystr = TL_MediaURL + "/ChatActions/ChatAction.ashx";

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", querystr, false);
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlHttp.send(
    "doCheck=1&CurURL=" +
      top.window.location.href +
      "&CaseID=0&TeamID=0&MediaID=6&Email=pravat@this.com&Auto=join&Name=pravat"
  );
  //alert(xmlHttp.responseText);
  //eval("var result = " + xmlHttp.responseText); // User result variable to initialize result json
  //alert(result.WaitTime); // result.ReturnCode,result.WaitTime,result.Position can be used for values

  if (xmlHttp.responseText != "") {
    //{ReturnCode:0,WaitTime:0,Position:0}
    var rsp = xmlHttp.responseText
      .replace(/{/g, '{"')
      .replace(/:/g, '":"')
      .replace(/,/g, '","')
      .replace("}", '"}');
    return JSON.parse(rsp);
  }
  return true;
}

// This function will be called when visitor visits Proactive chat page
function StartChecking() {
  window.setTimeout("StartCheck()", TL_ConsiderForWebtrakAfter * 1000); // Change this interval for the delay to show sitevisitor row at agent side.
  return;
}

// To trim String values
function GetTrimmedString(sel) {
  var tmpStr = "";
  var startPos = 0;
  var endPos = sel.length;

  for (i = 0; i < sel.length; i++) {
    if (
      escape(sel.charAt(i)) != "%0A" &&
      escape(sel.charAt(i)) != "%0D" &&
      escape(sel.charAt(i)) != "%09" &&
      escape(sel.charAt(i)) != "%20"
    )
      break;
  }
  startPos = i;

  for (i = sel.length - 1; i > -1; i--) {
    if (
      escape(sel.charAt(i)) != "%0A" &&
      escape(sel.charAt(i)) != "%0D" &&
      escape(sel.charAt(i)) != "%09" &&
      escape(sel.charAt(i)) != "%20"
    )
      break;
  }
  endPos = i + 1;

  for (j = startPos; j < endPos; j++) tmpStr += sel.charAt(j);
  return tmpStr;
}

// To initiate Proactive chat confirmation dialoge
function CreateChatNow() {
  var onok = function (closefunc) {
    InitiateChat(true);
    closefunc();
  };
  var oncancel = function (closefunc) {
    DenyProactive();
    closefunc();
  };
  LaunchAlert({ onok: onok, oncancel: oncancel });
}

// To deny proactive request
function DenyProactive() {
  var querystr =
    TL_MediaURL + "/ChatActions/ChatAction.ashx?ProactiveDeny=REMOVEPROACTIVE";
  DefImage.src = querystr;
  return;
}

// To Initiate Proactive chat
function InitiateChat(proactive) {
  OpenChat(proactive);
}

// To initiate Chat (Proactive/reactive)
function OpenChat(proactive, ignore) {
  if (ignore || TL_ValidationBeforeSubmit() == true) {
  
    if ($(window).width() < 990) {
      
      var url = TL_MediaURL + "/mVisitorChat/startchat.aspx";
      
    } else {
      var url = TL_MediaURL + "/VisitorChat/startchat.aspx";
    }
    var form = document.getElementById(TL_MsgFormId);
    form.action = url;
    form.method = "POST";
    sessionStorage.setItem("chat", "active");

    form.submit();
    setTimeout(function() {
        var button_minimize=document.createElement("span");
  button_minimize.className="button_minimize_block";
  button_minimize.setAttribute("id","minimize_btn");
  button_minimize.setAttribute("onclick","minimizeMe()");
  button_minimize.innerHTML="<span class='btn_minimize' id='chat_minimize' onclick='minimize_chat()'></span><span class='btn_maxmize' id='chat_maximize' onclick='maximize_chat()'><img src='https://cdn.shopify.com/s/files/1/0754/8531/5296/files/maximize_grey.png?v=1756105541' alt='maximize_grey' width='100' height='100'/></span>";
    var nDlgDiv = document.querySelector(".nDlgBody");

      

      
    //   var chat_logo=document.createElement("span");
    //   chat_logo.className="chat_logo";
    //   chat_logo.setAttribute('id','chat_logo_block');
    //   chat_logo.innerHTML="<img src='https://cdn.shopify.com/s/files/1/0754/8531/5296/files/jps_gif_chat.png?v=1756105540' id='chat_img' width='100' height='100'/>";
      

    //   nDlgDiv.appendChild(chat_logo);
      nDlgDiv.appendChild(button_minimize);
      }, 2000);
    return true;

       
  }
  return false;
}

function StartVideoChat() {
  var tjs = document.createElement("script");
  tjs.type = "text/javascript";
  tjs.src = "jquery.js";
  document.head.appendChild(tjs);

  tjs.onload = function () {
    var tjs1 = document.createElement("script");
    tjs1.type = "text/javascript";
    tjs1.src = "pubnub.js";
    document.head.appendChild(tjs1);

    tjs1.onload = function () {
      var tjs2 = document.createElement("script");
      tjs2.type = "text/javascript";
      tjs2.src = "webrtc.js";
      document.head.appendChild(tjs2);

      tjs2.onload = function () {
        LoadStyle();
        LoadChatUI(true);
        login(document.getElementById("VName"), function () {
          var vChatURL = "https://10.100.52.73/StartVideo/Handler.ashx";
          var frmVariable = "";
          frmVariable += "VName=" + document.getElementById("VName").value;
          frmVariable += "&Email=" + document.getElementById("Email").value;
          var xmlHttp = new XMLHttpRequest();
          xmlHttp.open("POST", vChatURL, false);
          xmlHttp.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
          xmlHttp.send(frmVariable);
          if (
            xmlHttp.responseText != "" &&
            parseInt(xmlHttp.responseText) > 0
          ) {
            //login({ username: document.getElementById("VName") });
            //setTimeout(function () {
            //}, 5000);
          }
        });
      };
    };
  };
}

function login(form, callBack) {
  var video_out = document.getElementById("chat-body");
  var phone = (window.phone = PHONE({
    number: form.value || "Anonymous", // listen on username line else Anonymous
    publish_key: "pub-c-534b6d07-65a6-42aa-928c-9ac7dc0f5463",
    subscribe_key: "sub-c-6c9a77e6-8d4c-11e7-ae33-36f589c5fdd4",
  }));
  phone.ready(function () {
    form.style.background = "#55ff5b";
    callBack();
    alert("Connected Please wait for agent to Join!");
  });
  phone.receive(function (session) {
    session.connected(function (session) {
      video_out.appendChild(session.video);
    });
    session.ended(function (session) {
      video_out.innerHTML = "";
    });
  });
  return false; // So the form does not submit.
}

function makeCall(form) {
  if (!window.phone) alert("Login First!");
  else phone.dial(form.number.value);
  return false;
}

// Validation of email format
function VerifyEmail(sel) {
  pos = sel.indexOf("@");
  pos2 = sel.lastIndexOf("@");
  if (pos != pos2) return false;
  pos1 = sel.lastIndexOf(".");
  if (pos == -1 || pos1 == -1 || pos1 <= pos || sel.indexOf(" ") != -1) {
    return false;
  }
  sel1 = sel.substr(pos + 1);
  var RegPat = "[`~!#$%^&*)(_+=}{|[:;\"'><,?/]";
  var emailReg = new RegExp(RegPat, "g");
  if (emailReg.test(sel1) || sel1.indexOf("\\") > 0 || sel1.indexOf("]") > 0)
    return false;

  sel2 = sel.substr(0, pos);
  var RegPat = '[><)([,;:"]';
  var emailReg = new RegExp(RegPat, "g");
  if (emailReg.test(sel2) || sel2.indexOf("\\") > 0 || sel2.indexOf("]") > 0)
    return false;

  pos2 = 0;
  while (sel1.indexOf(".") != -1) {
    pos2 = sel1.indexOf(".");
    if (pos2 == -1) pos2 = sel1.length;
    temp = sel1.substr(0, pos2);
    if (temp == "") return false;
    sel1 = sel1.substr(pos2 + 1);
  }
  if (sel1 == "") return false;
  pos2 = 0;
  while (sel2.indexOf(".") != -1) {
    pos2 = sel2.indexOf(".");
    if (pos2 == -1) pos2 = sel2.length;
    temp = sel2.substr(0, pos2);
    if (temp == "") return false;
    sel2 = sel2.substr(pos2 + 1);
  }
  if (sel2 == "") return false;
  return true;
}

function Dialog(option) {
  var dialog = {},
    h,
    w;
  var fragMent = document.createDocumentFragment();
  var dg = false;
  var hasHeader =
    typeof option.noheader == "undefined" || option.noheader == false;
  var hasMaximize =
    typeof option.maximize == "undefined" || option.maximize == false
      ? false
      : true;
  if (typeof option.nobg == "undefined" || option.nobg == false) {
    var modalDg = document.createElement("div");
    modalDg.className = "modal-bg hide";
    fragMent.appendChild(modalDg);
    dg = true;
  }
  var dlg = document.createElement("div");
  dlg.className = "nDlg";

  dialog.header = document.createElement("div");
  dialog.header.className = "nDlgHeader";
  var title = typeof option.title != "undefined" ? option.title : "";
  var h2 = document.createElement("h2");
  h2.innerHTML = title;
  var minimize=document.createElement("span");
  minimize.className="minimize_block";
  minimize.setAttribute("id","minimize_window");
  minimize.setAttribute("onclick", "minimize_window()");
  minimize.innerHTML="<span id='minimize'></span>";

  var maximize=document.createElement("span");
  maximize.className="maximize_block";
  maximize.setAttribute("id","maximize_window");
  maximize.setAttribute("onclick","maximize_window()");
  maximize.innerHTML="<span id='maximize'><img src='https://cdn.shopify.com/s/files/1/0754/8531/5296/files/maximize_white.png?v=1756105541' alt='maximize_white' width='100' height='100'/></span>";

  var button_minimize=document.createElement("span");
  button_minimize.className="button_minimize_block";
  button_minimize.setAttribute("id","minimize_btn");
  button_minimize.setAttribute("onclick","minimizeMe()");
  button_minimize.innerHTML="<span class='btn_minimize'></span>";

  

  
  var buttonClose = document.createElement("span");
  buttonClose.innerHTML =
    "<img src='https://cdn.shopify.com/s/files/1/0754/8531/5296/files/cancel-icon.png?v=1756105540' onclick='show_button()'></img>";
  buttonClose.className = "right btn close_chat";
  buttonClose.setAttribute("action", "endchat");
  buttonClose.setAttribute("id", "endchat");

  dialog.closeMe = function () {
    setTimeout(function () {
      $(dlg).detach();
      if (dg == true) $(modalDg).detach();
    });
    sessionStorage.setItem("chat", "closed");
  };
  buttonClose.onclick = function () {
    if (typeof option.beforeclose != "undefined")
      option.beforeclose(dialog.closeMe);
    else dialog.closeMe();
  };

  dialog.updateSize = function (radius) {
    option.radius = radius;
    dialog.changeHeight(radius);
  };

  dialog.changeHeight = function (radius, firstTime) {
    var deduction = 0;
    $(dialog.body).hide();
    $(dialog.footer).hide();
    if (typeof radius === "object") {
      if ($(dlg).find(".nDlgHeader").length > 0)
        deduction += $(dlg).find(".nDlgHeader").height();
      if ($(dlg).find(".nDlgFooter").length > 0)
        deduction += $(dlg).find(".nDlgFooter").height();
      h = Math.floor(radius[1]);
      w = Math.floor(radius[0]);
    } else if (typeof radius === "string") {
      var size = GetDialogRadious(radius);
      h = size[1];
      w = size[0];
    }
    

       var bodyElement=document.body;
       var htmlElement=document.documentElement;
        var iframes=document.getElementById("fChat");

   
    if ($(window).width() < 990) {
      // bodyElement.style.overflow="hidden";
      // htmlElement.style.overflow="hidden";
      // htmlElement.style.height="100%";
      if(iframes){
          iframes.style.height=$(window).height()+"px";
      }
     
    }
    dlg.style.height = h + "px";
  
    dlg.style.width = w + "px";
    // dlg.style.marginLeft = -Math.floor(w / 2) + 'px';
    // dlg.style.marginTop = -Math.floor(h / 2) + 'px';
    if (typeof firstTime != "undefined") {
      if (typeof option.bottom != "undefined") dlg.style.bottom = option.bottom;
      if (typeof option.top != "undefined") dlg.style.top = option.top;
      if (typeof option.left != "undefined") dlg.style.left = option.left;
      if (typeof option.right != "undefined") dlg.style.right = option.right;
    }
    setTimeout(function () {
      dialog.body.style.height = h - deduction + "px";
      $(dialog.body).show();
      $(dialog.footer).show();
    }, 200);

    //var paddingH = ((w / 100) * 2);
    //var paddingV = ((h / 100) * 2);
    //dialog.body.style.paddingLeft = paddingH + "px";
    //dialog.body.style.paddingRight = paddingH + "px";
    //dialog.body.style.paddingTop = paddingV + "px";
  };

  if (hasMaximize) {
    var buttonMaximize = document.createElement("span");
    buttonMaximize.innerHTML = "<i class='i-link-ext'></i>";
    buttonMaximize.className = "right btn";
    dialog.maximizeMe = function () {
      var isMax =
        buttonMaximize.getAttribute("max") &&
        buttonMaximize.getAttribute("max") == "true"
          ? true
          : false;
      if (isMax == true) {
        dialog.changeHeight(option.radius);
        buttonMaximize.innerHTML = "<i class='i-link-ext'></i>";
        buttonMaximize.setAttribute("max", "false");
      } else {
        dialog.changeHeight([550, 520]);
        buttonMaximize.innerHTML = "<i class='i-resize-small'></i>";
        buttonMaximize.setAttribute("max", "true");
      }
    };
    buttonMaximize.onclick = function () {
      if (typeof option.beforemaximize != "undefined")
        option.beforemaximize(dialog.maximizeMe);
      else dialog.maximizeMe();
    };
  }
  if (typeof option.left != "undefined") dialog.header.appendChild(option.left);
   dialog.header.appendChild(minimize);
  dialog.header.appendChild(maximize);
  dialog.header.appendChild(buttonClose);

  
  if (hasMaximize) dialog.header.appendChild(buttonMaximize);

  dialog.body = document.createElement("div");
  dialog.body.className = "nDlgBody";
  if (typeof option.dbody != "undefined") {
    dialog.body.innerHTML = option.dbody;
  } else if (typeof option.url != "undefined") {
    dialog.body.innerHTML = "<iframe src='" + option.url + "' ></iframe>";
  }
  dialog.footer = document.createElement("div");
  dialog.footer.className = "nDlgFooter";

  if (typeof option.dfooter != "undefined") {
    if (typeof option.dfooter == "string")
      dialog.footer.innerHTML = option.dfooter;
    else if (typeof option.dfooter == "object")
      dialog.footer.appendChild(option.dfooter);
  }
  if (hasHeader) dlg.appendChild(dialog.header);
  dlg.appendChild(dialog.body);
  dlg.appendChild(dialog.footer);
 

  fragMent.appendChild(dlg);

  document.body.appendChild(fragMent);
  dialog.changeHeight(option.radius, true);
  dialog.open = function () {
    dlg.className = dlg.className + " show";
    if (dg == true) modalDg.className = "modal-bg show";
    if (typeof option.opened != "undefined") option.opened();
  };
  dlg.focus();
  //$(dlg).draggable({
  //    handle: '.nDlgHeader',
  //    containment: "body"
  //});
  fragMent = null;
  return dialog;
}
var TLCONF_ALLOWED_DOMAINS = [
  "https://130519web1.saas.talismaonline.com",
  "localhost",
  "https://frontropharma.com/",
];
(function (w) {
  w.addEventListener(
    "message",
    function (event) {
      //Security Check for Domain
      var ads = TLCONF_ALLOWED_DOMAINS,
        i = ads.indexOf(event.origin),
        domain = ads[i] || "";
      if (i > -1 && domain.indexOf(event.origin) === 0) {
        var _d = event.data; //JSONTryParse(event.data);
        if (_d) {
          switch (_d) {
            case "ClosedChat":
            case "close":
              if (curDlg) curDlg.closeMe();
              location.reload();
              break;
            case "ended":
              sessionStorage.setItem("chat", "closed");
              $("#menu").hide();
              break;
          }
        }
      }
    },
    false
  );
  w.PostMesageCBArray = {};
})(window);

function getQuery(key) {
  var temp = location.search.match(new RegExp(key + "=(.*?)($|&)", "i"));
  if (!temp) return "";
  return temp[1];
}
function JSONTryParse(jsonString) {
  try {
    if (jsonString) {
      jsonString = jsonString.replace(/[\n\r\t\b\f\v]/g, "");
      jsonString = jsonString.replace(/[\\]/g, "\\\\");
    }
    return JSON.parse(jsonString);
  } catch (e) {
    return undefined;
  }
}