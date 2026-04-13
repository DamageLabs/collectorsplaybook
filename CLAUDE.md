# Collectors Playbook - Project Context for Claude

## Project Overview
Collectors Playbook is a premium sports cards marketplace website showcasing authenticated graded cards. The site serves as a frontend for an eBay store, directing customers to eBay listings for purchases.

## Key Information

### Business Details
- **eBay Store URL**: https://www.ebay.com/str/collectorsplaybooktx
- **Contact Email**: info@collectorsplaybook.com
- **Social Media**:
  - Twitter/X: @CPlaybookTX
  - Instagram: @collectorsplaybook
  - Facebook: @collectorsplaybook

### Technical Stack
- Static HTML/CSS website
- Font Awesome Pro for icons
- Umami Analytics (analytics.damagelabs.io, website ID: a6c86111-54b8-4c8b-beca-e2df5441a3af)
- Google Ads Conversion Tracking (AW-17265705932)
- Formspree for contact form (form ID: xpwrolyq)
- Cloudflare Web Analytics

## Important Guidelines

### When Updating Cards
1. All card listings should link to actual eBay items at https://www.ebay.com/itm/[ITEM_NUMBER]
2. Use high-resolution images (s-l1600 format) from eBay listings
3. Maintain consistent card layout with badges for PSA grades, serial numbers, etc.
4. The all-cards.html page should reflect current inventory from the eBay store

### External Links
- All external links must include `target="_blank"` and `rel="noopener noreferrer"`
- This includes links to eBay, social media, and any other external sites

### Code Style
- DO NOT add comments to code unless explicitly requested
- Maintain existing styling and structure
- Follow the gold (#F4B643) and navy (#1B2951) color scheme

### Running Locally
The site is served by Caddy directly — no server process needed.

```
https://collectorsplaybook.test
```

Caddy is configured at `/opt/homebrew/etc/Caddyfile` with:
```
collectorsplaybook.test {
    root * /Users/guntharp/Code/collectorsplaybook
    file_server
    tls internal
}
```

If Caddy isn't running: `sudo caddy start --config /opt/homebrew/etc/Caddyfile`

### Common Tasks

#### Update eBay Store Links
All eBay store links should point to: https://www.ebay.com/str/collectorsplaybooktx

#### Update Social Media Username
Twitter/X username is: @CPlaybookTX

#### Refresh Card Inventory
1. Visit https://www.ebay.com/str/collectorsplaybooktx
2. Get current active listings
3. Update all-cards.html with new items
4. Update featured cards on index.html if needed

#### Contact Form
The contact form uses Formspree (ID: xpwrolyq) and sends to info@collectorsplaybook.com

## File Structure
- `index.html` - Homepage with featured cards
- `all-cards.html` - Complete card inventory
- `contact.html` - Contact information page
- `contact-form.html` - Contact form page
- `privacy-policy.html` - Privacy policy
- `terms.html` - Terms and conditions
- `404.html` - Error page
- `styles.css` - Main stylesheet
- `assets/` - Font Awesome Pro resources

## Git Workflow
When committing changes:
- Write clear, descriptive commit messages
- Do not include Claude attribution in commits
- Push changes to main branch when ready

## Testing Commands
If you need to verify the site is working:
```bash
# Check for lint/type errors (if available)
npm run lint
npm run typecheck
```

Note: This is a static site, so there may not be npm scripts available.

## Notes
- The site owner is a young collector, so response times may be longer during school hours
- All actual transactions happen through eBay's platform
- The site serves primarily as a showcase and directory for the eBay store