// Consts
// Pending
const postHolder = document.getElementById("post-holder");
const addPostButton = document.getElementById("add-post-button");
const baseUrl = "http://localhost:3000/posts";
const postContainer = document.getElementById("post-container")
const buttonContainer = document.getElementById("btn-container")
const formContainer = document.getElementById("post-form")

// Consts
// Published
const published = document.getElementById("published")
const publishedContainer = document.getElementById("published-container")

//Inputs
const author = document.getElementById("author");
const postTitle = document.getElementById("postTitle");
const translatedTitle = document.getElementById("translatedTitle");
const originalDate = document.getElementById("originalDate");
const translator = document.getElementById("translator");

const category = document.getElementById("category");
const translation = document.getElementById("translation");
const isPublished = document.getElementById("isPublished");

//////////////////////////////////////////
//PENDING PART

//Loading existing posts
function loadPosts() {
    fetch(baseUrl)
        .then(res => res.json())
        .then(json => {
            json.forEach(element => {
                if(element.isPublished === "nem"){
                postContainer.appendChild(generatePostElement(element));
            }
            });
        })
}
//Post Element
function generatePostElement(object) {
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
        <div class="row mt-4 card-holder">
            <div class="col-4">
                 <img src="${imgUrl}" alt="${altText}" class="img-fluid">
             </div>
            <div class="col-8 member-desc">
                 <h3 class="member-name"><b>Eredeti Cím:</b> ${object.postTitle}</h3>
                 <h3 class="member-name"><b>Szerző: </b>${object.author}</h3>
                 <h4 class="member-name"><b>Fordított Cím: </b>${object.translatedTitle}</h4>
                 <h5 class="member-name"><b>Megjelenés dátuma: </b>${object.originalDate}</h5>
                 <h6 class="member-name"><b>Fordította: </b>${object.translator}</h6>
                 <span class="member-desc">
                      ${object.translation}
                 </span>
                <br>
                <div class="button-holder">
                    <button class="btn btn-primary" idToEdit="${object.id}">Szerkesztés</button>
                    <button class="btn btn-danger" idToDelete="${object.id}">Törlés</button>
                </div>
            </div>
        </div>
        `
    return postElement;
}


// Adding new posts
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
        isPublished: isPublished.value
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
            postContainer.appendChild(generatePostElement(json));
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

// Editing or deleting posts main function
postContainer.addEventListener("click", editOrDelete);

function editOrDelete(e) {
    e.preventDefault();
    if (e.target.hasAttribute("idToDelete")) {
        confirm("Biztosan eltávolítod ezt a művet?")
            ? deletePost(e.target.getAttribute("idToDelete")) : "";
    } else if (e.target.hasAttribute("idToEdit")) {
        prepareEditPost(e.target.getAttribute("idToEdit"))
    }
}

//Deleting Post
function deletePost(id) {
    let deleteUrl = `${baseUrl}/${id}`;
    fetch(deleteUrl, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(res => console.log("Post " + id + "deleted!"))
        .then(res => {
            document.getElementById(`post-${id}`).remove();
        })
}
// Preparing for editing
function prepareEditPost(id) {
    window.scrollTo(0, 0);
    buttonContainer.innerHTML =
        `
    <button id="edit-btn" class="btn btn-success" id-to-edit="${id}">Mentés</button>
    <button id="reset-btn" class="btn btn-secondary">Mégse</button>
    `;

    let editBtn = document.getElementById("edit-btn");
    let resetBtn = document.getElementById("reset-btn")

    editBtn.addEventListener("click", editPost);
    resetBtn.addEventListener("click", resetInput);

    let postUrl = `${baseUrl}/${id}`;

    fetch(postUrl)
        .then(res => res.json())
        .then(json => {
                author.value = json.author,
                postTitle.value = json.postTitle,
                translatedTitle.value = json.translatedTitle,
                originalDate.value = json.originalDate,
                translator.value = json.translator,
                category.value = json.category,
                translation.value = json.translation,
                isPublished.value = json.isPublished
        })

}

//actual editing of posts

function editPost(e) {
    e.preventDefault();

    let editPostObject = {
        author: author.value,
        postTitle: postTitle.value,
        translatedTitle: translatedTitle.value,
        originalDate: originalDate.value,
        translator: translator.value,
        category: category.value,
        translation: translation.value,
        isPublished: isPublished.value
    }

    let id = e.target.getAttribute("id-to-edit");
    let editUrl = `${baseUrl}/${id}`

    fetch(editUrl, {
        method: "PUT",
        headers: {
            "Content-type": "application/json"

        },
        body: JSON.stringify(editPostObject)
    })
        .then(res => res.json())
        .then(json => {
            resetInput();
            let htmlElementToEdit = document.getElementById(`post-${id}`)
            htmlElementToEdit.parentNode.replaceChild(generatePostElement(json), htmlElementToEdit)
        });
}

//Start
loadPosts();




//////////////////////////////////////////
//PUBLISHED PART

//Loading published
function loadPublishedPosts() {
    fetch(baseUrl)
        .then(res => res.json())
        .then(json => {
            json.forEach(element => {
                if(element.isPublished === "igen"){
                publishedContainer.appendChild(generatePublishedElement(element));
                
            }
            });
        })
}
//Published Element
function generatePublishedElement(object) {
   
   
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
        <div class="row mt-4 card-holder">
        
            <div class="col-12 member-desc">
                <h3 class="member-name"><b>Eredeti Cím:</b> ${object.postTitle}</h3>
                <h3 class="member-name"><b>Szerző: </b>${object.author}</h3>
                <h4 class="member-name"><b>Fordított Cím: </b>${object.translatedTitle}</h4>
                <h5 class="member-name"><b>Megjelenés dátuma: </b>${object.originalDate}</h5>
                <h6 class="member-name"><b>Fordította: </b>${object.translator}</h6>
                 <span class="member-desc">
                     ${object.translation}
                </span>
                    <br>
                <div class="button-holder">
                    
                    <button class="btn btn-danger" id="backToPend" idToPending="${object.id}">Törlés</button>
                </div>
            </div>
        </div>
        `
        // let backToPendingBtn = document.getElementById("backToPending")
        // console.log(backToPendingBtn)
        

        return postElement;
    }
    
// Editing or deleting posts main function
publishedContainer.addEventListener("click", backToPending);

function backToPending(e) {
    e.preventDefault();
    if (e.target.hasAttribute("idToPending")) {
        confirm("Biztosan visszaállítod a posztot?")
            ? deletePost(e.target.getAttribute("idToPending")) : "";
    } 
}




loadPublishedPosts()








//////////////////////////////////////////
//Toggler functions for page views
function appear() {
    postHolder.classList.toggle("appear")
    published.classList.add("appear")
}


function publishedAppear() {
    published.classList.toggle("appear")
    postHolder.classList.add("appear")
}