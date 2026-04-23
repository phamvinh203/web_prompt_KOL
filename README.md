# KOL Prompt Generator

Ứng dụng tạo prompt cho KOL (Key Opinion Leader) sử dụng AI.

## Tính năng

- Tạo prompt hình ảnh từ Google Gemini AI
- Tạo prompt video từ text và video samples
- Lưu lịch sử các prompt đã tạo
- Upload và xử lý video samples

## Cài đặt

### Yêu cầu

- Node.js (v18 trở lên)
- MongoDB (cục bộ hoặc Atlas cloud)
- npm hoặc yarn

### Cài đặt dependencies

```bash
# Clone repository
git clone https://github.com/phamvinh203/web_prompt_KOL.git
cd web_prompt_KOL

# Cài đặt server
cd server
npm install

# Cài đặt client
cd ../client
npm install
```

### Cấu hình môi trường

1. Copy file `.env.example` thành `.env` trong thư mục `server/`:

```bash
cd server
cp .env.example .env
```

2. Cập nhật các biến môi trường trong file `.env`:

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/kol_prompts
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

### Chạy ứng dụng

1. Khởi động MongoDB (nếu dùng local):

```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

2. Khởi động server:

```bash
cd server
npm start
```

3. Khởi động client (mở terminal mới):

```bash
cd client
npm run dev
```

4. Mở browser tại `http://localhost:5173`

## Cấu trúc dự án

```
kol-prompt-generator/
├── client/              # React frontend
│   ├── public/
│   ├── src/
│   └── package.json
├── server/             # Express backend
│   ├── db/            # Database connection
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   └── package.json
├── .gitignore
├── LICENSE
└── README.md
```

## API Endpoints

- `POST /api/image-prompt` - Tạo prompt hình ảnh
- `POST /api/video-prompt` - Tạo prompt video
- `GET /api/history` - Lấy lịch sử prompt
- `DELETE /api/history/:id` - Xóa prompt

## License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## Tác giả

Created by Pham Vinh