exports.config = {
  paths: {
    public: './assets',
    watched: ['scss']
  },
  files: {
    stylesheets: {
      joinTo: 'style.css'
    }
  },
  plugins: {
    sass: {
      options: {
        includePaths: ['scss']
      }
    }
  }
};
