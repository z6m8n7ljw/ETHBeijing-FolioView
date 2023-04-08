/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    serverURL: "http://127.0.0.1:5000",
    NEXT_PUBLIC_ENABLE_TESTNETSL: true,
    FOLIO_VIEW_NFT_ADDRESS: "0x983A8166D0C70E90ef0600Bddd097C885a2C994d"
  }
}

module.exports = nextConfig
