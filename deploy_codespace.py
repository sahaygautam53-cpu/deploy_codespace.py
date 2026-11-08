import os
import base64
import requests

# --- CONFIGURATION ---
GITHUB_TOKEN = "your_github_personal_access_token_here"
REPO_OWNER = "your_github_username"
REPO_NAME = "codespace"  # Your repository name
BRANCH = "main"

# Files to push
FILES_TO_UPLOAD = ["index.html", "style.css", "script.js"]

headers = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2026-03-10"
}

def upload_file_to_github(file_path):
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{file_path}"
    
    # Read local file content
    if not os.path.exists(file_path):
        print(f"⚠️ Error: Local file '{file_path}' not found!")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Base64 encode the file content required by GitHub API
    encoded_content = base64.b64encode(content.encode("utf-8")).decode("utf-8")

    # Check if file already exists to get its SHA (needed for updating)
    get_res = requests.get(url, headers=headers)
    sha = None
    if get_res.status_code == 200:
        sha = get_res.json().get("sha")

    payload = {
        "message": f"Auto-deploy CodeSpace: update {file_path}",
        "content": encoded_content,
        "branch": BRANCH
    }
    if sha:
        payload["sha"] = sha

    # Send PUT request to create/update file
    put_res = requests.put(url, headers=headers, json=payload)
    
    if put_res.status_code in [200, 201]:
        print(f"✅ Success: {file_path} uploaded to GitHub!")
    else:
        print(f"❌ Failed to upload {file_path}: {put_res.json().get('message')}")

if __name__ == "__main__":
    print(f"🚀 Starting CodeSpace deployment to {REPO_OWNER}/{REPO_NAME}...")
    for filename in FILES_TO_UPLOAD:
        upload_file_to_github(filename)
    print("✨ Deployment complete! Head over to your GitHub repository settings to enable GitHub Pages.")
  
