const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span")
const chatbox = document.querySelector(".chatbox")
const chatbotToggler=document.querySelector(".chatbot-toggler")
const chatBotcloseBtn=document.querySelector(".close-btn")

let userMessage;
const API_KEY = "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";
const inputInitHeight= chatInput.scrollHeight;

const  createChatLi = (message, className) =>{

    // Create a chat <li> element with passed message and className
    const chatLi= document.createElement("li");
    chatLi.classList.add("chat" ,className);
    let chatContent = className === "outgoing" ? ` <p></p>` :   `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent=message;
    return chatLi;
}

const generateResponse =( incomingChatLi) =>{
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement =  incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "applications/json",
            "Authorization": `Bearer ${API_KEY}`
        }, 
        body: JSON.stringify({
            model:"gpt-3.5-turbo",
        messages:[{ role: "user",content: userMessage}]
        })
        
    }

    // send POST request to API ,get response
    fetch(API_URL,requestOptions).then(res =>res.json()).then(data =>{
        messageElement.textcontent = data.choices[0].message.content;
    }).catch((error)=>{
        messageElement.classList.add = ("error");
        messageElement.textContent = "How are u.... ";
    }).finally(()=>chatbox.scrollTo(0,chatbox.scrollHeight));
}


const  handleChat = () =>{
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value=""
    chatInput.style.height=`${ inputInitHeight}px`;

   //Append the user's mesage to the chatbox

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);

    setTimeout(()=>{

        //Display "Thinking..." message while waiting for the response
        const incomingChatLi=createChatLi("Thinking...", "incoming")
        chatbox.appendChild( incomingChatLi);
        generateResponse( incomingChatLi);
    },600);
}

chatInput.addEventListener('input',(e)=>{
    chatInput.style.height=`${ inputInitHeight}px`;
    chatInput.style.height=`${ chatInput.scrollHeight}px`;


});



chatInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter" && !e.shiftkey && window.innerWidth >800){
        e.preventDefault();
        handleChat();
    }
   

});
sendChatBtn.addEventListener("click", handleChat);
chatBotcloseBtn.addEventListener("click",()=>document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"));