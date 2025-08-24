#!/usr/bin/env node

import { checkDomainComprehensive, checkMultipleDomains, formatResult, getDomainDetails } from './domain_checker_dns.js';

/**
 * Parse command line arguments
 * @returns {Object} Parsed arguments
 */
const parseArgs = () => {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node cli_dns.js <domain1> [domain2] [domain3] ...');
    console.log('Example: node cli_dns.js shastaai.com example.com');
    console.log('\nThis tool uses DNS lookup and does not require API keys.');
    process.exit(1);
  }
  
  return {
    domains: args
  };
};

/**
 * Main CLI function
 */
const main = async () => {
  const { domains } = parseArgs();
  
  console.log('🔍 Domain Availability Checker (DNS-based)\n');
  console.log(`Checking ${domains.length} domain(s): ${domains.join(', ')}\n`);
  
  try {
    const results = await checkMultipleDomains(domains);
    
    results.forEach(result => {
      console.log(formatResult(result));
      
      const details = getDomainDetails(result);
      details.forEach(detail => console.log(detail));
      
      console.log('');
    });
    
    // Summary
    const available = results.filter(r => r.available).length;
    const taken = results.filter(r => !r.available && !r.error).length;
    const errors = results.filter(r => r.error).length;
    
    console.log('📊 Summary:');
    console.log(`   ✅ Available: ${available}`);
    console.log(`   ❌ Taken: ${taken}`);
    if (errors > 0) {
      console.log(`   ⚠️  Errors: ${errors}`);
    }
    
    console.log('\n💡 Note: This tool checks DNS records. A domain might be registered but not have a website.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

main();
