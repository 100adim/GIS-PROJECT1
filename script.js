const GITHUB_USERNAME = "100adim";
const REPO_NAME = "GIS-PROJECT1";
const FILE_PATH = "users.json";
const GITHUB_TOKEN = typeof CONFIG !== "undefined" ? CONFIG.GITHUB_TOKEN : "";

async function fetchUsers() {
    const apiUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${FILE_PATH}`;

    try {
        const response = await fetch(apiUrl);
        const users = await response.json();

        const userList = document.getElementById("userList");
        if (userList) {
            userList.innerHTML = "";
            users.forEach(user => {
                let li = document.createElement("li");
                li.textContent = user.username;
                userList.appendChild(li);
            });
        }
    } catch (error) {
        console.error("שגיאה בטעינת המשתמשים:", error);
    }
}

async function registerUser() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    
    if (!username || !password) {
        alert("נא למלא את כל השדות");
        return;
    }

    const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`;
    
    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json"
            }
        });
        
        const data = await response.json();
        const users = JSON.parse(atob(data.content));
        users.push({ username, password });

        const updatedContent = btoa(JSON.stringify(users, null, 2));
        
        await fetch(apiUrl, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json"
            },
            body: JSON.stringify({
                message: "Update users.json",
                content: updatedContent,
                sha: data.sha
            })
        });
        
        alert("נרשמת בהצלחה!");
        closeModal('signup-modal');
    } catch (error) {
        console.error("שגיאה בהרשמה:", error);
    }
}

async function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const apiUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${FILE_PATH}`;

    try {
        const response = await fetch(apiUrl);
        const users = await response.json();
        
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            alert("התחברת בהצלחה!");
            window.location.href = "showLocations.html";
        } else {
            alert("שם משתמש או סיסמה שגויים");
        }
    } catch (error) {
        console.error("שגיאה בהתחברות:", error);
    }
}
