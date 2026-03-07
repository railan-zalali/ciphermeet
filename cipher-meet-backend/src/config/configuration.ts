export default () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    allowedOrigins: process.env.ALLOWED_ORIGINS ?? '*',

    jwt: {
        secret: process.env.JWT_SECRET ?? 'cipher-meet-jwt-secret-change-in-prod',
        expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
        refreshSecret:
            process.env.JWT_REFRESH_SECRET ??
            'cipher-meet-refresh-secret-change-in-prod',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    },

    database: {
        postgres: {
            host: process.env.POSTGRES_HOST ?? 'localhost',
            port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
            username: process.env.POSTGRES_USER ?? 'ciphermeet',
            password: process.env.POSTGRES_PASSWORD ?? 'ciphermeet_dev_password',
            database: process.env.POSTGRES_DB ?? 'ciphermeet',
        },
        mongodb: {
            uri:
                process.env.MONGODB_URI ??
                'mongodb://localhost:27017/ciphermeet_messages',
        },
    },

    redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        password: process.env.REDIS_PASSWORD ?? '',
    },

    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID ?? '',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
        privateKey: process.env.FIREBASE_PRIVATE_KEY ?? '',
    },

    aws: {
        region: process.env.AWS_REGION ?? 'ap-southeast-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
        s3Bucket: process.env.AWS_S3_BUCKET ?? 'ciphermeet-media',
        cloudfrontDomain: process.env.CLOUDFRONT_DOMAIN ?? '',
    },

    otp: {
        ttlSeconds: parseInt(process.env.OTP_TTL_SECONDS ?? '300', 10),
        maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS ?? '5', 10),
    },
});
