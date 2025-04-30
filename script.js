document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const hero = document.getElementById('hero');
    const ghostlyHands = document.querySelector('.ghostly-hands');
    let lastScrollTop = 0;
    let scrollDirection = 'down';
    
    // Section audio functionality
    const audioFirst = document.getElementById('audio-first');
    const audioMiddle = document.getElementById('audio-middle');
    const audioLast = document.getElementById('audio-last');
    
    // Set initial volume
    const audioVolume = 0.3; // 30% volume to avoid being too intrusive
    audioFirst.volume = audioVolume;
    audioMiddle.volume = audioVolume;
    audioLast.volume = audioVolume;
    
    // Define the sections
    const sections = [
        {
            elements: [document.querySelector('.hero'), document.querySelector('.synopsis')],
            audio: audioFirst,
            priority: 1,
            isVisible: false,
            visibilityRatio: 0
        },
        {
            elements: [document.querySelector('.characters'), document.querySelector('.atmospheric')],
            audio: audioMiddle,
            priority: 2,
            isVisible: false,
            visibilityRatio: 0
        },
        {
            elements: [document.querySelector('.cta')],
            audio: audioLast,
            priority: 3,
            isVisible: false,
            visibilityRatio: 0
        }
    ];
    
    // Track currently playing audio
    let currentlyPlayingSection = null;
    
    // Function to update audio based on section visibility
    function updateAudio() {
        // Find the visible section with highest priority
        let highestPrioritySection = null;
        let highestVisibilityRatio = 0;
        
        sections.forEach(section => {
            if (section.isVisible && section.visibilityRatio > highestVisibilityRatio) {
                highestVisibilityRatio = section.visibilityRatio;
                highestPrioritySection = section;
            }
        });
        
        // If we have a visible section and it's different from currently playing
        if (highestPrioritySection && (!currentlyPlayingSection || currentlyPlayingSection !== highestPrioritySection)) {
            // Stop all audio first
            if (currentlyPlayingSection) {
                fadeOutAudio(currentlyPlayingSection.audio);
            }
            
            // Wait a bit before starting new audio to prevent overlap
            setTimeout(() => {
                // Make sure we're still the highest priority section
                if (highestPrioritySection === sections.find(s => s.isVisible && s.visibilityRatio === highestVisibilityRatio)) {
                    fadeInAudio(highestPrioritySection.audio);
                    currentlyPlayingSection = highestPrioritySection;
                }
            }, 300);
        }
    }
    
    // Create intersection observers for each section
    sections.forEach(section => {
        section.elements.forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Update section visibility status
                    section.isVisible = entry.isIntersecting;
                    section.visibilityRatio = entry.intersectionRatio;
                    
                    // Update audio playback
                    updateAudio();
                });
            }, { threshold: [0, 0.3, 0.5, 0.7, 1] }); // Track multiple thresholds for better visibility detection
            
            observer.observe(element);
        });
    });
    
    // Fade in audio function
    function fadeInAudio(audio) {
        if (audio.paused) {
            audio.play().catch(e => console.log("Audio play prevented: ", e));
            audio.volume = 0;
            
            let volume = 0;
            const fadeInterval = setInterval(() => {
                if (volume < audioVolume) {
                    volume += 0.02;
                    audio.volume = volume;
                } else {
                    clearInterval(fadeInterval);
                }
            }, 50);
        }
    }
    
    // Fade out audio function
    function fadeOutAudio(audio) {
        if (!audio.paused) {
            let volume = audio.volume;
            const fadeInterval = setInterval(() => {
                if (volume > 0.02) {
                    volume -= 0.02;
                    audio.volume = volume;
                } else {
                    audio.pause();
                    clearInterval(fadeInterval);
                }
            }, 50);
        }
    }
    
    // Add mute button for user control
    const muteButton = document.createElement('button');
    muteButton.innerHTML = '🔇';
    muteButton.className = 'mute-button';
    muteButton.title = 'Mute/Unmute Audio';
    document.body.appendChild(muteButton);
    
    let audioMuted = true; // Start muted
    
    muteButton.addEventListener('click', function() {
        if (audioMuted) {
            // Unmute
            sections.forEach(section => {
                section.audio.muted = false;
            });
            muteButton.innerHTML = '🔊';
            audioMuted = false;
        } else {
            // Mute
            sections.forEach(section => {
                section.audio.muted = true;
            });
            muteButton.innerHTML = '🔇';
            audioMuted = true;
        }
    });
    
    // Start with audio muted until user interaction
    sections.forEach(section => {
        section.audio.muted = true;
    });
    
    // Show ghostly hands on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Determine scroll direction
        scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        
        // Show ghostly hands when scrolling down past the hero section
        if (scrollTop > hero.offsetHeight * 0.7) {
            ghostlyHands.style.opacity = '1';
        } else {
            ghostlyHands.style.opacity = '0';
        }
    });
    
    // Mirror effect on hover
    const mirror = document.querySelector('.mirror');
    if (mirror) {
        mirror.addEventListener('mouseover', function() {
            const reflection = document.querySelector('.mirror-reflection');
            reflection.style.transform = 'scale(1.1)';
            reflection.style.filter = 'blur(2px)';
            
            // Add creepy face effect
            setTimeout(() => {
                reflection.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><defs><filter id="blur" x="0" y="0"><feGaussianBlur in="SourceGraphic" stdDeviation="2" /></filter></defs><ellipse cx="100" cy="100" rx="60" ry="80" fill="rgba(200, 200, 200, 0.1)" filter="url(%23blur)"/><ellipse cx="100" cy="220" rx="40" ry="60" fill="rgba(200, 200, 200, 0.05)" filter="url(%23blur)"/><circle cx="80" cy="90" r="10" fill="rgba(0, 0, 0, 0.7)"/><circle cx="120" cy="90" r="10" fill="rgba(0, 0, 0, 0.7)"/><path d="M70,130 Q100,150 130,130" stroke="rgba(139, 0, 0, 0.7)" stroke-width="2" fill="none"/></svg>')`;
            }, 300);
        });
        
        mirror.addEventListener('mouseout', function() {
            const reflection = document.querySelector('.mirror-reflection');
            reflection.style.transform = 'scale(1)';
            reflection.style.filter = 'blur(0)';
            
            // Reset to original reflection
            setTimeout(() => {
                reflection.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><defs><filter id="blur" x="0" y="0"><feGaussianBlur in="SourceGraphic" stdDeviation="3" /></filter></defs><ellipse cx="100" cy="100" rx="60" ry="80" fill="rgba(200, 200, 200, 0.1)" filter="url(%23blur)"/><ellipse cx="100" cy="220" rx="40" ry="60" fill="rgba(200, 200, 200, 0.05)" filter="url(%23blur)"/></svg>')`;
            }, 300);
        });
    }
    
    // Text reveal animation for synopsis
    const synopsisContent = document.querySelector('.synopsis-content');
    if (synopsisContent) {
        const paragraphs = synopsisContent.querySelectorAll('p');
        
        // Create observer for text reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        // Observe each paragraph
        paragraphs.forEach((paragraph, index) => {
            paragraph.style.opacity = '0';
            paragraph.style.transform = 'translateY(20px)';
            paragraph.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
            observer.observe(paragraph);
        });
    }
    
    // Horror carousel animation control
    const horrorCarousel = document.querySelector('.single-carousel');
    if (horrorCarousel) {
        // Force animation to run immediately
        horrorCarousel.style.animationPlayState = 'running';
        horrorCarousel.classList.add('animate-in');
        
        // Add hover effect to image containers
        const imageContainers = document.querySelectorAll('.horror-image-container');
        imageContainers.forEach(container => {
            container.addEventListener('mouseenter', function() {
                // Add subtle glow effect
                this.style.boxShadow = '0 15px 40px rgba(139, 0, 0, 0.6), 0 0 20px rgba(139, 0, 0, 0.4)';
            });
            
            container.addEventListener('mouseleave', function() {
                // Remove glow effect
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8)';
            });
        });
    }
    
    // Blood text dripping effect
    const bloodText = document.querySelector('.blood-text');
    if (bloodText) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bloodText.style.animation = 'blood-drip 5s ease-in-out';
                    observer.unobserve(bloodText);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(bloodText);
    }
    
    // Instagram post interactions
    const instagramMockups = document.querySelectorAll('.instagram-mockup');
    if (instagramMockups.length > 0) {
        instagramMockups.forEach((mockup, index) => {
            // Make all posts the same size
            mockup.style.width = '350px';
            mockup.style.height = '600px';
            
            // Add hover effect to the Instagram mockup
            mockup.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0px 20px 60px rgba(182, 182, 182, 0.3)';
                this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            });
            
            mockup.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0px 14px 50px rgba(182, 182, 182, 0.25)';
            });
            
            // Make likes fully clickable and red
            const likeArea = mockup.querySelector('.instagram-likes');
            const heartIcon = mockup.querySelector('.instagram-icon[alt="Like"]');
            
            if (heartIcon && likeArea) {
                // Initialize like state
                let isLiked = false;
                
                // Make heart icon clickable
                heartIcon.addEventListener('click', function() {
                    isLiked = !isLiked;
                    
                    if (isLiked) {
                        // Make heart red when liked
                        this.style.transform = 'scale(1.2)';
                        this.style.filter = 'brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(7414%) hue-rotate(359deg) brightness(94%) contrast(118%)';
                        setTimeout(() => {
                            this.style.transform = 'scale(1)';
                        }, 200);
                    } else {
                        // Reset heart to original state
                        this.style.filter = '';
                    }
                });
                
                // Make like count area clickable too
                likeArea.style.cursor = 'pointer';
                likeArea.addEventListener('click', function() {
                    isLiked = !isLiked;
                    
                    if (isLiked) {
                        // Make heart red when liked through like count click
                        heartIcon.style.filter = 'brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(7414%) hue-rotate(359deg) brightness(94%) contrast(118%)';
                    } else {
                        // Reset heart to original state
                        heartIcon.style.filter = '';
                    }
                });
            }
            
            // Show only 1-2 comments initially and make them expandable
            const commentsSection = mockup.querySelector('.instagram-comments');
            const commentIcon = mockup.querySelector('.instagram-icon[alt="Comment"]');
            
            if (commentsSection && commentIcon) {
                const comments = commentsSection.querySelectorAll('.instagram-comment');
                
                // Hide all comments except the first one
                if (comments.length > 1) {
                    for (let i = 1; i < comments.length; i++) {
                        comments[i].style.display = 'none';
                    }
                }
                
                // Make comment icon clickable to show/hide comments
                commentIcon.style.cursor = 'pointer';
                let commentsExpanded = false;
                
                commentIcon.addEventListener('click', function() {
                    commentsExpanded = !commentsExpanded;
                    
                    if (commentsExpanded) {
                        // Show all comments
                        comments.forEach(comment => {
                            comment.style.display = 'block';
                        });
                    } else {
                        // Hide all comments except the first one
                        if (comments.length > 1) {
                            for (let i = 1; i < comments.length; i++) {
                                comments[i].style.display = 'none';
                            }
                        }
                    }
                });
            }
            
            // Add animation to the Instagram post when it comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        mockup.style.animation = `fade-in 1s ease-in-out ${index * 0.3}s`;
                        observer.unobserve(mockup);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(mockup);
        });
    }
    
    // Add parallax scrolling effect to backgrounds
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        // Hero parallax
        if (hero) {
            hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        }
        
        // Characters section parallax
        const charactersSection = document.querySelector('.characters');
        if (charactersSection) {
            const charactersOffset = charactersSection.offsetTop;
            const charactersParallax = (scrollPosition - charactersOffset) * 0.4;
            if (scrollPosition > charactersOffset - window.innerHeight) {
                charactersSection.style.backgroundPositionY = `${charactersParallax}px`;
            }
        }
        
        // Atmospheric section parallax
        const atmosphericSection = document.querySelector('.atmospheric');
        if (atmosphericSection) {
            const atmosphericOffset = atmosphericSection.offsetTop;
            const atmosphericParallax = (scrollPosition - atmosphericOffset) * 0.3;
            if (scrollPosition > atmosphericOffset - window.innerHeight) {
                atmosphericSection.style.backgroundPositionY = `${atmosphericParallax}px`;
            }
        }
    });
});
