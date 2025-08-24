#!/usr/bin/env node

import { checkDomainAvailability, checkMultipleDomains, formatResult } from './domain_checker.js';

/**
 * Parse command line arguments
 * @returns {Object} Parsed arguments
 */
const parseArgs = () => {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node cli.js <domain1> [domain2] [domain3] ...');
    console.log('Example: node cli.js shastaai.com example.com');
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
  
  console.log('🔍 Domain Availability Checker\n');
  console.log(`Checking ${domains.length} domain(s): ${domains.join(', ')}\n`);
  
  try {
    const results = await checkMultipleDomains(domains);
    
    results.forEach(result => {
      console.log(formatResult(result));
      
      if (!result.available && !result.error) {
        console.log(`   📅 Created: ${result.creationDate || 'Unknown'}`);
        console.log(`   📅 Expires: ${result.expiryDate || 'Unknown'}`);
        console.log(`   🔄 Updated: ${result.lastUpdated || 'Unknown'}`);
      }
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
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

main();
