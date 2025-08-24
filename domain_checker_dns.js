// Domain Availability Checker using DNS lookup
// More reliable than API-based solutions and doesn't require API keys

import { promises as dns } from 'dns';

/**
 * Check domain availability using DNS lookup
 * @param {string} domain - Domain to check (e.g., 'example.com')
 * @returns {Promise<Object>} Domain availability status
 */
const checkDomainAvailability = async (domain) => {
  try {
    // Try to resolve the domain's A record
    const addresses = await dns.resolve4(domain);
    
    return {
      domain,
      available: false,
      status: 'REGISTERED',
      hasWebsite: addresses.length > 0,
      ipAddresses: addresses,
      error: null
    };
  } catch (error) {
    // If domain doesn't resolve, it might be available
    if (error.code === 'ENOTFOUND') {
      return {
        domain,
        available: true,
        status: 'AVAILABLE',
        hasWebsite: false,
        ipAddresses: [],
        error: null
      };
    }
    
    // Other DNS errors
    return {
      domain,
      available: null,
      status: 'ERROR',
      hasWebsite: false,
      ipAddresses: [],
      error: error.message
    };
  }
};

/**
 * Check domain availability using multiple methods for better accuracy
 * @param {string} domain - Domain to check
 * @returns {Promise<Object>} Comprehensive domain status
 */
const checkDomainComprehensive = async (domain) => {
  try {
    // Check A record (IPv4)
    let aRecords = [];
    try {
      aRecords = await dns.resolve4(domain);
    } catch (error) {
      if (error.code !== 'ENOTFOUND') {
        throw error;
      }
    }
    
    // Check AAAA record (IPv6)
    let aaaaRecords = [];
    try {
      aaaaRecords = await dns.resolve6(domain);
    } catch (error) {
      if (error.code !== 'ENOTFOUND' && error.code !== 'ENODATA') {
        throw error;
      }
    }
    
    // Check MX record (mail servers)
    let mxRecords = [];
    try {
      mxRecords = await dns.resolveMx(domain);
    } catch (error) {
      if (error.code !== 'ENOTFOUND' && error.code !== 'ENODATA') {
        throw error;
      }
    }
    
    // Check NS record (name servers)
    let nsRecords = [];
    try {
      nsRecords = await dns.resolveNs(domain);
    } catch (error) {
      if (error.code !== 'ENOTFOUND' && error.code !== 'ENODATA') {
        throw error;
      }
    }
    
    const hasAnyRecords = aRecords.length > 0 || aaaaRecords.length > 0 || 
                         mxRecords.length > 0 || nsRecords.length > 0;
    
    return {
      domain,
      available: !hasAnyRecords,
      status: hasAnyRecords ? 'REGISTERED' : 'AVAILABLE',
      hasWebsite: aRecords.length > 0 || aaaaRecords.length > 0,
      hasEmail: mxRecords.length > 0,
      hasNameservers: nsRecords.length > 0,
      ipAddresses: [...aRecords, ...aaaaRecords],
      mailServers: mxRecords.map(mx => mx.exchange),
      nameServers: nsRecords,
      error: null
    };
    
  } catch (error) {
    return {
      domain,
      available: null,
      status: 'ERROR',
      hasWebsite: false,
      hasEmail: false,
      hasNameservers: false,
      ipAddresses: [],
      mailServers: [],
      nameServers: [],
      error: error.message
    };
  }
};

/**
 * Check multiple domains at once
 * @param {string[]} domains - Array of domains to check
 * @returns {Promise<Object[]>} Array of domain status objects
 */
const checkMultipleDomains = async (domains) => {
  const results = await Promise.all(
    domains.map(domain => checkDomainComprehensive(domain))
  );
  
  return results;
};

/**
 * Format domain check results for display
 * @param {Object} result - Domain check result
 * @returns {string} Formatted result string
 */
const formatResult = (result) => {
  if (result.error) {
    return `❌ ${result.domain}: Error - ${result.error}`;
  }
  
  if (result.available) {
    return `✅ ${result.domain}: AVAILABLE for registration`;
  } else {
    const details = [];
    if (result.hasWebsite) details.push('Website');
    if (result.hasEmail) details.push('Email');
    if (result.hasNameservers) details.push('DNS');
    
    return `❌ ${result.domain}: TAKEN (${details.join(', ')})`;
  }
};

/**
 * Get detailed information about a domain
 * @param {Object} result - Domain check result
 * @returns {string[]} Array of detail strings
 */
const getDomainDetails = (result) => {
  const details = [];
  
  if (result.error) return details;
  
  if (result.ipAddresses.length > 0) {
    details.push(`   🌐 IP Addresses: ${result.ipAddresses.join(', ')}`);
  }
  
  if (result.mailServers.length > 0) {
    details.push(`   📧 Mail Servers: ${result.mailServers.join(', ')}`);
  }
  
  if (result.nameServers.length > 0) {
    details.push(`   🖥️  Name Servers: ${result.nameServers.join(', ')}`);
  }
  
  return details;
};

// Example usage
const main = async () => {
  const domainsToCheck = ['shastaai.com', 'shasta-ai.com', 'example.com', 'google.com'];
  
  console.log('🔍 Checking domain availability using DNS lookup...\n');
  
  const results = await checkMultipleDomains(domainsToCheck);
  
  results.forEach(result => {
    console.log(formatResult(result));
    
    const details = getDomainDetails(result);
    details.forEach(detail => console.log(detail));
    
    console.log('');
  });
};

// Export functions for use in other modules
export {
  checkDomainAvailability,
  checkDomainComprehensive,
  checkMultipleDomains,
  formatResult,
  getDomainDetails
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
