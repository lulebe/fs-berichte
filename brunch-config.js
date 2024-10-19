exports.config = {
  paths: {
    public: './assets',
    watched: ['scss']
  },
  files: {
    stylesheets: {
      joinTo: 'style11.css'
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
