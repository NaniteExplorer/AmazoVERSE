import dns from "dns";
import mongoose from "mongoose";
import colors from "colors";
import config from "./index.js";

/**
 * Some local DNS resolvers — VPN clients, ad/DNS-filtering proxies, or ISP
 * routers bound to 127.0.0.1 — refuse SRV queries. That breaks the SRV lookup
 * that `mongodb+srv://` URIs depend on and surfaces as:
 *   "querySrv ECONNREFUSED _mongodb._tcp.<cluster>.mongodb.net"
 *
 * Point Node's resolver at public DNS servers (overridable via DNS_SERVERS, a
 * comma-separated list) so the lookup succeeds regardless of the local setup.
 * Only matters for mongodb+srv:// URIs; harmless otherwise.
 */
const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (dnsServers.length) {
  try {
    dns.setServers(dnsServers);
  } catch {
    // Ignore invalid overrides and fall back to the system resolver.
  }
}

/**
 * Establishes the MongoDB connection.
 *
 * In a serverless environment (e.g. Vercel) the entry module can be evaluated on
 * every cold start, so we cache the connection promise on the module to avoid
 * opening a new connection per invocation.
 *
 * NOTE: This only connects to the database that was manually populated;
 * it never mutates or seeds existing collections.
 */
let connectionPromise = null;

const connectDatabase = () => {
  if (connectionPromise) return connectionPromise;

  connectionPromise = mongoose
    .connect(config.db.uri)
    .then((connection) => {
      console.log(
        colors.bgGreen.white(
          `MongoDB connected with server: ${connection.connection.host}`
        )
      );
      return connection;
    })
    .catch((err) => {
      // Reset so a later invocation can retry instead of caching a failure.
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
};

export default connectDatabase;
