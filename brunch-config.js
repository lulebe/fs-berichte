exports.config = {
  paths: {
    public: './assets',
    watched: ['scss']
  },
  files: {
    stylesheets: {
      joinTo: 'style10.css'
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
