#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Setup Validation Script
 *
 * Validates that all required environment variables are set
 * and tests connections to Supabase and Stripe
 *
 * Run with: npm run validate-setup
 */

const fs = require('fs')
const path = require('path')

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green')
}

function logError(message) {
  log(`✗ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ ${message}`, 'cyan')
}

function logSection(message) {
  log(`\n${message}`, 'blue')
  log('━'.repeat(60), 'blue')
}

// Required environment variables
const REQUIRED_VARS = {
  'NEXT_PUBLIC_APP_URL': {
    description: 'Base URL for your app (used for redirects and metadata)',
    example: 'https://your-domain.com',
    validate: (value) => value.startsWith('https://') || value.startsWith('http://localhost')
  },
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': {
    description: 'Clerk publishable key',
    example: 'pk_test_...',
    validate: (value) => value.startsWith('pk_test_') || value.startsWith('pk_live_')
  },
  'CLERK_SECRET_KEY': {
    description: 'Clerk secret key',
    example: 'sk_test_...',
    validate: (value) => value.startsWith('sk_test_') || value.startsWith('sk_live_')
  },
  'NEXT_PUBLIC_SUPABASE_URL': {
    description: 'Supabase project URL',
    example: 'https://abcdefghijklmnop.supabase.co',
    validate: (value) => value.startsWith('https://') && value.includes('.supabase.co')
  },
  'SUPABASE_SERVICE_ROLE_KEY': {
    description: 'Supabase secret (service role) key, server-only',
    example: 'sb_secret_...',
    validate: (value) => value.startsWith('sb_secret_') || (value.startsWith('eyJ') && value.length > 100)
  },
  'ADMIN_USER_IDS': {
    description: 'Comma-separated Clerk user IDs allowed into /admin',
    example: 'user_abc123,user_def456',
    validate: (value) => value.split(',').every((id) => id.trim().startsWith('user_'))
  },
}

// Optional environment variables
const OPTIONAL_VARS = {
  'ANTHROPIC_API_KEY': {
    description: 'Anthropic API key (admin question generation)',
    example: 'sk-ant-...',
  },
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': {
    description: 'Stripe publishable key (payments are not used in v1)',
    example: 'pk_test_...',
  },
  'STRIPE_SECRET_KEY': {
    description: 'Stripe secret key (payments are not used in v1)',
    example: 'sk_test_...',
  },
  'STRIPE_WEBHOOK_SECRET': {
    description: 'Stripe webhook signing secret',
    example: 'whsec_...',
  },
  'NEXT_PUBLIC_STRIPE_PRICE_ID_PRO': {
    description: 'Stripe price ID for Pro plan',
    example: 'price_...',
  },
  'SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET': {
    description: 'Google OAuth client secret',
    example: 'GOCSPX-...',
  },
}

let hasErrors = false
let hasWarnings = false

function checkEnvFile() {
  logSection('Checking Environment File')

  const envPath = path.join(process.cwd(), '.env.local')

  if (!fs.existsSync(envPath)) {
    logError('.env.local file not found')
    logInfo('Create .env.local by copying .env.example:')
    logInfo('  cp .env.example .env.local')
    hasErrors = true
    return false
  }

  logSuccess('.env.local file exists')
  return true
}

function checkRequiredVariables() {
  logSection('Checking Required Environment Variables')

  for (const [varName, config] of Object.entries(REQUIRED_VARS)) {
    const value = process.env[varName]

    if (!value) {
      logError(`${varName} is not set`)
      logInfo(`  Description: ${config.description}`)
      logInfo(`  Example: ${config.example}`)
      hasErrors = true
      continue
    }

    if (value === config.example || value.includes('your-') || value.includes('...')) {
      logWarning(`${varName} appears to be a placeholder value`)
      logInfo(`  Current: ${value}`)
      logInfo(`  Update this with your actual ${config.description}`)
      hasWarnings = true
      continue
    }

    if (config.validate && !config.validate(value)) {
      logWarning(`${varName} format may be incorrect`)
      logInfo(`  Current: ${value.substring(0, 20)}...`)
      logInfo(`  Expected format: ${config.example}`)
      hasWarnings = true
      continue
    }

    logSuccess(`${varName} is set`)
  }
}

function checkOptionalVariables() {
  logSection('Checking Optional Environment Variables')

  for (const [varName, config] of Object.entries(OPTIONAL_VARS)) {
    const value = process.env[varName]

    if (!value) {
      logInfo(`${varName} is not set (optional)`)
      logInfo(`  Description: ${config.description}`)
      continue
    }

    if (value === config.example || value.includes('your-') || value.includes('...')) {
      logWarning(`${varName} appears to be a placeholder value`)
      logInfo(`  Update this with your actual ${config.description}`)
      hasWarnings = true
      continue
    }

    logSuccess(`${varName} is set`)
  }
}

async function testSupabaseConnection() {
  logSection('Testing Supabase Connection')

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    logWarning('Skipping - Supabase credentials not set')
    return
  }

  try {
    // Test basic connectivity to Supabase
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
      }
    })

    if (response.status === 200 || response.status === 404) {
      logSuccess('Supabase connection successful')
    } else {
      logError(`Supabase connection failed with status ${response.status}`)
      logInfo('Check your NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
      hasErrors = true
    }
  } catch (error) {
    logError(`Supabase connection error: ${error.message}`)
    hasErrors = true
  }
}

async function testStripeConnection() {
  logSection('Testing Stripe Connection')

  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    logWarning('Skipping - Stripe secret key not set')
    return
  }

  try {
    // Test Stripe API connectivity
    const response = await fetch('https://api.stripe.com/v1/customers?limit=1', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
      }
    })

    if (response.ok) {
      logSuccess('Stripe connection successful')

      // Check if using test mode or live mode
      if (secretKey.startsWith('sk_test_')) {
        logInfo('Using Stripe TEST mode')
      } else if (secretKey.startsWith('sk_live_')) {
        logWarning('Using Stripe LIVE mode - ensure this is intentional')
      }
    } else {
      const errorData = await response.json()
      logError(`Stripe connection failed: ${errorData.error?.message || 'Unknown error'}`)
      logInfo('Check your STRIPE_SECRET_KEY')
      hasErrors = true
    }
  } catch (error) {
    logError(`Stripe connection error: ${error.message}`)
    hasErrors = true
  }
}

function checkNodeVersion() {
  logSection('Checking Node.js Version')

  const version = process.version
  const majorVersion = parseInt(version.slice(1).split('.')[0])

  if (majorVersion < 18) {
    logError(`Node.js ${version} is not supported`)
    logInfo('This project requires Node.js 18 or higher')
    logInfo('Download from: https://nodejs.org/')
    hasErrors = true
  } else {
    logSuccess(`Node.js ${version} is supported`)
  }
}

function printSummary() {
  logSection('Validation Summary')

  if (hasErrors) {
    log('\n❌ Setup validation FAILED', 'red')
    log('Please fix the errors above before running the application.\n', 'red')
    process.exit(1)
  } else if (hasWarnings) {
    log('\n⚠️  Setup validation completed with WARNINGS', 'yellow')
    log('Some optional configurations are missing or incomplete.\n', 'yellow')
    log('You can proceed, but some features may not work.\n', 'yellow')
    process.exit(0)
  } else {
    log('\n✅ Setup validation PASSED', 'green')
    log('All required configurations are in place!\n', 'green')
    log('You can now run: npm run dev\n', 'cyan')
    process.exit(0)
  }
}

async function main() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'blue')
  log('║          SaaS Template - Setup Validation               ║', 'blue')
  log('╚══════════════════════════════════════════════════════════╝', 'blue')

  checkNodeVersion()

  const hasEnvFile = checkEnvFile()

  if (!hasEnvFile) {
    printSummary()
    return
  }

  // Load environment variables from .env.local
  require('dotenv').config({ path: '.env.local' })

  checkRequiredVariables()
  checkOptionalVariables()

  await testSupabaseConnection()
  await testStripeConnection()

  printSummary()
}

// Run the validation
main().catch((error) => {
  logError(`Unexpected error: ${error.message}`)
  process.exit(1)
})
