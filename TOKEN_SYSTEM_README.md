# Access Token ve Refresh Token Sistemi

Bu proje, NextAuth.js kullanarak kapsamlı bir access token ve refresh token sistemi içerir.

## 🚀 Özellikler

- **Access Token**: Kısa süreli (1 saat) kimlik doğrulama tokeni
- **Refresh Token**: Uzun süreli (30 gün) yenileme tokeni
- **Otomatik Token Yenileme**: Access token süresi dolduğunda otomatik yenileme
- **Token Doğrulama**: API endpoint'leri için token doğrulama
- **Token İptal**: Kullanıcı oturumlarını güvenli şekilde sonlandırma
- **Middleware Desteği**: Korumalı route'lar için middleware

## 📁 Dosya Yapısı

```
├── auth.ts                          # Ana NextAuth konfigürasyonu
├── src/
│   ├── lib/
│   │   ├── tokenUtils.ts           # Token yardımcı fonksiyonları
│   │   └── useTokens.ts            # React hook'u
│   ├── middleware/
│   │   └── tokenMiddleware.ts      # Token doğrulama middleware'i
│   ├── app/api/auth/
│   │   ├── refresh/route.ts        # Token yenileme API'si
│   │   ├── validate/route.ts       # Token doğrulama API'si
│   │   └── revoke/route.ts         # Token iptal API'si
│   ├── app/api/protected/
│   │   └── route.ts                # Örnek korumalı API
│   └── components/
│       └── TokenManager.tsx        # Token yönetimi UI'ı
```

## 🔧 Kurulum

### 1. Gerekli Paketler

Projenizde aşağıdaki paketlerin yüklü olduğundan emin olun:

```bash
npm install next-auth @auth/prisma-adapter @prisma/client
```

### 2. Veritabanı Şeması

Prisma şemanızda `Session` modelinde aşağıdaki alanların bulunduğundan emin olun:

```prisma
model Session {
  sessionToken String   @unique @id
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken  String?  // Access token alanı
  refreshToken String?  // Refresh token alanı
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### 3. Environment Variables

`.env` dosyanızda aşağıdaki değişkenleri tanımlayın:

```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=your-database-url
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🛠️ Kullanım

### 1. Token Yönetimi Hook'u

React bileşenlerinizde token yönetimi için `useTokens` hook'unu kullanın:

```tsx
import { useTokens } from "../lib/useTokens";

function MyComponent() {
  const {
    accessToken,
    refreshToken,
    validateToken,
    refreshTokens,
    revokeTokens,
    getAccessToken,
  } = useTokens();

  const handleApiCall = async () => {
    const token = await getAccessToken();
    if (token) {
      const response = await fetch("/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // API çağrısı işlemleri
    }
  };

  return (
    <div>
      <button onClick={handleApiCall}>API Çağrısı</button>
      <button onClick={refreshTokens}>Token Yenile</button>
      <button onClick={revokeTokens}>Token İptal Et</button>
    </div>
  );
}
```

### 2. Korumalı API Route'ları

Korumalı API endpoint'leri oluşturmak için middleware kullanın:

```tsx
import { NextRequest, NextResponse } from "next/server";
import {
  tokenMiddleware,
  getUserIdFromRequest,
} from "../../../middleware/tokenMiddleware";

export async function GET(request: NextRequest) {
  // Token doğrulama middleware'i uygula
  const middlewareResponse = await tokenMiddleware(request);

  if (middlewareResponse.status !== 200) {
    return middlewareResponse;
  }

  // Kullanıcı ID'sini middleware'den al
  const userId = getUserIdFromRequest(request);

  return NextResponse.json({
    message: "Bu korumalı bir endpoint",
    userId: userId,
  });
}
```

### 3. Token Doğrulama

API çağrılarında token doğrulama:

```tsx
const validateToken = async (token: string) => {
  const response = await fetch("/api/auth/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ accessToken: token }),
  });

  return response.json();
};
```

### 4. Token Yenileme

Access token süresi dolduğunda yenileme:

```tsx
const refreshTokens = async (refreshToken: string) => {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  return response.json();
};
```

## 🔐 Güvenlik Özellikleri

### 1. Token Güvenliği

- Access token'lar kısa süreli (1 saat)
- Refresh token'lar uzun süreli (30 gün)
- Token'lar veritabanında güvenli şekilde saklanır
- Otomatik token yenileme

### 2. Oturum Yönetimi

- Kullanıcı oturumları veritabanında takip edilir
- Token iptal etme özelliği
- Çoklu oturum desteği

### 3. API Güvenliği

- Bearer token doğrulama
- Middleware ile otomatik koruma
- Kullanıcı ID'si request header'larına eklenir

## 📊 API Endpoint'leri

### Token Yenileme

```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Token Doğrulama

```
POST /api/auth/validate
Content-Type: application/json

{
  "accessToken": "your-access-token"
}
```

### Token İptal

```
POST /api/auth/revoke
Authorization: Bearer your-access-token
```

### Korumalı Endpoint Örneği

```
GET /api/protected
Authorization: Bearer your-access-token
```

## 🧪 Test Etme

Token sistemini test etmek için `TokenManager` bileşenini kullanabilirsiniz:

```tsx
import TokenManager from "../components/TokenManager";

export default function TestPage() {
  return (
    <div>
      <h1>Token Sistemi Test</h1>
      <TokenManager />
    </div>
  );
}
```

## 🔄 Token Yaşam Döngüsü

1. **Giriş**: Kullanıcı giriş yaptığında access ve refresh token oluşturulur
2. **API Çağrısı**: Access token ile API çağrıları yapılır
3. **Token Yenileme**: Access token süresi dolduğunda refresh token ile yenilenir
4. **Çıkış**: Kullanıcı çıkış yaptığında token'lar iptal edilir

## ⚠️ Önemli Notlar

- Access token'lar kısa süreli tutulmalıdır (1 saat)
- Refresh token'lar güvenli şekilde saklanmalıdır
- Token'lar HTTPS üzerinden iletilmelidir
- Düzenli olarak token'ları yenileyin
- Kullanıcı çıkış yaptığında token'ları iptal edin

## 🐛 Sorun Giderme

### Token Yenileme Hatası

- Refresh token'ın geçerli olduğundan emin olun
- Veritabanı bağlantısını kontrol edin
- Session'ın aktif olduğunu doğrulayın

### API Erişim Hatası

- Authorization header'ının doğru formatta olduğunu kontrol edin
- Token'ın geçerli olduğunu doğrulayın
- Middleware'in doğru çalıştığından emin olun

Bu sistem, modern web uygulamaları için güvenli ve ölçeklenebilir bir token tabanlı kimlik doğrulama çözümü sağlar.
