const postHolder = document.getElementById("post-holder");
const addPostButton = document.getElementById("add-post-button");
const postContainer = document.getElementById("post-container")
const buttonContainer = document.getElementById("btn-container")
const formContainer = document.getElementById("post-form")
// INPUTS
const author = document.getElementById("author");
const postTitle = document.getElementById("postTitle");
const translatedTitle = document.getElementById("translatedTitle");
const originalDate = document.getElementById("originalDate");
const translator = document.getElementById("translator");

const category = document.getElementById("category");
const translation = document.getElementById("translation");


// Sending new posts
addPostButton.addEventListener("click", addPost)

function addPost(event) {
    event.preventDefault();
    let newPostObject = {
        author: author.value,
        postTitle: postTitle.value,
        translatedTitle: translatedTitle.value,
        originalDate: originalDate.value,
        translator: translator.value,
        category: category.value,
        translation: translation.value,
        isPublished: "nem"
    }
    fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(newPostObject)
    })
        .then(res => res.json())
        .then(json => {
            resetInput();
            ;
        })
}

// Reseting post form
function resetInput(e) {
    author.value = "";
    postTitle.value = "";
    translatedTitle.value = "";
    originalDate.value = "";
    translator.value = "";
    category.value = "";
    translation.value = "";
    isPublished.value = "";

}

let memberContainer = document.getElementById("member-container")
const baseUrl = "http://localhost:3000/posts";

//Loading existing members
function loadMembersInfo() {
    fetch(baseUrl)
        .then(res => res.json())
        .then(json => {
            json.forEach(element => {
                if(element.isPublished === "igen"){
                memberContainer.appendChild(generateMemberElement(element));
            }
            });
        })
}
//Member Element
function generateMemberElement(object) {
    let imgUrl = "";
    let altText = "";

    switch (object.category) {
        case "vers":
            imgUrl = "../img/poem.webp"
            altText = "vers"
            break;

        case "novella":
            imgUrl = "../img/novel.webp"
            altText = "novella"
            break;

        case "dalszöveg":
            imgUrl = "../img/lyrics.jpeg"
            altText = "dalszöveg"
            break;

        default:
            imgUrl = "../img/poem.webp"
            altText = "default"
            break;
    }

    let postElement = document.createElement("div");
    postElement.id = `post-${object.id}`;
    postElement.classList = "post-element";

    postElement.innerHTML =
        `
        <a href="${baseUrl}/${object.id}" target="_blank">
        <div class="row mt-4 card-holder">
            <div class="col-4">
                 <img src="${imgUrl}" alt="${altText}" class="img-fluid">
             </div>
            <div class="col-8 member-desc">
                 <h3 class="member-name">Eredeti Cím: ${object.postTitle}</h3>
                 <h4 class="member-name">Szerző: ${object.author}</h4>
                 
                 <h5 class="date">Megjelenés dátuma: ${object.originalDate}</h5>
                 <br>
                 <br>
                 <br>
                 <h4 class="member-name">${object.translatedTitle}</h4>
                 <br>
                 <span class="member-desc">
                      ${object.translation}
                 </span>
                <br>
                <br>
                <h6 class="member-name">Fordító neve: ${object.translator}</h6>
                
            </div>
        </div>
        </a>
        `
    return postElement;

}
loadMembersInfo()