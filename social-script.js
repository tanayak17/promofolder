document.addEventListener('DOMContentLoaded', function() {
    // Initialize all tweet interactions
    initTweetInteractions();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Add fog effect
    initFogEffect();
});

// Initialize tweet interactions
function initTweetInteractions() {
    // Like functionality
    const likeIcons = document.querySelectorAll('.like-icon');
    
    likeIcons.forEach(icon => {
        let isLiked = false;
        const countElement = icon.nextElementSibling;
        const originalCount = parseInt(countElement.textContent);
        
        icon.addEventListener('click', function() {
            isLiked = !isLiked;
            
            if (isLiked) {
                // Make heart red when liked
                icon.style.color = '#8b0000';
                icon.style.fill = '#8b0000';
                countElement.textContent = (originalCount + 1).toString();
                
                // Add animation
                icon.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            } else {
                // Reset heart to original state
                icon.style.color = '';
                icon.style.fill = 'none';
                countElement.textContent = originalCount.toString();
            }
        });
    });
    
    // Comment functionality - toggle replies visibility
    const commentIcons = document.querySelectorAll('.comment-icon');
    
    commentIcons.forEach(icon => {
        const tweet = findParentTweet(icon);
        const replies = tweet.querySelector('.tweet-replies');
        
        if (replies) {
            // Initially hide replies
            replies.style.display = 'none';
            
            icon.addEventListener('click', function() {
                if (replies.style.display === 'none') {
                    replies.style.display = 'block';
                } else {
                    replies.style.display = 'none';
                }
            });
        }
    });
    
    // Retweet functionality
    const retweetIcons = document.querySelectorAll('.retweet-icon');
    
    retweetIcons.forEach(icon => {
        let isRetweeted = false;
        const countElement = icon.nextElementSibling;
        const originalCount = parseInt(countElement.textContent);
        
        icon.addEventListener('click', function() {
            isRetweeted = !isRetweeted;
            
            if (isRetweeted) {
                // Change color when retweeted
                icon.style.color = '#17bf63';
                countElement.textContent = (originalCount + 1).toString();
                
                // Add animation
                icon.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            } else {
                // Reset to original state
                icon.style.color = '';
                countElement.textContent = originalCount.toString();
            }
        });
    });
    
    // Share functionality
    const shareIcons = document.querySelectorAll('.share-icon');
    
    shareIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Add animation
            icon.style.transform = 'scale(1.3)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 200);
            
            // Show a message (in a real app, this would open a share dialog)
            const tweet = findParentTweet(icon);
            const tweetText = tweet.querySelector('.tweet-text').textContent;
            console.log('Sharing tweet: ' + tweetText.substring(0, 50) + '...');
        });
    });
    
    // Helper function to find parent tweet
    function findParentTweet(element) {
        let parent = element;
        while (parent && !parent.classList.contains('tweet')) {
            parent = parent.parentElement;
        }
        return parent;
    }
}

// Initialize scroll animations
function initScrollAnimations() {
    const tweets = document.querySelectorAll('.tweet');
    
    // Create an intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Set initial styles and observe each tweet
    tweets.forEach((tweet, index) => {
        tweet.style.opacity = '0';
        tweet.style.transform = 'translateY(20px)';
        tweet.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(tweet);
    });
}

// Initialize fog effect
function initFogEffect() {
    const fogContainer = document.querySelector('.fog-container');
    
    // Add random fog movement on mouse move
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const fogImgFirst = document.querySelector('.fog-img-first');
        const fogImgSecond = document.querySelector('.fog-img-second');
        
        if (fogImgFirst && fogImgSecond) {
            fogImgFirst.style.transform = `translateX(${-50 + mouseX * 5}%)`;
            fogImgSecond.style.transform = `translateX(${mouseX * 5}%)`;
        }
    });
    
    // Add eerie effect on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Adjust fog opacity based on scroll position
        if (fogContainer) {
            const scrollPercentage = scrollPosition / (documentHeight - windowHeight);
            fogContainer.style.opacity = 0.3 + (scrollPercentage * 0.2);
        }
    });
}

// Add horror theme effects
function addHorrorEffects() {
    // Occasionally add subtle text glitch effect to tweet text
    const tweetTexts = document.querySelectorAll('.tweet-text');
    
    tweetTexts.forEach(text => {
        // Random chance to add glitch effect on hover
        text.addEventListener('mouseover', function() {
            if (Math.random() < 0.3) { // 30% chance
                const originalText = text.textContent;
                let glitchInterval;
                
                // Start glitch effect
                glitchInterval = setInterval(() => {
                    // Create glitched version of text
                    const glitchedText = createGlitchedText(originalText);
                    text.textContent = glitchedText;
                }, 100);
                
                // Stop glitch effect after a short time
                setTimeout(() => {
                    clearInterval(glitchInterval);
                    text.textContent = originalText;
                }, 500);
            }
        });
    });
    
    // Helper function to create glitched text
    function createGlitchedText(text) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            // Small chance to replace character with a random one
            if (Math.random() < 0.05) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            } else {
                result += text[i];
            }
        }
        
        return result;
    }
}

// Call horror effects after a delay
setTimeout(addHorrorEffects, 2000);
