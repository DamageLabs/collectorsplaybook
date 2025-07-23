# Blog Markdown Documentation

This document describes all supported markdown features for the Collectors Playbook blog system.

## Table of Contents
- [Basic Formatting](#basic-formatting)
- [Headers](#headers)
- [Lists](#lists)
- [Links and Images](#links-and-images)
- [Code](#code)
- [Blockquotes](#blockquotes)
- [Horizontal Rules](#horizontal-rules)
- [Footnotes](#footnotes)
- [Admonitions](#admonitions)
- [Charts](#charts)
- [Frontmatter](#frontmatter)

## Basic Formatting

### Bold and Italic

```markdown
**Bold text**
*Italic text*
***Bold and italic text***
```

## Headers

```markdown
# H1 Header
## H2 Header  
### H3 Header
```

Headers H1-H3 are supported. Use them to structure your content hierarchically.

## Lists

### Unordered Lists

```markdown
- First item
- Second item
- Third item

* Also works with asterisks
* Like this
```

### Ordered Lists

```markdown
1. First item
2. Second item
3. Third item
```

## Links and Images

### Links

```markdown
[Link text](https://example.com)
```

All external links automatically open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.

### Images

```markdown
![Alt text](image-url.jpg)
```

Images are responsive and will scale to fit the content area.

## Code

### Inline Code

```markdown
Use `backticks` for inline code
```

### Code Blocks

````markdown
```
Multi-line code blocks
are supported
```
````

## Blockquotes

```markdown
> This is a blockquote
> It can span multiple lines
```

## Horizontal Rules

```markdown
---
```

Use three hyphens on a line by themselves to create a horizontal rule.

## Footnotes

```markdown
This text has a footnote[^1].

[^1]: This is the footnote content.
```

Footnotes will be collected and displayed at the bottom of the post in a "References" section. Each footnote should be on its own line with a blank line between footnotes for proper formatting.

## Admonitions

Admonitions are special callout boxes for highlighting important information. Four types are supported:

### Info Admonition

```markdown
:::info
This is an informational note with a blue theme.
:::
```

### Warning Admonition

```markdown
:::warning
This is a warning message with an orange theme.
:::
```

### Tip Admonition

```markdown
:::tip
This is a helpful tip with a green theme.
:::
```

### Note Admonition

```markdown
:::note
This is a note with a purple theme.
:::
```

## Charts

You can embed Chart.js charts directly in your markdown:

```html
<div class="chart-container">
  <canvas id="myChart"></canvas>
</div>

<script>
const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March'],
        datasets: [{
            label: 'My Dataset',
            data: [10, 20, 30]
        }]
    }
});
</script>
```

Note: Chart.js is automatically loaded in blog posts. Each chart must have a unique canvas ID.

## Frontmatter

Every blog post must start with frontmatter in YAML format:

```yaml
---
title: Your Blog Post Title
date: 2025-01-23
author: Author Name
excerpt: A brief description of your post
image: images/featured-image.jpg
---
```

### Required Fields

- `title`: The title of your blog post
- `date`: Publication date in YYYY-MM-DD format
- `author`: Author name (defaults to "Collectors Playbook" if not provided)
- `excerpt`: Brief description shown in blog listings

### Optional Fields

- `image`: Path to the featured image for the blog post

## Adding a New Blog Post

1. Create a new `.md` file in the `blog/posts/` directory
2. Name it using kebab-case (e.g., `my-new-post.md`)
3. Add the required frontmatter at the top
4. Write your content using the supported markdown features
5. Add the filename (without `.md`) to the `postFiles` array in `blog.js`

## Best Practices

1. **Use descriptive filenames**: Choose URLs that are SEO-friendly
2. **Add images**: Include a featured image in frontmatter for better visual appeal
3. **Structure content**: Use headers to create a clear hierarchy
4. **Add footnotes**: For citations and references, use footnotes
5. **Highlight important info**: Use admonitions for tips, warnings, and notes
6. **Keep excerpts concise**: Write compelling excerpts under 160 characters

## Example Blog Post

```markdown
---
title: Understanding PSA Grading Standards
date: 2025-01-23
author: Collectors Playbook
excerpt: A comprehensive guide to PSA's 10-point grading scale and what to look for
image: images/psa-grading.jpg
---

# Understanding PSA Grading Standards

PSA grading is the gold standard in sports card authentication[^1]. Let's explore what makes a PSA 10.

## The Grading Scale

PSA uses a 1-10 scale where:

- **PSA 10**: Gem Mint
- **PSA 9**: Mint
- **PSA 8**: Near Mint-Mint

:::tip
Always check the corners first - they're usually the first to show wear.
:::

## What to Look For

When evaluating cards for grading:

1. Check all four corners
2. Examine the edges
3. Look for surface scratches
4. Verify centering

> "The difference between a PSA 9 and PSA 10 can be worth thousands on high-value cards."

---

:::info
Visit our [eBay store](https://www.ebay.com/str/collectorsplaybooktx) for PSA graded cards.
:::

[^1]: According to market data from 2024.
```

## Comments

Blog posts automatically include a comments section powered by Giscus, which uses GitHub Discussions. 

### Setup Required

To enable comments, you must:

1. **Install Giscus App**:
   - Go to https://github.com/apps/giscus
   - Click "Install" 
   - Select your repository

2. **Enable GitHub Discussions**:
   - Go to Settings → General → Features in your repository
   - Check "Discussions"

3. **Configure Giscus**:
   - Visit https://giscus.app
   - Enter your repository information
   - Copy the generated values
   - Update these placeholders in `blog/post.html`:
     - `[GITHUB-USERNAME]` - Your GitHub username
     - `[REPO-ID]` - Repository ID from giscus.app
     - `[CATEGORY-ID]` - Discussion category ID from giscus.app

### Features
- Visitors can comment using their GitHub account
- Reactions (👍 ❤️ 🎉 etc.) are enabled
- Comments are stored in the repository's GitHub Discussions
- No ads or tracking
- Fully responsive design

### Moderation
- Comments can be moderated through GitHub Discussions
- Spam protection is built-in through GitHub's systems
- Repository owners have full control over comments

## Technical Notes

- The blog system uses client-side markdown parsing
- All posts are static `.md` files
- Images should be placed in the main site's `images/` directory
- The blog automatically generates navigation and post listings
- Comments are loaded dynamically after the post content