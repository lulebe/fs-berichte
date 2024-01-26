exports.config = {
  paths: {
    public: './assets',
    watched: ['scss']
  },
  files: {
    stylesheets: {
      joinTo: 'style6.css'
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
