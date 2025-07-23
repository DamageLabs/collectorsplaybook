// Array to store blog posts loaded from markdown files
let blogPosts = [];

// Function to parse frontmatter from markdown
function parseFrontmatter(markdown) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) {
        return { metadata: {}, content: markdown };
    }
    
    const metadata = {};
    const metadataLines = match[1].split('\n');
    
    metadataLines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            metadata[key.trim()] = valueParts.join(':').trim();
        }
    });
    
    return { metadata, content: match[2] };
}

// Function to load blog posts from markdown files
async function loadBlogPosts() {
    // List of blog post files - in a real app, this would be dynamically generated
    const postFiles = [
        'getting-started-with-graded-cards',
        'sports-card-ebay-comps-guide',
        'cards-vs-stocks-market-bubbles',
        'decoding-the-box-game-understanding-topps-trading-card-product-types'
    ];
    
    blogPosts = [];
    
    for (const slug of postFiles) {
        try {
            const response = await fetch(`posts/${slug}.md`);
            if (response.ok) {
                const markdown = await response.text();
                const { metadata } = parseFrontmatter(markdown);
                
                blogPosts.push({
                    slug,
                    title: metadata.title || 'Untitled Post',
                    date: metadata.date || new Date().toISOString().split('T')[0],
                    author: metadata.author || 'Collectors Playbook',
                    excerpt: metadata.excerpt || '',
                    image: metadata.image || null
                });
            }
        } catch (error) {
            console.error(`Error loading post ${slug}:`, error);
        }
    }
    
    // Sort posts by date (newest first)
    blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function loadBlogList() {
    const blogList = document.getElementById('blog-list');
    if (!blogList) return;
    
    // Load blog posts from markdown files
    await loadBlogPosts();
    
    blogPosts.forEach(post => {
        const postCard = document.createElement('article');
        postCard.className = 'blog-card';
        postCard.style.cursor = 'pointer';
        
        const imageHtml = post.image ? 
            `<img src="${post.image}" alt="${post.title}" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'blog-image-placeholder\\'><i class=\\'fa-solid fa-cards-blank\\'></i></div>'">` :
            `<div class="blog-image-placeholder"><i class="fa-solid fa-cards-blank"></i></div>`;
        
        postCard.innerHTML = `
            ${imageHtml}
            <div class="blog-card-content">
                <h2><a href="post.html?slug=${post.slug}" style="text-decoration: none; color: inherit;">${post.title}</a></h2>
                <div class="date">${formatDate(post.date)}</div>
                <p class="excerpt">${post.excerpt}</p>
                <a href="post.html?slug=${post.slug}" class="read-more">
                    Read More <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        // Make the entire card clickable
        postCard.addEventListener('click', function(e) {
            // Don't navigate if clicking on a link
            if (e.target.tagName !== 'A' && !e.target.closest('a')) {
                window.location.href = `post.html?slug=${post.slug}`;
            }
        });
        
        blogList.appendChild(postCard);
    });
}

function convertMarkdownToHTML(markdown) {
    let html = markdown;
    
    // Headers (do these first)
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr>');
    
    // Code blocks (before other formatting)
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // HTML blocks (preserve raw HTML)
    html = html.replace(/(<div[\s\S]*?<\/div>)/g, (match) => {
        return match; // Preserve HTML as-is
    });
    
    // Filter out Chart.js CDN includes (already in template) but preserve chart initialization scripts
    html = html.replace(/(<script[\s\S]*?<\/script>)/g, (match) => {
        if (match.includes('cdn.jsdelivr.net/npm/chart.js')) {
            return ''; // Remove Chart.js CDN includes
        }
        return match; // Preserve other scripts
    });
    
    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^\*\n]+?)\*/g, '<em>$1</em>');
    
    // Footnote references [^1] -> <sup><a href="#fn1" id="fnref1">[1]</a></sup>
    html = html.replace(/\[\^(\d+)\]/g, '<sup><a href="#fn$1" id="fnref$1">[$1]</a></sup>');
    
    // Images and links
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // First, collect all footnote definitions
    const footnoteRegex = /^\[\^(\d+)\]:\s*(.+)$/gm;
    const footnotes = {};
    let match;
    
    while ((match = footnoteRegex.exec(html)) !== null) {
        footnotes[match[1]] = match[2];
    }
    
    // Remove footnote definitions from the main text
    html = html.replace(/^\[\^(\d+)\]:\s*.+$/gm, '');
    
    // Process lists
    const lines = html.split('\n');
    const processedLines = [];
    let inUl = false;
    let inOl = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for unordered list items
        if (line.match(/^[\*\-]\s+(.+)$/)) {
            const content = line.replace(/^[\*\-]\s+(.+)$/, '$1');
            if (!inUl) {
                processedLines.push('<ul>');
                inUl = true;
            }
            processedLines.push(`<li>${content}</li>`);
        }
        // Check for ordered list items
        else if (line.match(/^\d+\.\s+(.+)$/)) {
            const content = line.replace(/^\d+\.\s+(.+)$/, '$1');
            if (!inOl) {
                processedLines.push('<ol>');
                inOl = true;
            }
            processedLines.push(`<li>${content}</li>`);
        }
        // Not a list item
        else {
            // Close any open lists
            if (inUl) {
                processedLines.push('</ul>');
                inUl = false;
            }
            if (inOl) {
                processedLines.push('</ol>');
                inOl = false;
            }
            processedLines.push(line);
        }
    }
    
    // Close any remaining open lists
    if (inUl) processedLines.push('</ul>');
    if (inOl) processedLines.push('</ol>');
    
    html = processedLines.join('\n');
    
    // Admonitions (:::info, :::warning, :::tip, :::note) - Process before paragraph wrapping
    html = html.replace(/:::\s*(info|warning|tip|note)\s*\n([\s\S]*?)\n:::/g, (match, type, content) => {
        // Process the content for basic markdown formatting
        let processedContent = content.trim();
        // Convert bold text
        processedContent = processedContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Convert italic text
        processedContent = processedContent.replace(/\*([^\*\n]+?)\*/g, '<em>$1</em>');
        // Convert line breaks to paragraphs if multiple lines
        if (processedContent.includes('\n')) {
            processedContent = processedContent.split('\n').map(para => para.trim()).filter(para => para).map(para => `<p>${para}</p>`).join('\n');
        } else {
            processedContent = `<p>${processedContent}</p>`;
        }
        return `<div class="blog-admonition blog-admonition-${type}">${processedContent}</div>`;
    });
    
    // Paragraphs (split by double newlines)
    html = html.split('\n\n').map(block => {
        // Don't wrap if it's already an HTML element or empty
        if (block.match(/^<(h[1-6]|ul|ol|blockquote|pre|div|hr|script)/) || block.includes('blog-admonition')) {
            return block;
        }
        if (block.trim() === '') {
            return '';
        }
        
        // Check if this is a promotional snippet (starts with bold text containing "Collectors Playbook" or similar)
        if (block.match(/^\*\*.*(?:Collectors Playbook|For premium graded sports cards|What are your).*\*\*$/)) {
            // Convert bold markdown to HTML
            const content = block.replace(/\*\*(.+?)\*\*/g, '$1');
            return `<div class="blog-admonition"><p>${content}</p></div>`;
        }
        
        // Wrap in paragraph
        return `<p>${block}</p>`;
    }).join('\n\n');
    
    // Add footnotes section at the end if there are any
    if (Object.keys(footnotes).length > 0) {
        html += '\n\n<div class="footnotes">\n<h2>References</h2>\n<ol>\n';
        
        // Sort footnotes by number
        const sortedFootnotes = Object.keys(footnotes).sort((a, b) => parseInt(a) - parseInt(b));
        
        sortedFootnotes.forEach(num => {
            html += `<li id="fn${num}">${footnotes[num]} <a href="#fnref${num}" class="footnote-back">↩</a></li>\n`;
        });
        
        html += '</ol>\n</div>';
    }
    
    return html;
}

async function loadBlogPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const response = await fetch(`posts/${slug}.md`);
        if (!response.ok) {
            throw new Error('Post not found');
        }
        
        const markdown = await response.text();
        const { metadata, content } = parseFrontmatter(markdown);
        
        const postContent = document.getElementById('post-content');
        if (postContent) {
            postContent.innerHTML = `
                <article class="blog-post">
                    <header class="blog-post-header">
                        <h1>${metadata.title || 'Untitled Post'}</h1>
                        <div class="blog-post-meta">
                            <span><i class="fa-solid fa-calendar"></i> ${formatDate(metadata.date || new Date().toISOString().split('T')[0])}</span>
                            <span><i class="fa-solid fa-user"></i> ${metadata.author || 'Collectors Playbook'}</span>
                        </div>
                    </header>
                    <div class="blog-post-content">
                        ${convertMarkdownToHTML(content)}
                    </div>
                    <nav class="blog-navigation">
                        <a href="index.html" class="prev">
                            <i class="fa-solid fa-arrow-left"></i> Back to Blog
                        </a>
                    </nav>
                    
                    <!-- Comments Section -->
                    <div class="blog-comments">
                        <h2>Comments</h2>
                        <div class="giscus"></div>
                    </div>
                </article>
            `;
        }
    } catch (error) {
        console.error('Error loading blog post:', error);
        document.getElementById('post-content').innerHTML = `
            <div class="error-message">
                <h2>Post Not Found</h2>
                <p>Sorry, the blog post you're looking for doesn't exist.</p>
                <a href="index.html" class="cta-button">Back to Blog</a>
            </div>
        `;
    }
}

if (document.getElementById('blog-list')) {
    loadBlogList();
} else if (document.getElementById('post-content')) {
    loadBlogPost();
}