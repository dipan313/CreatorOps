from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_auth_signup_login():
    signup_res = client.post("/api/auth/signup", json={
        "email": "testuser@creatorops.ai",
        "password": "Password123!",
        "full_name": "Test Creator"
    })
    assert signup_res.status_code in [200, 201]
    assert "access_token" in signup_res.json()

    login_res = client.post("/api/auth/login", json={
        "email": "testuser@creatorops.ai",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

def test_projects_crud():
    create_res = client.post("/api/projects", json={
        "title": "Test Channel Strategy",
        "platform": "YouTube",
        "audience": "Developers",
        "tone": "Informative"
    })
    assert create_res.status_code == 201
    project_id = create_res.json()["id"]

    get_res = client.get(f"/api/projects/{project_id}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Test Channel Strategy"
