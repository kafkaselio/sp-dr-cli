// ─────────────────────────────────────────────
//  SP//DR BUILD SYSTEM — Template Definitions
// ─────────────────────────────────────────────

import { BuildConfig, GeneratedFile } from './types.js';
import ejs from 'ejs';

// ── EJS render helper
function render(template: string, data: object): string {
  return ejs.render(template, data, { openDelimiter: '{', closeDelimiter: '}' });
}

// Use standard EJS delimiters
function ejsRender(template: string, data: object): string {
  return ejs.render(template, data);
}

// ─────────────────────────────────────────────
// NEXT.JS APP ROUTER TEMPLATE SET
// ─────────────────────────────────────────────

function nextjsFiles(config: BuildConfig): GeneratedFile[] {
  const { projectName, database, auth } = config;
  const dbDep = database === 'postgresql' ? '"pg": "^8.11.0", "drizzle-orm": "^0.29.0"' : '';
  const authDep = auth === 'jwt' ? '"jsonwebtoken": "^9.0.2", "@types/jsonwebtoken": "^9.0.5"' : '';

  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      next: '14.1.0',
      react: '^18',
      'react-dom': '^18',
    },
    devDependencies: {
      typescript: '^5',
      '@types/node': '^20',
      '@types/react': '^18',
      '@types/react-dom': '^18',
      eslint: '^8',
      'eslint-config-next': '14.1.0',
    },
  };

  if (database === 'postgresql') {
    (packageJson.dependencies as Record<string, string>)['pg'] = '^8.11.0';
    (packageJson.dependencies as Record<string, string>)['drizzle-orm'] = '^0.29.0';
  }

  if (auth === 'jwt') {
    (packageJson.dependencies as Record<string, string>)['jsonwebtoken'] = '^9.0.2';
    (packageJson.devDependencies as Record<string, string>)['@types/jsonwebtoken'] = '^9.0.5';
  }

  return [
    {
      path: 'package.json',
      content: JSON.stringify(packageJson, null, 2),
    },
    {
      path: 'tsconfig.json',
      content: JSON.stringify(
        {
          compilerOptions: {
            lib: ['dom', 'dom.iterable', 'esnext'],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            noEmit: true,
            esModuleInterop: true,
            module: 'esnext',
            moduleResolution: 'bundler',
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: 'preserve',
            incremental: true,
            plugins: [{ name: 'next' }],
            paths: { '@/*': ['./src/*'] },
          },
          include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
          exclude: ['node_modules'],
        },
        null,
        2
      ),
    },
    {
      path: 'next.config.ts',
      content: `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`,
    },
    {
      path: '.env.example',
      content: [
        '# Application',
        `NEXT_PUBLIC_APP_NAME="${projectName}"`,
        'NEXT_PUBLIC_APP_URL=http://localhost:3000',
        '',
        database !== 'none' ? `# ${database.toUpperCase()}` : '',
        database === 'postgresql'
          ? 'DATABASE_URL=postgresql://user:password@localhost:5432/dbname'
          : '',
        database === 'mysql' ? 'DATABASE_URL=mysql://user:password@localhost:3306/dbname' : '',
        database === 'mongodb' ? 'MONGODB_URI=mongodb://localhost:27017/dbname' : '',
        database === 'sqlite' ? 'DATABASE_PATH=./data/app.db' : '',
        database === 'redis' ? 'REDIS_URL=redis://localhost:6379' : '',
        '',
        auth !== 'none' ? '# Authentication' : '',
        auth === 'jwt' ? 'JWT_SECRET=your-super-secret-key-change-this' : '',
        auth === 'oauth-github'
          ? 'GITHUB_CLIENT_ID=\nGITHUB_CLIENT_SECRET='
          : '',
        auth === 'oauth-google'
          ? 'GOOGLE_CLIENT_ID=\nGOOGLE_CLIENT_SECRET='
          : '',
        auth === 'session' ? 'SESSION_SECRET=your-session-secret-change-this' : '',
      ]
        .filter(Boolean)
        .join('\n'),
    },
    {
      path: '.gitignore',
      content: `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`,
    },
    {
      path: 'src/app/layout.tsx',
      content: `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '${projectName}',
  description: 'Built with SP//DR Build System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
`,
    },
    {
      path: 'src/app/page.tsx',
      content: `export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">${projectName}</h1>
        <p className="text-gray-500 mb-8">Assembled by SP//DR Build System</p>
        <div className="flex gap-4 justify-center">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Documentation
          </a>
          <a
            href="/api/health"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Health Check
          </a>
        </div>
      </div>
    </main>
  );
}
`,
    },
    {
      path: 'src/app/globals.css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
}
`,
    },
    {
      path: 'src/app/api/health/route.ts',
      content: `import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json(
    {
      status: 'online',
      service: '${projectName}',
      timestamp: new Date().toISOString(),
      framework: 'Next.js App Router',
    },
    { status: 200 }
  );
}
`,
    },
    {
      path: 'src/lib/utils.ts',
      content: `/** Merges class names. Drop-in replacement for clsx + tailwind-merge pattern. */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Format a date to a locale string. */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
`,
    },
    {
      path: 'README.md',
      content: generateReadme(config, 'Next.js App Router'),
    },
  ];
}

// ─────────────────────────────────────────────
// EXPRESS + POSTGRESQL TEMPLATE SET
// ─────────────────────────────────────────────

function expressFiles(config: BuildConfig): GeneratedFile[] {
  const { projectName, database, auth } = config;

  const deps: Record<string, string> = {
    express: '^4.18.2',
    dotenv: '^16.4.1',
    cors: '^2.8.5',
    helmet: '^7.1.0',
    morgan: '^1.10.0',
  };

  if (database === 'postgresql') {
    deps['pg'] = '^8.11.0';
  } else if (database === 'mysql') {
    deps['mysql2'] = '^3.7.0';
  } else if (database === 'mongodb') {
    deps['mongoose'] = '^8.1.0';
  } else if (database === 'sqlite') {
    deps['better-sqlite3'] = '^9.4.3';
  } else if (database === 'redis') {
    deps['ioredis'] = '^5.3.2';
  }

  if (auth === 'jwt') {
    deps['jsonwebtoken'] = '^9.0.2';
    deps['bcryptjs'] = '^2.4.3';
  } else if (auth === 'session') {
    deps['express-session'] = '^1.17.3';
  }

  const devDeps: Record<string, string> = {
    typescript: '^5.3.3',
    '@types/node': '^20.11.0',
    '@types/express': '^4.17.21',
    '@types/cors': '^2.8.17',
    '@types/morgan': '^1.9.9',
    'ts-node': '^10.9.2',
    nodemon: '^3.0.3',
  };

  if (auth === 'jwt') {
    devDeps['@types/jsonwebtoken'] = '^9.0.5';
    devDeps['@types/bcryptjs'] = '^2.4.6';
  }

  const packageJson = {
    name: projectName,
    version: '0.1.0',
    description: `${projectName} API server`,
    type: 'commonjs',
    main: 'dist/index.js',
    scripts: {
      dev: 'nodemon src/index.ts',
      build: 'tsc',
      start: 'node dist/index.js',
      lint: 'eslint src --ext .ts',
    },
    dependencies: deps,
    devDependencies: devDeps,
  };

  const dbConnectionCode =
    database === 'postgresql'
      ? `import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function connectDatabase(): Promise<void> {
  const client = await pool.connect();
  client.release();
  console.log('✔ PostgreSQL connected');
}`
      : database === 'mongodb'
      ? `import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI ?? '';
  await mongoose.connect(uri);
  console.log('✔ MongoDB connected');
}`
      : database === 'redis'
      ? `import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
redis.on('ready', () => console.log('✔ Redis connected'));

export async function connectDatabase(): Promise<void> {
  await redis.ping();
}`
      : `// No database configured
export async function connectDatabase(): Promise<void> {
  console.log('ℹ No database configured');
}`;

  const authMiddlewareCode =
    auth === 'jwt'
      ? `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET ?? '';
    const decoded = jwt.verify(token, secret) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}`
      : `import { Request, Response, NextFunction } from 'express';

// Placeholder auth middleware — configure for your auth strategy
export function authenticateToken(
  _req: Request,
  _res: Response,
  next: NextFunction
): void {
  next();
}`;

  return [
    {
      path: 'package.json',
      content: JSON.stringify(packageJson, null, 2),
    },
    {
      path: 'tsconfig.json',
      content: JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            module: 'commonjs',
            moduleResolution: 'node',
            outDir: 'dist',
            rootDir: 'src',
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            declaration: true,
            sourceMap: true,
          },
          include: ['src/**/*'],
          exclude: ['node_modules', 'dist'],
        },
        null,
        2
      ),
    },
    {
      path: 'nodemon.json',
      content: JSON.stringify(
        {
          watch: ['src'],
          ext: 'ts,json',
          ignore: ['src/**/*.spec.ts'],
          exec: 'ts-node src/index.ts',
        },
        null,
        2
      ),
    },
    {
      path: '.env.example',
      content: [
        '# Server',
        'PORT=3000',
        'NODE_ENV=development',
        '',
        database !== 'none' ? `# ${database.toUpperCase()}` : '',
        database === 'postgresql' ? 'DATABASE_URL=postgresql://user:password@localhost:5432/dbname' : '',
        database === 'mysql' ? 'DATABASE_URL=mysql://user:password@localhost:3306/dbname' : '',
        database === 'mongodb' ? 'MONGODB_URI=mongodb://localhost:27017/dbname' : '',
        database === 'sqlite' ? 'DATABASE_PATH=./data/app.db' : '',
        database === 'redis' ? 'REDIS_URL=redis://localhost:6379' : '',
        '',
        auth !== 'none' ? '# Auth' : '',
        auth === 'jwt' ? 'JWT_SECRET=your-super-secret-key-change-this\nJWT_EXPIRY=7d' : '',
        auth === 'session' ? 'SESSION_SECRET=your-session-secret' : '',
      ]
        .filter((l) => l !== undefined)
        .join('\n'),
    },
    {
      path: '.gitignore',
      content: `node_modules/
dist/
.env
*.log
*.tsbuildinfo
coverage/
.DS_Store
`,
    },
    {
      path: 'src/index.ts',
      content: `import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDatabase } from './db/connection.js';
import { healthRouter } from './routes/health.js';
import { apiRouter } from './routes/api.js';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3000', 10);

// ── Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes
app.use('/health', healthRouter);
app.use('/api/v1', apiRouter);

// ── 404 Handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Bootstrap
async function bootstrap(): Promise<void> {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(\`⚡ ${projectName} online → http://localhost:\${PORT}\`);
    console.log(\`   Health check → http://localhost:\${PORT}/health\`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
`,
    },
    {
      path: 'src/db/connection.ts',
      content: dbConnectionCode,
    },
    {
      path: 'src/middleware/auth.ts',
      content: authMiddlewareCode,
    },
    {
      path: 'src/routes/health.ts',
      content: `import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'online',
    service: '${projectName}',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});
`,
    },
    {
      path: 'src/routes/api.ts',
      content: `import { Router } from 'express';

export const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.json({
    service: '${projectName}',
    version: '0.1.0',
    message: 'API is operational.',
  });
});

// Example resource route
apiRouter.get('/items', (_req, res) => {
  res.json({ items: [], total: 0 });
});
`,
    },
    {
      path: 'src/types/index.ts',
      content: `export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}
`,
    },
    {
      path: 'README.md',
      content: generateReadme(config, 'Express'),
    },
  ];
}

// ─────────────────────────────────────────────
// FASTAPI TEMPLATE SET
// ─────────────────────────────────────────────

function fastapiFiles(config: BuildConfig): GeneratedFile[] {
  const { projectName, database, auth } = config;

  const dbDeps =
    database === 'postgresql'
      ? 'asyncpg==0.29.0\npsycopg2-binary==2.9.9\nsqlalchemy==2.0.25\nalembic==1.13.1'
      : database === 'mongodb'
      ? 'motor==3.3.2\nbeanie==1.25.0'
      : database === 'redis'
      ? 'redis==5.0.1\naioredis==2.0.1'
      : '';

  const authDeps =
    auth === 'jwt'
      ? 'python-jose[cryptography]==3.3.0\npasslib[bcrypt]==1.7.4\npython-multipart==0.0.6'
      : '';

  const requirements = [
    'fastapi==0.109.2',
    'uvicorn[standard]==0.27.0',
    'pydantic==2.6.0',
    'pydantic-settings==2.1.0',
    'python-dotenv==1.0.0',
    'httpx==0.26.0',
    dbDeps,
    authDeps,
  ]
    .filter(Boolean)
    .join('\n');

  const authRouterCode =
    auth === 'jwt'
      ? `from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from pydantic import BaseModel
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")


class Token(BaseModel):
    access_token: str
    token_type: str


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return {"id": user_id}
    except JWTError:
        raise credentials_exception


@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Replace with real user lookup
    if form_data.username != "admin" or form_data.password != "password":
        raise HTTPException(status_code=400, detail="Incorrect credentials")
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}
`
      : `# No auth configured — add your middleware here
`;

  return [
    {
      path: 'requirements.txt',
      content: requirements,
    },
    {
      path: '.env.example',
      content: [
        '# Application',
        `APP_NAME="${projectName}"`,
        'APP_ENV=development',
        'DEBUG=true',
        'PORT=8000',
        '',
        database !== 'none' ? `# ${database.toUpperCase()}` : '',
        database === 'postgresql' ? 'DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/dbname' : '',
        database === 'mongodb' ? 'MONGODB_URI=mongodb://localhost:27017/dbname' : '',
        database === 'redis' ? 'REDIS_URL=redis://localhost:6379' : '',
        '',
        auth === 'jwt'
          ? '# JWT\nSECRET_KEY=your-super-secret-key-change-this\nALGORITHM=HS256\nACCESS_TOKEN_EXPIRE_MINUTES=30'
          : '',
      ]
        .filter((l) => l !== undefined)
        .join('\n'),
    },
    {
      path: '.gitignore',
      content: `__pycache__/
*.py[cod]
*.pyo
*.pyd
.Python
env/
venv/
.venv/
.env
*.egg-info/
dist/
build/
.mypy_cache/
.pytest_cache/
.coverage
htmlcov/
.DS_Store
`,
    },
    {
      path: 'app/main.py',
      content: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print(f"⚡ {settings.APP_NAME} online")
    yield
    # Shutdown logic
    print(f"⏹  {settings.APP_NAME} shutting down")


app = FastAPI(
    title=settings.APP_NAME,
    description="Built with SP//DR Build System",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["system"])
async def health():
    return {
        "status": "online",
        "service": settings.APP_NAME,
    }
`,
    },
    {
      path: 'app/core/config.py',
      content: `from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "${projectName}"
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000

    ${database === 'postgresql' ? 'DATABASE_URL: str = "postgresql+asyncpg://localhost/dbname"' : ''}
    ${database === 'mongodb' ? 'MONGODB_URI: str = "mongodb://localhost:27017/dbname"' : ''}
    ${database === 'redis' ? 'REDIS_URL: str = "redis://localhost:6379"' : ''}

    ${auth === 'jwt' ? 'SECRET_KEY: str = "changethis"\n    ALGORITHM: str = "HS256"\n    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30' : ''}

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
`,
    },
    {
      path: 'app/api/v1/router.py',
      content: `from fastapi import APIRouter
from app.api.v1.endpoints import items
${auth === 'jwt' ? 'from app.api.v1.endpoints import auth' : ''}

api_router = APIRouter()

api_router.include_router(items.router, prefix="/items", tags=["items"])
${auth === 'jwt' ? 'api_router.include_router(auth.router, tags=["auth"])' : ''}
`,
    },
    {
      path: 'app/api/v1/endpoints/items.py',
      content: `from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()


class Item(BaseModel):
    id: int
    name: str
    description: str | None = None


# In-memory store — replace with your database layer
_items: List[Item] = [
    Item(id=1, name="Sample Item", description="Replace with real data"),
]


@router.get("/", response_model=List[Item])
async def list_items():
    return _items


@router.get("/{item_id}", response_model=Item)
async def get_item(item_id: int):
    for item in _items:
        if item.id == item_id:
            return item
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Item not found")


@router.post("/", response_model=Item, status_code=201)
async def create_item(item: Item):
    _items.append(item)
    return item
`,
    },
    {
      path: auth === 'jwt' ? 'app/api/v1/endpoints/auth.py' : 'app/api/v1/endpoints/.gitkeep',
      content: auth === 'jwt' ? authRouterCode : '',
    },
    {
      path: 'app/__init__.py',
      content: '',
    },
    {
      path: 'app/api/__init__.py',
      content: '',
    },
    {
      path: 'app/api/v1/__init__.py',
      content: '',
    },
    {
      path: 'app/api/v1/endpoints/__init__.py',
      content: '',
    },
    {
      path: 'app/core/__init__.py',
      content: '',
    },
    {
      path: 'run.py',
      content: `import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG,
    )
`,
    },
    {
      path: 'README.md',
      content: generateReadme(config, 'FastAPI'),
    },
  ];
}

// ─────────────────────────────────────────────
// REACT VITE TEMPLATE
// ─────────────────────────────────────────────

function reactViteFiles(config: BuildConfig): GeneratedFile[] {
  const { projectName } = config;

  return [
    {
      path: 'package.json',
      content: JSON.stringify(
        {
          name: projectName,
          private: true,
          version: '0.0.0',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'tsc && vite build',
            lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
            preview: 'vite preview',
          },
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
          },
          devDependencies: {
            '@types/react': '^18.2.55',
            '@types/react-dom': '^18.2.19',
            '@typescript-eslint/eslint-plugin': '^6.21.0',
            '@typescript-eslint/parser': '^6.21.0',
            '@vitejs/plugin-react': '^4.2.1',
            eslint: '^8.56.0',
            'eslint-plugin-react-hooks': '^4.6.0',
            'eslint-plugin-react-refresh': '^0.4.5',
            typescript: '^5.2.2',
            vite: '^5.1.0',
          },
        },
        null,
        2
      ),
    },
    {
      path: 'vite.config.ts',
      content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});
`,
    },
    {
      path: 'tsconfig.json',
      content: JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2020',
            useDefineForClassFields: true,
            lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'bundler',
            allowImportingTsExtensions: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: 'react-jsx',
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true,
          },
          include: ['src'],
          references: [{ path: './tsconfig.node.json' }],
        },
        null,
        2
      ),
    },
    {
      path: 'tsconfig.node.json',
      content: JSON.stringify(
        {
          compilerOptions: {
            composite: true,
            skipLibCheck: true,
            module: 'ESNext',
            moduleResolution: 'bundler',
            allowSyntheticDefaultImports: true,
          },
          include: ['vite.config.ts'],
        },
        null,
        2
      ),
    },
    {
      path: 'index.html',
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    },
    {
      path: 'src/main.tsx',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
    },
    {
      path: 'src/App.tsx',
      content: `import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header>
        <h1>${projectName}</h1>
        <p>Assembled by SP//DR Build System</p>
      </header>
      <main>
        <button onClick={() => setCount((c) => c + 1)}>
          Count: {count}
        </button>
      </main>
    </div>
  );
}

export default App;
`,
    },
    {
      path: 'src/index.css',
      content: `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}
`,
    },
    {
      path: 'src/App.css',
      content: `.app {
  text-align: center;
  padding: 2rem;
}

header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: 1px solid #555;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  color: white;
  transition: border-color 0.25s, background 0.25s;
}

button:hover {
  background: #1a1a1a;
  border-color: #00f5ff;
}
`,
    },
    {
      path: '.gitignore',
      content: `node_modules
dist
.env
*.local
.DS_Store
`,
    },
    {
      path: 'README.md',
      content: generateReadme(config, 'React + Vite'),
    },
  ];
}

// ─────────────────────────────────────────────
// NODE / TS CLI TEMPLATE
// ─────────────────────────────────────────────

function nodeCliFiles(config: BuildConfig, typescript: boolean): GeneratedFile[] {
  const { projectName } = config;

  return [
    {
      path: 'package.json',
      content: JSON.stringify(
        {
          name: projectName,
          version: '0.1.0',
          description: `${projectName} — a CLI tool`,
          type: 'module',
          bin: {
            [projectName]: typescript ? './dist/index.js' : './src/index.js',
          },
          scripts: typescript
            ? {
                build: 'tsc',
                dev: 'tsx src/index.ts',
                start: `node dist/index.js`,
                clean: 'rimraf dist',
              }
            : {
                start: 'node src/index.js',
                dev: 'node --watch src/index.js',
              },
          dependencies: {
            commander: '^11.1.0',
            chalk: '^5.3.0',
            ora: '^8.0.1',
          },
          devDependencies: typescript
            ? {
                typescript: '^5.3.3',
                '@types/node': '^20.11.0',
                tsx: '^4.7.0',
                rimraf: '^5.0.5',
              }
            : {
                '@types/node': '^20.11.0',
              },
        },
        null,
        2
      ),
    },
    typescript
      ? {
          path: 'tsconfig.json',
          content: JSON.stringify(
            {
              compilerOptions: {
                target: 'ES2022',
                module: 'NodeNext',
                moduleResolution: 'NodeNext',
                outDir: 'dist',
                rootDir: 'src',
                strict: true,
                esModuleInterop: true,
                skipLibCheck: true,
                declaration: true,
              },
              include: ['src/**/*'],
              exclude: ['node_modules', 'dist'],
            },
            null,
            2
          ),
        }
      : { path: '.placeholder', content: '' },
    {
      path: typescript ? 'src/index.ts' : 'src/index.js',
      content: typescript
        ? `#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';

const program = new Command();

program
  .name('${projectName}')
  .description('${projectName} — built with SP//DR')
  .version('0.1.0');

program
  .command('run')
  .description('Run the main task')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options: { verbose: boolean }) => {
    const spinner = ora(chalk.cyan('Processing...')).start();

    await new Promise<void>((resolve) => setTimeout(resolve, 1200));

    spinner.succeed(chalk.green('Done!'));

    if (options.verbose) {
      console.log(chalk.dim('\\nVerbose output enabled.'));
    }
  });

program.parse();
`
        : `#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';

const program = new Command();

program
  .name('${projectName}')
  .description('${projectName} — built with SP//DR')
  .version('0.1.0');

program
  .command('run')
  .description('Run the main task')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options) => {
    const spinner = ora(chalk.cyan('Processing...')).start();
    await new Promise((resolve) => setTimeout(resolve, 1200));
    spinner.succeed(chalk.green('Done!'));
    if (options.verbose) console.log(chalk.dim('Verbose mode enabled.'));
  });

program.parse();
`,
    },
    {
      path: '.gitignore',
      content: `node_modules/
dist/
.env
*.log
.DS_Store
`,
    },
    {
      path: 'README.md',
      content: generateReadme(config, typescript ? 'TypeScript CLI' : 'Node.js CLI'),
    },
  ];
}

// ─────────────────────────────────────────────
// EXTRAS
// ─────────────────────────────────────────────

function dockerFiles(config: BuildConfig): GeneratedFile[] {
  const { projectName, framework } = config;
  const isPython = ['fastapi', 'django'].includes(framework);
  const port = isPython ? 8000 : 3000;

  return [
    {
      path: 'docker-compose.yml',
      content: `version: '3.9'

services:
  app:
    build: .
    ports:
      - "${port}:${port}"
    env_file:
      - .env
    restart: unless-stopped
    depends_on:
      ${config.database === 'postgresql' ? '- postgres' : ''}
      ${config.database === 'mongodb' ? '- mongo' : ''}
      ${config.database === 'redis' ? '- redis' : ''}

${
  config.database === 'postgresql'
    ? `  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ${projectName.replace(/-/g, '_')}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`
    : ''
}
${
  config.database === 'mongodb'
    ? `  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodata:/data/db

volumes:
  mongodata:`
    : ''
}
${
  config.database === 'redis'
    ? `  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

volumes:
  redisdata:`
    : ''
}
`,
    },
    {
      path: 'Dockerfile',
      content: isPython
        ? `FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE ${port}

CMD ["python", "run.py"]
`
        : `FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE ${port}

CMD ["node", "dist/index.js"]
`,
    },
    {
      path: '.dockerignore',
      content: `node_modules
dist
.git
.env
*.log
__pycache__
.pytest_cache
*.pyc
`,
    },
  ];
}

function githubActionsFiles(config: BuildConfig): GeneratedFile[] {
  const isPython = ['fastapi', 'django'].includes(config.framework);

  return [
    {
      path: '.github/workflows/ci.yml',
      content: isPython
        ? `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest pytest-asyncio httpx

      - name: Lint
        run: |
          pip install ruff
          ruff check .

      - name: Run tests
        run: pytest
`
        : `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Lint
        run: npm run lint --if-present

      - name: Test
        run: npm test --if-present
`,
    },
  ];
}

function eslintFiles(config: BuildConfig): GeneratedFile[] {
  const isPython = ['fastapi', 'django'].includes(config.framework);
  if (isPython) return [];

  return [
    {
      path: '.eslintrc.json',
      content: JSON.stringify(
        {
          root: true,
          env: { node: true, es2022: true },
          parser: '@typescript-eslint/parser',
          plugins: ['@typescript-eslint'],
          extends: [
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
          ],
          rules: {
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-console': 'off',
          },
        },
        null,
        2
      ),
    },
    {
      path: '.prettierrc',
      content: JSON.stringify(
        {
          semi: true,
          singleQuote: true,
          trailingComma: 'es5',
          tabWidth: 2,
          printWidth: 100,
        },
        null,
        2
      ),
    },
    {
      path: '.prettierignore',
      content: `node_modules
dist
build
.next
coverage
`,
    },
  ];
}

function huskyFiles(): GeneratedFile[] {
  return [
    {
      path: '.husky/pre-commit',
      content: `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
`,
    },
    {
      path: '.lintstagedrc.json',
      content: JSON.stringify(
        {
          '*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
          '*.{json,md,yaml,yml}': ['prettier --write'],
        },
        null,
        2
      ),
    },
  ];
}

function commitlintFiles(): GeneratedFile[] {
  return [
    {
      path: 'commitlint.config.js',
      content: `export default {
  extends: ['@commitlint/config-conventional'],
};
`,
    },
    {
      path: '.husky/commit-msg',
      content: `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
`,
    },
  ];
}

// ─────────────────────────────────────────────
// README GENERATOR
// ─────────────────────────────────────────────

function generateReadme(config: BuildConfig, frameworkLabel: string): string {
  const { projectName, database, auth, extras } = config;
  const dbLabel = database === 'none' ? 'None' : database.charAt(0).toUpperCase() + database.slice(1);
  const authLabel = auth === 'none' ? 'None' : auth.toUpperCase();

  const isPython = ['fastapi', 'django'].includes(config.framework);
  const installCmd = isPython
    ? 'pip install -r requirements.txt'
    : 'npm install';
  const devCmd = isPython ? 'python run.py' : 'npm run dev';

  return `# ${projectName}

> Built with **SP//DR Build System** — Mech-assembly project scaffolding

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
[![Framework](https://img.shields.io/badge/Framework-${encodeURIComponent(frameworkLabel)}-blueviolet)](https://github.com)
${database !== 'none' ? `[![Database](https://img.shields.io/badge/Database-${encodeURIComponent(dbLabel)}-orange)](https://github.com)` : ''}

---

## ✦ Overview

\`${projectName}\` is a **${frameworkLabel}** application scaffolded by SP//DR Build System with the following configuration:

| Component       | Selection          |
|-----------------|--------------------|
| Framework       | ${frameworkLabel}  |
| Database        | ${dbLabel}         |
| Authentication  | ${authLabel}       |
| Extras          | ${extras.join(', ') || 'none'} |

---

## ⚡ Getting Started

### Prerequisites

${isPython ? '- Python 3.11+\n- pip' : '- Node.js 18+\n- npm 9+'}
${database === 'postgresql' ? '- PostgreSQL 15+' : ''}
${database === 'mongodb' ? '- MongoDB 7+' : ''}
${database === 'redis' ? '- Redis 7+' : ''}

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/${projectName}.git
cd ${projectName}

# Install dependencies
${installCmd}

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start development server
${devCmd}
\`\`\`

${extras.includes('docker') ? `### Docker

\`\`\`bash
docker compose up -d
\`\`\`` : ''}

---

## 📁 Project Structure

\`\`\`
${projectName}/
${isPython ? `├── app/
│   ├── main.py
│   ├── core/
│   │   └── config.py
│   └── api/
│       └── v1/
│           ├── router.py
│           └── endpoints/
├── requirements.txt
├── run.py
└── .env.example` : `├── src/
│   ├── index.ts
│   ├── routes/
│   ├── middleware/
│   └── db/
├── package.json
├── tsconfig.json
└── .env.example`}
\`\`\`

---

## 🔧 Scripts

${
  isPython
    ? `| Command | Description |
|---------|-------------|
| \`python run.py\` | Start development server |
| \`ruff check .\` | Lint code |
| \`pytest\` | Run tests |`
    : `| Command | Description |
|---------|-------------|
| \`npm run dev\` | Start development server |
| \`npm run build\` | Build for production |
| \`npm start\` | Run production build |
| \`npm run lint\` | Lint source code |`
}

---

## 🗺 Roadmap

- [ ] Add comprehensive test suite
- [ ] Set up deployment pipeline
- [ ] Add API documentation
- [ ] Performance optimization
- [ ] Monitoring and observability

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'feat: add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Assembled by <a href="https://github.com/YOUR_USERNAME/mechbuild-cli">SP//DR Build System</a></sub>
</div>
`;
}

// ─────────────────────────────────────────────
// PUBLIC API — resolveTemplateFiles
// ─────────────────────────────────────────────

export function resolveTemplateFiles(config: BuildConfig): GeneratedFile[] {
  const { framework, extras } = config;

  let coreFiles: GeneratedFile[] = [];

  switch (framework) {
    case 'nextjs':
      coreFiles = nextjsFiles(config);
      break;
    case 'express':
      coreFiles = expressFiles(config);
      break;
    case 'fastapi':
      coreFiles = fastapiFiles(config);
      break;
    case 'react-vite':
      coreFiles = reactViteFiles(config);
      break;
    case 'node-cli':
      coreFiles = nodeCliFiles(config, false);
      break;
    case 'ts-cli':
      coreFiles = nodeCliFiles(config, true);
      break;
    default:
      // Generic fallback: Express
      coreFiles = expressFiles(config);
      break;
  }

  const extraFiles: GeneratedFile[] = [];

  if (extras.includes('docker')) {
    extraFiles.push(...dockerFiles(config));
  }

  if (extras.includes('github-actions')) {
    extraFiles.push(...githubActionsFiles(config));
  }

  if (extras.includes('eslint')) {
    extraFiles.push(...eslintFiles(config));
  }

  if (extras.includes('husky')) {
    extraFiles.push(...huskyFiles());
  }

  if (extras.includes('conventional-commits')) {
    extraFiles.push(...commitlintFiles());
  }

  // Deduplicate by path (extras override core if same path)
  const fileMap = new Map<string, GeneratedFile>();
  for (const file of [...coreFiles, ...extraFiles]) {
    if (file.path && file.path !== '.placeholder') {
      fileMap.set(file.path, file);
    }
  }

  return Array.from(fileMap.values());
}
