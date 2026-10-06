import https from "https"
import { v2 as cloudinarySdk } from "cloudinary"
import config from "./index.js"

// Node's global https agent drops sockets idle for 5s, which can fire during a slow DNS
// lookup before the SDK's own 60s timeout applies; Cloudinary calls get their own agent.
export const cloudinaryAgent = new https.Agent({ keepAlive: true, timeout: 60_000 })

const isConfigured = Boolean(
  config.cloudinary_cloud_name && config.cloudinary_api_key && config.cloudinary_api_secret
)

if (isConfigured) {
  cloudinarySdk.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
    secure: true,
  })
}

export const cloudinary = isConfigured ? cloudinarySdk : null
