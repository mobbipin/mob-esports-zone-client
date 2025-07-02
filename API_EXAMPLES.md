# MOB ESPORTS API - Complete JSON Examples

## Authentication Endpoints

### 1. Register Admin
```bash
POST /auth/register
Content-Type: application/json
```

**Request:**
```json
{
  "email": "admin@mobesports.com",
  "password": "securepassword123",
  "role": "admin",
  "username": "admin",
  "displayName": "Admin User",
  "adminCode": "MOB_ADMIN_2024"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Registered successfully"
}
```

### 2. Register Player
```bash
POST /auth/register
Content-Type: application/json
```

**Request:**
```json
{
  "email": "player@example.com",
  "password": "password123",
  "role": "player",
  "username": "player1",
  "displayName": "Player One"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Registered successfully"
}
```

### 3. Login
```bash
POST /auth/login
Content-Type: application/json
```

**Request:**
```json
{
  "email": "admin@mobesports.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id_here",
      "role": "admin",
      "email": "admin@mobesports.com",
      "username": "admin",
      "displayName": "Admin User"
    }
  }
}
```

### 4. Get Current User Profile
```bash
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "user_id_here",
    "email": "admin@mobesports.com",
    "role": "admin",
    "username": "admin",
    "displayName": "Admin User",
    "playerProfile": null
  }
}
```

## Player Endpoints

### 5. Get Player Profile
```bash
GET /players/:id
```

**Response:**
```json
{
  "status": true,
  "data": {
    "userId": "user_id_here",
    "bio": "Professional esports player",
    "region": "North America",
    "gameId": "player123",
    "rank": "Diamond",
    "winRate": 0.75,
    "kills": 1500,
    "social": {
      "twitch": "https://twitch.tv/player123",
      "discord": "player123#1234"
    },
    "achievements": ["Tournament Winner", "MVP Season 1"]
  }
}
```

### 6. Update Player Profile
```bash
PUT /players/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "bio": "Updated bio",
  "region": "Europe",
  "gameId": "newgameid",
  "rank": "Master",
  "winRate": 0.80,
  "kills": 2000,
  "social": {
    "twitch": "https://twitch.tv/newplayer",
    "discord": "newplayer#5678"
  },
  "achievements": ["Tournament Winner", "MVP Season 1", "New Achievement"]
}
```

**Response:**
```json
{
  "status": true,
  "message": "Profile updated"
}
```

### 7. List Players
```bash
GET /players?page=1&limit=10&search=player
```

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "userId": "user1",
      "bio": "Professional player",
      "region": "NA",
      "gameId": "player1",
      "rank": "Diamond",
      "winRate": 0.75,
      "kills": 1500,
      "social": {
        "twitch": "https://twitch.tv/player1",
        "discord": "player1#1234"
      },
      "achievements": ["Winner"]
    }
  ]
}
```

## Team Endpoints

### 8. Create Team
```bash
POST /teams
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Team Alpha",
  "tag": "ALPHA",
  "bio": "Professional esports team",
  "logoUrl": "https://example.com/logo.png",
  "region": "North America"
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "team_id_here"
  },
  "message": "Team created"
}
```

### 9. Get Team Details
```bash
GET /teams/:id
```

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "team_id_here",
    "name": "Team Alpha",
    "tag": "ALPHA",
    "bio": "Professional esports team",
    "logoUrl": "https://example.com/logo.png",
    "region": "North America",
    "ownerId": "user_id_here",
    "matchesPlayed": 10,
    "wins": 8,
    "members": [
      {
        "userId": "user1",
        "teamId": "team_id_here",
        "role": "owner"
      },
      {
        "userId": "user2",
        "teamId": "team_id_here",
        "role": "member"
      }
    ]
  }
}
```

### 10. Update Team
```bash
PUT /teams/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Team Alpha Elite",
  "bio": "Updated team description",
  "region": "Europe"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Team updated"
}
```

### 11. Delete Team
```bash
DELETE /teams/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": true,
  "message": "Team deleted"
}
```

### 12. Invite Player to Team
```bash
POST /teams/:id/invite
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "userEmail": "player@example.com"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Player invited (stub)"
}
```

## Tournament Endpoints

### 13. Create Tournament (Admin Only)
```bash
POST /tournaments
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "MOB Championship 2024",
  "description": "Annual championship tournament",
  "game": "Mobile Legends",
  "startDate": "2024-12-01T10:00:00Z",
  "endDate": "2024-12-15T18:00:00Z",
  "maxTeams": 16,
  "prizePool": 10000,
  "entryFee": 100,
  "rules": "Standard tournament rules apply"
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "tournament_id_here"
  },
  "message": "Tournament created"
}
```

### 14. Get Tournament Details
```bash
GET /tournaments/:id
```

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "tournament_id_here",
    "name": "MOB Championship 2024",
    "description": "Annual championship tournament",
    "game": "Mobile Legends",
    "startDate": "2024-12-01T10:00:00Z",
    "endDate": "2024-12-15T18:00:00Z",
    "maxTeams": 16,
    "prizePool": 10000,
    "entryFee": 100,
    "rules": "Standard tournament rules apply",
    "status": "upcoming",
    "createdBy": "admin_user_id",
    "createdAt": "2024-01-01T00:00:00Z",
    "teams": [
      {
        "tournamentId": "tournament_id_here",
        "teamId": "team1",
        "registeredAt": "2024-01-01T00:00:00Z"
      }
    ],
    "matches": [
      {
        "id": "match1",
        "tournamentId": "tournament_id_here",
        "team1Id": "team1",
        "team2Id": "team2",
        "round": 1,
        "matchNumber": 1,
        "winnerId": null,
        "score1": null,
        "score2": null,
        "status": "pending"
      }
    ]
  }
}
```

### 15. List Tournaments
```bash
GET /tournaments?status=upcoming&page=1&limit=10
```

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": "tournament1",
      "name": "MOB Championship 2024",
      "description": "Annual championship",
      "game": "Mobile Legends",
      "startDate": "2024-12-01T10:00:00Z",
      "endDate": "2024-12-15T18:00:00Z",
      "maxTeams": 16,
      "prizePool": 10000,
      "entryFee": 100,
      "rules": "Standard rules",
      "status": "upcoming",
      "createdBy": "admin_user_id",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 16. Update Tournament (Admin Only)
```bash
PUT /tournaments/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "MOB Championship 2024 - Updated",
  "prizePool": 15000,
  "status": "registration"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Tournament updated"
}
```

### 17. Delete Tournament (Admin Only)
```bash
DELETE /tournaments/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": true,
  "message": "Tournament deleted"
}
```

### 18. Register Team for Tournament
```bash
POST /tournaments/:id/register
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "teamId": "team_id_here"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Team registered"
}
```

### 19. Create Tournament Bracket (Admin Only)
```bash
POST /tournaments/:id/bracket
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": true,
  "message": "Bracket created"
}
```

### 20. Update Match Result (Admin Only)
```bash
PUT /tournaments/:id/matches/:matchId
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "winnerId": "team1",
  "score1": 2,
  "score2": 1,
  "status": "completed"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Match updated"
}
```

## Post Endpoints

### 21. Create Post (Admin Only)
```bash
POST /posts
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "New Tournament Announcement",
  "content": "We are excited to announce our new tournament!",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "post_id_here"
  },
  "message": "Post created"
}
```

### 22. Get Post Details
```bash
GET /posts/:id
```

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "post_id_here",
    "title": "New Tournament Announcement",
    "content": "We are excited to announce our new tournament!",
    "imageUrl": "https://example.com/image.jpg",
    "createdBy": "admin_user_id",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 23. List Posts
```bash
GET /posts?limit=3&admin=true&page=1
```

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": "post1",
      "title": "New Tournament Announcement",
      "content": "We are excited to announce our new tournament!",
      "imageUrl": "https://example.com/image.jpg",
      "createdBy": "admin_user_id",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 24. Update Post (Admin Only)
```bash
PUT /posts/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Updated Tournament Announcement",
  "content": "Updated content here"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Post updated"
}
```

### 25. Delete Post (Admin Only)
```bash
DELETE /posts/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": true,
  "message": "Post deleted"
}
```

## File Upload Endpoints

### 26. Upload File
```bash
POST /upload/file
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "fileName": "document.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "upload_id_here",
    "fileUrl": "https://r2.example.com/upload_id_here/document.pdf"
  },
  "message": "File uploaded"
}
```

### 27. Get Upload Details
```bash
GET /upload/:id
```

**Response:**
```json
{
  "status": true,
  "data": {
    "id": "upload_id_here",
    "fileName": "document.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "fileUrl": "https://r2.example.com/upload_id_here/document.pdf",
    "uploadedBy": "user_id_here",
    "uploadDate": "2024-01-01T00:00:00Z"
  }
}
```

### 28. List Uploads
```bash
GET /upload?page=1&limit=10
```

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": "upload1",
      "fileName": "document.pdf",
      "fileType": "application/pdf",
      "fileSize": 1024000,
      "fileUrl": "https://r2.example.com/upload1/document.pdf",
      "uploadedBy": "user_id_here",
      "uploadDate": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 29. Delete Upload
```bash
DELETE /upload/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": true,
  "message": "Upload deleted"
}
```

### 30. Upload Avatar
```bash
POST /upload/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` or `avatar`: Image file

**Response:**
```json
{
  "status": true,
  "data": {
    "url": "https://r2.example.com/avatars/1234567890_avatar.jpg"
  }
}
```

### 31. Upload Team Logo
```bash
POST /upload/team-logo
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` or `logo`: Image file

**Response:**
```json
{
  "status": true,
  "data": {
    "url": "https://r2.example.com/team-logos/1234567890_logo.png"
  }
}
```

### 32. Upload Tournament Banner
```bash
POST /upload/tournament-banner
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` or `banner`: Image file

**Response:**
```json
{
  "status": true,
  "data": {
    "url": "https://r2.example.com/tournament-banners/1234567890_banner.jpg"
  }
}
```

## Error Response Examples

### Validation Error
```json
{
  "status": false,
  "error": {
    "fieldErrors": {
      "email": ["Invalid email format"],
      "password": ["Password must be at least 6 characters"]
    }
  }
}
```

### Authentication Error
```json
{
  "status": false,
  "error": "Invalid credentials"
}
```

### Not Found Error
```json
{
  "status": false,
  "error": "Tournament not found"
}
```

### Unauthorized Error
```json
{
  "status": false,
  "error": "Unauthorized"
}
```

## Authentication Headers

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Base URL

- **Local Development**: `http://127.0.0.1:8787`
- **Production**: `https://esportszone.mobbysc.com/`

## Notes

- All responses include a `status` field (true for success, false for errors)
- Successful responses may include `data` and/or `message` fields
- Error responses include an `error` field with details
- Admin-only endpoints require the user to have `role: "admin"`
- File uploads use multipart/form-data for actual files
- Pagination is available for list endpoints with `page` and `limit` parameters 