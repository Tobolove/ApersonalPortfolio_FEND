console.log("Hello World");


// Title Change
const h1 = document.querySelector("header").firstElementChild;
h1.textContent = "TOBOLOVE";


// About Me Funktion
const loadAboutMe = async () => {
    try {
        const response = await fetch('./data/aboutMeData.json');
        
        if (!response.ok) {
            throw new Error(`Es gab einen Fehler beim Laden der Daten ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        
        const aboutMe = document.querySelector("#aboutMe");
        const p = document.createElement("p");
        p.textContent = data.aboutMe;
        aboutMe.appendChild(p);

        const headshotContainer = document.createElement("div");
        headshotContainer.className = "headshotContainer";
        const headshot = document.createElement("img");
        headshot.src = data.headshot;
        headshot.alt = "Headshot of the author";
        headshotContainer.appendChild(headshot);
        aboutMe.appendChild(headshotContainer);
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
};
loadAboutMe();

// upDate Spotlight Funktion
const updateSpotlight = (project) => {
    const projectSpotlight = document.querySelector("#projectSpotlight");
    const spotlightTitles = document.querySelector("#spotlightTitles");
    
    // Update background image easy missing data handling with placeholder
    const spotlightImage = project.spotlight_image || 'images/spotlight_placeholder_bg.webp';
    projectSpotlight.style.backgroundImage = `url(${spotlightImage})`;
    projectSpotlight.style.backgroundRepeat = "no-repeat";
    projectSpotlight.style.backgroundSize = "100% auto";
    projectSpotlight.style.backgroundPosition = "center";
    
    // Delete all and start new
    spotlightTitles.textContent = '';
    
    // easy missing data handling with placeholder
    const title = document.createElement("h3");
    title.textContent = project.project_name || 'Untitled Project';
    spotlightTitles.appendChild(title);
    
    const description = document.createElement("p");
    description.textContent = project.long_description || project.short_description || 'No description available';
    spotlightTitles.appendChild(description);
    
    if (project.url) {
        const link = document.createElement("a");
        link.href = project.url;
        link.textContent = "View Project";
        link.target = "_blank";
        spotlightTitles.appendChild(link);
    }
};



// upDate Project Funktion
const loadProjects = async () => {
    try {
        const response = await fetch('./data/projectsData.json');
        
        if (!response.ok) {
            throw new Error(`Es gab einen Fehler beim Laden der Daten ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        
        const projectList = document.querySelector("#projectList");
        
        // Create DocumentFragment for DOM manipulation all together
        const fragment = document.createDocumentFragment();

        data.forEach(project => {
            const projectCard = document.createElement("div");
            projectCard.className = "projectCard";
            
            projectCard.id = project.project_id;
            projectCard.style.backgroundImage = `url(${project.card_image || 'images/card_placeholder_bg.webp'})`;

            const h4 = document.createElement("h4");
            h4.textContent = project.project_name || 'Untitled Project';
            projectCard.appendChild(h4);

            const p = document.createElement("p");
            p.textContent = project.short_description || 'No description available';
            projectCard.appendChild(p);

            // Append to fragment
            fragment.appendChild(projectCard);
        });

        // append all cards at once easy single function
        projectList.appendChild(fragment);
        
        // Add spotlight for first project
        updateSpotlight(data[0]);

        projectList.addEventListener('pointerdown', (event) => {
            const projectCard = event.target.closest('.projectCard');
            
            if (projectCard) {
                console.log('Project card clicked:', projectCard.id);
                
                // Find the  project data
                const clickedProject = data.find(project => project.project_id === projectCard.id);
                
                if (clickedProject) {
                    updateSpotlight(clickedProject);
                }
            }
        });
        
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
};
loadProjects();




// Arrow navigation with responsive design
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");

arrowLeft.addEventListener("pointerdown", () => {
    const projectList = document.querySelector("#projectList");
    
    if (window.innerWidth >= 1024) {
        // Desktop: scroll up (arrow rotated 90deg, so left = up)
        projectList.scrollBy({
            top: -300,
            behavior: 'smooth'
        });
    } else {
        // Mobile: scroll left
        projectList.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    }
});

arrowRight.addEventListener("pointerdown", () => {
    const projectList = document.querySelector("#projectList");
    
    if (window.innerWidth >= 1024) {
        // Desktop: scroll down (arrow rotated 90deg, so right = down)
        projectList.scrollBy({
            top: 300,
            behavior: 'smooth'
        });
    } else {
        // Mobile: scroll right
        projectList.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    }
});


// Form validation
const formSection = document.querySelector("#formSection");
const contactEmail = document.querySelector("#contactEmail");
const contactMessage = document.querySelector("#contactMessage");
const emailError = document.querySelector("#emailError");
const messageError = document.querySelector("#messageError");
const charactersLeft = document.querySelector("#charactersLeft");

// Validation functions
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const illegalChars = /[^a-zA-Z0-9@._-]/;
    
    if (!email.trim()) {
        return { valid: false, message: "Email addresse fehlt." };
    }
    if (illegalChars.test(email)) {
        return { valid: false, message: "Email enthält ungültige Zeichen. Nur Buchstaben, Zahlen, @, ., _, und - sind erlaubt." };
    }
    if (!emailRegex.test(email)) {
        return { valid: false, message: "Bitte geben Sie eine gültige E-Mail-Adresse ein (z.B. name@beispiel.com)." };
    }
    return { valid: true, message: "" };
};

const validateMessage = (message) => {
    if (!message.trim()) {
        return { valid: false, message: "Nachricht fehlt." };
    }
    if (message.length > 300) {
        return { valid: false, message: `Nachricht ist zu lang. Maximum 300 Zeichen erlaubt. Aktuell: ${message.length}` };
    }
    return { valid: true, message: "" };
};

// Character counter
contactMessage.addEventListener('input', () => {
    const currentLength = contactMessage.value.length;
    charactersLeft.textContent = `Characters: ${currentLength}/300`;
    
});






// Form submission validation
formSection.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form 
    
    // Validate email
    const emailValidation = validateEmail(contactEmail.value);
    if (!emailValidation.valid) {
        emailError.textContent = emailValidation.message;
        emailError.style.display = 'block';
    } else {
        emailError.textContent = '';
        emailError.style.display = 'none';
    }
    
    // Validate message
    const messageValidation = validateMessage(contactMessage.value);
    if (!messageValidation.valid) {
        messageError.textContent = messageValidation.message;
        messageError.style.display = 'block';
    } else {
        messageError.textContent = '';
        messageError.style.display = 'none';
    }

    // If both validations pass,  form OK
    if (emailValidation.valid && messageValidation.valid) {
        console.log('Email:', contactEmail.value);
        console.log('Message:', contactMessage.value);
        
        // Here normally submit to a server
        alert('Message erfolgreich gesendet!');
        
        
    }
});

// ADD RESET BUTTON  :)))
const resetButton = document.createElement("button");
resetButton.type = "button"; 
resetButton.textContent = "Reset";
resetButton.addEventListener("click", () => {
    contactEmail.value = '';
    contactMessage.value = '';
    charactersLeft.textContent = 'Characters: 0/300';
    
    messageError.textContent = '';
    messageError.style.display = 'none';
});

// Add reset button as sibling to submit button
const submitButton = document.querySelector("#formsubmit");
submitButton.insertAdjacentElement('afterend', resetButton);

