/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // postgres-js is a pure-JS package; no native bindings to externalise.
    serverComponentsExternalPackages: ["postgres"]
  }
};

export default nextConfig;
