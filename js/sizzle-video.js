// Enhanced video loading for mobile browsers
(function() {
    // Debug mode: enable by adding ?debug=true to URL or setting window.DEBUG = true
    const DEBUG = window.DEBUG || (new URLSearchParams(window.location.search).get('debug') === 'true');
    
    // Helper function for conditional logging
    const debugLog = (...args) => {
        if (DEBUG) console.log(...args);
    };
    const debugWarn = (...args) => {
        if (DEBUG) console.warn(...args);
    };
    const debugError = (...args) => {
        if (DEBUG) console.error(...args);
    };
    
    const video = document.getElementById('sizzle-video');
    if (!video) return;
    
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second
    let videoLoaded = false;
    let isLoading = false;
    
    function loadVideo(forceReload = false) {
        // Prevent duplicate loads
        if (isLoading || (videoLoaded && video.readyState >= 2 && !forceReload)) return;
        isLoading = true;
        
        // Only reset sources if we need to force a reload (e.g., after error)
        // Don't reset if preload is already working
        if (forceReload) {
            const sources = video.querySelectorAll('source');
            sources.forEach(source => {
                const src = source.src;
                source.src = '';
                source.src = src;
            });
        }
        
        // Only call load() if video hasn't started loading yet
        // This respects the preload directive
        if (video.readyState === 0) { // HAVE_NOTHING
            video.load();
        }
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Video started playing successfully
                    videoLoaded = true;
                    debugLog('Sizzle reel loaded successfully');
                })
                .catch(error => {
                    debugWarn('Video autoplay prevented or failed:', error);
                    // Even if autoplay fails, video should still load
                    // Try to play again when user interacts with page
                    const playOnInteraction = () => {
                        video.play().catch(() => {});
                        document.removeEventListener('touchstart', playOnInteraction);
                        document.removeEventListener('click', playOnInteraction);
                        document.removeEventListener('scroll', playOnInteraction);
                    };
                    document.addEventListener('touchstart', playOnInteraction, { once: true });
                    document.addEventListener('click', playOnInteraction, { once: true });
                    document.addEventListener('scroll', playOnInteraction, { once: true });
                });
        }
    }
    
    function handleVideoError() {
        isLoading = false; // Allow retry
        if (retryCount < maxRetries) {
            retryCount++;
            debugLog(`Video load failed, retrying... (${retryCount}/${maxRetries})`);
            setTimeout(() => {
                loadVideo(true); // Force reload on error
            }, retryDelay * retryCount); // Exponential backoff
        } else {
            debugError('Video failed to load after maximum retries');
        }
    }
    
    // Set up event listeners
    video.addEventListener('error', handleVideoError);
    video.addEventListener('loadstart', () => {
        debugLog('Video load started');
    });
    video.addEventListener('canplay', () => {
        debugLog('Video can play');
        videoLoaded = true;
        isLoading = false;
        retryCount = 0; // Reset retry count on success
    });
    video.addEventListener('loadeddata', () => {
        videoLoaded = true;
        isLoading = false;
    });
    
    // Check if video is already loaded/loading from preload
    function checkAndPlayVideo() {
        // Video might already be loading/loaded due to preload
        if (video.readyState >= 3) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
            debugLog('Video already loaded from preload, attempting to play');
            videoLoaded = true;
            video.play().catch(() => {
                // Autoplay blocked, will retry on interaction
                const playOnInteraction = () => {
                    video.play().catch(() => {});
                    document.removeEventListener('touchstart', playOnInteraction);
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('scroll', playOnInteraction);
                };
                document.addEventListener('touchstart', playOnInteraction, { once: true });
                document.addEventListener('click', playOnInteraction, { once: true });
                document.addEventListener('scroll', playOnInteraction, { once: true });
            });
            return true;
        }
        return false;
    }
    
    // Use Intersection Observer to ensure video plays when it comes into view
    // Since the video is preloaded, we mainly need to ensure it plays
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!checkAndPlayVideo()) {
                        debugLog('Video came into view, ensuring it loads...');
                        loadVideo(false); // Don't force reload, work with preload
                    }
                    observer.unobserve(video);
                }
            });
        }, {
            rootMargin: '50px' // Start loading slightly before it's visible
        });
        
        observer.observe(video);
    }
    
    // Ensure video loads/plays when page is ready
    // Preload should have already started fetching, we just need to ensure playback
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                if (!checkAndPlayVideo()) {
                    loadVideo(false); // Work with preload
                }
            }, 100);
        });
    } else {
        // DOM already loaded
        setTimeout(() => {
            if (!checkAndPlayVideo()) {
                loadVideo(false); // Work with preload
            }
        }, 100);
    }
    
    // Also check when window is fully loaded
    window.addEventListener('load', () => {
        if (!videoLoaded && !checkAndPlayVideo()) {
            debugLog('Window loaded, checking video state');
            setTimeout(() => loadVideo(false), 500);
        }
    });
})();

