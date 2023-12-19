/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["www.pexels.com", "img.icons8.com", "lh3.googleusercontent.com", "uploadthing.com"],
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/:path*"
            : "/api/",
      },
    ];
  },
};

module.exports = nextConfig;
