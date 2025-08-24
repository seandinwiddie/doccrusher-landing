# Domain Availability Checker

A functional domain availability checker using the WHOIS API to accurately determine if domains are registered or available.

## Features

- ✅ Check single or multiple domains at once
- ✅ Get detailed WHOIS information for registered domains
- ✅ Command-line interface for easy use
- ✅ Functional programming approach
- ✅ Error handling and validation

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## API Key Setup

To get accurate results, you'll need a WHOIS API key:

1. Sign up at [WHOIS XML API](https://whois.whoisxmlapi.com/)
2. Get your API key from the dashboard
3. Set it as an environment variable:
   ```bash
   export WHOIS_API_KEY="your_api_key_here"
   ```

**Note:** The demo key has limited requests. For production use, get a paid API key.

## Usage

### Command Line Interface

#### DNS-based Checker (Recommended - No API key required)

Check a single domain:
```bash
node cli_dns.js shastaai.com
```

Check multiple domains:
```bash
node cli_dns.js shastaai.com shasta-ai.com example.com
```

Or use npm script:
```bash
npm run check-dns shastaai.com shasta-ai.com
```

#### WHOIS API-based Checker (Requires API key)

Check a single domain:
```bash
node cli.js shastaai.com
```

Check multiple domains:
```bash
node cli.js shastaai.com shasta-ai.com example.com
```

### Programmatic Usage

```javascript
import { checkDomainAvailability, checkMultipleDomains } from './domain_checker.js';

// Check a single domain
const result = await checkDomainAvailability('shastaai.com');
console.log(result);

// Check multiple domains
const results = await checkMultipleDomains(['shastaai.com', 'example.com']);
console.log(results);
```

## Example Output

```
🔍 Domain Availability Checker

Checking 2 domain(s): shastaai.com, example.com

❌ shastaai.com: TAKEN (Registrar: GoDaddy.com, LLC)
   📅 Created: 2023-01-15T10:30:00Z
   📅 Expires: 2025-01-15T10:30:00Z
   🔄 Updated: 2024-06-20T14:22:00Z

✅ example.com: AVAILABLE for registration

📊 Summary:
   ✅ Available: 1
   ❌ Taken: 1
```

## API Response Format

Each domain check returns an object with:

```javascript
{
  domain: "shastaai.com",
  available: false,
  status: "UNAVAILABLE",
  registrar: "GoDaddy.com, LLC",
  creationDate: "2023-01-15T10:30:00Z",
  expiryDate: "2025-01-15T10:30:00Z",
  lastUpdated: "2024-06-20T14:22:00Z",
  nameServers: ["ns1.example.com", "ns2.example.com"],
  error: null
}
```

## DNS vs WHOIS API Comparison

### DNS-based Checker (`cli_dns.js`)
- ✅ **No API key required**
- ✅ **Fast and reliable**
- ✅ **Checks multiple record types (A, AAAA, MX, NS)**
- ✅ **Shows detailed DNS information**
- ⚠️ **May miss domains that are registered but have no DNS records**

### WHOIS API-based Checker (`cli.js`)
- ✅ **Most accurate for registration status**
- ✅ **Shows registrar information**
- ✅ **Shows creation/expiry dates**
- ❌ **Requires API key**
- ❌ **Rate limited**
- ❌ **May have costs**

## Alternative APIs

If you prefer different APIs, here are some alternatives:

1. **GoDaddy API** - Official registrar API
2. **Namecheap API** - Another major registrar
3. **Cloudflare API** - For domains registered with them

## License

MIT License - feel free to use and modify as needed.
