// Domain Availability Checker
// Uses WHOIS API to check domain registration status
import fetch from 'node-fetch';

const WHOIS_API_KEY = process.env.WHOIS_API_KEY || 'demo'; // Get from https://whois.whoisxmlapi.com/
const WHOIS_API_URL = 'https://domain-availability.whoisxmlapi.com/api/v1';

/**
 * Check domain availability using WHOIS API
 * @param {string} domain - Domain to check (e.g., 'example.com')
 * @returns {Promise<Object>} Domain availability status
 */
const checkDomainAvailability = async (domain) => {
  try {
    const url = `${WHOIS_API_URL}?apiKey=${WHOIS_API_KEY}&domainName=${encodeURIComponent(domain)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      domain,
      available: data.DomainInfo.domainAvailability === 'AVAILABLE',
      status: data.DomainInfo.domainAvailability,
      registrar: data.DomainInfo.registrarName || 'Unknown',
      creationDate: data.DomainInfo.createdDate,
      expiryDate: data.DomainInfo.expiresDate,
      lastUpdated: data.DomainInfo.updatedDate,
      nameServers: data.DomainInfo.nameServers || [],
      error: null
    };
  } catch (error) {
    return {
      domain,
      available: null,
      status: 'ERROR',
      error: error.message,
      registrar: null,
      creationDate: null,
      expiryDate: null,
      lastUpdated: null,
      nameServers: []
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
    domains.map(domain => checkDomainAvailability(domain))
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
    return `❌ ${result.domain}: TAKEN (Registrar: ${result.registrar})`;
  }
};

// Example usage
const main = async () => {
  const domainsToCheck = ['shastaai.com', 'shasta-ai.com', 'example.com'];
  
  console.log('🔍 Checking domain availability...\n');
  
  const results = await checkMultipleDomains(domainsToCheck);
  
  results.forEach(result => {
    console.log(formatResult(result));
    
    if (!result.available && !result.error) {
      console.log(`   📅 Created: ${result.creationDate || 'Unknown'}`);
      console.log(`   📅 Expires: ${result.expiryDate || 'Unknown'}`);
      console.log(`   🔄 Updated: ${result.lastUpdated || 'Unknown'}`);
    }
    console.log('');
  });
};

// Export functions for use in other modules
export {
  checkDomainAvailability,
  checkMultipleDomains,
  formatResult
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
