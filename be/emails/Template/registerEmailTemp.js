const registerEmailTemplate = (author) =>
  `<h1>Welcome to <span style="color: #15ed19;">StriveBlog</span> ${author.firstName}! 🎉</h1>
    <p>Congratulations on joining our vibrant community of writers and thinkers. We're thrilled to have you on board! 🚀</p>
    <p>Start exploring the app, share your ideas, and inspire others with your creativity.</p>
    <p>Don't hesitate to write new articles and let the community shower you with feedback and reviews. 📚📝</p>
    
    <h2>Get Started:</h2>
    <p>1. Visit your profile and make it uniquely yours by updating your profile picture ASAP! 📸</p>
    <p>2. Visit the "Meet our Authors" section to connect with fellow writers.</p>
    
    <p>We're excited to see what you'll bring to our community!</p>
    
    <p>Ready to dive in? <a href="https://main--striveblog-mlanci.netlify.app/">Explore Now</a></p>
    
    <p>Happy writing! 📖✍️</p>
    
    <p>Best regards,<br><span style="color: #15ed19;">The StriveBlog Team</span></p>`;

module.exports = registerEmailTemplate;
