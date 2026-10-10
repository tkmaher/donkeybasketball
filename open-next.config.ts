import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Configure additional overrides like incrementalCache or R2 usage here if needed
  // For standard deployments without Incremental Static Regeneration (ISR), the defaults suffice
});